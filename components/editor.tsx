'use client';

import { BlockNoteEditor, PartialBlock } from '@blocknote/core';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import { useTheme } from 'next-themes';
import { useDebounceCallback } from 'usehooks-ts';

import { useLocalDocument } from '@/hooks/documents/use-local-document';
import { toast } from 'sonner';

import '@blocknote/mantine/style.css';
import { useFileUpload } from '@/hooks/use-file-upload';

interface EditorProps {
  onChange: (content: string, mdContent: string) => void;
  editable?: boolean;
}

const Editor = ({ onChange, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { currentDocument } = useLocalDocument();
  const [upload] = useFileUpload();

  const handleUpload = async (file: File) => {
    try {
      const path = await upload(file);
      if (!path || path === '') {
        throw new Error('Failed to upload image');
      }
      return path;
    } catch (e) {
      console.log(e);
      toast.error('Error uploading file, please try again later.');
      return '';
    }
  };

  const editor: BlockNoteEditor = useCreateBlockNote(
    {
      initialContent: currentDocument?.content
        ? (JSON.parse(currentDocument.content) as PartialBlock[])
        : undefined,
      uploadFile: handleUpload,
    },
    [currentDocument?.id]
  );

  const debouncedContentChange = useDebounceCallback(
    (content: string, mdContent: string) => {
      onChange(content, mdContent);
    },
    1000
  );

  const onContentChange = async () => {
    const blocks = editor.document;
    const mdContent = await editor.blocksToMarkdownLossy(blocks);
    debouncedContentChange(JSON.stringify(blocks), mdContent);
  };

  return (
    <div>
      <BlockNoteView
        editor={editor}
        editable={editable}
        onChange={onContentChange}
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      ></BlockNoteView>
    </div>
  );
};

export default Editor;
