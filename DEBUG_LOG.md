# Debug Log - Full Stack Task

## 1. Initial Setup & Dependencies
- Issue: npm install failed with enoent error.
- Root Cause: Missing package.json file.
- Fix: Ran npm init -y and npm install express.
- Status: Resolved.

## 2. Development Environment
- Tooling: Installed nodemon for auto-restarting the server.
- Command: npm install -g nodemon

## 3. Bug Fixes (Logic & Configuration)
- Issue: Port mismatch between app.listen() (3000) and console log message (5000).
- Fix: Updated app.listen() to use port 3000.
- Status: Resolved.

- Issue: /users endpoint failed due to undefined userList variable.
- Root Cause: Typo in variable reference.
- Fix: Changed userList to allUsers.
- Status: Resolved.

- Issue: /users/:id endpoint returning nothing because of a Type Mismatch (String vs Number).
- Fix: Used parseInt() on req.params.id to ensure correct comparison.
- Status: Resolved.

- Issue: Inefficient function structure for getUserById().
- Fix: Refactored function to return the user object instead of using console.log, improving reusability and code quality.
- Status: Resolved.

- Issue: /notes/count endpoint returning undefined.
- Root Cause: Typo in property name lenght.
- Fix: Corrected notes.lenght to notes.length.
- Status: Resolved.

- Issue: /external-data route failing because `fetchExternalData` function was undefined.
- Fix: Implemented a mock `fetchExternalData` function that returns a Promise, and updated the route to use `await` to ensure the data is resolved before sending.
- Status: Resolved.


- Issue: Improper array comparison (notes == []) in /notes route and assignment error.
- Root Cause: JavaScript arrays cannot be compared using ==. Also, notes = [] was an accidental assignment.
- Fix: Replaced comparison with notes.length === 0 to correctly check for an empty array.
- Status: Resolved.

- Issue: ID generation logic for new notes producing decimals.
- Fix: Applied Math.floor() to generate whole number IDs.
- Status: Resolved.

- Issue: Note ID not generating correctly in /notes POST route.
- Root Cause: Function `generateNoteId` was assigned as a reference instead of being executed.
- Fix: Called `generateNoteId()` inside the route handler to ensure a unique ID is assigned for every new note.
- Status: Resolved.

- Issue: /notes/:id DELETE route failing to find notes.
- Root Cause: Type mismatch between string req.params.id and number note.id.
- Fix: Implemented parseInt() on the ID parameter and added a check to verify the note exists before attempting to splice the array.
- Status: Resolved.

- Issue: /users/:id PUT route failing to update user data.
- Root Cause: Type mismatch on req.params.id and incorrect variable name reference (username vs name).
- Fix: Implemented parseInt() for the ID, added a existence check for the user object, and corrected the variable assignment.
- Status: Resolved


-Issue: /user-notes/:userId route returning incorrect or empty results.
- Root Cause: Used assignment operator (=) instead of comparison (===) in filter and failed to convert req.params.userId from string to number.
- Fix: Implemented parseInt() for the ID and corrected the comparison operator to ===.
- Status: Resolved.

- Issue: Security vulnerability in /login route.
- Root Cause: Used logical OR (||) operator, allowing login if either email OR password matched.
- Fix: Changed to logical AND (&&) operator to ensure both credentials must be valid. Added 401 status code for failed attempts.
- Status: Resolved.


- Issue: /profile/:id returning undefined/error.
- Root Cause: filter() returns an array, so accessing .name directly was impossible.
- Fix: Switched from filter() to find() to retrieve the single user object, and used parseInt() for the ID.
- Status: Resolved.

- Issue: /sum route receiving undefined for req.body.
- Root Cause: Missing express.json() middleware to parse incoming JSON payloads.
- Fix: Added app.use(express.json()) to the application configuration.
- Status: Resolved.




## Features
- **Search:** Real-time filtering.
- **Pinning:** Pinned notes stay at the top of the list.
- **Auto-Save:** Saves changes automatically after 2 seconds of inactivity.
- **Responsive:** Optimized for mobile and desktop.

## API Endpoints
- `GET /notes?q=`: Get all notes or search.
- `POST /notes`: Create a new note.
- `PUT /notes/:id`: Update an existing note.
- `DELETE /notes/:id`: Delete a note.

## Setup
1. `npm install`
2. Create `.env` file with `VITE_API_URL`.
3. `npm run dev`