import { isObjectType } from '../utils/object';
import { isModelsDocument, type ModelsDocument } from './appwrite';

export type Word = {
  created_at: string;
  lang: string;
  word: string;
};

export type WordDocument = ModelsDocument<Word>;

export function isWord(value: unknown): value is Word {
  return isObjectType<Word>(value, {
    lang: 'string',
    created_at: 'string',
    word: 'string'
  });
}

// TODO: test
export function isWordDocument(doc: unknown): doc is WordDocument {
  return isModelsDocument(doc, isWord);
}
