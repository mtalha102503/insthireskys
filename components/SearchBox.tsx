// components/SearchBox.tsx
'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBox() {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `https://hireskys.com/jobs?q=${encodeURIComponent(query)}`;
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all shadow-sm"
        placeholder="Search old remote jobs by title..."
      />
      <button 
        type="submit"
        className="absolute inset-y-1 right-1 bg-blue-600 text-white px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Find
      </button>
    </form>
  );
}