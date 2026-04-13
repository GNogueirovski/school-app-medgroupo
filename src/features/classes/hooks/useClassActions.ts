import { useCallback } from 'react';
import { useToast, Toast, ToastTitle } from '@gluestack-ui/themed';
import { useClassMutations } from './useClasses';
import { Class } from '../types';
import React from 'react';

type ClassPayload = Omit<Class, 'id'>;

function makeToastRender(message: string) {
  return ({ id }: { id: string | number }) =>
    React.createElement(
      Toast,
      { nativeID: String(id), action: 'success' },
      React.createElement(ToastTitle, null, message),
    );
}

export function useClassActions() {
  const toast = useToast();
  const { createClass, updateClass, deleteClass } = useClassMutations();

  const create = useCallback(
    async (data: ClassPayload): Promise<void> => {
      await createClass(data);
      toast.show({ placement: 'bottom', render: makeToastRender('Turma criada com sucesso!') });
    },
    [createClass, toast],
  );

  const update = useCallback(
    async (id: string, data: ClassPayload): Promise<void> => {
      await updateClass(id, data);
      toast.show({ placement: 'bottom', render: makeToastRender('Turma atualizada com sucesso!') });
    },
    [updateClass, toast],
  );

  const remove = useCallback(
    async (id: string): Promise<void> => {
      await deleteClass(id);
      toast.show({ placement: 'bottom', render: makeToastRender('Turma removida com sucesso!') });
    },
    [deleteClass, toast],
  );

  return { create, update, remove };
}
