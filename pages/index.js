import { useState } from "react";
import Head from "next/head";
import Header from "../components/Header";
import UserForm from "../components/UserForm";
import UserList from "../components/UserList";

export default function Home() {
  const [triggerFetch, setTriggerFetch] = useState(0);
  const [editingUser, setEditingUser] = useState(null);

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
        <title>GrooveGamer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-400">
          Welcome to GrooveGamer
        </h1>
        <p className="text-xl text-center mb-8 text-gray-300">
          Your journey to musical mastery begins here!
        </p>
        <UserForm
          onUserAdded={handleUserAdded}
          editingUser={editingUser}
          onUserEdited={handleUserEdited}
        />
        <UserList triggerFetch={triggerFetch} onEditUser={handleEditUser} />
      </main>
    </div>
  );
}
