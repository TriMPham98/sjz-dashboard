import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Header from "../components/Header";
import UserForm from "../components/UserForm";
import UserList from "../components/UserList";
import Dashboard from "../components/Dashboard";
import Resources from "../components/Resources";
import Quizzes from "../components/Quizzes";
import Skills from "../components/Skills";
import Footer from "../components/Footer";
import PasswordPopup from "../components/PasswordPopup";
import {
  Home as HomeIcon,
  BookOpen,
  Music,
  Users,
  Search,
  Bell,
  Menu,
  X,
  Award,
} from "lucide-react";

// Main component for the home page of the San Jose Jazz Progressions application
export default function Home() {
  // State variables
  const [triggerFetch, setTriggerFetch] = useState(0);
  const [editingUser, setEditingUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [triggerInputFocus, setTriggerInputFocus] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Ref to store references to tab elements for positioning the highlight
  const tabRefs = useRef({});

  // Handler for when a user is added
  const handleUserAdded = () => {
    setTriggerFetch((prev) => prev + 1);
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
    setTriggerFetch((prev) => prev + 1);
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
    setIsMobileMenuOpen(false);
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

  // Array of available tabs with icons
  const tabs = [
    { id: "dashboard", icon: HomeIcon, label: "Dashboard" },
    { id: "quizzes", icon: Music, label: "Quizzes" },
    { id: "resources", icon: BookOpen, label: "Resources" },
    { id: "skills", icon: Award, label: "Skills" },
    { id: "members", icon: Users, label: "Members" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
      <Head>
        <title>San Jose Jazz Progressions</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Mobile header */}
      <div className="bg-white shadow-md md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 focus:outline-none">
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <h1 className="text-xl font-bold">SJZ Progressions</h1>
          <div className="flex items-center space-x-2">
            <button className="p-1 rounded-full hover:bg-gray-200">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Mobile navigation menu */}
        {isMobileMenuOpen && (
          <nav className="px-4 pt-2 pb-4 space-y-1 bg-white">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => handleTabChange(tab.id)}>
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:flex-col md:w-64 bg-white shadow-lg z-10">
          <div className="p-5 border-b border-gray-200">
            <h1
              className="text-xl font-bold cursor-pointer text-indigo-700"
              onClick={handleOpenDashboard}>
              SJZ Progressions
            </h1>
          </div>
          <nav className="flex flex-col flex-1 pt-5 px-4 space-y-1 overflow-y-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => handleTabChange(tab.id)}>
                <tab.icon className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main content area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Desktop Header */}
          <header className="hidden md:flex bg-white shadow-sm z-10 p-4 items-center justify-between">
            <div className="flex items-center space-x-2 w-1/3">
              <div className="relative rounded-md w-full max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-1 rounded-full text-gray-600 hover:bg-gray-100">
                <Bell className="h-6 w-6" />
              </button>
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                SJ
              </div>
            </div>
          </header>

          {/* Content section */}
          <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
            {/* Dashboard content */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                  <Dashboard />
                </div>
              </div>
            )}

            {/* Quizzes content */}
            {activeTab === "quizzes" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">Quizzes</h1>
                <div className="bg-white shadow-sm rounded-lg overflow-hidden p-6">
                  <Quizzes />
                </div>
              </div>
            )}

            {/* Resources content */}
            {activeTab === "resources" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">Resources</h1>
                <div className="bg-white shadow-sm rounded-lg overflow-hidden p-6">
                  <Resources />
                </div>
              </div>
            )}

            {/* Skills content */}
            {activeTab === "skills" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  Skills Tracker
                </h1>
                <div className="bg-white shadow-sm rounded-lg overflow-hidden p-6">
                  <Skills />
                </div>
              </div>
            )}

            {/* Members content */}
            {activeTab === "members" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-gray-800">
                    {showAddForm
                      ? editingUser
                        ? "Edit Member"
                        : "Add New Member"
                      : "Members"}
                  </h1>
                  {!showAddForm && (
                    <button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                      onClick={handleAddStudentClick}>
                      Add Member
                    </button>
                  )}
                </div>
                {/* Render UserForm for adding/editing or UserList for displaying members */}
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                  {showAddForm ? (
                    <div className="p-6">
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
                    </div>
                  ) : (
                    <UserList
                      triggerFetch={triggerFetch}
                      onEditUser={handleEditUser}
                    />
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />

      {/* Render password popup when adding a new member */}
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
