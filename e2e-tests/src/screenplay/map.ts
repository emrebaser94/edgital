import { Answerable, Duration, Interaction, Question, Task, Wait } from '@serenity-js/core';
import { BrowseTheWeb, By, isVisible, Navigate, PageElement, PageElements, Select, Text } from '@serenity-js/web';

/**
 * The `eemi` grade → colour mapping from Requirement 3, expressed as the
 * `rgb(...)` strings the browser actually computes for the SVG `stroke`.
 *   1–1.49 blue | 1.5–2.49 light-green | 2.5–3.49 dark-green
 *   3.5–4.49 yellow | 4.5–5.00 red
 */
export const GRADE_PALETTE: readonly string[] = [
  'rgb(0, 0, 255)',     // blue
  'rgb(144, 238, 144)', // lightgreen
  'rgb(0, 100, 0)',     // darkgreen
  'rgb(255, 255, 0)',   // yellow
  'rgb(255, 0, 0)',     // red
];

export class RoadMap {
  /** Every road is rendered by Leaflet as an interactive SVG <path>. */
  static roads = () =>
    PageElements.located(By.css('path.leaflet-interactive')).describedAs('roads on the map');

  static legend = () =>
    PageElement.located(By.css('.legend')).describedAs('the map legend');

  static evaluationDropdown = () =>
    PageElement.located(By.css('select')).describedAs('the evaluation dropdown');

  static evaluationOptions = () =>
    PageElements.located(By.css('select option')).describedAs('the evaluation options');

  /** Load the map page and wait until the road geometry has rendered. */
  static isLoaded = () =>
    Task.where('#actor opens the Road Overview map',
      Navigate.to('/'),
      Wait.upTo(Duration.ofSeconds(20)).until(RoadMap.roads().first(), isVisible()),
    );

  /**
   * Click a road on the map.
   *
   * Leaflet paths fail Playwright's default actionability check (the element
   * under the click point is often a neighbouring path or the tile layer), so
   * we drop to the native Playwright API and force the click — exactly the
   * behaviour a user produces by clicking the line.
   */
  static clickRoad = (index: number) =>
    Interaction.where(`#actor clicks road #${index} on the map`, async (actor) => {
      const page: any = await BrowseTheWeb.as(actor).currentPage();
      const native = await page.nativePage();
      await native.locator('path.leaflet-interactive').nth(index).click({ force: true });
    });

  static selectEvaluation = (label: string) =>
    Task.where(`#actor selects the "${label}" evaluation`,
      Select.option(label).from(RoadMap.evaluationDropdown()),
    );
}

/**
 * The set of distinct stroke colours currently used by the first `limit`
 * roads that fall OUTSIDE the documented grade palette. Empty means every
 * sampled road is coloured correctly.
 */
export const roadColoursOutsidePalette = (limit: number): Question<Promise<string[]>> =>
  Question.about(`road colours outside the grade palette (first ${limit})`, async (actor) => {
    const page: any = await BrowseTheWeb.as(actor).currentPage();
    const native = await page.nativePage();
    const colours: string[] = await native
      .locator('path.leaflet-interactive')
      .evaluateAll(
        (els: Element[], n: number) =>
          Array.from(new Set(els.slice(0, n).map((e) => getComputedStyle(e).stroke))),
        limit,
      );
    return colours.filter((c) => !GRADE_PALETTE.includes(c));
  });

/** The visible option labels of the evaluation dropdown (e.g. GW, TWRIO …). */
export const evaluationOptionLabels = (): Question<Promise<string[]>> =>
  Text.ofAll(RoadMap.evaluationOptions());

export const legendText = (): Answerable<string> => Text.of(RoadMap.legend());
