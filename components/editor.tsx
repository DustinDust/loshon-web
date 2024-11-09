'use client';

import { BlockNoteEditor, PartialBlock } from '@blocknote/core';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import { useTheme } from 'next-themes';
import { useDebounceCallback } from 'usehooks-ts';

import { useCurrentDocument } from '@/hooks/use-current-document';
import { useEdgeStore } from '@/lib/edgestore';
import { toast } from 'sonner';

import '@blocknote/mantine/style.css';

interface EditorProps {
  onChange: (value: string) => void;
  editable?: boolean;
}

const Editor = ({ onChange, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { currentDocument } = useCurrentDocument();
  const { edgestore } = useEdgeStore();

  const handleUpload = async (file: File) => {
    try {
      const resp = await edgestore.publicFiles.upload({ file });
      return resp.url;
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

  const debouncedContentChange = useDebounceCallback((blocks) => {
    onChange(JSON.stringify(blocks));
  }, 1000);

  const onContentChange = () => {
    const blocks = editor.document;
    debouncedContentChange(blocks);
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
