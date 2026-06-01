import { expect, test } from '@playwright/test';

// E2E coverage for issue #1359 — UI-controllable polling interval.
// Requires the docker-compose stack to be up on http://localhost with
// AUTH_TOKEN=dev-token. Run from console/ui:
//   AUTH_TOKEN=dev-token docker compose -f ../docker-compose.yml up -d
//   npx playwright test
//
// When iterating on console images locally (especially on Macs with both
// Docker Desktop and OrbStack installed), always pass `--load` to docker
// build, and confirm a single active docker context with `docker context ls`.
// Without --load, multi-arch buildx output can skip loading into the local
// daemon, leaving `docker run` to silently reuse a stale tagged image —
// tests then run against the previous build.

const TOKEN = 'dev-token';

// Locate the refresh-interval dropdown trigger (Button with aria-label set in
// RefreshIntervalSelect). The trigger renders its current value as its text
// content, so toContainText still works on it.
const intervalCombobox = (page: import('@playwright/test').Page) =>
  page.getByRole('button', { name: 'Refresh interval' });

const visit = async (page: import('@playwright/test').Page, path: string) => {
  // The init script runs on every page load (incl. reloads). We always re-set
  // the auth token, but we only strip pollingInterval.* keys once per test so
  // that reload-persistence tests can actually verify rehydration.
  await page.addInitScript((token: string) => {
    window.localStorage.setItem('token', token);
    if (!window.sessionStorage.getItem('e2eInitialized')) {
      for (const key of Object.keys(window.localStorage)) {
        if (key.startsWith('pollingInterval.')) window.localStorage.removeItem(key);
      }
      window.sessionStorage.setItem('e2eInitialized', '1');
    }
  }, TOKEN);
  await page.goto(path);
};

