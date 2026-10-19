import type { Match, MatchesData, Score, Team } from '../types';

type RawObject = Record<string, unknown>;

const isObject = (value: unknown): value is RawObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

function parseTeam(raw: unknown): Team | null {
  if (!isObject(raw) || typeof raw.name !== 'string') return null;
  const name = raw.name.trim();
  if (name === '') return null;
  return {
    id: typeof raw.id === 'string' ? raw.id : name,
    name,
    city: typeof raw.city === 'string' ? raw.city : '',
  };
}

// Счёт 0:0 — настоящий счёт, поэтому проверяем типы, а не «истинность» чисел.
function parseScore(raw: unknown): Score | null {
  if (!isObject(raw) || !isFiniteNumber(raw.home) || !isFiniteNumber(raw.away)) return null;
  return { home: raw.home, away: raw.away };
}

// Пустая или невалидная дата → null, чтобы на экране не появились «Invalid Date» или 1970 год.
function parseDate(raw: unknown): Date | null {
  if (typeof raw !== 'string') return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

// Без id или названий команд матч не показать (id нужен для ключа списка и избранного).
function parseMatch(raw: unknown): Match | null {
  if (!isObject(raw) || typeof raw.id !== 'string' || raw.id === '') return null;
  const home = parseTeam(raw.home);
  const away = parseTeam(raw.away);
  if (!home || !away) return null;
  return {
    id: raw.id,
    startsAt: parseDate(raw.startsAt),
    status: typeof raw.status === 'string' ? raw.status.trim().toLowerCase() : '',
    minute: isFiniteNumber(raw.minute) ? raw.minute : null,
    home,
    away,
    score: parseScore(raw.score),
  };
}

// Превращает ответ сервера в типизированные данные. Порядок матчей сохраняется.
export function parseMatches(payload: unknown): MatchesData {
  if (!isObject(payload) || !Array.isArray(payload.matches)) {
    throw new Error('Неожиданный формат ответа сервера');
  }

  const matches: Match[] = [];
  for (const raw of payload.matches) {
    const match = parseMatch(raw);
    if (match) {
      matches.push(match);
    } else {
      console.warn('Пропущена некорректная запись матча', raw);
    }
  }

  return { round: isFiniteNumber(payload.round) ? payload.round : null, matches };
}
