import {DatePlugin} from '@udecode/plate-date/react';
import { DateElement } from '../components/date';

export const datePlugin = DatePlugin.configure({
    override: {
        components: {
            [DatePlugin.key]: DateElement
        }
    }
})
