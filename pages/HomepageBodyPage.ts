import type { Locator, Page } from '@playwright/test';

export type StoryComponent = {
  index: number;
  heading: string;
};

export class HomepageBodyPage {
  constructor(private readonly page: Page) {}

  get main(): Locator {
    return this.page.getByRole('main');
  }

  getComponentByHeading(name: string): Locator {
    return this.main
      .locator(':scope > *')
      .filter({ has: this.page.getByRole('heading', { name, exact: true }) })
      .first();
  }

  async gotoHome(): Promise<void> {
    await this.page.goto('/');
  }

  async getStoryComponents(): Promise<StoryComponent[]> {
    return this.main.locator(':scope > *').evaluateAll((components) =>
      components.flatMap((component, index) => {
        const heading = component.querySelector('h1, h2, h3')?.textContent?.trim();
        const storyLink =
          component.querySelector<HTMLAnchorElement>('a[href]:has(h3)') ??
          Array.from(
            component.querySelectorAll<HTMLAnchorElement>('a[href]:has(h2)'),
          ).find((link) => {
            const linkHeading = link.querySelector('h2')?.textContent?.trim();
            return linkHeading?.toLocaleLowerCase() !== heading?.toLocaleLowerCase();
          });
        if (!storyLink) {
          return [];
        }

        return [{ index, heading: heading || `Homepage content component ${index + 1}` }];
      }),
    );
  }

  async getStoryLink(componentIndex: number): Promise<Locator> {
    const component = this.main.locator(':scope > *').nth(componentIndex);
    const h3Links = component.locator('a[href]:has(h3)');
    if ((await h3Links.count()) > 0) {
      return h3Links.first();
    }

    const sectionHeading = (await component.locator('h1, h2, h3').first().textContent())?.trim();
    const h2Links = component.locator('a[href]:has(h2)');
    for (let index = 0; index < (await h2Links.count()); index += 1) {
      const link = h2Links.nth(index);
      const linkHeading = (await link.locator('h2').textContent())?.trim();
      if (linkHeading?.toLocaleLowerCase() !== sectionHeading?.toLocaleLowerCase()) {
        return link;
      }
    }

    throw new Error(`Homepage content component ${componentIndex + 1} has no story link`);
  }

  async openStory(componentIndex: number): Promise<Page> {
    const link = await this.getStoryLink(componentIndex);
    const href = await link.getAttribute('href');
    if (!href) {
      throw new Error(`Homepage story link in component ${componentIndex + 1} has no href`);
    }

    const targetUrl = new URL(href, this.page.url());
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
      this.page.waitForURL(
        (url) =>
          url.origin === targetUrl.origin &&
          this.normalizePath(url.pathname) === this.normalizePath(targetUrl.pathname),
      ),
      link.click(),
    ]);

    return this.page;
  }

  async getBodyLinkDestinations(): Promise<string[]> {
    return this.main.locator('a[href]').evaluateAll((links) =>
      links.map((link) => (link as HTMLAnchorElement).href),
    );
  }

  private normalizePath(path: string): string {
    return path === '/' ? path : path.replace(/\/+$/, '');
  }
}
