import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Make sure you import the CSS file

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/todos");
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async () => {
    if (newTodo.trim()) {
      try {
        const response = await axios.post("http://localhost:5000/api/todos", { text: newTodo });
        setTodos([...todos, response.data]);
        setNewTodo(""); // Clear the input after adding
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/todos/${id}`, {
        completed: !completed,
      });
      setTodos(
        todos.map((todo) => (todo._id === id ? { ...todo, completed: response.data.completed } : todo))
      );
    } catch (error) {
      console.error("Error toggling complete status:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className="App">
      <h1>Todo List</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)} // Updates newTodo state on input change
        placeholder="Add a new todo"
      />
      <button onClick={addTodo} disabled={!newTodo.trim()}>Add</button>

      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            <span
              onClick={() => toggleComplete(todo._id, todo.completed)}
              className={todo.completed ? "completed" : ""}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
