import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import "./index.css";

const supabase = createClient(
  "https://qvexzxnorbdqlscsakes.supabase.co", // Ganti dengan Supabase URL Anda
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2ZXh6eG5vcmJkcWxzY3Nha2VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNzQwNDEsImV4cCI6MjA2Mzc1MDA0MX0.GC2TYOjw-qre4ZNYws-eL1E-DyiPiRD1OKdRoy0cYhk" // Ganti dengan Supabase Anon Key Anda
);

function App() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTask, setEditingTask] = useState("");

  // Fetch todos
  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching todos:", error);
    } else {
      setTodos(data);
    }
  };

  // Create todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const { error } = await supabase.from("todos").insert([{ task: newTask }]);
    if (error) {
      console.error("Error adding todo:", error);
    } else {
      setNewTask("");
      fetchTodos();
    }
  };

  // Update todo
  const updateTodo = async (id) => {
    const { error } = await supabase
      .from("todos")
      .update({ task: editingTask })
      .eq("id", id);
    if (error) {
      console.error("Error updating todo:", error);
    } else {
      setEditingId(null);
      fetchTodos();
    }
  };

  // Toggle completion
  const toggleCompletion = async (id, is_completed) => {
    const { error } = await supabase
      .from("todos")
      .update({ is_completed: !is_completed })
      .eq("id", id);
    if (error) {
      console.error("Error toggling completion:", error);
    } else {
      fetchTodos();
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (error) {
      console.error("Error deleting todo:", error);
    } else {
      fetchTodos();
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>

      <div className="mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          className="w-full p-2 border rounded"
        />
        <button
          onClick={addTodo}
          className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Todo
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-2 border rounded"
          >
            {editingId === todo.id ? (
              <div className="flex w-full">
                <input
                  type="text"
                  value={editingTask}
                  onChange={(e) => setEditingTask(e.target.value)}
                  className="flex-1 p-1 border rounded"
                />
                <button
                  onClick={() => updateTodo(todo.id)}
                  className="ml-2 bg-green-500 text-white p-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="ml-2 bg-gray-500 text-white p-1 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={todo.is_completed}
                    onChange={() =>
                      toggleCompletion(todo.id, todo.is_completed)
                    }
                    className="mr-2"
                  />
                  <span className={todo.is_completed ? "line-through" : ""}>
                    {todo.task}
                  </span>
                </div>
                <div>
                  <button
                    onClick={() => {
                      setEditingId(todo.id);
                      setEditingTask(todo.task);
                    }}
                    className="mr-2 text-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
