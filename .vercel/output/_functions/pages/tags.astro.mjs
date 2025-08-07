import { a as createComponent, r as renderComponent, g as renderTemplate, m as maybeRenderHead } from "../chunks/astro/server_Bp3iFUji.mjs";
import "kleur/colors";
import { g as getCollection } from "../chunks/_astro_content_DOxMeuTV.mjs";
import { $ as $$Main } from "../chunks/Main_ioh-DZOg.mjs";
import { $ as $$Layout, a as $$Header, d as $$Footer } from "../chunks/Footer_D4daS1_U.mjs";
import { $ as $$Tag } from "../chunks/Tag_fyBr-dZM.mjs";
import { g as getUniqueTags } from "../chunks/getUniqueTags_oMrzMIJ_.mjs";
import { S as SITE } from "../chunks/config_D2KW0BrR.mjs";
import { renderers } from "../renderers.mjs";
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const posts = await getCollection("blog");
  let tags = getUniqueTags(posts);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Tags | ${SITE.title}` }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", $$Header, {})} ${renderComponent($$result2, "Main", $$Main, { "pageTitle": "Tags", "pageDesc": "All the tags used in posts." }, { "default": async ($$result3) => renderTemplate` ${maybeRenderHead()}<ul> ${tags.map(({ tag, tagName }) => renderTemplate`${renderComponent($$result3, "Tag", $$Tag, { "tag": tag, "tagName": tagName, "size": "lg" })}`)} </ul> ` })} ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "/workspace/src/pages/tags/index.astro", void 0);
const $$file = "/workspace/src/pages/tags/index.astro";
const $$url = "/tags";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
