"use client";

import { useEffect, useState } from "react";

interface IExperience {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  image_url: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <img
            src="/images/logo.jpeg"
            alt="Book-It Logo"
            className="h-12 w-auto"
          />
        </a>

        {/* Search */}
        <div className="flex-1 max-w-lg mx-8">
          <input
            type="search"
            placeholder="Search experiences..."
            className="w-full py-2 px-4 bg-gray-100 border border-gray-200 text-gray-700 rounded-lg"
          />
        </div>

        <button className="bg-yellow-400 py-2 px-5 rounded-lg font-semibold">
          Search
        </button>
      </nav>
    </header>
  );
}

export default function Home() {
  const [experiences, setExperiences] = useState<IExperience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/experiences`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setExperiences(data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {loading && (
          <p className="text-center text-gray-600">Loading experiences...</p>
        )}

        {!loading && experiences.length === 0 && (
          <p className="text-center text-gray-500">
            No experiences found. Backend might be offline.
          </p>
        )}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((exp) => (
              <div
                key={exp._id}
                className="bg-white rounded-lg overflow-hidden border border-gray-200"
              >
                <img src={exp.image_url} className="w-full h-48 object-cover" />

                <div className="p-4">
                  <div className="flex justify-between">
                    <h2 className="text-xl font-bold">{exp.title}</h2>
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                      {exp.location}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-2">
                    {exp.description}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-bold">₹{exp.price}</span>
                    <a href={`/details/${exp._id}`}>
                      <button className="bg-yellow-400 py-2 px-4 rounded-lg">
                        View Details
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}