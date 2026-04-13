import { View, Text, Pressable, StyleSheet } from 'react-native';

interface EmptyStateProps {
  message: string;
  ctaLabel?: string;
  onCta?: () => void;
}

export function EmptyState({ message, ctaLabel, onCta }: EmptyStateProps) {
  return (
    <View style={styles.container} testID="empty-state">
      <Text style={styles.message} testID="empty-state-message">
        {message}
      </Text>
      {ctaLabel && onCta && (
        <Pressable onPress={onCta} style={styles.button} testID="empty-state-cta">
          <Text style={styles.buttonText}>{ctaLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 32,
  },
  message: {
    fontSize: 15,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#38BDF8',
    borderRadius: 8,
  },
  buttonText: {
    color: '#0F172A',
    fontWeight: '600',
    fontSize: 14,
  },
});
