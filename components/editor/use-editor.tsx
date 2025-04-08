'use client';

import { AnyPluginConfig, WithAnyKey } from '@udecode/plate';
import { DOMHandlers, OnChange, usePlateEditor } from '@udecode/plate/react';
import { NodeIdPlugin } from '@udecode/plate-node-id';
import { basicElementsPlugin } from './plugins/basic-elements';
import { autoformatPlugin } from './plugins/autoformat';
import { resetBlockTypePlugin } from './plugins/reset-node';
import { basicMarksPlugin } from './plugins/basic-marks';

interface IUseEditor {
  value?: any;
  handlers: DOMHandlers<WithAnyKey<AnyPluginConfig>> & {
    onChange: OnChange<WithAnyKey<AnyPluginConfig>>;
  };
}

export const useEditor = ({ value, handlers }: IUseEditor) => {
  const editor = usePlateEditor({
    value: value,
    handlers: {
      ...handlers,
    },
    plugins: [
      NodeIdPlugin,

      basicMarksPlugin,
      basicElementsPlugin,
      autoformatPlugin,
      resetBlockTypePlugin,
    ],
  });
  return editor;
};
