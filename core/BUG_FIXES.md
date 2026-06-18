# Bug Fixes Report

## Summary
Fixed 15+ bugs in the Express.js application to make it run correctly.

---

## Bugs Fixed

### 1. **Line 18: Undefined Variable**
- **Bug**: `res.send(userList);`
- **Fix**: `res.send(allUsers);`
- **Issue**: Variable `userList` was not defined, should use `allUsers`

### 2. **Line 23: Type Coercion Issue**
- **Bug**: `const user = users.find(u => u.id === id);` (id is string)
- **Fix**: `const id = Number(req.params.id);`
- **Issue**: req.params.id is a string, but u.id is a number

### 3. **Line 29: Missing Return Statement**
- **Bug**: Function doesn't return anything
- **Fix**: `return user;`
- **Issue**: Function would return undefined

### 4. **Line 32: Typo in Property Name**
- **Bug**: `const total = notes.lenght;`
- **Fix**: `const total = notes.length;`
- **Issue**: Typo - should be "length" not "lenght"

### 5. **Line 37: Undefined Function**
- **Bug**: `const data = fetchExternalData();`
- **Fix**: `const data = await fetchExternalData();`
- **Issue**: Missing await keyword and function doesn't exist (added try-catch)

### 6. **Line 42: Assignment Instead of Comparison**
- **Bug**: `if (notes = []) {`
- **Fix**: `if (notes.length === 0) {`
- **Issue**: Using assignment operator = instead of comparison ===

### 7. **Line 49: Non-integer ID Generation**
- **Bug**: `return Math.random() * 1000;`
- **Fix**: `return Math.floor(Math.random() * 1000);`
- **Issue**: Returns decimal, should return integer

### 8. **Line 52: Missing Function Call Parentheses**
- **Bug**: `const newId = generateNoteId;`
- **Fix**: `const newId = generateNoteId();`
- **Issue**: Missing () to actually call the function

### 9. **Line 57: Wrong Logical Operator**
- **Bug**: `if (!title && !content) {`
- **Fix**: `if (!title || !content) {`
- **Issue**: Should be OR (||) not AND (&&)

### 10. **Line 74: Missing Error Handling**
- **Bug**: No check if noteIndex === -1
- **Fix**: Added validation before splice
- **Issue**: Deletes wrong note if ID not found

### 11. **Line 85: Wrong Variable Name**
- **Bug**: `user.name = username;`
- **Fix**: `user.name = name;`
- **Issue**: Variable is destructured as `name`, not `username`

### 12. **Line 92: Assignment Instead of Comparison**
- **Bug**: `const userNotes = notes.filter(n => n.userId = userId);`
- **Fix**: `const userNotes = notes.filter(n => n.userId === userId);`
- **Issue**: Using assignment = instead of comparison ===

### 13. **Line 99: Wrong Logical Operator**
- **Bug**: `if (email === "admin@test.com" || password === "123456") {`
- **Fix**: `if (email === "admin@test.com" && password === "123456") {`
- **Issue**: Should be AND (&&), not OR (||)

### 14. **Line 109: Array vs Object**
- **Bug**: `const user = users.filter(u => u.id === id); res.send(user.name);`
- **Fix**: `const user = users.find(u => u.id === id); res.send(user ? user.name : "User not found");`
- **Issue**: filter() returns array, need find() or access first element

### 15. **Line 119: Console Message Inconsistency**
- **Bug**: `console.log("Server running on port 5000");`
- **Fix**: `console.log("Server running on port 3000");`
- **Issue**: Server listens on 3000, but message says 5000

### 16. **Lines 84: Type Coercion in PUT endpoint**
- **Bug**: `const user = users.find(u => u.id == id);`
- **Fix**: `const id = Number(req.params.id);` and `const user = users.find(u => u.id === id);`
- **Issue**: Type coercion with == instead of strict comparison

---

## Key Issues Addressed
1. **Variable naming errors** - typos and undefined variables
2. **Type coercion** - mixing strings and numbers from req.params
3. **Operator confusion** - assignment vs comparison (= vs ===)
4. **Logic errors** - wrong logical operators (|| vs &&)
5. **Missing error handling** - no validation for edge cases
6. **Function calls** - missing parentheses
7. **Return statements** - missing returns in functions

---

## Testing Recommendations
- Test all endpoints with valid and invalid inputs
- Verify type coercion with numeric IDs
- Test edge cases like non-existent IDs
- Verify login with correct/incorrect credentials
