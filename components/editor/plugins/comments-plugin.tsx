'use client';

import { CommentsPlugin } from '@udecode/plate-comments/react';

import { CommentsPopover } from '@/components/plate-ui/comments-popover';

export const commentsPlugin = CommentsPlugin.configure({
  options: {},
  render: { afterEditable: () => <CommentsPopover /> },
});
