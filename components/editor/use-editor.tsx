'use client';

import { AnyPluginConfig, WithAnyKey } from '@udecode/plate';
import { DOMHandlers, OnChange, usePlateEditor } from '@udecode/plate/react';
import { NodeIdPlugin } from '@udecode/plate-node-id';
import { useMemo } from 'react';

import {
  autoformatPlugin,
  basicElementsPlugin,
  basicMarksPlugin,
  exitBreakPlugin,
  indentPlugin,
  resetBlockTypePlugin,
  slashCommand,
  softBreakPlugin,
} from './plugins';
import { indentListPlugin } from './plugins/indent-list';
import { blockSelectionPlugins } from './plugins/block-selection';
import { floatingToolbarPlugin } from './plugins/floating-toolbar';

interface IUseEditor {
  value?: any;
  handlers: DOMHandlers<WithAnyKey<AnyPluginConfig>> & {
    onChange: OnChange<WithAnyKey<AnyPluginConfig>>;
  };
  readonly?: boolean;
}

export const useEditor = ({
  value,
  handlers,
  readonly = false,
}: IUseEditor) => {
  const editor = usePlateEditor({
    value: value,
    handlers: {
      ...handlers,
      onKeyDown: (e) => {
        if (e.event.key === 'backspace') {
          console.log(e.editor.chidren);
        }
      },
    },
    plugins: [
      NodeIdPlugin, // no config

      // Basic text editor
      basicMarksPlugin,
      basicElementsPlugin,
      autoformatPlugin,
      resetBlockTypePlugin,
      exitBreakPlugin,
      softBreakPlugin,
      indentPlugin,
      indentListPlugin,

      // functionality
      slashCommand,
      ...blockSelectionPlugins,
      floatingToolbarPlugin,
    ],
  });
  const editorInstance = useMemo(() => {
    return editor;
  }, [editor]);

  return editorInstance;
};
