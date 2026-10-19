import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { FilterTabs } from '../components/FilterTabs';
import { MatchCard } from '../components/MatchCard';
import { StateMessage } from '../components/StateMessage';
import { UpdatedAgo } from '../components/UpdatedAgo';
import { useMatches, type MatchesState } from '../hooks/useMatches';
import type { MatchFilter } from '../types';
import { filterMatches } from '../utils/matches';

// Экран «Матчи тура» — задание в README.md, часть 1.
export function MatchesScreen() {
  const { state, reload } = useMatches();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Матчи тура</Text>
        {state.status === 'ready' && state.round !== null ? (
          <Text style={styles.round}>Тур {state.round}</Text>
        ) : null}
      </View>
      {renderContent(state, reload)}
    </View>
  );
}

function renderContent(state: MatchesState, reload: () => void) {
  switch (state.status) {
    case 'loading':
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Загружаем матчи…</Text>
        </View>
      );
    case 'error':
      return (
        <View style={styles.centered}>
          <StateMessage
            title="Не удалось загрузить матчи"
            text={state.message}
            action={{ label: 'Повторить', onPress: reload }}
          />
        </View>
      );
    case 'ready':
      return <MatchesList state={state} onReload={reload} />;
  }
}

type MatchesListProps = {
  state: Extract<MatchesState, { status: 'ready' }>;
  onReload: () => void;
};

// Всё, что видно, когда данные уже загружены: фильтр, строка обновления и сам список.
function MatchesList({ state, onReload }: MatchesListProps) {
  const [filter, setFilter] = useState<MatchFilter>('all');
  const visibleMatches = useMemo(
    () => filterMatches(state.matches, filter),
    [state.matches, filter],
  );

  return (
    <>
      <FilterTabs value={filter} onChange={setFilter} />
      <View style={styles.toolbar}>
        <UpdatedAgo since={state.updatedAt} />
        <Button
          label={state.refreshing ? 'Обновляем…' : 'Обновить'}
          onPress={onReload}
          disabled={state.refreshing}
        />
      </View>
      {state.refreshError !== null ? (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Не удалось обновить: {state.refreshError}</Text>
          <Button label="Повторить" onPress={onReload} />
        </View>
      ) : null}
      <FlatList
        data={visibleMatches}
        keyExtractor={(match) => match.id}
        renderItem={({ item }) => <MatchCard match={item} />}
        refreshing={state.refreshing}
        onRefresh={onReload}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          state.matches.length === 0 ? (
            <StateMessage
              title="В этом туре пока нет матчей"
              text="Загляните позже или обновите список"
              action={{ label: 'Обновить', onPress: onReload }}
            />
          ) : (
            <StateMessage
              title="Нет матчей в этой категории"
              text="Выберите другой фильтр"
              action={{ label: 'Показать все', onPress: () => setFilter('all') }}
            />
          )
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  round: {
    fontSize: 16,
    color: '#6b7280',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
  },
  bannerText: {
    flex: 1,
    fontSize: 14,
    color: '#b91c1c',
  },
  listContent: {
    flexGrow: 1,
    gap: 12,
    paddingVertical: 16,
  },
});
