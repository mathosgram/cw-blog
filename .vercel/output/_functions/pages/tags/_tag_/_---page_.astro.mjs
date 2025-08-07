import { c as createAstro, a as createComponent, r as renderComponent, g as renderTemplate, m as maybeRenderHead } from "../../../chunks/astro/server_Bp3iFUji.mjs";
import "kleur/colors";
import { g as getCollection } from "../../../chunks/_astro_content_DOxMeuTV.mjs";
import { $ as $$Main } from "../../../chunks/Main_ioh-DZOg.mjs";
import { $ as $$Layout, a as $$Header, d as $$Footer } from "../../../chunks/Footer_D4daS1_U.mjs";
import { $ as $$Card } from "../../../chunks/Card_Cl4v8WXg.mjs";
import { $ as $$Pagination } from "../../../chunks/Pagination_D7sfjn-5.mjs";
import { g as getUniqueTags } from "../../../chunks/getUniqueTags_oMrzMIJ_.mjs";
import { g as getSortedPosts } from "../../../chunks/getSortedPosts_ClMJ_MFt.mjs";
import { a as slugifyAll } from "../../../chunks/slugify_Bj2zK5b-.mjs";
import { S as SITE } from "../../../chunks/config_D2KW0BrR.mjs";
import { renderers } from "../../../renderers.mjs";
const getPostsByTag = (posts, tag) => getSortedPosts(
  posts.filter((post) => slugifyAll(post.data.tags).includes(tag))
);
const $$Astro = createAstro("https://stack.cowrywise-ambassadors.com/");
async function getStaticPaths({ paginate }) {
  const posts = await getCollection("blog");
  const tags = getUniqueTags(posts);
  return tags.flatMap(({ tag, tagName }) => {
    const tagPosts = getPostsByTag(posts, tag);
    return paginate(tagPosts, {
      params: { tag },
      props: { tagName },
      pageSize: SITE.postPerPage
    });
  });
}
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const params = Astro2.params;
  const { tag } = params;
  const { page: page2, tagName } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Tag: ${tagName} | ${SITE.title}` }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", $$Header, {})} ${renderComponent($$result2, "Main", $$Main, { "pageTitle": [`Tag:`, `${tagName}`], "titleTransition": tag, "pageDesc": `All the articles with the tag "${tagName}".` }, { "default": async ($$result3) => renderTemplate` ${maybeRenderHead()}<ul> ${page2.data.map((data) => renderTemplate`${renderComponent($$result3, "Card", $$Card, { ...data })}`)} </ul> ` })} ${renderComponent($$result2, "Pagination", $$Pagination, { "page": page2 })} ${renderComponent($$result2, "Footer", $$Footer, { "noMarginTop": page2.lastPage > 1 })} ` })}`;
}, "/workspace/src/pages/tags/[tag]/[...page].astro", void 0);
const $$file = "/workspace/src/pages/tags/[tag]/[...page].astro";
const $$url = "/tags/[tag]/[...page]";
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
