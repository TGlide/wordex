import { createDispatcher } from './createDispatcher';

type Callback = (key: string, code?: string) => void;

export const keyDispatcher = createDispatcher<Callback>();
