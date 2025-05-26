import { SnackbarMessageType } from './snackbar-message-type';

export interface IDoSnackbarMessage {
  id: number;
  message: string;
  timed: boolean;
  type: SnackbarMessageType;
  closing: boolean;
}