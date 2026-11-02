import { test, expect } from '../fixtures/test';

test.describe('News18 homepage body functionality and redirection', () => {
  test('renders linked content components between the header and footer', async ({
    homepageBodyPage,
  }) => {
    await homepageBodyPage.gotoHome();

    await expect(homepageBodyPage.main).toBeVisible();
    await expect(homepageBodyPage.main.getByRole('heading', { name: 'Top News' })).toBeVisible();

    const components = await homepageBodyPage.getStoryComponents();
    expect(components.length).toBeGreaterThan(0);
  });

  test('all homepage body links have valid web destinations', async ({ homepageBodyPage }) => {
    await homepageBodyPage.gotoHome();

    const destinations = await homepageBodyPage.getBodyLinkDestinations();
    expect(destinations.length).toBeGreaterThan(0);

    for (const destination of destinations) {
      const url = new URL(destination);
      expect(['http:', 'https:']).toContain(url.protocol);
      expect(url.hostname).not.toBe('');
    }
  });

  test('Amazon deal category controls show products and redirect to Amazon', async ({
    page,
    homepageBodyPage,
  }) => {
    await homepageBodyPage.gotoHome();

    const deals = homepageBodyPage.getComponentByHeading('Deals from Amazon');
    await expect(deals).toBeVisible();
    await deals.getByRole('button', { name: 'Laptop', exact: true }).click();

    const buyLink = deals.getByRole('link', { name: 'BUY NOW ON AMAZON' }).first();
    await expect(buyLink).toBeVisible();

    const href = await buyLink.getAttribute('href');
    expect(href).toBeTruthy();
    if (!href) {
      throw new Error('Amazon deal purchase link is missing its href');
    }

    expect(new URL(href).hostname).toMatch(/(^|\.)amazon\.in$/);
    await expect(buyLink).toHaveAttribute('target', '_blank');

    const [productPage] = await Promise.all([
      page.context().waitForEvent('page'),
      buyLink.click(),
    ]);
    expect(new URL(productPage.url()).hostname).toMatch(/(^|\.)amazon\.in$/);
    await productPage.close();
  });

  test('story links in each content component open their matching destinations', async ({
    page,
    homepageBodyPage,
  }) => {
    await homepageBodyPage.gotoHome();

    const components = await homepageBodyPage.getStoryComponents();
    expect(components.length).toBeGreaterThan(0);

    for (const component of components) {
      const storyLink = await homepageBodyPage.getStoryLink(component.index);
      await expect(storyLink, component.heading).toBeVisible();

      const href = await storyLink.getAttribute('href');
      expect(href, `${component.heading} story link should have a destination`).toBeTruthy();
      if (!href) {
        throw new Error(`${component.heading} story link is missing its href`);
      }

      const expectedUrl = new URL(href, page.url());
      expect(expectedUrl.protocol).toMatch(/^https?:$/);
      expect(expectedUrl.pathname).not.toBe('/');

      const destinationPage = await homepageBodyPage.openStory(component.index);
      try {
        const actualUrl = new URL(destinationPage.url());
        expect(actualUrl.origin, component.heading).toBe(expectedUrl.origin);
        expect(normalizePath(actualUrl.pathname), component.heading).toBe(
          normalizePath(expectedUrl.pathname),
        );
      } finally {
        if (destinationPage !== page) {
          await destinationPage.close();
        } else {
          await homepageBodyPage.gotoHome();
        }
      }
    }
  });
});

function normalizePath(path: string): string {
  return path === '/' ? path : path.replace(/\/+$/, '');
}
