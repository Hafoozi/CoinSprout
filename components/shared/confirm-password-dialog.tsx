'use client'

// TODO: Implement PIN confirmation dialog
// Used when: switching to parent mode, switching between child profiles
// Shows a 4-digit PIN entry pad (or numeric input for MVP simplicity)
// Calls actions/profile-switch.ts > verifyPin on submit
interface Props {
  open: boolean
  onClose: () => void
  onConfirm: (pin: string) => Promise<void>
  title?: string
}

export default function ConfirmPinDialog({
  open,
  onClose,
  onConfirm,
  title = 'Enter PIN',
}: Props) {
  return null
}
