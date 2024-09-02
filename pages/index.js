import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Header from "../components/Header";
import UserForm from "../components/UserForm";
import UserList from "../components/UserList";
import Dashboard from "../components/Dashboard";
import Resources from "../components/Resources";
import Footer from "../components/Footer";
import PasswordPopup from "../components/PasswordPopup";

export default function Home() {
  const [triggerFetch, setTriggerFetch] = useState(0);
  const [editingUser, setEditingUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddForm, setShowAddForm] = useState(false);
  const [highlightStyle, setHighlightStyle] = useState({});
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const tabRefs = useRef({});

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

  const handleOpenDashboard = () => {
    setActiveTab("dashboard");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleAddStudentClick = () => {
    setShowPasswordPopup(true);
  };

  const handlePasswordSubmit = (password) => {
    if (password === "onDeals") {
      setShowPasswordPopup(false);
      setShowAddForm(true);
    } else {
      alert("Incorrect password. Please try again.");
    }
  };

  useEffect(() => {
    const currentTabElement = tabRefs.current[activeTab];
    if (currentTabElement) {
      setHighlightStyle({
        top: currentTabElement.offsetTop + "px",
        height: currentTabElement.offsetHeight + "px",
        marginTop: "1rem",
      });
    }
  }, [activeTab]);

  const tabs = ["dashboard", "resources", "students"];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Head>
        <title>San Jose Jazz Progressions</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header onOpenDashboard={handleOpenDashboard} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-black min-h-screen p-4 border-r border-gray-800 relative">
          <div
            className="absolute left-0 w-full bg-white rounded transition-all duration-300 ease-in-out"
            style={{
              ...highlightStyle,
              width: "calc(100% - 2rem)",
              marginLeft: "1rem",
              zIndex: 0,
            }}
          />
          <nav className="relative z-10">
            {tabs.map((tab) => (
              <button
                key={tab}
                ref={(el) => (tabRefs.current[tab] = el)}
                className={`block w-full text-left px-4 py-2 mb-2 rounded transition-colors duration-300 ${
                  activeTab === tab
                    ? "text-black"
                    : "text-white hover:bg-gray-800"
                }`}
                onClick={() => handleTabChange(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <main className="flex-1 p-8 bg-black">
          {activeTab === "students" && (
            <>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-gray-100">
                  {showAddForm
                    ? editingUser
                      ? "Edit Student"
                      : "Add New Student"
                    : "Registered Students"}
                </h1>
                {!showAddForm && (
                  <button
                    className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 rounded"
                    onClick={handleAddStudentClick}>
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
              <h1 className="text-4xl font-bold mb-8 text-gray-100">
                Dashboard
              </h1>
              <Dashboard />
            </>
          )}
          {activeTab === "resources" && <Resources />}
        </main>
      </div>

      <Footer />

      {showPasswordPopup && (
        <PasswordPopup
          onSubmit={handlePasswordSubmit}
          onCancel={() => setShowPasswordPopup(false)}
        />
      )}
    </div>
  );
}
