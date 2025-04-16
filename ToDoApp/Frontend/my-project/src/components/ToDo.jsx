import { useState } from "react";
import { useEffect } from "react";
const ToDo = () =>{
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const apiUrl = "http://localhost:3001";
  useEffect(() => {
    getToDo();
  },[]);
  const getToDo = () =>{
    fetch(apiUrl + "/todo")
      .then((res) => {return res.json()})
      .then((res) => {
        setTodos(res);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to connect to the server");
      });
  }
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
                    setTodos([...todos, { title, description }]);
                    setMessage("Todo item created successfully!");
                    setTimeout(()=>{
                      setMessage("");
                    },3000);
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
  return(
    <>
    <div className="flex p-3 bg-green-600 text-white justify-center">
    <h1 className="font-bold ">
      To Do App with NodeJs and React
    </h1>
    </div>
    <div className="text-center  mt-5">
      <h3>Add Item</h3>
      {message && <p className="text-green-500">{message}</p>}
      <div className="flex justify-center gap-4 mt-5">
        <input
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          id="first_name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-[40%]"
          placeholder="Title"
          required
        />
        <input
          type="text"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          id="first_name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-[40%]"
          placeholder="Description"
          required
        />
        <button
          type="button"
          className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 w-[10%]"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      {error && <p>{error}</p>}
    </div>
   
 
 
    <div className="w-full max-w-[550px] mt-5 mx-auto">
  <ul className="list-none ml-0 space-y-4">
    {todos.map((item)=>(
    <li className="bg-white shadow-md p-4 rounded-lg border border-gray-200">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
        <p className="text-sm text-gray-600">{item.description}</p>
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <button className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">Edit</button>
        <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">Delete</button>
      </div>
    </li>))}
  </ul>
</div>




    </>
  );
}
export default ToDo;