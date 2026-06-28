"use client";
import { useState } from "react";
export default function Home() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("photo");
  const [results, setResults] = useState<any[]>([]);
  const search = async () => {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${type}`);
    const data = await res.json();
    setResults(data.items || []);
  };
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-900 via-black to-amber-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">pixabay</h1>
        <p className="text-xl text-gray-300 mb-8">Free stock photos, video & music</p>
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 flex gap-4">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..."
            className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
            onKeyDown={(e) => e.key === "Enter" && search()} />
          <select value={type} onChange={(e) => setType(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none">
            <option value="photo">Photos</option>
            <option value="video">Videos</option>
            <option value="music">Music</option>
          </select>
          <button onClick={search}
            className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-xl font-semibold hover:opacity-90 transition">Search</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((item) => (
            <div key={item.id} className="bg-white/10 backdrop-blur rounded-xl overflow-hidden hover:scale-105 transition cursor-pointer">
              <div className="aspect-square bg-white/20 flex items-center justify-center text-4xl">📷</div>
              <div className="p-3">
                <p className="font-semibold text-sm">{item.title}</p>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {item.tags.map((t: string, i: number) => (
                    <span key={i} className="text-xs bg-yellow-600/30 px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}