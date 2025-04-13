'use client';

import { createPlatePlugin } from '@udecode/plate/react';

import { FloatingToolbar } from '../components/floating-toolbar';
// import { FloatingToolbarButtons } from '../components/floating-toolbar-buttons';

export const floatingToolbarPlugin = createPlatePlugin({
  key: 'floating-toolbar',
  render: {
    afterEditable: () => (
      <FloatingToolbar>
        <div>hi</div>
      </FloatingToolbar>
    ),
  },
});
