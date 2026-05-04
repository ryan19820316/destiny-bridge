"use client";

import { useState, useEffect } from "react";

interface Stats {
  totalDownloads: number;
  queriesByEndpoint: Record<string, number>;
  queriesByDay: Record<string, number>;
  recentQueries: { endpoint: string; category?: string; lang?: string; timestamp: string }[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <p className="text-gold-400">Loading...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <p className="text-red-400">Failed to load stats</p>
      </div>
    );
  }

  const sortedDays = Object.entries(stats.queriesByDay).sort(
    ([a], [b]) => b.localeCompare(a)
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold gold-text mb-8">Dashboard</h1>

      {/* Key numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="mystic-card rounded-xl p-4 text-center">
          <p className="text-3xl font-bold gold-text">{stats.totalDownloads}</p>
          <p className="text-xs text-gray-500 mt-1">Downloads</p>
        </div>
        <div className="mystic-card rounded-xl p-4 text-center">
          <p className="text-3xl font-bold gold-text">
            {Object.values(stats.queriesByEndpoint).reduce((a, b) => a + b, 0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total Queries</p>
        </div>
        <div className="mystic-card rounded-xl p-4 text-center">
          <p className="text-3xl font-bold gold-text">
            {Object.keys(stats.queriesByDay).length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Active Days</p>
        </div>
        <div className="mystic-card rounded-xl p-4 text-center">
          <p className="text-3xl font-bold gold-text">
            {stats.recentQueries.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Recent (100)</p>
        </div>
      </div>

      {/* Queries by endpoint */}
      <div className="mystic-card rounded-2xl p-5 mb-4">
        <h2 className="text-sm font-semibold text-gold-400 mb-3">Queries by Endpoint</h2>
        <div className="space-y-2">
          {Object.entries(stats.queriesByEndpoint)
            .sort(([, a], [, b]) => b - a)
            .map(([ep, count]) => (
              <div key={ep} className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">{ep}</span>
                <span className="text-gold-300 font-mono text-sm">{count}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Daily breakdown */}
      <div className="mystic-card rounded-2xl p-5 mb-4">
        <h2 className="text-sm font-semibold text-gold-400 mb-3">Queries by Day</h2>
        <div className="space-y-2">
          {sortedDays.map(([day, count]) => (
            <div key={day} className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">{day}</span>
              <span className="text-gold-300 font-mono text-sm">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent queries */}
      <div className="mystic-card rounded-2xl p-5 mb-4">
        <h2 className="text-sm font-semibold text-gold-400 mb-3">
          Recent Queries (last 100)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-gray-400">
            <thead>
              <tr className="border-b border-mystic-700/30">
                <th className="text-left p-1.5">Time</th>
                <th className="text-left p-1.5">Endpoint</th>
                <th className="text-left p-1.5">Category</th>
                <th className="text-left p-1.5">Lang</th>
              </tr>
            </thead>
            <tbody>
              {[...stats.recentQueries].reverse().map((q, i) => (
                <tr key={i} className="border-b border-mystic-700/10">
                  <td className="p-1.5 text-gray-500">
                    {new Date(q.timestamp).toLocaleString()}
                  </td>
                  <td className="p-1.5 text-gray-300">{q.endpoint}</td>
                  <td className="p-1.5">{q.category || "-"}</td>
                  <td className="p-1.5">{q.lang || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-center text-xs text-gray-600 mt-8">
        Auto-refresh: reload the page
      </p>
    </div>
  );
}
