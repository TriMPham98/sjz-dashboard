import React, { useState, useEffect, useCallback } from "react";
import PasswordPopup from "./PasswordPopup";

export default function UserList({ triggerFetch, onEditUser }) {
  const [users, setUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "grade",
    direction: "ascending",
  });
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [passwordAction, setPasswordAction] = useState(null);
  const [actionUser, setActionUser] = useState(null);

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

  const handleEdit = (user) => {
    setActionUser(user);
    setPasswordAction("edit");
    setShowPasswordPopup(true);
  };

  const handleDelete = (user) => {
    setActionUser(user);
    setPasswordAction("delete");
    setShowPasswordPopup(true);
  };

  const handlePasswordSubmit = async (password) => {
    if (password === "onDeals") {
      setShowPasswordPopup(false);
      if (passwordAction === "edit") {
        onEditUser(actionUser);
      } else if (passwordAction === "delete") {
        try {
          const response = await fetch(`/api/deleteUser?id=${actionUser.id}`, {
            method: "DELETE",
          });
          if (response.ok) {
            setUsers(users.filter((user) => user.id !== actionUser.id));
            setSelectedUserId(null);
          } else {
            throw new Error("Failed to delete user");
          }
        } catch (error) {
          console.error("Error deleting user:", error);
        }
      }
    } else {
      alert("Incorrect password. Please try again.");
    }
  };

  const requestSort = useCallback(
    (key) => {
      let direction = "ascending";
      if (sortConfig.key === key && sortConfig.direction === "ascending") {
        direction = "descending";
      }
      setSortConfig({ key, direction });
    },
    [sortConfig]
  );

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

  const handleRowClick = (userId) => {
    setSelectedUserId(selectedUserId === userId ? null : userId);
  };

  return (
    <div className="mt-8 bg-black shadow-md rounded px-8 pt-6 pb-8 mb-4 border border-gray-800">
      {sortedUsers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-black text-white">
            <thead>
              <tr>
                {[
                  "first_name",
                  "last_name",
                  "grade",
                  "main_instrument",
                  "score",
                ].map((key) => (
                  <th
                    key={key}
                    className="px-4 py-2 text-left cursor-pointer hover:bg-gray-900"
                    onClick={() => requestSort(key)}>
                    {key
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                    {sortConfig.key === key && (
                      <span>
                        {sortConfig.direction === "ascending" ? " ▲" : " ▼"}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <React.Fragment key={user.id}>
                  <tr
                    className={`border-t border-gray-800 cursor-pointer hover:bg-gray-900 ${
                      selectedUserId === user.id ? "bg-gray-900" : ""
                    }`}
                    onClick={() => handleRowClick(user.id)}>
                    <td className="px-4 py-2">{user.first_name}</td>
                    <td className="px-4 py-2">{user.last_name}</td>
                    <td className="px-4 py-2">{user.grade}</td>
                    <td className="px-4 py-2">{user.main_instrument}</td>
                    <td className="px-4 py-2">{user.score}</td>
                  </tr>
                  {selectedUserId === user.id && (
                    <tr className="bg-gray-900">
                      <td colSpan="5" className="px-4 py-2">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="bg-white hover:bg-gray-200 text-black font-bold py-1 px-2 rounded">
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-400">No students registered yet.</p>
      )}
      {showPasswordPopup && (
        <PasswordPopup
          onSubmit={handlePasswordSubmit}
          onCancel={() => setShowPasswordPopup(false)}
        />
      )}
    </div>
  );
}
