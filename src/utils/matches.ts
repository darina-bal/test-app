import type { Match, MatchFilter } from '../types';

const STATUS_LABELS = new Map([
  ['scheduled', 'Запланирован'],
  ['live', 'Идёт'],
  ['finished', 'Завершён'],
  ['postponed', 'Перенесён'],
]);

// «Предстоящие» — всё, что ещё не закончилось: ждёт начала, идёт сейчас или перенесено на потом.
// Статус, которого мы не знаем (например, отмена), не попадает ни в «Предстоящие», ни в «Завершённые»:
// не гадаем, а оставляем матч видимым во «Все».
const UPCOMING_STATUSES = new Set(['scheduled', 'live', 'postponed']);

export function getStatusLabel(status: string): string {
  return STATUS_LABELS.get(status) ?? 'Статус неизвестен';
}

export function filterMatches(matches: Match[], filter: MatchFilter): Match[] {
  switch (filter) {
    case 'all':
      return matches;
    case 'upcoming':
      return matches.filter((match) => UPCOMING_STATUSES.has(match.status));
    case 'finished':
      return matches.filter((match) => match.status === 'finished');
  }
}
