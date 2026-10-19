import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { MatchFilter } from '../types';

type Props = {
  value: MatchFilter;
  onChange: (filter: MatchFilter) => void;
};

const OPTIONS: { value: MatchFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'upcoming', label: 'Предстоящие' },
  { value: 'finished', label: 'Завершённые' },
];

// Переключатель «Все / Предстоящие / Завершённые».
export function FilterTabs({ value, onChange }: Props) {
  return (
    <View style={styles.row} accessibilityRole="tablist">
      {OPTIONS.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="tab"
            aria-selected={selected}
            style={[styles.tab, selected && styles.tabSelected]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  tabSelected: {
    borderColor: '#111827',
    backgroundColor: '#111827',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  labelSelected: {
    color: '#fff',
  },
});
