'use client';

import {
  BlockMenuPlugin,
  BlockSelectionPlugin,
  CursorOverlayPlugin,
} from '@udecode/plate-selection/react';
import { BlockSelection } from '../components/block-selection';
import { CursorOverlay } from '../components/cursor-overlay';
import { BlockContextMenu } from '../components/block-context-menu';

export const blockSelectionPlugins = [
  BlockSelectionPlugin.configure(({ editor }) => ({
    options: {
      enableContextMenu: true,
      isSelectable: (element, path) => {
        return (
          !['code_line', 'column', 'td'].includes(element.type) &&
          !editor.api.block({ above: true, at: path, match: { type: 'tr' } })
        );
      },
    },
    render: {
      belowRootNodes: (props) => {
        if (!props.className?.includes('slate-selectable')) return null;

        return <BlockSelection />;
      },
    },
  })),
  CursorOverlayPlugin.configure({
    render: { afterEditable: () => <CursorOverlay /> },
  }),
  BlockMenuPlugin.configure({
    render: { aboveEditable: BlockContextMenu },
  }),
];

export const blockSelectionReadOnlyPlugin = BlockSelectionPlugin.configure({
  api: {},
  extendEditor: null,
  handlers: {},
  options: {},
  render: {},
  useHooks: null,
});
