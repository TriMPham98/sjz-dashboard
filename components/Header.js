export default function Header({ onOpenDashboard }) {
  return (
    <header className="bg-gray-900 text-gray-300 p-4 flex justify-between items-center">
      <button
        onClick={onOpenDashboard}
        className="text-2xl font-bold text-gray-100 hover:text-gray-300 transition-colors"
      >
        San Jose Jazz Progressions
      </button>
    </header>
  );
}
