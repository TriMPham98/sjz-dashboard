import React, { useState, useEffect, useRef } from "react";

const PasswordPopup = ({ onSubmit, onCancel }) => {
  const [password, setPassword] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-black p-8 rounded-lg shadow-lg border border-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-white">
          Enter Admin Password
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-900 text-white rounded border border-gray-700 focus:outline-none focus:border-gray-500"
            placeholder="Enter password"
            ref={inputRef}
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="mr-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none">
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordPopup;
