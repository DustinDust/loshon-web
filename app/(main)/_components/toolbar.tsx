'use client';

import { ImageIcon, Smile, X } from 'lucide-react';
import TextAreaAutoSize from 'react-textarea-autosize';

import { Document, UpdateDocument } from '@/lib/types';
import { IconPicker } from './icon-picker';
import { Button } from '@/components/ui/button';
import { ElementRef, useRef, useState } from 'react';

interface ToolbarProps {
  document: Document;
  preview?: boolean;
  onUpdate: (data: UpdateDocument) => void;
  onChange: (data: UpdateDocument) => void;
}

export const Toolbar = ({
  document,
  preview = false,
  onChange,
  onUpdate,
}: ToolbarProps) => {
  const inputRef = useRef<ElementRef<'textarea'>>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(document.title);

  const enableInput = () => {
    if (preview) {
      return;
    }
    setTitle(document.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const disableInputAndUpdate = () => {
    setIsEditing(false);
    onUpdate({ title: title || 'Untitled' });
  };

  const onInput = (value: string) => {
    setTitle(value);
    onChange({ title: value || 'Untitled' });
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      disableInputAndUpdate();
    }
  };

  return (
    <div className='pl-[54px] group relative'>
      {!!document.icon && !preview && (
        <div className='flex items-center gap-x-2 group/icon pt-6'>
          <IconPicker onChange={() => {}}>
            <p className='text-6xl hover:opacity-75 transition'>
              {document.icon}
            </p>
          </IconPicker>
          <Button
            onClick={() => {}}
            className='rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs'
            variant='outline'
            size='icon'
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      )}
      {!!document.icon && preview && (
        <p className='text-6xl pt-6'>{document.icon}</p>
      )}
      <div className='opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4'>
        {!document.icon && !preview && (
          <IconPicker onChange={() => {}}>
            <Button
              className='text-muted-foreground text-xs'
              variant='outline'
              size='sm'
            >
              <Smile className='h-4 w-4 mr-2 ' />
              Add icon
            </Button>
          </IconPicker>
        )}
        {!document.coverImage && !preview && (
          <Button
            className='text-muted-foreground text-xs'
            variant='outline'
            size='sm'
          >
            <ImageIcon className='w-4 h-4 mr-2' />
            Add cover
          </Button>
        )}
      </div>
      {isEditing && !preview ? (
        <TextAreaAutoSize
          placeholder='Untitled'
          ref={inputRef}
          onBlur={disableInputAndUpdate}
          onKeyDown={onKeyDown}
          value={title}
          onChange={(e) => onInput(e.target.value)}
          className='text-5xl bg-transparent font-bold break-words outline-none text-[#3f3f3f] dark-[#cfcfcf] resize-none'
        />
      ) : (
        <div
          onClick={enableInput}
          className='pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3f3f3f] dark-[#cfcfcf]'
        >
          {document.title}
        </div>
      )}
    </div>
  );
};
