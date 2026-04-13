import { useCallback } from 'react';
import { useToast, Toast, ToastTitle } from '@gluestack-ui/themed';
import { useSchoolMutations } from './useSchools';
import React from 'react';

type SchoolPayload = { name: string; address: string };

function makeToastRender(message: string) {
  return ({ id }: { id: string | number }) =>
    React.createElement(
      Toast,
      { nativeID: String(id), action: 'success' },
      React.createElement(ToastTitle, null, message),
    );
}

export function useSchoolActions() {
  const toast = useToast();
  const { createSchool, updateSchool, deleteSchool } = useSchoolMutations();

  const create = useCallback(
    async (data: SchoolPayload): Promise<void> => {
      await createSchool(data);
      toast.show({ placement: 'bottom', render: makeToastRender('Escola criada com sucesso!') });
    },
    [createSchool, toast],
  );

  const update = useCallback(
    async (id: string, data: SchoolPayload): Promise<void> => {
      await updateSchool(id, data);
      toast.show({ placement: 'bottom', render: makeToastRender('Escola atualizada com sucesso!') });
    },
    [updateSchool, toast],
  );

  const remove = useCallback(
    async (id: string): Promise<void> => {
      await deleteSchool(id);
      toast.show({ placement: 'bottom', render: makeToastRender('Escola removida com sucesso!') });
    },
    [deleteSchool, toast],
  );

  return { create, update, remove };
}
