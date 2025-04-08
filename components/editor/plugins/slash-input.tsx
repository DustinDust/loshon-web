import { CodeBlockPlugin } from '@udecode/plate-code-block/react';
import {
  SlashInputPlugin,
  SlashPlugin,
} from '@udecode/plate-slash-command/react';
import { SlashInputElement } from '../components/slash-input';

export const slashCommand = SlashPlugin.extend({
  options: {
    triggerQuery(editor) {
      return !editor.api.some({
        match: { type: editor.getType(CodeBlockPlugin) },
      });
    },
  },
}).configure({
  override: {
    components: {
      [SlashInputPlugin.key]: SlashInputElement,
    },
  },
});
