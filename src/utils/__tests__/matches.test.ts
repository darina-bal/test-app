import type { Match } from '../../types';
import { filterMatches, getStatusLabel } from '../matches';

function makeMatch(id: string, status: string): Match {
  const team = { id: 'team', name: 'Команда', city: 'Город' };
  return { id, status, startsAt: null, minute: null, home: team, away: team, score: null };
}

// По матчу на каждый статус из данных и один со статусом, которого мы не знаем.
const matches = [
  makeMatch('finished', 'finished'),
  makeMatch('live', 'live'),
  makeMatch('scheduled', 'scheduled'),
  makeMatch('postponed', 'postponed'),
  makeMatch('cancelled', 'cancelled'),
];

const ids = (list: Match[]) => list.map((match) => match.id);

describe('filterMatches', () => {
  test('«Все» возвращает всё в исходном порядке, включая неизвестный статус', () => {
    expect(ids(filterMatches(matches, 'all'))).toEqual([
      'finished',
      'live',
      'scheduled',
      'postponed',
      'cancelled',
    ]);
  });

  test('«Предстоящие» — запланированные, идущие и перенесённые', () => {
    expect(ids(filterMatches(matches, 'upcoming'))).toEqual(['live', 'scheduled', 'postponed']);
  });

  test('«Завершённые» — только finished', () => {
    expect(ids(filterMatches(matches, 'finished'))).toEqual(['finished']);
  });

  test('идущий матч со счётом не считается завершённым', () => {
    const live: Match = { ...makeMatch('live', 'live'), score: { home: 1, away: 1 }, minute: 67 };
    expect(filterMatches([live], 'finished')).toEqual([]);
  });

  test('неизвестный статус не попадает ни в «Предстоящие», ни в «Завершённые»', () => {
    expect(ids(filterMatches(matches, 'upcoming'))).not.toContain('cancelled');
    expect(ids(filterMatches(matches, 'finished'))).not.toContain('cancelled');
  });

  test('не меняет исходный массив', () => {
    const before = [...matches];
    filterMatches(matches, 'upcoming');
    filterMatches(matches, 'finished');
    expect(matches).toEqual(before);
  });

  test('пустой список остаётся пустым при любом фильтре', () => {
    expect(filterMatches([], 'all')).toEqual([]);
    expect(filterMatches([], 'upcoming')).toEqual([]);
    expect(filterMatches([], 'finished')).toEqual([]);
  });
});

describe('getStatusLabel', () => {
  test('известные статусы подписаны по-русски', () => {
    expect(getStatusLabel('scheduled')).toBe('Запланирован');
    expect(getStatusLabel('live')).toBe('Идёт');
    expect(getStatusLabel('finished')).toBe('Завершён');
    expect(getStatusLabel('postponed')).toBe('Перенесён');
  });

  test('неизвестный статус не ломает подпись', () => {
    expect(getStatusLabel('cancelled')).toBe('Статус неизвестен');
    expect(getStatusLabel('')).toBe('Статус неизвестен');
    // Ключ из прототипа объекта не должен приниматься за статус.
    expect(getStatusLabel('constructor')).toBe('Статус неизвестен');
  });
});
