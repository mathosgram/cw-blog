import { c as createAstro, a as createComponent, r as renderComponent, e as renderScript, g as renderTemplate, m as maybeRenderHead, b as addAttribute, h as createTransitionScope } from "../chunks/astro/server_Bp3iFUji.mjs";
import "kleur/colors";
/* empty css                                  */
import { $ as $$Main } from "../chunks/Main_ioh-DZOg.mjs";
import { $ as $$Layout, a as $$Header, d as $$Footer } from "../chunks/Footer_D4daS1_U.mjs";
import { S as SITE } from "../chunks/config_D2KW0BrR.mjs";
/* empty css                                 */
import { renderers } from "../renderers.mjs";
const $$Astro = createAstro("https://stack.cowrywise-ambassadors.com/");
const $$Search = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Search;
  const backUrl = `${Astro2.url.pathname}`;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Search | ${SITE.title}` }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", $$Header, {})} ${renderComponent($$result2, "Main", $$Main, { "pageTitle": "Search", "pageDesc": "Search any article ..." }, { "default": async ($$result3) => renderTemplate` ${maybeRenderHead()}<div id="pagefind-search"${addAttribute(backUrl, "data-backurl")}${addAttribute(createTransitionScope($$result3, "rgzmq3na"), "data-astro-transition-persist")}></div> ` })} ${renderComponent($$result2, "Footer", $$Footer, {})} ` })} ${renderScript($$result, "/workspace/src/pages/search.astro?astro&type=script&index=0&lang.ts")} `;
}, "/workspace/src/pages/search.astro", "self");
const $$file = "/workspace/src/pages/search.astro";
const $$url = "/search";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Search,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
