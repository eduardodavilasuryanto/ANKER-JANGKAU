"""Account and saved-search routes backed by the AUTH_DB D1 binding."""

import json
import uuid
from datetime import UTC, datetime, timedelta
from typing import Any

from fastapi import APIRouter, Depends, Header, HTTPException, status

from app.core.database import get_auth_database, prepared_statement
from app.core.security import (
    create_session_token,
    hash_password,
    hash_session_token,
    verify_password,
)
from app.schemas.auth import (
    LoginRequest,
    SavedSearchCreateRequest,
    SavedSearchResponse,
    SessionResponse,
    SignUpRequest,
    UserResponse,
)

router = APIRouter(prefix="/auth")
SESSION_DURATION = timedelta(days=30)


def _user_response(row: dict[str, Any]) -> UserResponse:
    return UserResponse(
        id=row["id"],
        name=row["name"],
        email=row["email"],
        created_at=row.get("created_at"),
    )


async def _current_user(
    authorization: str | None = Header(default=None),
    database: Any = Depends(get_auth_database),
) -> dict[str, Any]:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sign in is required.")

    token = authorization.removeprefix("Bearer ").strip()
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sign in is required.")

    row = await prepared_statement(
        database,
        """
        SELECT users.id, users.name, users.email, users.created_at
        FROM sessions
        JOIN users ON users.id = sessions.user_id
        WHERE sessions.token_hash = ? AND sessions.expires_at > ?
        """,
        hash_session_token(token),
        datetime.now(UTC).isoformat(),
    ).first()

    if row is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Your session has expired.",
        )

    return row


async def _create_session(database: Any, user: dict[str, Any]) -> SessionResponse:
    token = create_session_token()
    expires_at = datetime.now(UTC) + SESSION_DURATION

    await prepared_statement(
        database,
        "INSERT INTO sessions (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)",
        str(uuid.uuid4()),
        user["id"],
        hash_session_token(token),
        expires_at.isoformat(),
    ).run()

    return SessionResponse(token=token, user=_user_response(user))


@router.post("/sign-up", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
async def sign_up(
    payload: SignUpRequest, database: Any = Depends(get_auth_database)
) -> SessionResponse:
    email = str(payload.email).lower()
    existing_user = await prepared_statement(
        database, "SELECT id FROM users WHERE email = ?", email
    ).first()
    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="That email is already registered.",
        )

    user = {
        "id": str(uuid.uuid4()),
        "name": payload.name.strip(),
        "email": email,
        "password_hash": hash_password(payload.password),
        "created_at": datetime.now(UTC).isoformat(),
    }
    await prepared_statement(
        database,
        """
        INSERT INTO users (id, name, email, password_hash, created_at)
        VALUES (?, ?, ?, ?, ?)
        """,
        user["id"],
        user["name"],
        user["email"],
        user["password_hash"],
        user["created_at"],
    ).run()

    return await _create_session(database, user)


@router.post("/login", response_model=SessionResponse)
async def login(
    payload: LoginRequest, database: Any = Depends(get_auth_database)
) -> SessionResponse:
    user = await prepared_statement(
        database,
        "SELECT id, name, email, password_hash, created_at FROM users WHERE email = ?",
        str(payload.email).lower(),
    ).first()
    if user is None or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )

    return await _create_session(database, user)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    authorization: str | None = Header(default=None), database: Any = Depends(get_auth_database)
) -> None:
    if authorization and authorization.startswith("Bearer "):
        await prepared_statement(
            database,
            "DELETE FROM sessions WHERE token_hash = ?",
            hash_session_token(authorization.removeprefix("Bearer ").strip()),
        ).run()


@router.get("/me", response_model=UserResponse)
async def current_user(user: dict[str, Any] = Depends(_current_user)) -> UserResponse:
    return _user_response(user)


@router.get("/saved-searches", response_model=list[SavedSearchResponse])
async def list_saved_searches(
    user: dict[str, Any] = Depends(_current_user),
    database: Any = Depends(get_auth_database),
) -> list[SavedSearchResponse]:
    result = await prepared_statement(
        database,
        """
        SELECT id, label, search_input, search_result, created_at, updated_at
        FROM saved_searches
        WHERE user_id = ?
        ORDER BY updated_at DESC
        """,
        user["id"],
    ).run()
    rows = result.get("results", [])

    return [
        SavedSearchResponse(
            **{
                **row,
                "search_input": json.loads(row["search_input"]),
                "search_result": json.loads(row["search_result"]),
            }
        )
        for row in rows
    ]


@router.post(
    "/saved-searches",
    response_model=SavedSearchResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_saved_search(
    payload: SavedSearchCreateRequest,
    user: dict[str, Any] = Depends(_current_user),
    database: Any = Depends(get_auth_database),
) -> SavedSearchResponse:
    saved_search = {
        "id": str(uuid.uuid4()),
        "label": payload.label.strip(),
        "search_input": json.dumps(payload.search_input),
        "search_result": json.dumps(payload.search_result),
        "created_at": datetime.now(UTC).isoformat(),
        "updated_at": datetime.now(UTC).isoformat(),
    }
    await prepared_statement(
        database,
        """
        INSERT INTO saved_searches
          (id, user_id, label, search_input, search_result, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        saved_search["id"],
        user["id"],
        saved_search["label"],
        saved_search["search_input"],
        saved_search["search_result"],
        saved_search["created_at"],
        saved_search["updated_at"],
    ).run()

    return SavedSearchResponse(
        **{
            **saved_search,
            "search_input": payload.search_input,
            "search_result": payload.search_result,
        }
    )


@router.delete("/saved-searches/{saved_search_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_saved_search(
    saved_search_id: str,
    user: dict[str, Any] = Depends(_current_user),
    database: Any = Depends(get_auth_database),
) -> None:
    await prepared_statement(
        database,
        "DELETE FROM saved_searches WHERE id = ? AND user_id = ?",
        saved_search_id,
        user["id"],
    ).run()
