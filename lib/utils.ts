import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Document } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function updateListById<T extends { id: string }>(
  list: T[],
  id: string,
  newData: T
): T[] {
  const index = list.findIndex((item) => item.id === id);
  console.log(index);
  if (index < 0) {
    return list;
  }
  list[index] = newData;
  return [
    ...list.slice(0, index),
    newData,
    ...list.slice(index + 1, list.length),
  ];
}

export function getMutateKeyByDocument(
  document: Pick<Document, 'id' | 'parentDocumentId'>
): string {
  return `documents${
    document.parentDocumentId
      ? `?parentDocument=${document.parentDocumentId}`
      : ''
  }`;
}
