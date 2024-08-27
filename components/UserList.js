import React, { useState, useEffect } from "react";

export default function UserList({ triggerFetch, onEditUser }) {
  const [users, setUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

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

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = React.useMemo(() => {
    let sortableUsers = [...users];
    if (sortConfig.key !== null) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);

  return (
    <div className="mt-8 bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-400">
        Registered Gamers
      </h2>

      {sortedUsers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-700 text-white">
            <thead>
              <tr>
                {["id", "name", "grade", "main_instrument", "score"].map(
                  (key) => (
                    <th
                      key={key}
                      className="px-4 py-2 text-left cursor-pointer hover:bg-gray-600"
                      onClick={() => requestSort(key)}>
                      {key.charAt(0).toUpperCase() +
                        key.slice(1).replace("_", " ")}
                      {sortConfig.key === key && (
                        <span>
                          {sortConfig.direction === "ascending" ? " ▲" : " ▼"}
                        </span>
                      )}
                    </th>
                  )
                )}
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <tr key={user.id} className="border-t border-gray-600">
                  <td className="px-4 py-2">{user.id}</td>
                  <td className="px-4 py-2">{`${user.first_name} ${user.last_name}`}</td>
                  <td className="px-4 py-2">{user.grade}</td>
                  <td className="px-4 py-2">{user.main_instrument}</td>
                  <td className="px-4 py-2">{user.score}</td>
                  <td className="px-4 py-2">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-400">No students registered yet.</p>
      )}
    </div>
  );
}
