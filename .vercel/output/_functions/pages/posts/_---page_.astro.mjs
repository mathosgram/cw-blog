import { c as createAstro, a as createComponent, r as renderComponent, g as renderTemplate, m as maybeRenderHead } from "../../chunks/astro/server_Bp3iFUji.mjs";
import "kleur/colors";
import { g as getCollection } from "../../chunks/_astro_content_DOxMeuTV.mjs";
import { $ as $$Main } from "../../chunks/Main_ioh-DZOg.mjs";
import { $ as $$Layout, a as $$Header, d as $$Footer } from "../../chunks/Footer_D4daS1_U.mjs";
import { $ as $$Card } from "../../chunks/Card_Cl4v8WXg.mjs";
import { $ as $$Pagination } from "../../chunks/Pagination_D7sfjn-5.mjs";
import { g as getSortedPosts } from "../../chunks/getSortedPosts_ClMJ_MFt.mjs";
import { S as SITE } from "../../chunks/config_D2KW0BrR.mjs";
import { renderers } from "../../renderers.mjs";
const $$Astro = createAstro("https://stack.cowrywise-ambassadors.com/");
const getStaticPaths = async ({ paginate }) => {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return paginate(getSortedPosts(posts), { pageSize: SITE.postPerPage });
};
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const { page: page2 } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Posts | ${SITE.title}` }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", $$Header, {})} ${renderComponent($$result2, "Main", $$Main, { "pageTitle": "Posts", "pageDesc": "All the articles I've posted." }, { "default": async ($$result3) => renderTemplate` ${maybeRenderHead()}<ul> ${page2.data.map((data) => renderTemplate`${renderComponent($$result3, "Card", $$Card, { ...data })}`)} </ul> ` })} ${renderComponent($$result2, "Pagination", $$Pagination, { "page": page2 })} ${renderComponent($$result2, "Footer", $$Footer, { "noMarginTop": page2.lastPage > 1 })} ` })}`;
}, "/workspace/src/pages/posts/[...page].astro", void 0);
const $$file = "/workspace/src/pages/posts/[...page].astro";
const $$url = "/posts/[...page]";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
