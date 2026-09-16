import { By, PageElement, PageElements } from '@serenity-js/web';

export class RoadMap {
  /** Every road is rendered by Leaflet as an interactive SVG <path>. */
  static roads = () =>
    PageElements.located(By.css('path.leaflet-interactive')).describedAs('roads on the map');

  static road = (index: number) =>
    RoadMap.roads().nth(index).describedAs(`road #${index}`);

  static legend = () =>
    PageElement.located(By.css('.legend')).describedAs('the map legend');

  static evaluationDropdown = () =>
    PageElement.located(By.css('select')).describedAs('the evaluation dropdown');

  /** The Leaflet tooltip that opens while a road is hovered. */
  static tooltip = () =>
    PageElement.located(By.css('.leaflet-tooltip')).describedAs('the road tooltip');
}
