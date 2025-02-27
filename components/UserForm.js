import { useState, useEffect } from "react";

export default function UserForm({
  onUserAdded,
  editingUser,
  onUserEdited,
  onCancel,
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("Student");
  const [grade, setGrade] = useState("");
  const [mainInstrument, setMainInstrument] = useState("");
  const [currentlyPracticing, setCurrentlyPracticing] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setFirstName(editingUser.first_name);
      setLastName(editingUser.last_name);
      setRole(editingUser.role || "Student");
      setGrade(editingUser.grade === "-" ? "" : editingUser.grade.toString());
      setMainInstrument(editingUser.main_instrument);
      setCurrentlyPracticing(editingUser.currently_practicing || "");
    }
  }, [editingUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    const url = editingUser ? "/api/editUser" : "/api/addUser";
    const method = editingUser ? "PUT" : "POST";

    const gradeValue = role === "Student" ? grade : "-";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingUser?.id,
          firstName,
          lastName,
          role,
          grade: gradeValue,
          mainInstrument,
          currentlyPracticing,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          editingUser
            ? "Member updated successfully!"
            : "Member added successfully!"
        );
        if (!editingUser) {
          setFirstName("");
          setLastName("");
          setRole("Student");
          setGrade("");
          setMainInstrument("");
          setCurrentlyPracticing("");
          onUserAdded();
        } else {
          onUserEdited();
        }
      } else {
        setMessage(data.error || "An error occurred");
        setIsError(true);
      }
    } catch (error) {
      setMessage("An error occurred");
      setIsError(true);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 border border-gray-300">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="firstName">
            First Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white border-gray-300 placeholder-gray-400"
            id="firstName"
            type="text"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            autoComplete="off"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="lastName">
            Last Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white border-gray-300 placeholder-gray-400"
            id="lastName"
            type="text"
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            autoComplete="off"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="role">
            Role
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white border-gray-300"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required>
            <option value="Student">Student</option>
            <option value="Alumni">Alumni</option>
            <option value="Teacher">Teacher</option>
          </select>
        </div>
        {role === "Student" && (
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="grade">
              Grade
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white border-gray-300 placeholder-gray-400"
              id="grade"
              type="number"
              placeholder="Enter grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
        )}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="mainInstrument">
            Main Instrument
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white border-gray-300"
            id="mainInstrument"
            value={mainInstrument}
            onChange={(e) => setMainInstrument(e.target.value)}
            required>
            <option value="">Select an instrument</option>
            <option value="bass">Bass</option>
            <option value="drums">Drums</option>
            <option value="electric guitar">Electric Guitar</option>
            <option value="piano">Piano</option>
            <option value="saxophone">Saxophone</option>
            <option value="ukulele">Ukulele</option>
            <option value="violin">Violin</option>
            <option value="vocals">Vocals</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="currentlyPracticing">
            Currently Practicing
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white border-gray-300 placeholder-gray-400"
            id="currentlyPracticing"
            type="text"
            placeholder="Enter current practice focus"
            value={currentlyPracticing}
            onChange={(e) => setCurrentlyPracticing(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit">
            {editingUser ? "Update Member" : "Add Member"}
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={onCancel}>
            Cancel
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
