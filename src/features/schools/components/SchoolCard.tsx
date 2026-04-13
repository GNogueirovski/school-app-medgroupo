import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Icon, EditIcon, TrashIcon } from '@gluestack-ui/themed';
import { School } from '../types';
import { ShiftBadge } from './ShiftBadge';

interface SchoolCardProps {
  school: School;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function SchoolCard({ school, onPress, onEdit, onDelete }: SchoolCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      testID={`school-card-${school.id}`}
    >
      {/* Imagem placeholder */}
      <View style={styles.imagePlaceholder} />

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {school.name}
        </Text>

        <Text style={styles.address} numberOfLines={2}>
          {school.address}
        </Text>

        <Text style={styles.classCount}>
          {school.classCount} {school.classCount === 1 ? 'turma' : 'turmas'}
        </Text>

        <View style={styles.badges}>
          {school.shifts.map((shift) => (
            <ShiftBadge key={shift} shift={shift} />
          ))}
        </View>
      </View>

      {(onEdit || onDelete) && (
        <View style={styles.actions}>
          {onEdit && (
            <Pressable
              onPress={onEdit}
              style={styles.actionButton}
              testID={`edit-school-${school.id}`}
              hitSlop={8}
            >
              <Icon as={EditIcon} color="#60A5FA" size="lg" />
            </Pressable>
          )}
          {onDelete && (
            <Pressable
              onPress={onDelete}
              style={styles.actionButton}
              testID={`delete-school-${school.id}`}
              hitSlop={8}
            >
              <Icon as={TrashIcon} color="#F87171" size="lg" />
            </Pressable>
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.85,
  },
  imagePlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: '#334155',
    marginRight: 12,
    flexShrink: 0,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  address: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
  },
  classCount: {
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '500',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'column',
    gap: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 8,
  },
  actionButton: {
    paddingVertical: 1,
    paddingHorizontal: 4,
  },
});
