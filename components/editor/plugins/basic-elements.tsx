import { createLowlight, all } from 'lowlight';
import { BasicElementsPlugin } from '@udecode/plate-basic-elements/react';
import { HeadingPlugin } from '@udecode/plate-heading/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { withProps } from '@udecode/cn';
import { ParagraphPlugin, PlateElement } from '@udecode/plate/react';
import { CodeBlockPlugin } from '@udecode/plate-code-block/react';

import { CodeBlockElement } from '../components/codeblock';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { BlockquoteElement } from '../components/blockquote';

const lowlight = createLowlight(all);

export const basicElementsPlugin = BasicElementsPlugin.configurePlugin(
  CodeBlockPlugin,
  {
    options: {
      lowlight,
    },
    override: {
      components: {
        [CodeBlockPlugin.key]: CodeBlockElement,
      },
    },
  }
)
  .configurePlugin(HeadingPlugin, {
    options: {
      levels: [1, 2, 3, 4],
    },
    override: {
      components: {
        [HEADING_KEYS.h1]: withProps(PlateElement, {
          as: 'h1',
          className: 'mt-[1.6em] pb-1 font-heading text-4xl font-bold',
        }),
        [HEADING_KEYS.h2]: withProps(PlateElement, {
          as: 'h2',
          className:
            'mt-[1.4em] pb-px font-heading text-2xl font-semibold tracking-tight',
        }),
        [HEADING_KEYS.h3]: withProps(PlateElement, {
          as: 'h3',
          className:
            'mt-[1em] pb-px font-heading text-xl font-semibold tracking-tight',
        }),
        [HEADING_KEYS.h4]: withProps(PlateElement, {
          as: 'h4',
          className:
            'mt-[0.75em] font-heading text-lg font-semibold tracking-tight',
        }),
      },
    },
  })
  .configurePlugin(BlockquotePlugin, {
    override: {
      components: {
        [BlockquotePlugin.key]: BlockquoteElement,
      },
    },
  })
  .configurePlugin(ParagraphPlugin, {
    override: {
      components: {
        [ParagraphPlugin.key]: withProps(PlateElement, {
          as: 'p',
          className: 'my-2 text-base leading-7',
        }),
      },
    },
  });
