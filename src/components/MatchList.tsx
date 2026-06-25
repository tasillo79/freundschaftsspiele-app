import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Match, Tip } from '../types';

interface Props {
  player: string;
}

function formatDate(date: string) {
  return new Date(date).toLocaleString('de-DE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function MatchList({ player }: Props) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [tips, setTips] = useState<Tip[]>([]);
  const [drafts, setDrafts] = useState<Record<string, { germany: string; opponent: string }>>({});
  const [error, setError] = useState('');
  const [savedId, setSavedId] = useState('');

  const load = async () => {
    const [m, t] = await Promise.all([api.getMatches(), api.getTips(player)]);
    setMatches(m.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setTips(t);
  };

  useEffect(() => {
    load().catch((e) => setError(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player]);

  const draftFor = (matchId: string) => {
    if (drafts[matchId]) return drafts[matchId];
    const existing = tips.find((t) => t.matchId === matchId);
    return {
      germany: existing ? String(existing.germany) : '',
      opponent: existing ? String(existing.opponent) : '',
    };
  };

  const submit = async (match: Match) => {
    setError('');
    const draft = draftFor(match.id);
    const germany = parseInt(draft.germany, 10);
    const opponent = parseInt(draft.opponent, 10);
    if (Number.isNaN(germany) || Number.isNaN(opponent) || germany < 0 || opponent < 0) {
      setError('Bitte ein gültiges Ergebnis eingeben.');
      return;
    }
    try {
      await api.submitTip({ player, matchId: match.id, germany, opponent });
      setSavedId(match.id);
      setTimeout(() => setSavedId(''), 1500);
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  if (matches.length === 0) {
    return <p>Noch keine Deutschland-Spiele eingetragen. Schau später wieder vorbei.</p>;
  }

  return (
    <div className="match-list">
      {error && <p className="error">{error}</p>}
      {matches.map((match) => {
        const locked = !!match.result;
        const draft = draftFor(match.id);
        return (
          <div key={match.id} className="card match-card">
            <div className="match-header">
              <strong>Deutschland – {match.opponent}</strong>
              <span className="stage">{match.stage}</span>
            </div>
            <div className="match-date">{formatDate(match.date)}</div>
            {locked && match.result && (
              <div className="result">
                Endergebnis: {match.result.germany}:{match.result.opponent}
              </div>
            )}
            <div className="tip-form">
              <input
                type="number"
                min={0}
                disabled={locked}
                value={draft.germany}
                onChange={(e) =>
                  setDrafts({ ...drafts, [match.id]: { ...draft, germany: e.target.value } })
                }
                placeholder="GER"
              />
              <span>:</span>
              <input
                type="number"
                min={0}
                disabled={locked}
                value={draft.opponent}
                onChange={(e) =>
                  setDrafts({ ...drafts, [match.id]: { ...draft, opponent: e.target.value } })
                }
                placeholder={match.opponent}
              />
              <button disabled={locked} onClick={() => submit(match)}>
                {locked ? 'Gesperrt' : 'Tipp speichern'}
              </button>
              {savedId === match.id && <span className="saved">Gespeichert!</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
