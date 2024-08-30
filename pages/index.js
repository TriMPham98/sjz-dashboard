import { useState } from "react";
import Head from "next/head";
import Header from "../components/Header";
import UserForm from "../components/UserForm";
import UserList from "../components/UserList";

export default function Home() {
  const [triggerFetch, setTriggerFetch] = useState(0);
  const [editingUser, setEditingUser] = useState(null);
  const [activeTab, setActiveTab] = useState("students");

  const handleUserAdded = () => {
    setTriggerFetch((prev) => prev + 1);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleUserEdited = () => {
    setTriggerFetch((prev) => prev + 1);
    setEditingUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Head>
        <title>SJZ - Groove Gamer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 min-h-screen p-4">
          <h2 className="text-2xl font-bold mb-4 text-blue-400">Dashboard</h2>
          <nav>
            <button
              className={`block w-full text-left px-4 py-2 mb-2 ${
                activeTab === "students" ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab("students")}>
              Students
            </button>
            <button
              className={`block w-full text-left px-4 py-2 mb-2 ${
                activeTab === "add-student" ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab("add-student")}>
              Add Student
            </button>
            <button
              className={`block w-full text-left px-4 py-2 mb-2 ${
                activeTab === "analytics" ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab("analytics")}>
              Analytics
            </button>
          </nav>
        </div>

        {/* Main content */}
        <main className="flex-1 p-8">
          {activeTab === "students" && (
            <>
              <h1 className="text-4xl font-bold mb-8 text-blue-400">
                Registered Students
              </h1>
              <UserList triggerFetch={triggerFetch} onEditUser={handleEditUser} />
            </>
          )}
          {activeTab === "add-student" && (
            <>
              <h1 className="text-4xl font-bold mb-8 text-blue-400">
                {editingUser ? "Edit Student" : "Add New Student"}
              </h1>
              <UserForm
                onUserAdded={handleUserAdded}
                editingUser={editingUser}
                onUserEdited={handleUserEdited}
              />
            </>
          )}
          {activeTab === "analytics" && (
            <>
              <h1 className="text-4xl font-bold mb-8 text-blue-400">
                Analytics
              </h1>
              <p className="text-xl text-gray-300">
                Analytics content will be added here.
              </p>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
