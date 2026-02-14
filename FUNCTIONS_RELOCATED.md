# Firebase Functions relocated to `3dime-api`

The Firebase Functions that were previously part of this repository have been extracted to a separate repository named `3dime-api` to keep backend code isolated from the frontend.

This repository (`3dime-angular`) no longer contains the `functions/` source tree. If you need to build, run, test, or deploy the functions, follow the steps below from the `3dime-api` repository.

Basic workflow (example)

```bash
# clone the functions repository (example URL — replace with the actual repo URL if known)
# git clone https://github.com/<org>/3dime-api.git
# cd 3dime-api

# install deps
npm install

# build (if required)
npm run build

# run emulator locally (if configured)
firebase emulators:start --only functions

# deploy functions
firebase deploy --only functions
```

Notes

- Environment variables, secrets, and CORS settings for the functions live in the `3dime-api` repository. Configure them there.
- Documentation that previously pointed to `functions/` inside this repo has been updated to reference the `3dime-api` repository instead.
- If you want me to add a direct link to the `3dime-api` GitHub repository in this file, provide the URL or ask me to add it.

If you'd like, I can:
- Add a short README entry to this repo's `README.md` linking to `FUNCTIONS_RELOCATED.md`.
- Remove any remaining references to `functions/` across the repository (I will double-check and fix them).
- Create a small example showing how to run the emulator and test endpoints locally.

