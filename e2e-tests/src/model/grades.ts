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

/** The palette colour Requirement 3 prescribes for a grade (same buckets as the legend). */
export const colourForGrade = (grade: number): string =>
  GRADE_PALETTE[grade < 1.5 ? 0 : grade < 2.5 ? 1 : grade < 3.5 ? 2 : grade < 4.5 ? 3 : 4];
