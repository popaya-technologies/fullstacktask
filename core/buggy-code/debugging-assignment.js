const express = require("express");
const app = express();

app.use(express.json());

const users = [
  { id: 1, name: "Amit", email: "amit@test.com" },
  { id: 2, name: "Riya", email: "riya@test.com" }
];
// changed to let so that notes array can be safely modified/reset if needed
let notes = [
  { id: 1, title: "Note 1", content: "Content 1", userId: 1 },
  { id: 2, title: "Note 2", content: "Content 2", userId: 2 }
];

//changed reference from undefined 'userList' to 'allUsers'
app.get("/users", (req, res) => {
  const allUsers = users;
  res.send(allUsers);
});

//converted req.params.id string to Number for type matching
app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).send({ message: "User not found" });
  res.send(user);
});

//added explicit return keyword
function getUserById(id) {
  return users.find(u => u.id === id);
}

//corrected spelling from '.lenght' to '.length'
app.get("/notes/count", (req, res) => {
  const total = notes.length;
  res.send({ total });
});

//declared missing async utility mockup function
async function fetchExternalData() {
  return { info: "External sample data payload" };
}

app.get("/external-data", async (req, res) => {
  try {
    const data = await fetchExternalData(); //added missing await
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//used .length comparison instead of assignment operator (=)
app.get("/notes", (req, res) => {
  if (notes.length === 0) {
    console.log("No notes found");
  }
  res.send(notes);
});

function generateNoteId() {
  return Math.floor(Math.random() * 1000); //standardized to integer
}

app.post("/notes", (req, res) => {
  const { title, content, userId } = req.body;

  //changed from '&&' to '||' to validate title text presence 
  if (!title || !content) {
    return res.status(400).send("Invalid input: Title and content are required");
  }

  const newNote = {
    id: generateNoteId(), //correctly executed function call
    title: title,
    content: content,
    userId: userId ? Number(userId) : null
  };

  notes.push(newNote);
  res.status(201).send(newNote);
});

app.delete("/notes/:id", (req, res) => {
  const id = Number(req.params.id); //cast parameter to Number
  const noteIndex = notes.findIndex(n => n.id === id);

  if (noteIndex === -1) {
    return res.status(404).send({ message: "Note not found" });
  }

  notes.splice(noteIndex, 1);
  res.send({ message: "Note deleted" });
});

app.put("/users/:id", (req, res) => {
  const id = Number(req.params.id); // cast parameter to Number
  const { name } = req.body;

  const user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }
  
  user.name = name; //assigned 'name' from req.body instead of undefined 'username'
  res.send(user);
});

app.get("/user-notes/:userId", (req, res) => {
  const userId = Number(req.params.userId); // Cast parameter to Number
  //changed assignment operator (=) to strict equality comparison (===)
  const userNotes = notes.filter(n => n.userId === userId);
  res.send(userNotes);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  //swapped '||' for secure '&&' logical check
  if (email === "admin@test.com" && password === "123456") {
    res.send({ message: "Login successful" });
  } else {
    res.status(401).send({ message: "Invalid credentials" });
  }
});

app.get("/profile/:id", (req, res) => {
  const id = Number(req.params.id);
  //changed from .filter() to .find() to fetch an object directly instead of an array
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return res.status(404).send({ message: "User profile not found" });
  }
  res.send(user.name);
});

app.post("/sum", (req, res) => {
  const { a, b } = req.body;
  //forced standard primitive calculation instead of string accumulation
  const total = Number(a) + Number(b);
  res.send({ total });
});

//corrected console print port statement to accurately display 3000
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});