import { test, expect } from '../fixtures/test';
import {
  footerInformationItems,
  footerNavigationItems,
} from '../pages/FooterPage';

test.describe('News18 footer functionality', () => {
  test('shows the main footer groups and corporate links', async ({ footerPage }) => {
    await footerPage.gotoHome();
    await footerPage.scrollIntoView();

    await expect(footerPage.footer).toBeVisible();
    for (const heading of [
      'Trending Topics',
      'Hot On Social',
      'Popular Categories',
      'Language Sites',
      'Network18 Group Sites',
    ]) {
      await expect(footerPage.getHeading(heading)).toBeVisible();
    }

    for (const item of footerInformationItems) {
      await expect(footerPage.getLink(item.label)).toBeVisible();
    }
  });

  for (const item of footerNavigationItems) {
    test(`footer ${item.label} link opens its matching section`, async ({ page, footerPage }) => {
      await footerPage.gotoHome();
      await footerPage.scrollIntoView();

      const link = footerPage.getLink(item.label);
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', new RegExp(`${escapeRegExp(item.path)}$`));

      await footerPage.openInternalLink(item.label, item.path);
      await expect(page).toHaveURL((url) => {
        return (
          url.origin === 'https://www.news18.com' &&
          normalizePath(url.pathname) === normalizePath(item.path)
        );
      });
    });
  }

  for (const item of footerInformationItems) {
    test(`footer ${item.label} link opens its information page`, async ({ page, footerPage }) => {
      await footerPage.gotoHome();
      await footerPage.scrollIntoView();

      const link = footerPage.getLink(item.label);
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', new RegExp(`${escapeRegExp(item.path)}$`));

      await footerPage.openInternalLink(item.label, item.path);
      await expect(page).toHaveURL((url) => {
        return (
          url.origin === 'https://www.news18.com' &&
          normalizePath(url.pathname) === normalizePath(item.path)
        );
      });
    });
  }
});

function normalizePath(path: string): string {
  return path === '/' ? path : path.replace(/\/+$/, '');
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
