def score_career_trajectory(profile: dict) -> float:
    history = profile.get("history", []) if profile else []
    return 0.5 + min(len(history), 5) * 0.1
