import { useState } from "react";
import Head from "next/head";
import Header from "../components/Header";
import UserForm from "../components/UserForm";
import UserList from "../components/UserList";

export default function Home() {
  const [triggerFetch, setTriggerFetch] = useState(0);

  const handleUserAdded = () => {
    setTriggerFetch((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>GrooveGamer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to GrooveGamer
        </h1>
        <p className="text-xl text-center mb-8">
          Your journey to musical mastery begins here!
        </p>
        <UserForm onUserAdded={handleUserAdded} />
        <UserList triggerFetch={triggerFetch} />
      </main>
    </div>
  );
}
