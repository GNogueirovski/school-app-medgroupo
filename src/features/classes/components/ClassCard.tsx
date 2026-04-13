import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Icon, EditIcon, TrashIcon } from '@gluestack-ui/themed';
import { Class } from '../types';
import { ShiftBadge } from '@/features/schools/components/ShiftBadge';

interface ClassCardProps {
  classItem: Class;
  onEdit: () => void;
  onDelete: () => void;
}

export function ClassCard({ classItem, onEdit, onDelete }: ClassCardProps) {
  return (
    <View style={styles.card} testID={`class-card-${classItem.id}`}>
      <View style={styles.info}>
        <Text style={styles.name}>{classItem.name}</Text>
        <View style={styles.meta}>
          <ShiftBadge shift={classItem.shift} />
          <Text style={styles.year}>{classItem.academicYear}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={onEdit}
          style={styles.actionButton}
          testID={`edit-class-${classItem.id}`}
          hitSlop={8}
        >
          <Icon as={EditIcon} color="#60A5FA" size="lg" />
        </Pressable>

        <Pressable
          onPress={onDelete}
          style={styles.actionButton}
          testID={`delete-class-${classItem.id}`}
          hitSlop={8}
        >
          <Icon as={TrashIcon} color="#F87171" size="lg" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 5,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  info: {
    flex: 1,
    gap: 6,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  year: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
});
