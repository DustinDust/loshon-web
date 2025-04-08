import { withProps } from '@udecode/cn';
import {
  BasicMarksPlugin,
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  UnderlinePlugin,
} from '@udecode/plate-basic-marks/react';
import { PlateLeaf } from '@udecode/plate/react';
import { CodeLeaf } from '../components/codeblock';

export const basicMarksPlugin = BasicMarksPlugin.configure({
  override: {
    components: {
      [BoldPlugin.key]: withProps(PlateLeaf, {
        as: 'strong',
        className: 'font-bold',
      }),
      [ItalicPlugin.key]: withProps(PlateLeaf, {
        as: 'em',
        className: 'font-italic',
      }),
      [UnderlinePlugin.key]: withProps(PlateLeaf, {
        as: 'u',
        className: 'underline',
      }),
      [StrikethroughPlugin.key]: withProps(PlateLeaf, {
        as: 's',
        className: 'line-through',
      }),
      [SuperscriptPlugin.key]: withProps(PlateLeaf, {
        as: 'sup',
        className: 'text-sm align-super',
      }),
      [SubscriptPlugin.key]: withProps(PlateLeaf, {
        as: 'sub',
        className: 'text-sm align-sub',
      }),
      [CodePlugin.key]: CodeLeaf,
    },
  },
});
