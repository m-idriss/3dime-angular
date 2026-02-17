# Firebase Functions relocated to `3dime-api`

The Firebase Functions that were previously part of this repository have been extracted to a separate repository named `3dime-api` to keep backend code isolated from the frontend.

This repository (`3dime-angular`) no longer contains the `functions/` source tree. If you need to build, run, test, or deploy the functions, follow the steps below from the `3dime-api` repository.

## Basic workflow (example)

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

## Notes

- Environment variables, secrets, and CORS settings for the functions live in the `3dime-api` repository. Configure them there.
- All documentation in this repository has been updated to reference the `3dime-api` repository instead of the old `functions/` directory.
- All references to `functions/` across this repository have been verified and cleaned up.

