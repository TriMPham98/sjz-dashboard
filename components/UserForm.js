import { useState, useEffect } from "react";

export default function UserForm({ onUserAdded, editingUser, onUserEdited }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [grade, setGrade] = useState("");
  const [mainInstrument, setMainInstrument] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setFirstName(editingUser.first_name);
      setLastName(editingUser.last_name);
      setGrade(editingUser.grade.toString());
      setMainInstrument(editingUser.main_instrument);
    }
  }, [editingUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    const url = editingUser ? "/api/editUser" : "/api/addUser";
    const method = editingUser ? "PUT" : "POST";

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
          grade,
          mainInstrument,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          editingUser
            ? "Student updated successfully!"
            : "Student added successfully!"
        );
        if (!editingUser) {
          setFirstName("");
          setLastName("");
          setGrade("");
          setMainInstrument("");
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
        className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label
            className="block text-gray-300 text-sm font-bold mb-2"
            htmlFor="firstName">
            First Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 placeholder-gray-400"
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
            className="block text-gray-300 text-sm font-bold mb-2"
            htmlFor="lastName">
            Last Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 placeholder-gray-400"
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
            className="block text-gray-300 text-sm font-bold mb-2"
            htmlFor="grade">
            Grade
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 placeholder-gray-400"
            id="grade"
            type="number"
            placeholder="Enter grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            required
            autoComplete="off"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-300 text-sm font-bold mb-2"
            htmlFor="mainInstrument">
            Main Instrument
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
            id="mainInstrument"
            value={mainInstrument}
            onChange={(e) => setMainInstrument(e.target.value)}
            required>
            <option value="">Select an instrument</option>
            <option value="electric guitar">Electric Guitar</option>
            <option value="bass">Bass</option>
            <option value="piano">Piano</option>
            <option value="drums">Drums</option>
            <option value="vocals">Vocals</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit">
            {editingUser ? "Update Student" : "Add Student"}
          </button>
        </div>
      </form>
      {message && (
        <p
          className={`text-center ${
            isError ? "text-red-400" : "text-green-400"
          }`}>
          {message}
        </p>
      )}
    </div>
  );
}
