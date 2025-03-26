import { Hono, Next } from 'hono';
import { serveStatic } from 'hono/bun';
import type { Context } from 'hono';
import { jsxRenderer } from "hono/jsx-renderer";

// Locales and i18n helpers
import { en, AppTranslations } from './locales/en'; // Default import
import { nl } from './locales/nl';
import { createT, TFunction } from './utils/i18n';
import { defaultLanguage, supportedLanguages, supportedLangCodes } from './config';

// Import Layout and Pages
import Layout from './views/layout';
import HomePage from './pages/home-page';
import DecodePage from './pages/decode-page';
import NotFoundPage from './pages/not-found-page';
import { virtualSheet, setup } from 'twind/shim/server';


// Define types for Hono context variables
type HonoVariables = {
  lang: string;
  translations: AppTranslations;
  t: TFunction;
};




export const twindVirtualSheet = virtualSheet();


setup({
  darkMode: 'class',
  hash: true,
  preflight: true,
  theme: {
    extend: {
      minHeight: {
        'screen': '100vh',
      }
    },
  },
  sheet: twindVirtualSheet,
});

console.log('Virtual sheet created');

const app = new Hono<{ Variables: HonoVariables; }>();

// before page rendering call console.log('Before rendering page');
app.use((_, next) => {
  twindVirtualSheet.reset();
  console.log('Virtual sheet reset');
  return next();
});

app.use(jsxRenderer()); // Enable JSX rendering

// 2. Language Middleware
app.use('/:lang/*', async (c: Context<{ Variables: HonoVariables; }>, next: Next) => {
  let lang = c.req.param('lang');

  // Validate language code
  if (!supportedLangCodes.includes(lang)) {
    lang = defaultLanguage; // Fallback to default
    // Optional: Redirect to the default language URL if the code was invalid
    // const path = c.req.path.substring(c.req.param('lang').length + 1); // Get path after lang code
    // return c.redirect(`/${lang}${path || '/'}`, 302);
  }

  // Load translations dynamically (or use direct imports if preferred)
  const langConfig = supportedLanguages.find(l => l.code === lang);
  const translations = langConfig ? await langConfig.import() : en; // Fallback needed

  // Create translation function
  const t = createT(translations);

  // Set variables on context for later use in routes
  c.set('lang', lang);
  c.set('translations', translations);
  c.set('t', t);

  await next(); // Continue to the route handler
});

// --- Routes ---

// Root Redirect
app.get('/', (c) => {
  return c.redirect(`/${defaultLanguage}`, 302);
});

// Home Page Route
app.get('/:lang', async (c) => {
  const lang = c.get('lang');
  const t = c.get('t');
  const currentPath = c.req.path;
  const content = <Layout t={t} lang={lang} currentPath={currentPath} titleKey="meta.titleIntro" virtualSheet={twindVirtualSheet}>
    <HomePage t={t} lang={lang} />
  </Layout>;

  return c.render(content);
});


// Decode Page Route
app.get('/:lang/decode', (c) => {
  const lang = c.get('lang');
  const t = c.get('t');
  const currentPath = c.req.path;

  const inszInput = c.req.query('insz'); // Changed query param name for consistency

  return c.render(
    <Layout t={t} lang={lang} currentPath={currentPath} titleKey="meta.titleDecode" virtualSheet={twindVirtualSheet}>
      <DecodePage t={t} lang={lang} inputValue={inszInput} />
    </Layout>
  );
});

// --- 404 Not Found Handler --- (Keep as is)
app.notFound((c) => {
  let lang = c.get('lang') ?? defaultLanguage;
  let t = c.get('t');
  const currentPath = c.req.path;
  if (!t) {
    const translations = lang === 'nl' ? nl : en;
    t = createT(translations);
  }
  const basePath = supportedLangCodes.includes(currentPath.split('/')[1])
    ? `/${currentPath.split('/')[1]}`
    : `/${lang}`;
  return c.html(
    <Layout t={t} lang={lang} currentPath={basePath} titleKey="meta.titleNotFound" virtualSheet={twindVirtualSheet}>
      <NotFoundPage t={t} lang={lang} />
    </Layout>,
    404
  );
});

// --- Export ---
export default app;

console.log(`Hono server running on http://localhost:3000 (Default lang: ${defaultLanguage})`);