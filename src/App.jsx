import './App.css';
import { useState, useEffect } from "react";

export default function App() {
  const [data, setData] = useState([]);
  const [input, setInput] = useState("");
  const [previousText, setPreviousText] = useState("");
  const [updateID, setUpdateID] = useState();

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = async () => {
    try {
      const response = await fetch(`http://localhost:3008/todos`);
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  }

  const addTodo = async () => {
    try {
      await fetch("http://localhost:3008/todo/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: input
        })
      });
      setInput("");
      getTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  }

  const deleteTodo = async (id) => {
    try {
      await fetch(`http://localhost:3008/todo/delete/${id}`, {
        method: "DELETE"
      });
      getTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }

  const updateData = async (id) => {
    try {
      await fetch(`http://localhost:3008/todo/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": "token-value"
        },
        body: JSON.stringify({
          text: previousText
        })
      });
      setPreviousText("");
      setUpdateID(null);
      getTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  }

  return (
    <div className="App bg-gray-100 min-h-screen p-5">
      <div className="max-w-screen-md mx-auto bg-white p-8 rounded-lg shadow-lg flex flex-col lg:flex-row">
        <div className="left-section w-full">
    <h1 className="text-2xl font-bold mb-4 text-center">All the Todos</h1>
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-300">
          <th className="border border-gray-400 px-4 py-2">Todo</th>
          <th className="border border-gray-400 px-4 py-2">Delete</th>
          <th className="border border-gray-400 px-4 py-2">Edit</th>
          <th className="border border-gray-400 px-4 py-2">Update</th>
        </tr>
      </thead>
      <tbody>
        {data.map((res) => (
          <tr key={res._id} className="bg-gray-200">
            <td className="border border-gray-400 px-4 py-2 text-lg">{res.text}</td>
            <td className="border border-gray-400 px-4 py-2 text-center">
              <button
                onClick={() => deleteTodo(res._id)}
                className="delete bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </td>
            <td className="border border-gray-400 px-4 py-2 text-center">
              <button
                onClick={() => { setPreviousText(res.text); setUpdateID(res._id); }}
                className="update bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Edit
              </button>
            </td>
            <td className="border border-gray-400 px-4 py-2 text-center">
              {updateID === res._id && (
                <div className="flex flex-col space-y-2">
                  <input
                    value={previousText}
                    onChange={e => setPreviousText(e.target.value)}
                    className="border border-gray-300 rounded p-2"
                  />
                  <button
                    onClick={() => updateData(updateID)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-700"
                  >
                    Update
                  </button>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
        </div>

        <div className="right-section w-full  lg:ml-8 mt-8 lg:mt-0">
          <h1 className="text-2xl font-bold mb-4 text-center">Add Todo</h1>
          <div className="mb-4">
            <label className="block text-lg mb-2">Enter Todo name</label>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button onClick={addTodo} className="w-full bg-green-500 text-white px-3 py-2 rounded hover:bg-green-700">ADD Todo</button>
        </div>
      </div>
    </div>
  );
}
