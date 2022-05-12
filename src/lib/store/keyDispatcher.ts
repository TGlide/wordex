import { get, writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

type Callback = (key: string, code?: string) => void;

type StoredListener = {
	callback: Callback;
	id: string;
};

const createDispatcher = () => {
	const store = writable<StoredListener[]>([]);

	const addListener = (callback: Callback) => {
		const id = uuidv4();
		store.update((listeners) => [...listeners, { callback, id }]);

		return id;
	};

	const removeListener = (idToRemove: string) => {
		store.update((listeners) => listeners.filter(({ id }) => id !== idToRemove));
	};

	const dispatch = (...params: Parameters<Callback>) => {
		get(store).forEach(({ callback: c }) => {
			c(...params);
		});
	};

	return { ...store, addListener, removeListener, dispatch };
};

export const keyDispatcher = createDispatcher();
