'use client';

import { useRef, useState } from 'react';

import { Document } from '@/lib/types';
import { useUpdateDocument } from '../(routes)/documents/_hooks/use-document';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TitleProps {
  initialData: Document;
}

export const Title = ({ initialData }: TitleProps) => {
  const { trigger: triggerUpdate } = useUpdateDocument(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(initialData.title || 'Untitled');

  const enableInput = () => {
    setTitle(initialData.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current?.value?.length);
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    triggerUpdate(
      {
        body: JSON.stringify({
          title: event.target.value || 'Untitled',
        }),
      },
      {
        onSuccess: (dat) => {
          console.log(dat);
        },
        onError: (err) => {
          console.log(err);
        },
      }
    );
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      disableInput();
    }
  };

  return (
    <div className='flex items-center gap-x-1'>
      {!!initialData.icon && <p>{initialData.icon}</p>}
      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={enableInput}
          onBlur={disableInput}
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
          <span className='truncate'>{initialData.title}</span>
        </Button>
      )}
    </div>
  );
};