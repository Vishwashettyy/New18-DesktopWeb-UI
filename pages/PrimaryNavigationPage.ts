import type { Locator, Page } from '@playwright/test';

export type PrimaryNavigationItem = {
  label: string;
  url: string;
};

export const primaryNavigationItems: PrimaryNavigationItem[] = [
  { label: 'Home', url: 'https://www.news18.com/' },
  { label: 'India', url: 'https://www.news18.com/india/' },
  { label: 'World', url: 'https://www.news18.com/world/' },
  { label: 'Explainers', url: 'https://www.news18.com/explainers/' },
  { label: 'DataPop', url: 'https://www.news18.com/topics/data-graphics/' },
  { label: 'Cricket', url: 'https://www.news18.com/cricket/' },
  { label: 'Cities', url: 'https://www.news18.com/cities/' },
  { label: 'Movies', url: 'https://www.news18.com/movies/' },
  { label: 'Lifestyle', url: 'https://www.news18.com/lifestyle/' },
  { label: 'Business', url: 'https://www.news18.com/business/' },
  { label: 'Tech2', url: 'https://www.tech2.com/' },
  { label: 'Latest', url: 'https://www.news18.com/news/' },
];

export class PrimaryNavigationPage {
  constructor(private readonly page: Page) {}

  async goto(path = '/'): Promise<void> {
    await this.page.goto(path);
  }

  getLink(label: string): Locator {
    return this.page
      .locator('header nav')
      .first()
      .getByRole('link', { name: label, exact: true })
      .first();
  }

  async openSection(item: PrimaryNavigationItem): Promise<Page> {
    const link = this.getLink(item.label);
    const target = await link.getAttribute('target');

    if (target?.toLowerCase() === '_blank') {
      const [destinationPage] = await Promise.all([
        this.page.context().waitForEvent('page'),
        link.click(),
      ]);

      await destinationPage.waitForLoadState('domcontentloaded');
      return destinationPage;
    }

    await Promise.all([
      this.page.waitForURL((url) => this.matchesUrl(url, item.url)),
      link.click(),
    ]);

    return this.page;
  }

  private matchesUrl(actualUrl: URL, expectedUrl: string): boolean {
    const expected = new URL(expectedUrl);
    return (
      actualUrl.origin === expected.origin &&
      this.normalizePath(actualUrl.pathname) === this.normalizePath(expected.pathname)
    );
  }

  private normalizePath(path: string): string {
    return path === '/' ? path : path.replace(/\/+$/, '');
  }
}
