import { isArrayOfType } from '../utils/array';
import { isObjectType, objectFilter } from '../utils/object';
import type { AppwriteException, Models } from 'appwrite';

export type ModelsDocument<T extends object = object> = Models.Document & T;

export function isModelsDocument<T extends object = object>(
  doc: unknown,
  docTypeChecker?: (value: unknown) => value is T
): doc is ModelsDocument<T> {
  return (
    isObjectType<Models.Document>(doc, {
      $id: 'string',
      $collectionId: 'string',
      $databaseId: 'string',
      $createdAt: 'string',
      $updatedAt: 'string',
      $permissions: (v) => isArrayOfType<string>(v, 'string')
    }) && (docTypeChecker ? docTypeChecker(doc) : true)
  );
}

export function isModelsDocumentList<T extends object = object>(
  docList: unknown,
  docTypeChecker?: (value: unknown) => value is T
): docList is Models.DocumentList<ModelsDocument<T>> {
  const documentChecker = (doc: unknown): doc is ModelsDocument<T> => {
    return isModelsDocument(doc, docTypeChecker);
  };

  return isObjectType<Models.DocumentList<ModelsDocument<T>>>(docList, {
    total: 'number',
    documents: (v) => isArrayOfType(v, documentChecker)
  });
}

export function strippedDocument<T extends object = object>(doc: ModelsDocument<T>): T {
  const excludedKeys = [
    '$id',
    '$collectionId',
    '$databaseId',
    '$createdAt',
    '$updatedAt',
    '$permissions'
  ];
  return objectFilter(doc, (key) => !excludedKeys.includes(key as string)) as T;
}

type PickedAppwriteException = Pick<AppwriteException, 'code' | 'type'>;
export function isAppwriteException(value: unknown): value is PickedAppwriteException {
  return isObjectType<PickedAppwriteException>(value, {
    code: 'number',
    type: 'string'
  });
}
