import { View, Text, StyleSheet } from 'react-native';
import { Shift } from '../types';

const SHIFT_STYLE: Record<Shift, { bg: string; text: string }> = {
  [Shift.Morning]: { bg: '#064e3b', text: '#6ee7b7' },
  [Shift.Afternoon]: { bg: '#7c2d12', text: '#fdba74' },
  [Shift.Evening]: { bg: '#3b0764', text: '#d8b4fe' },
};

interface ShiftBadgeProps {
  shift: Shift;
}

export function ShiftBadge({ shift }: ShiftBadgeProps) {
  const { bg, text } = SHIFT_STYLE[shift];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]} testID={`shift-badge-${shift}`}>
      <Text style={[styles.label, { color: text }]}>{shift}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
});
