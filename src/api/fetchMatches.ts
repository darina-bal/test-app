import { MATCHES_URL } from '../config';
import type { MatchesData } from '../types';
import { parseMatches } from './parseMatches';

// fetch не бросает ошибку на 404 и 500, поэтому статус ответа проверяем сами.
export async function fetchMatches(signal?: AbortSignal): Promise<MatchesData> {
  const response = await fetch(MATCHES_URL, { signal });
  if (!response.ok) {
    throw new Error(`Сервер ответил ${response.status}`);
  }
  return parseMatches(await response.json());
}
