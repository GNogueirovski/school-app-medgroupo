import { useState } from 'react';
import { View, ActivityIndicator, Text, Pressable, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  Heading,
  Icon,
  AddIcon,
} from '@gluestack-ui/themed';
import { useClasses } from '@/features/classes/hooks/useClasses';
import { useClassActions } from '@/features/classes/hooks/useClassActions';
import { useSchoolById } from '@/features/schools/hooks/useSchools';
import { ClassList } from '@/features/classes/components/ClassList';
import { ClassForm, ClassFormValues } from '@/features/classes/components/ClassForm';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Class } from '@/features/classes/types';

export default function SchoolDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const school = useSchoolById(id);
  const { classes, loading, error, refresh } = useClasses(id);
  const { create: createClass, update: updateClass, remove: deleteClass } = useClassActions();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [classToDelete, setClassToDelete] = useState<Class | null>(null);

  function openCreate() {
    setEditingClass(null);
    setSheetOpen(true);
  }

  function openEdit(classItem: Class) {
    setEditingClass(classItem);
    setSheetOpen(true);
  }

  function closeSheet() {
    setSheetOpen(false);
    setEditingClass(null);
  }

  async function handleSubmit(data: ClassFormValues & { schoolId: string }) {
    if (editingClass) {
      await updateClass(editingClass.id, data);
    } else {
      await createClass(data);
    }
    closeSheet();
  }

  function requestDelete(classItem: Class) {
    setClassToDelete(classItem);
  }

  async function confirmDelete() {
    if (!classToDelete) return;
    await deleteClass(classToDelete.id);
    setClassToDelete(null);
  }

  function cancelDelete() {
    setClassToDelete(null);
  }

  const headerRight = () => <AddButton onPress={openCreate} />;

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ title: school?.name ?? 'Escola', headerRight }} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" testID="loading-indicator" />
        </View>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Stack.Screen options={{ title: school?.name ?? 'Escola', headerRight }} />
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={refresh} style={styles.retryButton}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </Pressable>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: school?.name ?? 'Escola', headerRight }} />

      <ClassList
        classes={classes}
        onEdit={openEdit}
        onDelete={requestDelete}
        onAddClass={openCreate}
      />

      <Actionsheet isOpen={sheetOpen} onClose={closeSheet}>
        <ActionsheetBackdrop />
        <ActionsheetContent bg="#1E293B">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator bg="#475569" />
          </ActionsheetDragIndicatorWrapper>
          <Heading size="sm" style={styles.sheetTitle} color="#F8FAFC">
            {editingClass ? 'Editar turma' : 'Nova turma'}
          </Heading>
          <ClassForm
            schoolId={id}
            initialValues={
              editingClass
                ? { name: editingClass.name, shift: editingClass.shift, academicYear: editingClass.academicYear }
                : undefined
            }
            onSubmit={handleSubmit}
            onCancel={closeSheet}
          />
        </ActionsheetContent>
      </Actionsheet>

      <ConfirmDialog
        isOpen={Boolean(classToDelete)}
        title="Excluir turma"
        message={`Tem certeza que deseja excluir a turma "${classToDelete?.name}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
}

function AddButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.addButton} testID="add-class-button">
      <Icon as={AddIcon} color="#0F172A" size="xl" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  errorText: {
    fontSize: 15,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#38BDF8',
    borderRadius: 8,
  },
  retryText: {
    color: '#0F172A',
    fontWeight: '600',
    fontSize: 14,
  },
  addButton: {
    marginRight: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetTitle: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
});
