import { Text } from '@serenity-js/web';

import { PageBody } from '../ui/PageBody';

/** The text of the whole page — for coarse "page shows X" assertions. */
export const PageText = () => Text.of(PageBody());
