"""Helpers for accessing the D1 binding exposed by Cloudflare's ASGI adapter."""

from typing import Any

from fastapi import HTTPException, Request, status


def get_auth_database(request: Request) -> Any:
    """Return the AUTH_DB binding or a useful response outside Workers runtime."""

    environment = request.scope.get("env")
    database = getattr(environment, "AUTH_DB", None)

    if database is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The authentication database is unavailable. Run with pywrangler dev.",
        )

    return database


def prepared_statement(database: Any, query: str, *values: Any) -> Any:
    """Prepare a D1 statement and bind positional values when present."""

    statement = database.prepare(query)
    return statement.bind(*values) if values else statement
