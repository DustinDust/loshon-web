import { IndentPlugin } from '@udecode/plate-indent/react';
import { HEADING_LEVELS } from '@udecode/plate-heading';
import { ParagraphPlugin } from '@udecode/plate/react';
import { CodeBlockPlugin } from '@udecode/plate-code-block/react';
import { TogglePlugin } from '@udecode/plate-toggle/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';

export const indentPlugin = IndentPlugin.extend({
  inject: {
    targetPlugins: [
      ParagraphPlugin.key,
      ...HEADING_LEVELS,
      CodeBlockPlugin.key,
      TogglePlugin.key,
      BlockquotePlugin.key,
    ],
  },
});
