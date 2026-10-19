import { useState } from 'react';

// Избранные матчи (по id). Хранятся только в памяти, пока открыто приложение.
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  // indexOf возвращает позицию, а не признак наличия: -1 («нет») — это true, а 0 («первый») — false.
  const isFavorite = (id: string) => favorites.includes(id);

  // Массив не меняем, а создаём новый: React перерисует экран, только если в setFavorites пришла
  // другая ссылка. Функциональная форма берёт актуальное состояние, а не значение из замыкания.
  const toggle = (id: string) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return { favorites, isFavorite, toggle };
}
