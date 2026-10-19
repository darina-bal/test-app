import { StyleSheet, Text, View } from 'react-native';
import type { Match, Score } from '../types';
import { formatKickoff } from '../utils/formatKickoff';
import { getStatusLabel } from '../utils/matches';

type Props = {
  match: Match;
};

// «2 : 1», а если счёта ещё нет — прочерк. Сравниваем с null, а не проверяем «истинность»:
// 0:0 — настоящий счёт.
function formatScore(score: Score | null): string {
  return score === null ? '—' : `${score.home} : ${score.away}`;
}

// «Идёт, 67′» для матча в процессе, у остальных — просто статус.
function formatStatus(match: Match): string {
  const label = getStatusLabel(match.status);
  return match.status === 'live' && match.minute !== null ? `${label}, ${match.minute}′` : label;
}

// Карточка матча: время начала, хозяева, счёт, гости и статус.
export function MatchCard({ match }: Props) {
  return (
    <View style={styles.card} testID={`match-${match.id}`}>
      <Text style={styles.kickoff}>{formatKickoff(match.startsAt)}</Text>
      <View style={styles.teams}>
        <Text style={[styles.team, styles.home]} numberOfLines={2}>
          {match.home.name}
        </Text>
        <Text style={styles.score}>{formatScore(match.score)}</Text>
        <Text style={[styles.team, styles.away]} numberOfLines={2}>
          {match.away.name}
        </Text>
      </View>
      <Text style={[styles.status, match.status === 'live' && styles.live]}>
        {formatStatus(match)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  kickoff: {
    fontSize: 13,
    color: '#6b7280',
  },
  teams: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  team: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  home: {
    textAlign: 'right',
  },
  away: {
    textAlign: 'left',
  },
  score: {
    minWidth: 64,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  status: {
    fontSize: 13,
    textAlign: 'center',
    color: '#6b7280',
  },
  live: {
    fontWeight: '600',
    color: '#ef3124',
  },
});
