# Meeting Overlap Manager

A web application for managing meetings with automatic conflict detection and visualization. The application helps users identify scheduling conflicts by detecting overlapping meetings and grouping them into conflict clusters. It provides both list and range views for better visualization of meeting schedules.

## Project Description

This is a meeting management system that:

- **Detects Meeting Conflicts**: Automatically identifies overlapping meetings based on their start and end times
- **Groups Conflicts**: Uses graph-based clustering to group intersecting meetings into conflict clusters (connected components)
- **Visual Highlighting**: Clearly marks meetings with conflicts in the UI
- **Multiple View Modes**: 
  - **List View**: Traditional day-based list with conflict highlighting
  - **Range View**: Visual timeline showing all meetings on a single axis based on their time ranges
- **Persistent Settings**: Saves user preferences (view mode, sort mode, filters) in localStorage
- **Flexible Sorting**: Sort meetings by time or topic
- **Filtering**: Option to show only meetings with conflicts

The application uses vanilla JavaScript with localStorage for data persistence, making it a lightweight, client-side solution.

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

5.  **Run tests:**

    ```bash
    npm test
    ```

    Or run tests once:

    ```bash
    npm run test:run
    ```

## Project Structure

- `/src`: All source code lives here.
    - `/index.js`: Main application entry point and event handlers
    - `/styles/index.css`: Application styles including conflict highlighting and range view
    - `/utils`: Helper functions
        - `checkOverlap.js`: Pairwise intersection detection between meetings
        - `scanMeetingsForOverlaps.js`: Scans all meetings for overlaps
        - `clustering.js`: Groups intersecting meetings into conflict clusters (connected components)
        - `sortMeetings.js`: Sorting utilities for meetings
        - `queries.js`: Data access layer (localStorage operations) and UI options persistence
        - `formUtils.js`: Form handling and meeting rendering with conflict detection
- `/index.html`: Main HTML structure with UI controls
- `/public`: Static assets like images and fonts.

## Features

### Conflict Detection

The application implements pairwise intersection detection between meetings using their `startTime` and `endTime` values. The result is a normalized structure:

```javascript
{
    meetingId0: string,
    meetingId1: string,
    overlaps: boolean
}
```

### Conflict Clustering

Meetings that intersect are grouped into conflict clusters using graph-based connected components analysis. This means if Meeting A overlaps with Meeting B, and Meeting B overlaps with Meeting C, all three are grouped into the same cluster.

### UI Features

- **Conflict Highlighting**: Meetings in conflict clusters are visually highlighted with red borders and background
- **Range View**: Visual timeline representation showing meetings positioned on a time axis
- **Persistent Options**: View mode, sort mode, and filter preferences are saved to localStorage and restored on page reload
- **Interactive Meetings**: Click on any meeting in either view to view/edit details

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

## Testing

The project includes automated tests for intersection detection and clustering logic using Vitest. Test files are located in the `src/utils` directory with the `.test.js` extension.

### Running Tests

- `npm test` - Run tests in watch mode
- `npm run test:run` - Run tests once

### Test Coverage

Tests cover:
- **Intersection Detection** (`checkOverlap.test.js`): Tests for overlapping meetings, non-overlapping meetings, different days, and normalized result structure
- **Clustering Logic** (`clustering.test.js`): Tests for building conflict clusters, connected components, and conflict map creation
- **Scanning Logic** (`scanMeetingsForOverlaps.test.js`): Tests for scanning all meeting pairs and producing complete overlap results
