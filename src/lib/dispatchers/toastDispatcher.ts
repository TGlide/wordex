import { createDispatcher } from './createDispatcher';

export type Toast = {
  text: string;
  duration?: number;
  dismissable?: boolean;
};

type Callback = (toast: Toast) => void;

export const toastDispatcher = createDispatcher<Callback>();
export const clearToastDispatcher = createDispatcher<() => void>();
