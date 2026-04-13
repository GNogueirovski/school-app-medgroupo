import { FlatList } from 'react-native';
import { School } from '../types';
import { SchoolCard } from './SchoolCard';
import { EmptyState } from '@/components/EmptyState';

interface SchoolListProps {
  schools: School[];
  onSchoolPress: (school: School) => void;
  onSchoolEdit?: (school: School) => void;
  onSchoolDelete?: (school: School) => void;
  onAddSchool?: () => void;
}

export function SchoolList({ schools, onSchoolPress, onSchoolEdit, onSchoolDelete, onAddSchool }: SchoolListProps) {
  return (
    <FlatList
      data={schools}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <SchoolCard
          school={item}
          onPress={() => onSchoolPress(item)}
          onEdit={onSchoolEdit ? () => onSchoolEdit(item) : undefined}
          onDelete={onSchoolDelete ? () => onSchoolDelete(item) : undefined}
        />
      )}
      ListEmptyComponent={
        <EmptyState
          message="Nenhuma escola cadastrada ainda."
          ctaLabel="Adicionar escola"
          onCta={onAddSchool}
        />
      }
      contentContainerStyle={{ paddingVertical: 8, flexGrow: 1 }}
    />
  );
}
