import { useState } from "react";
import Head from "next/head";
import Header from "../components/Header";
import UserForm from "../components/UserForm";
import UserList from "../components/UserList";

export default function Home() {
  const [triggerFetch, setTriggerFetch] = useState(0);
  const [editingUser, setEditingUser] = useState(null);
  const [activeTab, setActiveTab] = useState("students");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleUserAdded = () => {
    setTriggerFetch((prev) => prev + 1);
    setShowAddForm(false);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowAddForm(true);
  };

  const handleUserEdited = () => {
    setTriggerFetch((prev) => prev + 1);
    setEditingUser(null);
    setShowAddForm(false);
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
          <nav>
            <button
              className={`block w-full text-left px-4 py-2 mb-2 ${
                activeTab === "analytics" ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab("dashboard")}>
              Dashboard
            </button>
            <button
              className={`block w-full text-left px-4 py-2 mb-2 ${
                activeTab === "students" ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab("students")}>
              Students
            </button>
          </nav>
        </div>

        {/* Main content */}
        <main className="flex-1 p-8">
          {activeTab === "students" && (
            <>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-blue-400">
                  {showAddForm
                    ? editingUser
                      ? "Edit Student"
                      : "Add New Student"
                    : "Registered Students"}
                </h1>
                {!showAddForm && (
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => setShowAddForm(true)}>
                    Add Student
                  </button>
                )}
              </div>
              {showAddForm ? (
                <UserForm
                  onUserAdded={handleUserAdded}
                  editingUser={editingUser}
                  onUserEdited={handleUserEdited}
                  onCancel={() => {
                    setShowAddForm(false);
                    setEditingUser(null);
                  }}
                />
              ) : (
                <UserList
                  triggerFetch={triggerFetch}
                  onEditUser={handleEditUser}
                />
              )}
            </>
          )}
          {activeTab === "dashboard" && (
            <>
              <h1 className="text-4xl font-bold mb-8 text-blue-400">
                Dashboard
              </h1>
              <p className="text-xl text-gray-300">
                Dashboard content will be displayed here.
              </p>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
