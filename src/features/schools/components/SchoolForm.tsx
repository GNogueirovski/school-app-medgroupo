import { useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
  Input,
  InputField,
  Button,
  ButtonText,
  VStack,
  ButtonSpinner,
} from '@gluestack-ui/themed';

export interface SchoolFormValues {
  name: string;
  address: string;
}

interface SchoolFormProps {
  initialValues?: SchoolFormValues;
  onSubmit: (data: SchoolFormValues) => Promise<void>;
  onCancel: () => void;
}

export function SchoolForm({ initialValues, onSubmit, onCancel }: SchoolFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [address, setAddress] = useState(initialValues?.address ?? '');
  const [nameError, setNameError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    let valid = true;
    if (!name.trim()) {
      setNameError('Nome é obrigatório');
      valid = false;
    } else {
      setNameError('');
    }
    if (!address.trim()) {
      setAddressError('Endereço é obrigatório');
      valid = false;
    } else {
      setAddressError('');
    }
    return valid;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), address: address.trim() });
    } finally {
      setSubmitting(false);
    }
  }

  const isEditing = Boolean(initialValues);

  return (
    <VStack space="md" style={styles.container}>
      <FormControl isInvalid={Boolean(nameError)}>
        <FormControlLabel>
          <FormControlLabelText color="#F8FAFC">Nome da escola</FormControlLabelText>
        </FormControlLabel>
        <Input borderColor="#475569">
          <InputField
            color="#F8FAFC"
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={setName}
            placeholder="Ex: E.E. Santos Dumont"
            testID="school-name-input"
            returnKeyType="next"
          />
        </Input>
        {Boolean(nameError) && (
          <FormControlError>
            <FormControlErrorText testID="school-name-error">{nameError}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      <FormControl isInvalid={Boolean(addressError)}>
        <FormControlLabel>
          <FormControlLabelText color="#F8FAFC">Endereço</FormControlLabelText>
        </FormControlLabel>
        <Input borderColor="#475569">
          <InputField
            color="#F8FAFC"
            placeholderTextColor="#94A3B8"
            value={address}
            onChangeText={setAddress}
            placeholder="Ex: Rua das Flores, 123 - Centro"
            testID="school-address-input"
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />
        </Input>
        {Boolean(addressError) && (
          <FormControlError>
            <FormControlErrorText testID="school-address-error">{addressError}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      <Button onPress={handleSubmit} isDisabled={submitting} testID="school-submit-button" bg="#38BDF8">
        {submitting ? <ButtonSpinner /> : <ButtonText color="#0F172A">{isEditing ? 'Salvar alterações' : 'Criar escola'}</ButtonText>}
      </Button>

      <Button variant="outline" borderColor="#475569" onPress={onCancel} isDisabled={submitting} testID="school-cancel-button">
        <ButtonText color="#F8FAFC">Cancelar</ButtonText>
      </Button>
    </VStack>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
