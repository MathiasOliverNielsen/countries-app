"use client";

import { useEffect, useState } from "react";

interface Language {
  name: string;
}

interface Country {
  code: string;
  name: string;
  emoji: string;
  currency: string | null;
  languages: Language[];
}

const API_URL = "https://countries.trevorblades.com/graphql";

export default function Home() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCountries() {
      try {
        const query = `
          query GetCountries {
            countries {
              code
              name
              emoji
              currency
              languages {
                name
              }
            }
          }
        `;

        // Multiple endpoints
        // const response = await fetch('/api/countries');
        // const response = await fetch(`/api/countries/${id}`);
        // const response = await fetch(`/api/countries/${id}/languages`);

        // Single endpoint, here i specify what data i want
        // POST method - GraphQL uses POST with query in body, REST uses GET/POST/etc
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });

        const result = await response.json();
        setCountries(result.data.countries);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCountries();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2 text-slate-900 dark:text-white">Countries Explorer</h1>
          <p className="text-center text-slate-600 dark:text-slate-300 mb-8">Discover information about countries</p>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg text-slate-600 dark:text-slate-300">Loading countries...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {countries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => setSelectedCountry(country)}
                  className="bg-white dark:bg-slate-700 rounded-lg shadow-md hover:shadow-lg p-4 text-center cursor-pointer hover:scale-105 transform transition-transform duration-200"
                >
                  <div className="text-5xl mb-3">{country.emoji}</div>
                  <h2 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">{country.name}</h2>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedCountry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedCountry(null)}>
          <div className="bg-white dark:bg-slate-700 rounded-lg shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                <span className="text-4xl mr-2">{selectedCountry.emoji}</span>
                {selectedCountry.name}
              </h2>
              <button onClick={() => setSelectedCountry(null)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-2xl font-light">
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">CURRENCY</p>
                <p className="text-lg text-slate-900 dark:text-white">{selectedCountry.currency || "N/A"}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">LANGUAGES</p>
                <p className="text-lg text-slate-900 dark:text-white">{selectedCountry.languages.length > 0 ? selectedCountry.languages.map((lang) => lang.name).join(", ") : "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-slate-900 dark:bg-slate-950 text-white py-6 px-4 text-center">
        <p className="mb-2">Made by Techcollege Aalborg</p>
        <p className="text-slate-400">
          Data from{" "}
          <a href="https://countries.trevorblades.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
            Countries GraphQL API
          </a>
        </p>
      </footer>
    </div>
  );
}