test.describe('refresh interval dropdown', () => {
  test('Clusters page: every dropdown option has a translated label (no raw i18n keys leak)', async ({
    page,
  }) => {
    await visit(page, '/clusters');
    await intervalCombobox(page).click();
    const optionTexts = await page.getByRole('menuitem').allTextContents();
    expect(optionTexts.length).toBeGreaterThan(0);
    for (const txt of optionTexts) {
      expect(txt, `option "${txt}" should not be a raw i18n key`).not.toMatch(
        /^refreshInterval\./,
      );
    }
  });

  test('Clusters page: dropdown is present and shows env default (1m)', async ({ page }) => {
    await visit(page, '/clusters');
    await expect(intervalCombobox(page)).toContainText('1m');
  });

  test('Clusters page: changing the interval persists to localStorage', async ({ page }) => {
    await visit(page, '/clusters');
    await intervalCombobox(page).click();
    await page.getByRole('menuitem', { name: '30s', exact: true }).click();

    const stored = await page.evaluate(() => window.localStorage.getItem('pollingInterval.clusters'));
    expect(stored).toBe('30000');
    await expect(intervalCombobox(page)).toContainText('30s');
  });

  test('Clusters page: selection survives reload', async ({ page }) => {
    await visit(page, '/clusters');
    await intervalCombobox(page).click();
    await page.getByRole('menuitem', { name: '15m', exact: true }).click();

    await page.reload();
    const stored = await page.evaluate(() => window.localStorage.getItem('pollingInterval.clusters'));
    expect(stored).toBe('900000');
    await expect(intervalCombobox(page)).toContainText('15m');
  });

  test('Clusters page: setting Off stops auto-polling but manual refresh still fires', async ({ page }) => {
    await visit(page, '/clusters');

    const requests: number[] = [];
    page.on('request', (req) => {
      if (req.method() === 'GET' && /\/api\/v1\/clusters(\?|$)/.test(req.url())) {
        requests.push(Date.now());
      }
    });

    await intervalCombobox(page).click();
    await page.getByRole('menuitem', { name: 'Off', exact: true }).click();
    expect(await page.evaluate(() => window.localStorage.getItem('pollingInterval.clusters'))).toBe('0');

    // Baseline after the dropdown change has settled.
    await page.waitForTimeout(1500);
    const baseline = requests.length;

    // Wait ~7s — well below the previous 60s default. No auto-polling should fire.
    await page.waitForTimeout(7_000);
    expect(requests.length).toBe(baseline);

    // Manual refresh should still trigger a request.
    await page.getByRole('button', { name: 'Refresh', exact: true }).click();
    await page.waitForTimeout(500);
    expect(requests.length).toBeGreaterThan(baseline);
  });

  test('Clusters page: 5s interval polls approximately every 5s', async ({ page }) => {
    await visit(page, '/clusters');

    const requests: number[] = [];
    page.on('request', (req) => {
      if (req.method() === 'GET' && /\/api\/v1\/clusters(\?|$)/.test(req.url())) {
        requests.push(Date.now());
      }
    });

    await intervalCombobox(page).click();
    await page.getByRole('menuitem', { name: '5s', exact: true }).click();
    await page.waitForTimeout(500); // let initial settle

    const before = requests.length;
    await page.waitForTimeout(13_000);
    const after = requests.length;
    // 13s / 5s = 2.6 intervals. Allow 1..4.
    expect(after - before).toBeGreaterThanOrEqual(1);
    expect(after - before).toBeLessThanOrEqual(4);
  });

  test('Operations page: dropdown is present with its own default', async ({ page }) => {
    // Set Clusters interval to 5s first.
    await visit(page, '/clusters');
    await intervalCombobox(page).click();
    await page.getByRole('menuitem', { name: '5s', exact: true }).click();
    expect(await page.evaluate(() => window.localStorage.getItem('pollingInterval.clusters'))).toBe('5000');

    // Operations should be independent (its localStorage key not yet written).
    await page.goto('/operations');
    await expect(intervalCombobox(page)).toBeVisible();
    await expect(intervalCombobox(page)).toContainText('1m');
    const opsStored = await page.evaluate(() => window.localStorage.getItem('pollingInterval.operations'));
    expect(opsStored).toBeNull();
  });

  // These two tests require a cluster + operation present in the console DB.
  // Skipped automatically when none exist.
  test('Cluster Overview page: dropdown is present and isolated', async ({ page, request }) => {
    const list = await request.get('/api/v1/clusters?project_id=1', {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    const json = await list.json();
    const clusterId = json?.data?.[0]?.id;
    test.skip(!clusterId, 'No cluster present — skipping Cluster Overview test');

    await visit(page, `/clusters/${clusterId}/overview`);
    await expect(intervalCombobox(page)).toBeVisible();
    await expect(intervalCombobox(page)).toContainText('1m');

    await intervalCombobox(page).click();
    await page.getByRole('menuitem', { name: '30s', exact: true }).click();
    expect(
      await page.evaluate(() => window.localStorage.getItem('pollingInterval.clusterOverview')),
    ).toBe('30000');
    // Other contexts should be untouched.
    expect(
      await page.evaluate(() => window.localStorage.getItem('pollingInterval.clusters')),
    ).toBeNull();
  });

  test('Operation Log page: dropdown is present and isolated', async ({ page, request }) => {
    const start = '2020-01-01T00:00:00Z';
    const end = '2099-01-01T00:00:00Z';
    const list = await request.get(
      `/api/v1/operations?project_id=1&start_date=${start}&end_date=${end}`,
      { headers: { Authorization: `Bearer ${TOKEN}` } },
    );
    let operationId: number | undefined;
    if (list.ok()) {
      const json = await list.json();
      operationId = json?.data?.[0]?.id;
    }
    test.skip(!operationId, 'No operation present — skipping Operation Log test');

    await visit(page, `/operations/${operationId}/log`);
    await expect(intervalCombobox(page)).toBeVisible();
    // Default for operation logs is 10s.
    await expect(intervalCombobox(page)).toContainText('10s');

    await intervalCombobox(page).click();
    await page.getByRole('menuitem', { name: '5s', exact: true }).click();
    expect(
      await page.evaluate(() => window.localStorage.getItem('pollingInterval.operationLogs')),
    ).toBe('5000');
  });
});
