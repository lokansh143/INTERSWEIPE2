def score_skill_gap(profile: dict, preferences: dict) -> float:
    required = set((preferences or {}).get("skills", []))
    provided = set((profile or {}).get("skills", []))
    if not required:
        return 0.5
    return len(required & provided) / len(required)
