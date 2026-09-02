# Contributing

Read `docs/GUIDEBOOK.md` first. That book is the house rule.

## 1. Pick a room

Work in one room unless a ticket and a form must change together.

- `frontend/` shop window
- `backend/` kitchen
- `pipeline/` Saturday prep
- `data/` pantry
- `docs/` fridge binder

## 2. Branch, then small photos

```powershell
git checkout main
git pull
git checkout -b feat/short-name
```

Commit one idea at a time. English. Present tense.

## 3. Check before you ask to merge

```powershell
cd backend
python -m pytest -q

cd ..\frontend
npm run build
```

## 4. Open a pull request

Use the template. Say which room you entered. Do not include `.env`, keys, or raw dumps.

## 5. Freeze

After 11 September 2026, only bug fixes and docs land on `main`.
