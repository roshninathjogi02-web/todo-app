import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  // Get todos from backend
  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add todo
  const addTodo = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const newTodo = await response.json();

      setTodos([...todos, newTodo]);
      setText("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Complete todo
  const toggleTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
      });

      const updatedTodo = await response.json();

      setTodos(
        todos.map((todo) =>
          todo.id === id ? updatedTodo : todo
        )
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className="app">
      <div className="todo-container">
        <h1>My To-Do List</h1>

        <form onSubmit={addTodo} className="todo-form">
          <input
            type="text"
            placeholder="Enter a task..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button type="submit">Add</button>
        </form>

        <div className="todo-list">
          {todos.length === 0 ? (
            <p className="empty">No tasks yet.</p>
          ) : (
            todos.map((todo) => (
              <div
                className={`todo-item ${
                  todo.completed ? "completed" : ""
                }`}
                key={todo.id}
              >
                <span onClick={() => toggleTodo(todo.id)}>
                  {todo.text}
                </span>

                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;