'use client';

import { useRef, useState } from 'react';

import { Document } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { updateListById } from '@/lib/utils';
import { useDocuments } from '../(routes)/documents/_hooks/use-document';
import { useSWRConfig } from 'swr';

interface TitleProps {
  document: Document;
  onUpdate: (title: string) => void;
}

export const Title = ({ document, onUpdate }: TitleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(document.title || 'Untitled');
  const { data: documents } = useDocuments(document.parentDocumentId);

  const enableInput = () => {
    setTitle(document.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current?.value?.length);
    }, 0);
  };

  const disableInputAndSubmit = () => {
    setIsEditing(false);
    onUpdate(title.trim());
  };

  const { mutate } = useSWRConfig();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    const updatedList = updateListById<Document>(
      documents?.data || [],
      document.id,
      {
        ...document,
        title: event.target.value,
      }
    );
    const mutateKey = `documents${
      document.parentDocumentId
        ? `?parentDocument=${document.parentDocumentId}`
        : ''
    }`;
    mutate(
      mutateKey,
      { ...documents, data: updatedList },
      { revalidate: false, populateCache: true }
    );
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      disableInputAndSubmit();
    }
  };

  return (
    <div className='flex items-center gap-x-1'>
      {!!document.icon && <p>{document.icon}</p>}
      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={enableInput}
          onBlur={disableInputAndSubmit}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={title}
          className='h-7 px-2 focus-visible:ring-transparent'
        />
      ) : (
        <Button
          onClick={enableInput}
          variant='ghost'
          size='sm'
          className='font-normal h-auto p-1'
        >
          <span className='truncate'>{document.title}</span>
        </Button>
      )}
    </div>
  );
};

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className='h-9 w-16 rounded-md' />;
};
