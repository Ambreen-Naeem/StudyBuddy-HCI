import Modal from './Modal'
import Button from './Button'

// Confirmation dialog for destructive/irreversible actions. Built on Modal so
// it inherits the focus trap, Escape-to-close and labelling. The confirm button
// uses the danger variant and an icon so intent is clear without relying on
// color alone.
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  variant = 'danger',
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      labelId="confirm-dialog-title"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={variant} onClick={onConfirm} loading={loading} icon={<span aria-hidden="true">⚠</span>}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p>{message}</p>
    </Modal>
  )
}
