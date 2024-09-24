import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Header from "../components/Header";
import UserForm from "../components/UserForm";
import UserList from "../components/UserList";
import Dashboard from "../components/Dashboard";
import Resources from "../components/Resources";
import Quizzes from "../components/Quizzes";
import Footer from "../components/Footer";
import PasswordPopup from "../components/PasswordPopup";

// Main component for the home page of the San Jose Jazz Progressions application
export default function Home() {
  // State variables
  const [triggerFetch, setTriggerFetch] = useState(0); // Used to trigger re-fetching of user data
  const [editingUser, setEditingUser] = useState(null); // Stores the user being edited
  const [activeTab, setActiveTab] = useState("dashboard"); // Tracks the currently active tab
  const [showAddForm, setShowAddForm] = useState(false); // Controls visibility of the add/edit user form
  const [highlightStyle, setHighlightStyle] = useState({}); // Styles for highlighting the active tab
  const [showPasswordPopup, setShowPasswordPopup] = useState(false); // Controls visibility of the password popup
  const [triggerInputFocus, setTriggerInputFocus] = useState(false); // Used to trigger focus on input fields

  // Ref to store references to tab elements for positioning the highlight
  const tabRefs = useRef({});

  // Handler for when a user is added
  const handleUserAdded = () => {
    setTriggerFetch((prev) => prev + 1); // Trigger a re-fetch of user data
    setShowAddForm(false);
    setTriggerInputFocus(false);
  };

  // Handler for editing a user
  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowAddForm(true);
    setTriggerInputFocus(true);
  };

  // Handler for when a user is edited
  const handleUserEdited = () => {
    setTriggerFetch((prev) => prev + 1); // Trigger a re-fetch of user data
    setEditingUser(null);
    setShowAddForm(false);
    setTriggerInputFocus(false);
  };

  // Handler for opening the dashboard
  const handleOpenDashboard = () => {
    setActiveTab("dashboard");
  };

  // Handler for changing tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handler for clicking the "Add Student" button
  const handleAddStudentClick = () => {
    setShowPasswordPopup(true);
  };

  // Handler for submitting the password
  const handlePasswordSubmit = (password) => {
    if (password === "onDeals") {
      setShowPasswordPopup(false);
      setShowAddForm(true);
      setTriggerInputFocus(true);
    } else {
      alert("Incorrect password. Please try again.");
    }
  };

  // Effect to update the highlight style when the active tab changes
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

  // Array of available tabs
  const tabs = ["dashboard", "quizzes", "resources", "members"];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Head>
        <title>San Jose Jazz Progressions</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header onOpenDashboard={handleOpenDashboard} />

      <div className="flex flex-1">
        {/* Sidebar navigation */}
        <div className="w-64 bg-black min-h-screen p-4 border-r border-gray-800 relative">
          {/* Highlight for active tab */}
          <div
            className="absolute left-0 w-full bg-white rounded transition-all duration-300 ease-in-out"
            style={{
              ...highlightStyle,
              width: "calc(100% - 2rem)",
              marginLeft: "1rem",
              zIndex: 0,
            }}
          />
          {/* Navigation buttons */}
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

        {/* Main content area */}
        <main className="flex-1 p-8 bg-black">
          {/* Render different components based on the active tab */}
          {activeTab === "dashboard" && (
            <>
              <h1 className="text-4xl font-bold mb-8 text-gray-100">
                Dashboard
              </h1>
              <Dashboard />
            </>
          )}
          {activeTab === "quizzes" && (
            <>
              <h1 className="text-4xl font-bold mb-8 text-gray-100">Quizzes</h1>
              <Quizzes />
            </>
          )}
          {activeTab === "resources" && <Resources />}
          {activeTab === "members" && (
            <>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-gray-100">
                  {showAddForm
                    ? editingUser
                      ? "Edit Member"
                      : "Add New Member"
                    : "Members"}
                </h1>
                {!showAddForm && (
                  <button
                    className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 rounded"
                    onClick={handleAddStudentClick}>
                    Add Member
                  </button>
                )}
              </div>
              {/* Render UserForm for adding/editing or UserList for displaying members */}
              {showAddForm ? (
                <UserForm
                  onUserAdded={handleUserAdded}
                  editingUser={editingUser}
                  onUserEdited={handleUserEdited}
                  onCancel={() => {
                    setShowAddForm(false);
                    setEditingUser(null);
                    setTriggerInputFocus(false);
                  }}
                  triggerInputFocus={triggerInputFocus}
                />
              ) : (
                <UserList
                  triggerFetch={triggerFetch}
                  onEditUser={handleEditUser}
                />
              )}
            </>
          )}
        </main>
      </div>

      <Footer />

      {/* Render password popup when adding a new member */}
      {showPasswordPopup && (
        <PasswordPopup
          onSubmit={handlePasswordSubmit}
          onCancel={() => setShowPasswordPopup(false)}
        />
      )}
    </div>
  );
}
