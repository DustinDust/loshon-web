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

export function formatHighlightedHits(content: string, padDot = false): string {
  const matchedLine = content.split('\n').filter((line) => {
    return line.indexOf('<mark>') !== -1 && line.indexOf('</mark>') !== -1;
  });
  if (matchedLine.length === 0) {
    if (padDot) {
      return content.substring(0, 50).trim() + '...';
    } else {
      return content.substring(0, 50);
    }
  }
  const formatted = matchedLine[0]
    .replace(/<mark>/g, '<span class="font-bold text-slate">')
    .replace(/<\/mark>/g, '</span>');

  return formatted;
}
