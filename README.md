# New18-DesktopWeb-UI

Playwright tests live in [`tests/`](./tests/), separate from installed dependencies in `node_modules/`.
Test plans and supporting QA documentation live in [`specs/`](./specs/).
Page objects live in [`pages/`](./pages/), and shared Playwright fixtures live in [`fixtures/`](./fixtures/).

Run the tests with:

```powershell
npm test
```

Run a single spec with:

```powershell
npm test -- tests/footer-functional.spec.ts
```

VS Code Code Runner is configured to run TypeScript files through Playwright Test rather than `ts-node`.