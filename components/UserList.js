import React, { useState, useEffect } from "react";
import PasswordPopup from "./PasswordPopup";

const RolePill = ({ role }) => {
  const colors = {
    student: "bg-green-500",
    alumni: "bg-blue-500",
    teacher: "bg-red-500",
  };
  const baseClasses = "px-2 py-1 rounded-full text-white text-xs font-bold";
  return (
    <span
      className={`${baseClasses} ${
        colors[role.toLowerCase()] || "bg-gray-500"
      }`}>
      {role}
    </span>
  );
};

export default function UserList({ triggerFetch, onEditUser }) {
  const [users, setUsers] = useState([]);
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

  const sortedUsers = React.useMemo(() => {
    return [...users].sort((a, b) => {
      const roleOrder = { Student: 0, Alumni: 1, Teacher: 2 };
      if (roleOrder[a.role] !== roleOrder[b.role]) {
        return roleOrder[a.role] - roleOrder[b.role];
      }
      if (a.role === "Student") {
        return a.grade - b.grade;
      }
      return 0;
    });
  }, [users]);

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
                  "name",
                  "role",
                  "grade",
                  "main_instrument",
                  "score",
                  "currently_practicing",
                ].map((key) => (
                  <th key={key} className="px-4 py-2 text-left">
                    {key
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
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
                    <td className="px-4 py-2">{`${user.first_name} ${user.last_name}`}</td>
                    <td className="px-4 py-2">
                      <RolePill role={user.role} />
                    </td>
                    <td className="px-4 py-2">
                      {user.role === "Student" ? user.grade : "-"}
                    </td>
                    <td className="px-4 py-2">{user.main_instrument}</td>
                    <td className="px-4 py-2">{user.score}</td>
                    <td className="px-4 py-2">
                      {user.currently_practicing || "-"}
                    </td>
                  </tr>
                  {selectedUserId === user.id && (
                    <tr className="bg-gray-900">
                      <td colSpan="6" className="px-4 py-2">
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
        <p className="text-gray-400">No members registered yet.</p>
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
