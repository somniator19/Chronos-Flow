# Meeting Overlap Manager

This document contains everything you need to get up and running. Please read it carefully before asking questions.

## Prerequisites

Before you start, ensure you have the following installed:

- **Node.js** (Version 18 or higher): [Download here](https://nodejs.org/)
- **Git**: [Download here](https://git-scm.com/)
- **VS Code**: Recommended IDE.

## Getting Started

Open your terminal and run these commands in order:

1.  **Clone the repository:**

    ```bash
    git clone git@github.com:TUMOlabs/meeting-manager.git

    cd meeting-manager
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Start the development server:**

    ```bash
    npm run dev
    ```

    _The app should now be running at `http://localhost:3000`._

4.  **To make sure Vite can successfully bundle the project for production run:**

    ```bash
    npm run build
    ```

## Project Structure

- `/src`: All source code lives here.
    - `/components`: Reusable UI parts (Buttons, Headers).
    - `/pages`: Full views/screens.
    - `/utils`: Helper functions (date formatting, math).
- `/public`: Static assets like images and fonts.

## Contribution Rules

1.  **Never push to `main` directly.** Always create a new branch.
2.  **Branch Naming:** `feature/description` (e.g., `feature/login-page`).
3.  **Commit Messages:** Use present tense.
    - ✅ `Add login button`
    - ❌ `Added login button`
4.  **Before pushing:** Run `npm run lint` to check for errors.

## Workflow

1. **Branch off main**

    make sure you are on the **main** branch

    `git checkout main`

    then create a new **feature** branch from the **main** branch

    `git checkout -b feature/feature-name`

2. **Commit changes**

    `npm run fix` run this before every commit and fix all errors which were not autofixed

    or run `npm run check` just to see the errors

    `git add <filename1> <filename2>`

    or `git add .` to add all changes

    `git commit -m <commit message>`

    lint and format _pre-commit_ check will run, if all ok changes are committed

3. **Push to the _REMOTE_ branch**

    `git push -u origin feature/<feature name>`

4. **Open a Pull Request (PR) for review**

5. **Merge into main branch via PR**

    base: **main** <- compare: **feature/feature-name**

    (use **Squash and merge** if you want cleaner history).

6. **Delete the feature branch**

    `git checkout main`

    `git branch feature/<feature name> -d`

    or `git branch feature/<feature name> -D` to force delete

## Check and Fix

On each save (Ctrl+S) _Prettier_ will format the code using its config file (.prettierrc).

- `npm run check`

This is the "Safety Check." It doesn't change any code; it just reports if anything is wrong.

- `npm run fix`

Run this command when you see this: **Run Prettier with --write to fix**

This is the "Magic Wand." It will automatically fix every formatting error and every auto-fixable ESLint error in the entire project at once.

- `npm run format`

Useful if you want to check if you forgot to format a file without actually changing the file yet.

## Environment Variables

Define all environment variables in **.env** file.

Any variable you want to use in the frontend must start with **VITE\_**.

e.g.: VITE_SAMPLE_VAR

**NOTE: .env file is ignored and NEVER pushed to the repo.**

**.env.example** file is for reference only and can be pushed safely.
It contains variable names and their data types (**NO REAL VALUES**) in the following format:

VITE_VARIABLE_NAME=\<data_type\>

e.g.: VITE_SAMPLE_VAR=\<string\>
