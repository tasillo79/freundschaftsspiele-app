import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { LeaderboardEntry } from '../types';

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    api.getLeaderboard().then(setEntries).catch(() => setEntries([]));
  }, []);

  if (entries.length === 0) {
    return <p>Noch keine Tipps abgegeben.</p>;
  }

  return (
    <table className="leaderboard">
      <thead>
        <tr>
          <th>Platz</th>
          <th>Spieler</th>
          <th>Punkte</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, i) => (
          <tr key={entry.player}>
            <td>{i + 1}</td>
            <td>{entry.player}</td>
            <td>{entry.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
