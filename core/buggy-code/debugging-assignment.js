const express = require("express");
const app = express();

app.use(express.json());

const users = [
  { id: 1, name: "Amit", email: "amit@test.com" },
  { id: 2, name: "Riya", email: "riya@test.com" }
];

const notes = [
  { id: 1, title: "Note 1", content: "Content 1", userId: 1 },
  { id: 2, title: "Note 2", content: "Content 2", userId: 2 }
];

app.get("/users", (req, res) => {
  const allUsers = users;
  res.status(200).json({allUsers});      //Listuser is not defined, it should be allUsers
});

app.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);           // id should be parsed to integer
  const user = users.find(u => u.id === id);
  if(!user){
    return res.status(404).json({ error: "User not found" });
  }
  res.status(200).json({ user });
});

function getUserById(id) {
  const user = users.find(u => u.id === id);
  return user                                                  //return the user object
}

app.get("/notes/count", (req, res) => {
  const total = notes.length;                  //lenght spelling was wrong, it should be length
  console.log(total);
  res.status(200).json({ total });
});

app.get("/external-data", async (req, res) => {            
  try {
    const data = await fetchExternalData();                 //fetchExternalData is not defined, it should be awaited becuase it is an asynchronous function
  }catch (error) {                                          //it should be written inside the try block to catch any error that may occur during the fetching of external data
    console.error("Error fetching external data:", error);
    return res.status(500).json({ error: "Failed to fetch external data" });
  }
  res.status(200).json({ data });
});

app.get("/notes", (req, res) => {
  if (notes.length === 0) {                               //notes is an constant variable and cannot be reassign and to check the length of notes it should be notes.length === 0 
    console.log("No notes found");
  }
  res.status(200).json({ notes });
});

function generateNoteId() {
  return Math.floor(Math.random() * 1000);    //the generated number can be deciaml so we need to use Math.floor to convert floats to integer
}
//the generateNoteid is stored to id variable and it should be generate new every single time we can't use the same id 

app.post("/notes", (req, res) => {
  const { title, content, userId } = req.body;

  if (!title || !content) {                     //we need to check the title and content for vlid input 
    return res.status(400).json({ error: "Invalid input" });
  }

  const newNote = {
    id: generateNoteId(),         //we need to call the function 
    title: title,
    content: content,
    userId: userId
  };

  notes.push(newNote);
  res.status(201).json({ note: newNote });
});

app.delete("/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);          //id should be parsed to integer
  const noteIndex = notes.findIndex(n => n.id === id);

  if (noteIndex === -1) {
    return res.status(404).json({ error: "Note not found" });
  }
  notes.splice(noteIndex, 1);
  res.status(200).json({ message: "Note deleted" });
});

app.put("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);          //id should be parsed to integer
  const { name } = req.body;
  if(!name){
    return res.status(400).json({ error: "Name is required" });
  }
  const user = users.find(u => u.id === id);
  if(!user){
    return res.status(404).json({ error: "User not found" });
  }
  user.name = name;                  //we need to update the name of the user object

  res.status(200).json({ user });
});

app.get("/user-notes/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);
  const userNotes = notes.filter(n => n.userId === userId);           //we need to use "===" instead of "="
                                                                      // "=" is an assignment operator and "===" is a comparison operator, we need to compare the userId of the note with the userId from the request parameters to filter the notes for that specific user
  res.status(200).json({ notes: userNotes });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@test.com" && password === "123456") {       //we need both the inputs to login
    res.status(200).json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.get("/profile/:id", (req, res) => {
  const id = parseInt(req.params.id);                    //we need to use parseInt to convert the id from string to integer
  const user = users.find(u => u.id === id);             //we need to use find function to get the user object based on the id
  if(!user){
    return res.status(404).json({ error: "User not found" });
  }
  res.status(200).json({ user });
});

app.post("/sum", (req, res) => {
  const numA = parseInt(req.body.numA);
  const numB = parseInt(req.body.numB);
  if (isNaN(numA) || isNaN(numB)) {                 //we need to check if the inputs are valid numbers
    return res.status(400).json({ error: "Invalid input" });
  }                                                  //using isNum function to quickly check whether the inputs are valid numbers or not
  const total = numA + numB;
  res.status(200).json({ total });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});