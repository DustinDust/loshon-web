'use client';

import { useRef, useState } from 'react';

import { Document, UpdateDocument } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface TitleProps {
  document: Document;
  onUpdate: (title: string) => void;
  onChange: (data: UpdateDocument) => void;
}

export const Title = ({ document, onUpdate, onChange }: TitleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(document.title || 'Untitled');

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
    onUpdate(title.trim() || 'Untitled');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    onChange({ title: event.target.value || 'Untitled' });
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
          onChange={handleChange}
          onKeyDown={onKeyDown}
          value={title}
          className='h-7 px-2 focus-visible:ring-transparent'
          placeholder='Untitled'
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
