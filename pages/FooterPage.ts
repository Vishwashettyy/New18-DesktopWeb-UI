import type { Locator, Page } from '@playwright/test';

export type FooterNavigationItem = {
  label: string;
  path: string;
};

export const footerNavigationItems: FooterNavigationItem[] = [
  { label: 'Latest News', path: '/news/' },
  { label: 'India', path: '/india/' },
  { label: 'Movies', path: '/movies/' },
  { label: 'World', path: '/world/' },
  { label: 'Politics', path: '/politics/' },
  { label: 'Tech', path: '/tech/' },
  { label: 'Cricket', path: '/cricket/' },
  { label: 'Explainers', path: '/explainers/' },
  { label: 'City News', path: '/cities/' },
  { label: 'Elections', path: '/elections/' },
];

export type FooterInformationItem = {
  label: string;
  path: string;
};

export const footerInformationItems: FooterInformationItem[] = [
  { label: 'About Us', path: '/about_us/' },
  { label: 'Contact Us', path: '/contact-us.html' },
  { label: 'Privacy Policy', path: '/privacy_policy/' },
  { label: 'Cookie Policy', path: '/cookie-policy.html' },
  { label: 'Disclaimer', path: '/disclaimer/' },
  { label: 'RSS', path: '/rss/' },
  { label: 'Sitemap', path: '/sitemap/' },
];

export class FooterPage {
  constructor(private readonly page: Page) {}

  async gotoHome(): Promise<void> {
    await this.page.goto('/');
  }

  get footer(): Locator {
    return this.page.locator('footer').last();
  }

  async scrollIntoView(): Promise<void> {
    await this.footer.scrollIntoViewIfNeeded();
  }

  getHeading(name: string): Locator {
    return this.footer.getByRole('heading', { name, exact: true });
  }

  getLink(name: string): Locator {
    return this.footer.getByRole('link', { name, exact: true }).first();
  }

  async openInternalLink(label: string, path: string): Promise<void> {
    const link = this.getLink(label);
    const expectedUrl = new URL(path, this.page.url());

    await Promise.all([
      this.page.waitForURL((actualUrl) => this.matchesUrl(actualUrl, expectedUrl)),
      link.click(),
    ]);
  }

  private matchesUrl(actualUrl: URL, expectedUrl: URL): boolean {
    return (
      actualUrl.origin === expectedUrl.origin &&
      this.normalizePath(actualUrl.pathname) === this.normalizePath(expectedUrl.pathname)
    );
  }

  private normalizePath(path: string): string {
    return path === '/' ? path : path.replace(/\/+$/, '');
  }
}
