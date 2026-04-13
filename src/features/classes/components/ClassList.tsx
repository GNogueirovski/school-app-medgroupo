import { FlatList } from 'react-native';
import { Class } from '../types';
import { ClassCard } from './ClassCard';
import { EmptyState } from '@/components/EmptyState';

interface ClassListProps {
  classes: Class[];
  onEdit: (classItem: Class) => void;
  onDelete: (classItem: Class) => void;
  onAddClass?: () => void;
}

export function ClassList({ classes, onEdit, onDelete, onAddClass }: ClassListProps) {
  return (
    <FlatList
      data={classes}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ClassCard
          classItem={item}
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item)}
        />
      )}
      ListEmptyComponent={
        <EmptyState
          message="Nenhuma turma cadastrada ainda."
          ctaLabel="Adicionar turma"
          onCta={onAddClass}
        />
      }
      contentContainerStyle={{ paddingVertical: 8, flexGrow: 1 }}
    />
  );
}
