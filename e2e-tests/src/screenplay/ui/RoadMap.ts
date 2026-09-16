import { matches } from '@serenity-js/assertions';
import { By, PageElement, PageElements, Text } from '@serenity-js/web';

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

  /** Every Leaflet tooltip currently open on the map. */
  static tooltips = () =>
    PageElements.located(By.css('.leaflet-tooltip')).describedAs('the road tooltips');

  /** The tooltip of one road, picked by its "Road ID" line. Another road's
   *  tooltip can still be open (one whose mouseout never fired), so a plain
   *  `.leaflet-tooltip` locator would match several elements. `\b` keeps
   *  road 1317 from also matching road 13170. */
  static tooltipOf = (fid: number) =>
    RoadMap.tooltips()
      .where(Text, matches(new RegExp(`Road ID: ${fid}\\b`)))
      .first()
      .describedAs(`the tooltip of road ${fid}`);
}
