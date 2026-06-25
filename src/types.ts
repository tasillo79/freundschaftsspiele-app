export interface Match {
  id: string;
  opponent: string;
  stage: string;
  date: string;
  result: { germany: number; opponent: number } | null;
}

export interface Tip {
  player: string;
  matchId: string;
  germany: number;
  opponent: number;
}

export interface LeaderboardEntry {
  player: string;
  points: number;
}
