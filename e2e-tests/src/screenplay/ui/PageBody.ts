import { By, PageElement } from '@serenity-js/web';

/** The whole page body — used for coarse "page shows X" text assertions. */
export const PageBody = () => PageElement.located(By.css('body')).describedAs('the page');
