import { asset, Head } from "$fresh/runtime.ts";
import { defineApp } from "$fresh/server.ts";
import { useScript } from "@deco/deco/hooks";
import { Context } from "@deco/deco";
const serviceWorkerScript = () =>
  addEventListener("load", () =>
    navigator && navigator.serviceWorker &&
    navigator.serviceWorker.register("/sw.js"));
export default defineApp(async (_req, ctx) => {
  const revision = await Context.active().release?.revision();
  return (
    <>
      {/* Include Icons and manifest */}
      <Head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id=GTM-T597R4Q'+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-T597R4Q');`,
          }}
        />
        {/* End Google Tag Manager */}
        {/* Enable View Transitions API */}
        <style
          dangerouslySetInnerHTML={{
            __html: `@view-transition { navigation: auto; }`,
          }}
        />

        {/* Tailwind v3 CSS file */}
        <link
          href={asset(`/styles.css?revision=${revision}`)}
          rel="stylesheet"
        />

        {/* Web Manifest */}
        <link rel="manifest" href={asset("/site.webmanifest")} />
      </Head>

      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-T597R4Q"
          height="0"
          width="0"
          style="display:none;visibility:hidden"
        >
        </iframe>
      </noscript>
      {/* End Google Tag Manager (noscript) */}

      {/* Rest of Preact tree */}
      <main class="bg-[#FDF0F0]">
        <ctx.Component />
      </main>

      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(serviceWorkerScript) }}
      />

      {/* Script de filtro de tamanhos por categoria */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function waitForFilters() {
              var filtros = document.querySelectorAll('ul.menu a[href*="filter.tamanho="]');
              if (filtros.length === 0) {
                setTimeout(waitForFilters, 200);
                return;
              }

              // Brincos: só mostra pp, p, m, g
              document.querySelectorAll('ul.menu a[href*="filter.category-1=brincos"][href*="filter.tamanho="]').forEach(a => {
                const match = a.href.match(/filter\\.tamanho=([^&]+)/);
                const tamanho = match ? decodeURIComponent(match[1]).toLowerCase() : "";
                if (!["pp", "p", "m", "g"].includes(tamanho)) {
                  a.style.display = "none";
                }
              });

              // Colares/Colar: só mostra curto, médio, longo
              document.querySelectorAll('ul.menu a[href*="filter.category-1=colares"], ul.menu a[href*="filter.category-1=colar"][href*="filter.tamanho="]').forEach(a => {
                const match = a.href.match(/filter\\.tamanho=([^&]+)/);
                const tamanho = match ? decodeURIComponent(match[1]).toLowerCase() : "";
                if (!["curto", "médio", "medio", "longo"].includes(tamanho)) {
                  a.style.display = "none";
                }
              });

              // Conjunto/Conjuntos: só mostra curto, médio, longo
              document.querySelectorAll('ul.menu a[href*="filter.category-1=conjunto"], ul.menu a[href*="filter.category-1=conjuntos"][href*="filter.tamanho="]').forEach(a => {
                const match = a.href.match(/filter\\.tamanho=([^&]+)/);
                const tamanho = match ? decodeURIComponent(match[1]).toLowerCase() : "";
                if (!["curto", "médio", "medio", "longo"].includes(tamanho)) {
                  a.style.display = "none";
                }
              });
            })();
          `,
        }}
      />
    </>
  );
});
