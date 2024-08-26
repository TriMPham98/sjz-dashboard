import { useState, useEffect } from "react";

export default function UserList({ triggerFetch, onEditUser }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/checkUsers");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchUsers();
  }, [triggerFetch]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const response = await fetch(`/api/deleteUser?id=${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setUsers(users.filter((user) => user.id !== id));
        } else {
          throw new Error("Failed to delete user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <div className="mt-8 bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-400">
        Registered Gamers
      </h2>
      {users.length > 0 ? (
        <ul className="text-gray-300">
          {users.map((user) => (
            <li
              key={user.id}
              className="mb-2 flex justify-between items-center">
              <span>
                ID: {user.id}, Name: {user.first_name} {user.last_name}, Grade:{" "}
                {user.grade}, Instrument: {user.main_instrument}, Score:{" "}
                {user.score}
              </span>
              <div>
                <button
                  onClick={() => onEditUser(user)}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No students registered yet.</p>
      )}
    </div>
  );
}
