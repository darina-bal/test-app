export type Team = {
  id: string;
  name: string;
  city: string;
};

export type Score = {
  home: number;
  away: number;
};

export type Match = {
  id: string;
  // null — у перенесённого матча даты пока нет.
  startsAt: Date | null;
  // Статус в нижнем регистре, как прислал сервер. Известные значения описаны в utils/matches.ts,
  // но сервер может прислать и другие.
  status: string;
  // Минута игры, есть только у идущего матча.
  minute: number | null;
  home: Team;
  away: Team;
  // null — счёта ещё нет. Счёт 0:0 настоящий, это не «нет счёта».
  score: Score | null;
};

export type MatchesData = {
  round: number | null;
  matches: Match[];
};

export type MatchFilter = 'all' | 'upcoming' | 'finished';
