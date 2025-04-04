import { Hono, Next } from 'hono';
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
import { virtualSheet } from 'twind/shim/server';
import { serveStatic } from '@hono/node-server/serve-static';

// Define types for Hono context variables
type HonoVariables = {
  lang: string;
  translations: AppTranslations;
  t: TFunction;
};

export const twindVirtualSheet = virtualSheet();
const app = new Hono<{ Variables: HonoVariables; }>();

// public folder
app.use('/assets/*', serveStatic({ root: './public' }));

// before page rendering call console.log('Before rendering page');
app.use((_, next) => {
  twindVirtualSheet.reset();
  return next();
});

app.use(jsxRenderer(
  ({ children }, c) => {

    const lang = c.get('lang');
    const t = c.get('t');
    const currentPath = c.req.path;

    return (
      <Layout t={t} lang={lang} currentPath={currentPath} titleKey="meta.titleIntro">
        {children}
      </Layout>
    );
  },
  {
    docType: true
  }
));

// 2. Language Middleware
app.use('/:lang/*', async (c: Context<{ Variables: HonoVariables; }>, next: Next) => {
  // Skip language processing for asset paths
  if (c.req.path.startsWith('/assets/') || c.req.path.startsWith('/src/') || c.req.path.startsWith('/public/') || c.req.path.startsWith('/dist/')) {
    console.log('Skipping language processing for asset path');
    return next();
  }

  let lang = c.req.param('lang');

  // Validate language code
  if (!supportedLangCodes.includes(lang)) {
    lang = defaultLanguage; // Fallback to default
    // Optional: Redirect to the default language URL if the code was invalid
    const path = c.req.path.substring(c.req.param('lang').length + 1); // Get path after lang code
    return c.redirect(`/${lang}${path || ''}`, 302);
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

  return c.render(
    <HomePage t={t} lang={lang} />
  );
});


// Decode Page Route
app.get('/:lang/decode', (c) => {
  const lang = c.get('lang');
  const t = c.get('t');
  const translations = c.get('translations');

  const inszInput = c.req.query('insz'); // Changed query param name for consistency

  return c.render(
    <DecodePage 
      t={t} 
      lang={lang} 
      inputValue={inszInput}
      translations={translations} 
    />
  );
});


// --- 404 Not Found Handler --- (Keep as is)
app.notFound((c) => {
  let lang = c.get('lang') ?? defaultLanguage;
  let t = c.get('t');

  if (!t) {
    const translations = lang === 'nl' ? nl : en;
    t = createT(translations);
  }

  return c.html(
    <NotFoundPage t={t} lang={lang} />,
    404
  );
});

export default app;

console.log(`Hono server running on http://localhost:3000 (Default lang: ${defaultLanguage})`);