import { useState, useEffect } from "react";

const ToDo = () => {
  // State variables for managing title, description, todos, error, and success messages
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  // Backend API URL
  const apiUrl = "http://localhost:3001";
  const handleEdit = (item) => {
         setEditDescription(item.description); // Pre-fill the description input with the current item's description
         setEditId(item._id); // Set the current item's ID to edit
         setEditTitle(item.title); // Pre-fill the title input with the current item's title
  };
  const handleUpdate = () => {
    setError("");
    setMessage("");
    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      fetch(apiUrl + "/todo/" + editId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      })
        .then((res) => {
          if (res.ok) {
            getToDo(); // Refresh the todo list
            setEditId(-1); // Exit edit mode
            setMessage("Todo item updated successfully!");
            setTimeout(() => {
              setMessage(""); // Clear the success message after 3 seconds
            }, 3000);
          } else {
            setError("Unable to update todo item");
          }
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setError("Failed to connect to the server");
        });
    }
  }
  // Fetch all todo items when the component is mounted
  useEffect(() => {
    getToDo();
  }, []);

  // Function to fetch all todo items from the backend
  const getToDo = () => {
    fetch(apiUrl + "/todo")
      .then((res) => res.json())
      .then((res) => {
        setTodos(res); // Update the todos state with the fetched data
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to connect to the server");
      });
  };

  // Function to handle form submission for adding a new todo item
  const handleSubmit = (e) => {
    setError("");
    setMessage("");
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiUrl + "/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            setTodos([...todos, { title, description }]); // Add the new todo to the list
            setMessage("Todo item created successfully!");
            setTimeout(() => {
              setMessage(""); // Clear the success message after 3 seconds
            }, 3000);
          } else {
            setError("Unable to create todo item");
          }
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setError("Failed to connect to the server");
        });
    }
  };

  return (
    <>
      {/* Header Section */}
      <div className="flex p-3 bg-green-600 text-white justify-center">
        <h1 className="font-bold text-xl">To Do App with NodeJs and React</h1>
      </div>

      {/* Add Item Section */}
      <div className="text-center mt-5">
        <h3 className="text-lg font-semibold">Add Item</h3>
        {message && <p className="text-green-500">{message}</p>}
        <div className="flex justify-center gap-4 mt-5">
          {/* Input for Title */}
          <input
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            id="title"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-[40%]"
            placeholder="Title"
            required
          />
          {/* Input for Description */}
          <input
            type="text"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            id="description"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-[40%]"
            placeholder="Description"
            required
          />
          {/* Submit Button */}
          <button
            type="button"
            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 w-[10%]"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Todo List Section */}
      <div className="w-full max-w-[550px] mt-5 mx-auto">
        <ul className="list-none ml-0 space-y-4">
          {todos.map((item, index) => (
            <li
              key={index}
              className="bg-white shadow-md p-4 rounded-lg border border-gray-200"
            >
              <div className="space-y-1">
                {/* Display Title */}
                {editId === -1 || editId !== item._id ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      onChange={(e) => setEditTitle(e.target.value)} // Update editTitle state
                      value={editTitle} // Bind to editTitle state
                      id="title"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full max-w-[400px] mx-auto"
                      placeholder="Enter Title"
                    />
                    <input
                      type="text"
                      onChange={(e) => setEditDescription(e.target.value)} // Update editDescription state
                      value={editDescription} // Bind to editDescription state
                      id="description"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full max-w-[400px] mx-auto"
                      placeholder="Enter Description"
                      required
                    />
                  </>
                )}
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                {/* Edit Button */}
                {editId === item._id ? (
                  // Show Update and Cancel Buttons for the Selected Item
                  <>
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                      onClick={handleUpdate}
                    >
                      Update
                    </button>
                    <button
                      className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                      onClick={() => setEditId(-1)} // Cancel Edit Mode
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  // Show Edit Button for Other Items
                  <>
                    <button
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                      onClick={() => {
                        handleEdit(item); // Set the current item's ID to edit
                        
                        // Pre-fill the description input with the current item's description
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                      // Cancel Edit Mode
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ToDo;
