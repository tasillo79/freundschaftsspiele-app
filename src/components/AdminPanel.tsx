import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Match } from '../types';

export default function AdminPanel() {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [opponent, setOpponent] = useState('');
  const [stage, setStage] = useState('Gruppenphase');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [results, setResults] = useState<Record<string, { germany: string; opponent: string }>>({});

  const load = () => api.getMatches().then(setMatches);

  useEffect(() => {
    if (unlocked) load();
  }, [unlocked]);

  const tryUnlock = async () => {
    setError('');
    try {
      // any call requiring auth validates the password
      await api.addMatch(password, { opponent: '__check__', stage: '', date: '' }).catch((e) => {
        throw e;
      });
    } catch (e) {
      const msg = (e as Error).message;
      if (msg.includes('autorisiert')) {
        setError('Falsches Passwort.');
        return;
      }
    }
    setUnlocked(true);
  };

  const addMatch = async () => {
    setError('');
    if (!opponent.trim() || !date) {
      setError('Gegner und Datum sind erforderlich.');
      return;
    }
    try {
      await api.addMatch(password, { opponent: opponent.trim(), stage, date });
      setOpponent('');
      setDate('');
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const saveResult = async (matchId: string) => {
    const draft = results[matchId];
    if (!draft) return;
    const germany = parseInt(draft.germany, 10);
    const opponentScore = parseInt(draft.opponent, 10);
    if (Number.isNaN(germany) || Number.isNaN(opponentScore)) {
      setError('Bitte ein gültiges Ergebnis eingeben.');
      return;
    }
    try {
      await api.setResult(password, matchId, { germany, opponent: opponentScore });
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const removeMatch = async (matchId: string) => {
    try {
      await api.deleteMatch(password, matchId);
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  if (!unlocked) {
    return (
      <div className="card">
        <h3>Admin-Bereich</h3>
        {error && <p className="error">{error}</p>}
        <input
          type="password"
          placeholder="Admin-Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={tryUnlock}>Entsperren</button>
      </div>
    );
  }

  return (
    <div>
      {error && <p className="error">{error}</p>}
      <div className="card">
        <h3>Neues Deutschland-Spiel anlegen</h3>
        <input
          placeholder="Gegner"
          value={opponent}
          onChange={(e) => setOpponent(e.target.value)}
        />
        <select value={stage} onChange={(e) => setStage(e.target.value)}>
          <option>Gruppenphase</option>
          <option>Achtelfinale</option>
          <option>Viertelfinale</option>
          <option>Halbfinale</option>
          <option>Finale</option>
        </select>
        <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
        <button onClick={addMatch}>Spiel anlegen</button>
      </div>

      <div className="card">
        <h3>Spiele verwalten</h3>
        {matches.map((match) => (
          <div key={match.id} className="admin-match-row">
            <span>
              Deutschland – {match.opponent} ({match.stage})
            </span>
            {match.result ? (
              <span>
                Ergebnis: {match.result.germany}:{match.result.opponent}
              </span>
            ) : (
              <span className="tip-form">
                <input
                  type="number"
                  min={0}
                  placeholder="GER"
                  value={results[match.id]?.germany ?? ''}
                  onChange={(e) =>
                    setResults({
                      ...results,
                      [match.id]: { ...results[match.id], germany: e.target.value, opponent: results[match.id]?.opponent ?? '' },
                    })
                  }
                />
                <input
                  type="number"
                  min={0}
                  placeholder={match.opponent}
                  value={results[match.id]?.opponent ?? ''}
                  onChange={(e) =>
                    setResults({
                      ...results,
                      [match.id]: { ...results[match.id], opponent: e.target.value, germany: results[match.id]?.germany ?? '' },
                    })
                  }
                />
                <button onClick={() => saveResult(match.id)}>Ergebnis eintragen</button>
              </span>
            )}
            <button className="danger" onClick={() => removeMatch(match.id)}>
              Löschen
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
