import { SnackbarMessageType } from './snackbar-message-type';

export interface IDoShowMessage {
  message: string;
  timed?: boolean;
  type?: SnackbarMessageType;
}