from app.core.security import (
    create_session_token,
    hash_password,
    hash_session_token,
    verify_password,
)


def test_password_hash_can_only_verify_its_original_password() -> None:
    password_hash = hash_password("correct-horse-battery-staple")

    assert verify_password("correct-horse-battery-staple", password_hash)
    assert not verify_password("not-the-password", password_hash)


def test_session_tokens_are_random_and_are_stored_as_hashes() -> None:
    first_token = create_session_token()
    second_token = create_session_token()

    assert first_token != second_token
    assert hash_session_token(first_token) != first_token
