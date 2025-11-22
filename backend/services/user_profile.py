"""Dummy user profile service placeholder."""


def get_profile(user_id: int) -> dict:
    # TODO: fetch profile from database
    return {"user_id": user_id, "profile": "placeholder"}
