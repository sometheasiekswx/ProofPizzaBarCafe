import { expect, test } from "@playwright/test";
import menu from "../src/data/menu.json";

test("page loads without errors, broken assets or overflowing the viewport", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("response", response => { if (response.status() >= 400 && response.url().startsWith("http://127.0.0.1")) errors.push(response.url()); });
  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("A little Naples.");
  for (const width of [320, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  expect(await page.locator("img").evaluateAll(images => images.filter(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth === 0).length)).toBe(0);
  expect(errors).toEqual([]);
});

test("all menu categories show the expected items and both currencies", async ({ page }) => {
  await page.goto("./#menu");
  for (const category of ["Pizza", "Small plates", "Cocktails", "Wine", "Coffee & more"]) {
    const button = page.getByRole("button", { name: new RegExp(category) });
    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "true");
    const items = menu.items.filter(item => item.category === category);
    await expect(page.locator(".menu-item")).toHaveCount(items.length);
    if (items.length) {
      await expect(page.locator(".menu-item").first()).toContainText("$");
      await expect(page.locator(".menu-item").first()).toContainText("៛");
    } else await expect(page.locator(".menu-empty")).toBeVisible();
  }
});

test("navigation and contact links work", async ({ page, isMobile }) => {
  await page.goto("./");
  if (isMobile) {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(page.getByRole("navigation")).toBeVisible();
  }
  await page.getByRole("navigation").getByRole("link", { name: "The menu" }).click();
  await expect(page).toHaveURL(/#menu$/);
  if (isMobile) await expect(page.getByRole("navigation")).not.toBeVisible();
  await expect(page.getByRole("link", { name: "+855 12 345 678" })).toHaveAttribute("href", "tel:+85512345678");
  await expect(page.getByRole("link", { name: "Get directions" })).toHaveAttribute("href", "https://maps.app.goo.gl/fP6T5GmEshLWcUf78");
});

test("keyboard controls and reduced motion remain usable", async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  if (isMobile) {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("navigation").getByRole("link", { name: "Our story" }).focus();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Open navigation" })).toBeFocused();
    await expect(page.getByRole("navigation")).not.toBeVisible();
  }
  const cocktails = page.getByRole("button", { name: /Cocktails/ });
  await cocktails.focus();
  await page.keyboard.press("Enter");
  await expect(cocktails).toHaveAttribute("aria-pressed", "true");
  expect(await page.locator("html").evaluate(element => getComputedStyle(element).scrollBehavior)).toBe("auto");
  expect(await page.locator(".hero-photo img").evaluate(element => getComputedStyle(element).transitionDuration)).toBe("0s");
});
