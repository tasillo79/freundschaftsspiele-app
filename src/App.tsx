import React, { useEffect, useState } from 'react';
import './App.css';
import NameGate from './components/NameGate';
import MatchList from './components/MatchList';
import Leaderboard from './components/Leaderboard';
import AdminPanel from './components/AdminPanel';

type Tab = 'tipps' | 'tabelle' | 'admin';

const STORAGE_KEY = 'tippspiel-player';

function App() {
  const [player, setPlayer] = useState<string>('');
  const [tab, setTab] = useState<Tab>('tipps');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setPlayer(stored);
  }, []);

  const handleLogin = (name: string) => {
    localStorage.setItem(STORAGE_KEY, name);
    setPlayer(name);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPlayer('');
  };

  if (!player) {
    return (
      <div className="App">
        <NameGate onSubmit={handleLogin} />
      </div>
    );
  }

  return (
    <div className="App">
      <header className="top-bar">
        <h1>WM 2026 Tippspiel</h1>
        <div>
          Angemeldet als <strong>{player}</strong>{' '}
          <button onClick={logout}>Abmelden</button>
        </div>
      </header>
      <nav className="tabs">
        <button className={tab === 'tipps' ? 'active' : ''} onClick={() => setTab('tipps')}>
          Tipps
        </button>
        <button className={tab === 'tabelle' ? 'active' : ''} onClick={() => setTab('tabelle')}>
          Tabelle
        </button>
        <button className={tab === 'admin' ? 'active' : ''} onClick={() => setTab('admin')}>
          Admin
        </button>
      </nav>
      <main className="content">
        {tab === 'tipps' && <MatchList player={player} />}
        {tab === 'tabelle' && <Leaderboard />}
        {tab === 'admin' && <AdminPanel />}
      </main>
    </div>
  );
}

export default App;
