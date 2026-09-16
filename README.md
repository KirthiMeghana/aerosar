# AEROSAR — SIH 2026, PS 26177

AI-powered autonomous drone for search & rescue. The full technical plan lives in
[`docs/AEROSAR_SIH_PS26177_Master_Document_final.md`](docs/AEROSAR_SIH_PS26177_Master_Document_final.md).

## Repository layout (master doc §18.1)

| Folder | Owner | Status in this repo |
|---|---|---|
| `worlds/`, `drone_description/` | Member 1 | not yet added |
| `aerosar_msgs/` | all (Member 1 gatekeeps) | not yet added |
| `perception/` | Member 2 | not yet added |
| `navigation/` | Member 3 | not yet added |
| `backend/` | Member 4 | not yet added |
| `frontend/` | **Member 5** | Command-center dashboard — see `frontend/README.md` |
| `launch/`, `scripts/` | Member 6 | not yet added |
| `docs/` | everyone | master document, Member 5 agent prompt and git guide |

## Branches (master doc §18.2)

`main` (always demo-able, Member 6 merges) ← `develop` (integration) ← `feature/<module>` branches.
Commit messages use `[module] short description`.

## Quick start (dashboard)

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173 — runs the built-in demo scenario
```

The dashboard ⇄ backend contract is in [`frontend/WS_CONTRACT.md`](frontend/WS_CONTRACT.md).
