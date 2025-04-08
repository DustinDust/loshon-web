import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { CodeBlockPlugin } from '@udecode/plate-code-block/react';
import { HEADING_LEVELS } from '@udecode/plate-heading';
import { IndentListPlugin } from '@udecode/plate-indent-list/react';
import { TogglePlugin } from '@udecode/plate-toggle/react';
import { ParagraphPlugin } from '@udecode/plate/react';

import type { SlateRenderElementProps } from '@udecode/plate';

import { cn } from '@udecode/cn';
import {
  useIndentTodoListElement,
  useIndentTodoListElementState,
} from '@udecode/plate-indent-list/react';
import { useReadOnly } from '@udecode/plate/react';

import { Checkbox } from '@/components/ui/checkbox';

const TodoMarker = ({ element }: Omit<SlateRenderElementProps, 'children'>) => {
  const state = useIndentTodoListElementState({ element });
  const { checkboxProps } = useIndentTodoListElement(state);
  const readOnly = useReadOnly();

  return (
    <div contentEditable={false}>
      <Checkbox
        className={cn(
          'absolute top-1 -left-6',
          readOnly && 'pointer-events-none'
        )}
        {...checkboxProps}
      />
    </div>
  );
};

const TodoLi = (props: SlateRenderElementProps) => {
  const { children, element } = props;

  return (
    <li
      className={cn(
        'list-none',
        (element.checked as boolean) && 'text-muted-foreground line-through'
      )}
    >
      {children}
    </li>
  );
};

export const indentListPlugin = IndentListPlugin.extend({
  inject: {
    targetPlugins: [
      ParagraphPlugin.key,
      ...HEADING_LEVELS,
      BlockquotePlugin.key,
      CodeBlockPlugin.key,
      TogglePlugin.key,
    ],
  },
  options: {
    listStyleTypes: {
      todo: {
        liComponent: TodoLi,
        markerComponent: TodoMarker,
        type: 'todo',
      },
    },
  },
});
