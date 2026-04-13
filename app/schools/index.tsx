import { useState } from 'react';
import { View, ActivityIndicator, Text, Pressable, StyleSheet } from 'react-native';
import { router, Stack } from 'expo-router';
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
import { useSchools } from '@/features/schools/hooks/useSchools';
import { useSchoolActions } from '@/features/schools/hooks/useSchoolActions';
import { SchoolList } from '@/features/schools/components/SchoolList';
import { SchoolForm, SchoolFormValues } from '@/features/schools/components/SchoolForm';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { School } from '@/features/schools/types';

export default function SchoolsScreen() {
  const { schools, loading, error, refresh } = useSchools();
  const { create: createSchool, update: updateSchool, remove: deleteSchool } = useSchoolActions();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [schoolToDelete, setSchoolToDelete] = useState<School | null>(null);

  function openCreate() {
    setEditingSchool(null);
    setSheetOpen(true);
  }

  function openEdit(school: School) {
    setEditingSchool(school);
    setSheetOpen(true);
  }

  function closeSheet() {
    setSheetOpen(false);
    setEditingSchool(null);
  }

  async function handleSubmit(data: SchoolFormValues) {
    if (editingSchool) {
      await updateSchool(editingSchool.id, data);
    } else {
      await createSchool(data);
    }
    closeSheet();
  }

  function requestDelete(school: School) {
    setSchoolToDelete(school);
  }

  async function confirmDelete() {
    if (!schoolToDelete) return;
    await deleteSchool(schoolToDelete.id);
    setSchoolToDelete(null);
  }

  function cancelDelete() {
    setSchoolToDelete(null);
  }

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ title: 'Escolas', headerRight: () => <AddButton onPress={openCreate} /> }} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" testID="loading-indicator" />
        </View>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Stack.Screen options={{ title: 'Escolas', headerRight: () => <AddButton onPress={openCreate} /> }} />
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
      <Stack.Screen options={{ title: 'Escolas', headerRight: () => <AddButton onPress={openCreate} /> }} />

      <SchoolList
        schools={schools}
        onSchoolPress={(school) => router.push(`/schools/${school.id}`)}
        onSchoolEdit={openEdit}
        onSchoolDelete={requestDelete}
        onAddSchool={openCreate}
      />

      <Actionsheet isOpen={sheetOpen} onClose={closeSheet}>
        <ActionsheetBackdrop />
        <ActionsheetContent bg="#1E293B">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator bg="#475569" />
          </ActionsheetDragIndicatorWrapper>
          <Heading size="sm" style={styles.sheetTitle} color="#F8FAFC">
            {editingSchool ? 'Editar escola' : 'Nova escola'}
          </Heading>
          <SchoolForm
            initialValues={editingSchool ? { name: editingSchool.name, address: editingSchool.address } : undefined}
            onSubmit={handleSubmit}
            onCancel={closeSheet}
          />
        </ActionsheetContent>
      </Actionsheet>

      <ConfirmDialog
        isOpen={Boolean(schoolToDelete)}
        title="Excluir escola"
        message={`Tem certeza que deseja excluir "${schoolToDelete?.name}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
}

function AddButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.addButton} testID="add-school-button">
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
