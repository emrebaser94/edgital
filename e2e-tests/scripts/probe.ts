/* eslint-disable no-console */
/**
 * Throwaway exploration script (NOT part of the test suite).
 * Learns the real DOM of the running SUT so the Screenplay layer can use
 * reliable selectors — especially: which click method on a Leaflet SVG path
 * actually opens the Todo modal.
 *
 * Run with: npm run probe   (SUT must be up)
 */
import { chromium, Page } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:5173';

async function modalVisible(page: Page): Promise<boolean> {
  return page.locator('text=Todo Details').isVisible().catch(() => false);
}

async function closeModal(page: Page) {
  await page.locator('button:has-text("Close")').click().catch(() => {});
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const out: Record<string, unknown> = {};

  // --- MAP PAGE ---
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForSelector('path.leaflet-interactive', { timeout: 20_000 });
  const roads = page.locator('path.leaflet-interactive');
  out.roadCount = await roads.count();

  // stroke representation of first road
  const first = roads.first();
  out.stroke_attr = await first.getAttribute('stroke');
  out.stroke_style = await first.evaluate((el) => getComputedStyle(el).stroke);

  // legend text
  out.legend = await page.locator('.legend').innerText().catch(() => '(no .legend)');

  // dropdown options
  out.dropdownOptions = await page.locator('select option').allInnerTexts();

  // --- CLICK METHOD DISCOVERY ---
  const methods: Record<string, boolean> = {};

  // method A: plain click on first road
  await first.click({ timeout: 3000 }).catch(() => {});
  methods.plainClick = await modalVisible(page);
  if (methods.plainClick) await closeModal(page);

  // method B: force click
  if (!methods.plainClick) {
    await first.click({ force: true, timeout: 3000 }).catch(() => {});
    methods.forceClick = await modalVisible(page);
    if (methods.forceClick) await closeModal(page);
  }

  // method C: dispatchEvent('click')
  if (!methods.plainClick && !methods.forceClick) {
    await first.dispatchEvent('click').catch(() => {});
    methods.dispatchEvent = await modalVisible(page);
    if (methods.dispatchEvent) await closeModal(page);
  }

  out.clickMethods = methods;

  // --- MODAL FIELDS (open via whichever worked, fallback dispatch) ---
  if (!(await modalVisible(page))) {
    await first.dispatchEvent('click').catch(() => {});
  }
  if (await modalVisible(page)) {
    out.modal = {
      title_placeholder: await page.locator('input[placeholder="Title"]').count(),
      title_disabled: await page.locator('input[placeholder="Title"]').isDisabled().catch(() => null),
      title_value: await page.locator('input[placeholder="Title"]').inputValue().catch(() => null),
      roadFid_value: await page.locator('input[placeholder="Road Fid"]').inputValue().catch(() => null),
      roadFid_disabled: await page.locator('input[placeholder="Road Fid"]').isDisabled().catch(() => null),
      saveButtonText: await page.locator('.modal-footer button').last().innerText().catch(() => null),
    };
    await closeModal(page);
  }

  // --- NAVIGATION ---
  const nav: Record<string, unknown> = {};
  for (const link of ['Overview', 'Statistics', 'Todos', 'Roads']) {
    await page.locator(`.header li:has-text("${link}")`).click().catch(() => {});
    await page.waitForTimeout(800);
    nav[link] = {
      url: page.url(),
      h2: await page.locator('h2').allInnerTexts().catch(() => []),
      tableHeaders: await page.locator('th').allInnerTexts().catch(() => []),
    };
  }
  out.navigation = nav;

  // --- STATISTICS PAGE ---
  await page.locator('.header li:has-text("Statistics")').click().catch(() => {});
  await page.waitForTimeout(1000);
  out.statistics = {
    canvas: await page.locator('canvas#statisticsChart').count(),
    rows: await page.locator('table tr').allInnerTexts().catch(() => []),
  };

  console.log(JSON.stringify(out, null, 2));
  await browser.close();
})();
