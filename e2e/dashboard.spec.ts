import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("overview and jobs routes provide the critical operator workflow", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("dashboard-page")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Compute health at a glance" })).toBeVisible();
  await expect(page.getByTestId("metric-grid")).toContainText("GPU utilization");

  await page.getByTestId("critical-action-button").click();
  await expect(page).toHaveURL(/\/jobs$/);
  await expect(page.getByTestId("jobs-page")).toBeVisible();
  await expect(page.getByTestId("jobs-table").getByRole("row")).toHaveCount(4);
});

test("overview has a stable scoped visual", async ({ page }) => {
  await page.goto("/");
  const dashboard = page.getByTestId("dashboard-page");
  await expect(dashboard).toBeVisible();
  await expect(dashboard).toHaveScreenshot("dashboard-page.png");
});

for (const route of ["/", "/jobs"] as const) {
  test(`${route} has no automatically detectable accessibility violations`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();

    const results = await new AxeBuilder({ page }).include("main").analyze();
    expect(results.violations).toEqual([]);
  });
}
