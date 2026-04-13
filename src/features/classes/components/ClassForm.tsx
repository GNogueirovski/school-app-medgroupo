import { useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
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
import { Shift } from '@/features/schools/types';

export interface ClassFormValues {
  name: string;
  shift: Shift;
  academicYear: number;
}

interface ClassFormProps {
  schoolId: string;
  initialValues?: ClassFormValues;
  onSubmit: (data: ClassFormValues & { schoolId: string }) => Promise<void>;
  onCancel: () => void;
}

const SHIFT_OPTIONS: { label: string; value: Shift }[] = [
  { label: 'Matutino', value: Shift.Morning },
  { label: 'Vespertino', value: Shift.Afternoon },
  { label: 'Noturno', value: Shift.Evening },
];

const SHIFT_COLORS: Record<Shift, { bg: string; text: string; selectedBg: string }> = {
  [Shift.Morning]: { bg: '#064E3B', text: '#6EE7B7', selectedBg: '#047857' },
  [Shift.Afternoon]: { bg: '#7C2D12', text: '#FDBA74', selectedBg: '#C2410C' },
  [Shift.Evening]: { bg: '#3B0764', text: '#D8B4FE', selectedBg: '#7E22CE' },
};

export function ClassForm({ schoolId, initialValues, onSubmit, onCancel }: ClassFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [shift, setShift] = useState<Shift | null>(initialValues?.shift ?? null);
  const [academicYear, setAcademicYear] = useState(
    initialValues?.academicYear ? String(initialValues.academicYear) : '',
  );
  const [nameError, setNameError] = useState('');
  const [shiftError, setShiftError] = useState('');
  const [yearError, setYearError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    let valid = true;

    if (!name.trim()) {
      setNameError('Nome é obrigatório');
      valid = false;
    } else {
      setNameError('');
    }

    if (!shift) {
      setShiftError('Turno é obrigatório');
      valid = false;
    } else {
      setShiftError('');
    }

    const yearNum = parseInt(academicYear, 10);
    if (!academicYear.trim() || isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
      setYearError('Ano letivo inválido (ex: 2024)');
      valid = false;
    } else {
      setYearError('');
    }

    return valid;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        schoolId,
        name: name.trim(),
        shift: shift as Shift,
        academicYear: parseInt(academicYear, 10),
      });
    } finally {
      setSubmitting(false);
    }
  }

  const isEditing = Boolean(initialValues);

  return (
    <VStack space="md" style={styles.container}>
      <FormControl isInvalid={Boolean(nameError)}>
        <FormControlLabel>
          <FormControlLabelText color="#F8FAFC">Nome da turma</FormControlLabelText>
        </FormControlLabel>
        <Input borderColor="#475569">
          <InputField
            color="#F8FAFC"
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={setName}
            placeholder="Ex: 1º A"
            testID="class-name-input"
            returnKeyType="next"
          />
        </Input>
        {Boolean(nameError) && (
          <FormControlError>
            <FormControlErrorText testID="class-name-error">{nameError}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      <FormControl isInvalid={Boolean(shiftError)}>
        <FormControlLabel>
          <FormControlLabelText color="#F8FAFC">Turno</FormControlLabelText>
        </FormControlLabel>
        <View style={styles.shiftRow} testID="class-shift-selector">
          {SHIFT_OPTIONS.map((option) => {
            const selected = shift === option.value;
            const colors = SHIFT_COLORS[option.value];
            return (
              <Pressable
                key={option.value}
                onPress={() => setShift(option.value)}
                testID={`shift-option-${option.value}`}
                style={[
                  styles.shiftButton,
                  { backgroundColor: selected ? colors.selectedBg : colors.bg },
                ]}
              >
                <Text style={[styles.shiftText, { color: selected ? '#fff' : colors.text }]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {Boolean(shiftError) && (
          <FormControlError>
            <FormControlErrorText testID="class-shift-error">{shiftError}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      <FormControl isInvalid={Boolean(yearError)}>
        <FormControlLabel>
          <FormControlLabelText color="#F8FAFC">Ano letivo</FormControlLabelText>
        </FormControlLabel>
        <Input borderColor="#475569">
          <InputField
            color="#F8FAFC"
            placeholderTextColor="#94A3B8"
            value={academicYear}
            onChangeText={setAcademicYear}
            placeholder="Ex: 2024"
            keyboardType="numeric"
            testID="class-year-input"
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            maxLength={4}
          />
        </Input>
        {Boolean(yearError) && (
          <FormControlError>
            <FormControlErrorText testID="class-year-error">{yearError}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      <Button onPress={handleSubmit} isDisabled={submitting} testID="class-submit-button" bg="#38BDF8">
        {submitting ? <ButtonSpinner /> : <ButtonText color="#0F172A">{isEditing ? 'Salvar alterações' : 'Criar turma'}</ButtonText>}
      </Button>

      <Button variant="outline" borderColor="#475569" onPress={onCancel} isDisabled={submitting} testID="class-cancel-button">
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
  shiftRow: {
    flexDirection: 'row',
    gap: 8,
  },
  shiftButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  shiftText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
