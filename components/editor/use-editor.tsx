'use client';

import { AnyPluginConfig, WithAnyKey } from '@udecode/plate';
import { DOMHandlers, OnChange, usePlateEditor } from '@udecode/plate/react';
import { NodeIdPlugin } from '@udecode/plate-node-id';
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
    ],
  });
  return editor;
};
