import { Search } from 'lucide-react';

export default function Header({ onOpenDashboard }) {
  return (
    <header className="bg-white shadow-sm p-4">
      <div className="container mx-auto flex justify-between items-center">
        <button
          onClick={onOpenDashboard}
          className="text-2xl font-bold text-indigo-700 hover:text-indigo-800 transition-colors">
          San Jose Jazz Progressions
        </button>
        <div className="flex items-center space-x-2">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
