import sample from '../../../data/matches.json';
import { parseMatches } from '../parseMatches';

function findMatch(id: string) {
  const match = parseMatches(sample).matches.find((item) => item.id === id);
  if (!match) throw new Error(`В примере нет матча ${id}`);
  return match;
}

describe('parseMatches: пример ответа из data/matches.json', () => {
  test('читает номер тура и все матчи', () => {
    const { round, matches } = parseMatches(sample);
    expect(round).toBe(12);
    expect(matches).toHaveLength(8);
  });

  test('счёт 0:0 сохраняется и не превращается в «нет счёта»', () => {
    expect(findMatch('m2').score).toEqual({ home: 0, away: 0 });
  });

  test('у матча, который не начался, счёта нет', () => {
    expect(findMatch('m5').score).toBeNull();
  });

  test('у перенесённого матча нет даты', () => {
    expect(findMatch('m7').startsAt).toBeNull();
  });

  test('дата в UTC разбирается в тот же момент времени', () => {
    expect(findMatch('m1').startsAt?.toISOString()).toBe('2026-10-11T13:00:00.000Z');
  });

  test('у идущего матча есть минута и счёт', () => {
    expect(findMatch('m4')).toMatchObject({
      status: 'live',
      minute: 67,
      score: { home: 1, away: 1 },
    });
  });
});

describe('parseMatches: неожиданные данные', () => {
  const rawMatch = {
    id: 'ok',
    startsAt: '2026-10-11T13:00:00Z',
    status: ' Scheduled ',
    home: { id: 'a', name: 'Альфа', city: 'Город' },
    away: { id: 'b', name: 'Бета', city: 'Город' },
    score: null,
  };

  test('статус приводится к нижнему регистру без пробелов', () => {
    expect(parseMatches({ matches: [rawMatch] }).matches[0].status).toBe('scheduled');
  });

  test('невалидная дата становится null', () => {
    const { matches } = parseMatches({ matches: [{ ...rawMatch, startsAt: 'скоро' }] });
    expect(matches[0].startsAt).toBeNull();
  });

  test('отсутствующий счёт и минута становятся null', () => {
    const { score, minute } = parseMatches({ matches: [rawMatch] }).matches[0];
    expect(score).toBeNull();
    expect(minute).toBeNull();
  });

  test('пропускает записи без id или названий команд, остальные оставляет', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { matches } = parseMatches({
      matches: [rawMatch, { ...rawMatch, id: '' }, { ...rawMatch, home: {} }, null],
    });
    expect(matches.map((match) => match.id)).toEqual(['ok']);
    expect(warn).toHaveBeenCalledTimes(3);
    warn.mockRestore();
  });

  test('пустой список матчей — не ошибка', () => {
    expect(parseMatches({ round: 3, matches: [] })).toEqual({ round: 3, matches: [] });
  });

  test('если matches не массив — бросает ошибку', () => {
    expect(() => parseMatches({ round: 1 })).toThrow();
    expect(() => parseMatches({ matches: 'нет' })).toThrow();
    expect(() => parseMatches(null)).toThrow();
  });
});
