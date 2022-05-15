import { createDispatcher } from './createDispatcher';

type Callback = (text: string) => void;

export const toastDispatcher = createDispatcher<Callback>();
