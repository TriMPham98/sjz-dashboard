import { useState } from "react";

export default function UserForm({ onUserAdded }) {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const response = await fetch("/api/addUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("User added successfully!");
        setUsername("");
        onUserAdded();
      } else {
        setMessage(data.error || "An error occurred while adding the user.");
        setIsError(true);
      }
    } catch (error) {
      setMessage("An error occurred while adding the user.");
      setIsError(true);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username">
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit">
            Add User
          </button>
        </div>
      </form>
      {message && (
        <p
          className={`text-center ${
            isError ? "text-red-500" : "text-green-500"
          }`}>
          {message}
        </p>
      )}
    </div>
  );
}
