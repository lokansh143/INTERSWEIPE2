from fastapi import FastAPI
from pydantic import BaseModel

from engines import (
    score_behavioral_fit,
    score_career_trajectory,
    score_skill_gap
)

app = FastAPI()


class MatchRequest(BaseModel):
    profile: dict | None = None
    preferences: dict | None = None


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/match")
def match(request: MatchRequest):
    profile = request.profile or {}
    preferences = request.preferences or {}
    scores = {
        "career_trajectory": score_career_trajectory(profile),
        "skill_gap": score_skill_gap(profile, preferences),
        "behavioral_fit": score_behavioral_fit(profile)
    }
    overall = sum(scores.values()) / len(scores)
    return {
        "matches": [],
        "received": request.model_dump(),
        "scores": scores,
        "overall": round(overall, 2),
        "note": "Matching logic placeholder"
    }
