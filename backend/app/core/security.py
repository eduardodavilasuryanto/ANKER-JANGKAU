"""Password and session-token helpers using only Python standard-library crypto."""

import hashlib
import hmac
import secrets

PBKDF2_ITERATIONS = 600_000
SALT_BYTES = 16


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(SALT_BYTES)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, PBKDF2_ITERATIONS)
    return f"{salt.hex()}${digest.hex()}"


def verify_password(password: str, password_hash: str) -> bool:
    try:
        salt_hex, stored_digest = password_hash.split("$", maxsplit=1)
        salt = bytes.fromhex(salt_hex)
    except ValueError:
        return False

    calculated_digest = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), salt, PBKDF2_ITERATIONS
    ).hex()
    return hmac.compare_digest(calculated_digest, stored_digest)


def create_session_token() -> str:
    return secrets.token_urlsafe(32)


def hash_session_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()
