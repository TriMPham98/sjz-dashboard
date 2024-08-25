import Head from "next/head";
import Header from "../components/Header";

export default function Home() {
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
        <p className="text-xl text-center">
          Your journey to musical mastery begins here!
        </p>
      </main>
    </div>
  );
}
