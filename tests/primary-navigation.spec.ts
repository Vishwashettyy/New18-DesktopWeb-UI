import { test, expect } from '../fixtures/test';
import { primaryNavigationItems } from '../pages/PrimaryNavigationPage';

test.describe('Primary navigation links open their matching sections', () => {
  for (const item of primaryNavigationItems) {
    test(`${item.label} opens its matching section`, async ({ page, primaryNavigationPage }) => {
      await primaryNavigationPage.goto(item.label === 'Home' ? '/india/' : '/');

      const link = primaryNavigationPage.getLink(item.label);
      await expect(link).toBeVisible();

      const href = await link.getAttribute('href');
      expect(href, `${item.label} navigation link should have a destination`).not.toBeNull();
      if (!href) {
        throw new Error(`${item.label} navigation link is missing its href`);
      }

      const linkUrl = new URL(href, page.url());
      const expectedUrl = new URL(item.url);
      expect(linkUrl.origin).toBe(expectedUrl.origin);
      expect(normalizePath(linkUrl.pathname)).toBe(normalizePath(expectedUrl.pathname));

      const destinationPage = await primaryNavigationPage.openSection(item);
      try {
        const destinationUrl = new URL(destinationPage.url());
        expect(destinationUrl.origin).toBe(expectedUrl.origin);
        expect(normalizePath(destinationUrl.pathname)).toBe(normalizePath(expectedUrl.pathname));
      } finally {
        if (destinationPage !== page) {
          await destinationPage.close();
        }
      }
    });
  }
});

function normalizePath(path: string): string {
  return path === '/' ? path : path.replace(/\/+$/, '');
}
