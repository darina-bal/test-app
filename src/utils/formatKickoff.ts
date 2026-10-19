// Дата и время начала в часовом поясе устройства: timeZone не задаём намеренно.
// Опции перечислены явно, без dateStyle/timeStyle — на старых Android в Hermes их нет.
export function formatKickoff(startsAt: Date | null): string {
  if (startsAt === null) return 'Дата уточняется';
  return startsAt.toLocaleString('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}
