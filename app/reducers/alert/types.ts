export interface AlertState {
  isVisible: boolean;
  autodismiss: number | null;
  content: unknown | null;
  data: Record<string, unknown> | null;
}
