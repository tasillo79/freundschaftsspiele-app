import { LeaderboardEntry, Match, Tip } from './types';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Anfrage fehlgeschlagen (${res.status})`);
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json();
}

export const api = {
  getMatches: () => request<Match[]>('/api/matches'),
  addMatch: (
    adminPassword: string,
    match: { opponent: string; stage: string; date: string }
  ) =>
    request<Match>('/api/matches', {
      method: 'POST',
      headers: { 'x-admin-password': adminPassword },
      body: JSON.stringify(match),
    }),
  setResult: (
    adminPassword: string,
    matchId: string,
    result: { germany: number; opponent: number }
  ) =>
    request<Match>(`/api/matches/${matchId}/result`, {
      method: 'PUT',
      headers: { 'x-admin-password': adminPassword },
      body: JSON.stringify(result),
    }),
  deleteMatch: (adminPassword: string, matchId: string) =>
    request<void>(`/api/matches/${matchId}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': adminPassword },
    }),
  getTips: (player?: string) =>
    request<Tip[]>(`/api/tips${player ? `?player=${encodeURIComponent(player)}` : ''}`),
  submitTip: (tip: Tip) =>
    request<Tip>('/api/tips', {
      method: 'POST',
      body: JSON.stringify(tip),
    }),
  getLeaderboard: () => request<LeaderboardEntry[]>('/api/leaderboard'),
};
