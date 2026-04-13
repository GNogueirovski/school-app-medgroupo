import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialogCloseButton,
  Heading,
  Text,
  Button,
  ButtonText,
  Icon,
  CloseIcon,
} from '@gluestack-ui/themed';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AlertDialog isOpen={isOpen} onClose={onCancel} testID="confirm-dialog">
      <AlertDialogBackdrop />
      <AlertDialogContent bg="#1E293B">
        <AlertDialogHeader>
          <Heading size="lg" testID="confirm-dialog-title" color="#F8FAFC">
            {title}
          </Heading>
          <AlertDialogCloseButton>
            <Icon as={CloseIcon} color="#94A3B8" />
          </AlertDialogCloseButton>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text testID="confirm-dialog-message" color="#CBD5E1">{message}</Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button variant="outline" borderColor="#475569" onPress={onCancel} testID="confirm-dialog-cancel">
            <ButtonText color="#F8FAFC">{cancelLabel}</ButtonText>
          </Button>
          <Button action="negative" bg="#F87171" onPress={onConfirm} testID="confirm-dialog-confirm">
            <ButtonText color="#0F172A">{confirmLabel}</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
