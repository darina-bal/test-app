import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchMatches } from '../api/fetchMatches';
import type { Match } from '../types';

// Состояние загрузки как набор взаимоисключающих вариантов: экран не может оказаться
// одновременно «в загрузке» и «с ошибкой», а TypeScript заставляет обработать каждый вариант.
export type MatchesState =
  // Первая загрузка ещё идёт.
  | { status: 'loading' }
  // Первая загрузка не удалась: показывать нечего.
  | { status: 'error'; message: string }
  // Данные есть. refreshing — идёт повторная загрузка; refreshError — она не удалась,
  // но прежний список остаётся на экране.
  | {
      status: 'ready';
      round: number | null;
      matches: Match[];
      updatedAt: Date;
      refreshing: boolean;
      refreshError: string | null;
    };

// fetch сообщает о сетевом сбое через TypeError, а невалидный JSON приходит как SyntaxError.
function describeError(error: unknown): string {
  if (error instanceof TypeError) return 'Нет соединения с сервером';
  if (error instanceof SyntaxError) return 'Сервер вернул данные в неожиданном виде';
  if (error instanceof Error) return error.message;
  return 'Неизвестная ошибка';
}

// Загружает матчи при открытии экрана; reload — для «Обновить» и «Повторить».
export function useMatches() {
  const [state, setState] = useState<MatchesState>({ status: 'loading' });
  // Последний запущенный запрос: новый отменяет предыдущий, уход с экрана отменяет текущий.
  const controllerRef = useRef<AbortController | null>(null);

  const reload = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    // Если данные уже есть, список остаётся на месте; иначе показываем загрузку на весь экран.
    setState((prev) => {
      if (prev.status === 'ready') return { ...prev, refreshing: true, refreshError: null };
      if (prev.status === 'loading') return prev;
      return { status: 'loading' };
    });

    try {
      const { round, matches } = await fetchMatches(controller.signal);
      if (controller.signal.aborted) return;
      // Время обновления фиксируем только при успехе: «Обновлено N сек назад» считается от него.
      setState({
        status: 'ready',
        round,
        matches,
        updatedAt: new Date(),
        refreshing: false,
        refreshError: null,
      });
    } catch (error) {
      // Отменённый запрос — не ошибка: его уже заменил другой или экран закрыт.
      if (controller.signal.aborted) return;
      const message = describeError(error);
      setState((prev) =>
        prev.status === 'ready'
          ? { ...prev, refreshing: false, refreshError: message }
          : { status: 'error', message },
      );
    }
  }, []);

  useEffect(() => {
    reload();
    return () => controllerRef.current?.abort();
  }, [reload]);

  return { state, reload };
}
