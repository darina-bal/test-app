import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

type Props = {
  // Момент последней успешной загрузки данных.
  since: Date;
};

// Подпись «Обновлено N сек назад».
export function UpdatedAgo({ since }: Props) {
  const sinceMs = since.getTime();
  // В состоянии хранится «сейчас», а не счётчик секунд: секунды всегда считаются от since,
  // поэтому подпись не застревает и сбрасывается, когда приходит новый since.
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    // Без очистки таймер жил бы после ухода с экрана, а при смене since копились бы новые.
    return () => clearInterval(id);
  }, [sinceMs]);

  // Сразу после нового since сохранённое «сейчас» может быть чуть старше него, поэтому не меньше 0.
  const seconds = Math.max(0, Math.floor((now - sinceMs) / 1000));

  return <Text style={styles.text}>Обновлено {seconds} сек назад</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    color: '#6b7280',
  },
});
