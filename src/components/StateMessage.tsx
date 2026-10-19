import { StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';

type Props = {
  title: string;
  text?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
};

// Сообщение по центру: ошибка или пустой список, при необходимости с кнопкой.
export function StateMessage({ title, text, action }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {text ? <Text style={styles.text}>{text}</Text> : null}
      {action ? <Button label={action.label} onPress={action.onPress} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#111827',
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6b7280',
  },
});
