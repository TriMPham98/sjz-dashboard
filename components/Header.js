export default function Header({ onOpenDashboard }) {
  return (
    <header className="bg-black text-white p-4 flex justify-between items-center">
      <button
        onClick={onOpenDashboard}
        className="text-5xl font-bold text-white hover:text-gray-300 transition-colors">
        San Jose Jazz Progressions
      </button>
    </header>
  );
}
