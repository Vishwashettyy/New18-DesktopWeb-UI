import { test as base, expect } from '@playwright/test';
import { FooterPage } from '../pages/FooterPage';
import { HomepageBodyPage } from '../pages/HomepageBodyPage';
import { PrimaryNavigationPage } from '../pages/PrimaryNavigationPage';

type TestFixtures = {
  footerPage: FooterPage;
  homepageBodyPage: HomepageBodyPage;
  primaryNavigationPage: PrimaryNavigationPage;
};

export const test = base.extend<TestFixtures>({
  footerPage: async ({ page }, use) => {
    await use(new FooterPage(page));
  },
  homepageBodyPage: async ({ page }, use) => {
    await use(new HomepageBodyPage(page));
  },
  primaryNavigationPage: async ({ page }, use) => {
    await use(new PrimaryNavigationPage(page));
  },
});

export { expect };
