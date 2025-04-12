'use client';

import {
  Plate,
  PlateContent,
  useEditorContainerRef,
  useEditorRef,
} from '@udecode/plate/react';
import React from 'react';

import { useEditor } from './use-editor';
import { cn } from '@/lib/utils';

const plateContentCN = cn(
  'group/editor',
  'relative w-full cursor-text overflow-x-hidden break-words whitespace-pre-wrap select-text',
  'rounded-md ring-offset-background focus-visible:outline-none',
  'placeholder:text-muted-foreground/80 **:data-slate-placeholder:top-[auto_!important] **:data-slate-placeholder:text-muted-foreground/80 **:data-slate-placeholder:opacity-100!',
  '[&_strong]:font-bold',
  'size-full px-16 pt-4 pb-72 text-base sm:px-[max(64px,calc(50%-350px))]'
);

export const PlateEditor = () => {
  const editor = useEditor({
    handlers: {
      onChange: (e) => {
        console.log(e.value);
      },
    },
  });

  return (
    <Plate editor={editor}>
      <EditorContainer className='relative w-full cursor-text overflow-y-auto caret-primary select-text selection:bg-brand/25 focus-visible:outline-none [&_.slate-selection-area]:z-50 [&_.slate-selection-area]:border [&_.slate-selection-area]:border-brand/25 [&_.slate-selection-area]:bg-brand/15 h-full ignore-click-outside/toolbar'>
        <PlateContent className={plateContentCN} placeholder='Type..' />
      </EditorContainer>
    </Plate>
  );
};

export const EditorContainer = (
  props: React.HTMLAttributes<HTMLDivElement>
) => {
  const editor = useEditorRef();
  const containerRef =
    useEditorContainerRef() as React.RefObject<HTMLDivElement>;

  return <div id={editor.uid} ref={containerRef} {...props} />;
};
