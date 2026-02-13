def score_behavioral_fit(profile: dict) -> float:
    traits = (profile or {}).get("traits", [])
    if not traits:
        return 0.4
    return min(len(traits), 5) / 5
