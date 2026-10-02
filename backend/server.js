const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Temporary in-memory todo list
let todos = [];

// Test route
app.get("/", (req, res) => {
    res.send("Todo Backend is Running!");
});

// Get all todos
app.get("/api/todos", (req, res) => {
    res.json(todos);
});

// Add a todo
app.post("/api/todos", (req, res) => {
    const { text } = req.body;

    if (!text || text.trim() === "") {
        return res.status(400).json({
            message: "Todo text is required"
        });
    }

    const newTodo = {
        id: Date.now(),
        text: text.trim(),
        completed: false
    };

    todos.push(newTodo);

    res.status(201).json(newTodo);
});

// Update todo
app.put("/api/todos/:id", (req, res) => {
    const id = Number(req.params.id);

    const todo = todos.find((todo) => todo.id === id);

    if (!todo) {
        return res.status(404).json({
            message: "Todo not found"
        });
    }

    todo.completed = !todo.completed;

    res.json(todo);
});

// Delete todo
app.delete("/api/todos/:id", (req, res) => {
    const id = Number(req.params.id);

    const todoExists = todos.some((todo) => todo.id === id);

    if (!todoExists) {
        return res.status(404).json({
            message: "Todo not found"
        });
    }

    todos = todos.filter((todo) => todo.id !== id);

    res.json({
        message: "Todo deleted successfully"
    });
});

// Render provides the PORT environment variable
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});