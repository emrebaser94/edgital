import { Task } from '@serenity-js/core';
import { Click } from '@serenity-js/web';

import { NavigationBar } from '../ui/NavigationBar';

/** Click a navigation-bar entry. The <li> sits inside a react-router <Link>,
 *  so a plain click triggers client-side routing. */
export const OpenMenuEntry = (name: string) =>
  Task.where(`#actor opens "${name}" from the navigation bar`,
    Click.on(NavigationBar.link(name)),
  );
