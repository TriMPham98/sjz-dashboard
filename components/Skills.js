import React, { useState, useEffect } from "react";
import PasswordPopup from "./PasswordPopup";

export default function Skills() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [dateLearnedStr, setDateLearnedStr] = useState("");
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch users on component mount
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
        setMessage("Failed to fetch users");
        setIsError(true);
      }
    }
    fetchUsers();
  }, []);

  // Fetch skills when a user is selected
  useEffect(() => {
    if (selectedUser) {
      fetchSkills(selectedUser.id);
    } else {
      setSkills([]);
    }
  }, [selectedUser]);

  // Function to fetch skills for a user
  const fetchSkills = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/getSkills?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch skills");
      }
      const data = await response.json();
      setSkills(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching skills:", error);
      setMessage("Failed to fetch skills");
      setIsError(true);
      setLoading(false);
    }
  };

  // Handle user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setNewSkill("");
    setDateLearnedStr("");
    setMessage("");
    setIsError(false);
  };

  // Handle adding a new skill
  const handleAddSkill = () => {
    if (!selectedUser) {
      setMessage("Please select a user first");
      setIsError(true);
      return;
    }

    if (!newSkill.trim()) {
      setMessage("Please enter a skill name");
      setIsError(true);
      return;
    }

    if (!dateLearnedStr) {
      setMessage("Please select a date");
      setIsError(true);
      return;
    }

    setShowPasswordPopup(true);
  };

  // Handle password submission
  const handlePasswordSubmit = async (password) => {
    if (password === "onDeals") {
      setShowPasswordPopup(false);
      await submitSkill();
    } else {
      alert("Incorrect password. Please try again.");
    }
  };

  // Submit the skill to the API
  const submitSkill = async () => {
    try {
      const response = await fetch("/api/addSkill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          skillName: newSkill.trim(),
          dateLearnedStr: dateLearnedStr,
        }),
      });

      if (response.ok) {
        setMessage("Skill added successfully!");
        setIsError(false);
        setNewSkill("");
        setDateLearnedStr("");
        fetchSkills(selectedUser.id);
      } else {
        const data = await response.json();
        setMessage(data.error || "Failed to add skill");
        setIsError(true);
      }
    } catch (error) {
      console.error("Error adding skill:", error);
      setMessage("Failed to add skill");
      setIsError(true);
    }
  };

  // Handle deleting a skill
  const handleDeleteSkill = async (skillId) => {
    try {
      const response = await fetch(`/api/deleteSkill?id=${skillId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage("Skill deleted successfully!");
        setIsError(false);
        fetchSkills(selectedUser.id);
      } else {
        const data = await response.json();
        setMessage(data.error || "Failed to delete skill");
        setIsError(true);
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
      setMessage("Failed to delete skill");
      setIsError(true);
    }
  };

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User selection panel */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Select Student</h2>
          <div className="max-h-96 overflow-y-auto">
            {users.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {users
                  .filter((user) => user.role === "Student")
                  .sort(
                    (a, b) =>
                      a.grade - b.grade ||
                      a.last_name.localeCompare(b.last_name)
                  )
                  .map((user) => (
                    <li
                      key={user.id}
                      className={`p-3 cursor-pointer hover:bg-gray-50 ${
                        selectedUser?.id === user.id ? "bg-indigo-50" : ""
                      }`}
                      onClick={() => handleUserSelect(user)}>
                      <div className="font-medium">
                        {user.first_name} {user.last_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Grade: {user.grade}
                      </div>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-gray-500">No students found</p>
            )}
          </div>
        </div>

        {/* Skills input panel */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Add New Skill</h2>
          {selectedUser ? (
            <div>
              <p className="mb-4">
                Adding skill for:{" "}
                <span className="font-medium">
                  {selectedUser.first_name} {selectedUser.last_name}
                </span>
              </p>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="skillName">
                  Skill Name
                </label>
                <input
                  id="skillName"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter skill name"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="dateLearned">
                  Date Learned
                </label>
                <input
                  id="dateLearned"
                  type="date"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={dateLearnedStr}
                  onChange={(e) => setDateLearnedStr(e.target.value)}
                />
              </div>
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleAddSkill}>
                Add Skill
              </button>
              {message && (
                <div
                  className={`mt-4 p-2 rounded ${
                    isError
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}>
                  {message}
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Please select a student first</p>
          )}
        </div>

        {/* Skills list panel */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Skills List</h2>
          {selectedUser ? (
            loading ? (
              <p className="text-gray-500">Loading skills...</p>
            ) : skills.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {skills.map((skill) => (
                  <li key={skill.id} className="py-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{skill.skill_name}</div>
                        <div className="text-sm text-gray-500">
                          {formatDate(skill.date_learned)}
                        </div>
                      </div>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteSkill(skill.id)}>
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No skills recorded yet</p>
            )
          ) : (
            <p className="text-gray-500">Please select a student first</p>
          )}
        </div>
      </div>

      {/* Password popup */}
      {showPasswordPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <PasswordPopup
            onSubmit={handlePasswordSubmit}
            onCancel={() => setShowPasswordPopup(false)}
          />
        </div>
      )}
    </div>
  );
}
