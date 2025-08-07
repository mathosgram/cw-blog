import { a as createComponent, r as renderComponent, e as renderScript, g as renderTemplate, m as maybeRenderHead, b as addAttribute, F as Fragment } from "../chunks/astro/server_Bp3iFUji.mjs";
import "kleur/colors";
import { g as getCollection } from "../chunks/_astro_content_DOxMeuTV.mjs";
import { c as createSvgComponent, $ as $$Layout, a as $$Header, e as $$Hr, b as $$LinkButton, d as $$Footer } from "../chunks/Footer_D4daS1_U.mjs";
import { $ as $$Card } from "../chunks/Card_Cl4v8WXg.mjs";
import { g as getSortedPosts } from "../chunks/getSortedPosts_ClMJ_MFt.mjs";
import { I as IconArrowRight } from "../chunks/IconArrowRight_HmqBN17V.mjs";
import { S as SITE } from "../chunks/config_D2KW0BrR.mjs";
import { g as getBlogPosts } from "../chunks/redis_CxlEi8Z_.mjs";
import { renderers } from "../renderers.mjs";
const IconRss = createSvgComponent({ "meta": { "src": "/_astro/IconRss.BYWRoVjV.svg", "width": 24, "height": 24, "format": "svg" }, "attributes": { "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", "class": "icon icon-tabler icons-tabler-outline icon-tabler-rss" }, "children": '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M4 4a16 16 0 0 1 16 16" /><path d="M4 11a9 9 0 0 1 9 9" />' });
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const posts = await getCollection("blog");
  const sortedPosts = getSortedPosts(posts);
  const featuredPosts = sortedPosts.filter(({ data }) => data.featured);
  const recentPosts = sortedPosts.filter(({ data }) => !data.featured);
  let dynamicPosts = [];
  try {
    const dbPosts = await getBlogPosts({
      published: true,
      limit: 10
    });
    dynamicPosts = dbPosts.map((post) => ({
      ...post,
      id: post.id
    }));
  } catch (error) {
    console.error("Error fetching dynamic posts:", error);
  }
  const hasDynamicPosts = dynamicPosts.length > 0;
  const dynamicFeaturedPosts = dynamicPosts.filter((post) => post.featured);
  const dynamicRecentPosts = dynamicPosts.filter((post) => !post.featured);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", $$Header, {})} ${maybeRenderHead()}<main id="main-content" data-layout="index"> <section id="hero" class="pt-8 pb-6"> <h1 class="my-4 inline-block text-4xl font-bold sm:my-8 sm:text-5xl">
Welcome to Stack
</h1> <a target="_blank" href="/rss.xml" class="inline-block" aria-label="rss feed" title="RSS Feed"> ${renderComponent($$result2, "IconRss", IconRss, { "width": 20, "height": 20, "class": "scale-125 stroke-accent stroke-3 rtl:-rotate-90" })} <span class="sr-only">RSS Feed</span> </a> <p>
Stack is the official writing platform for the Cowrywise Ambassador Writing Group. 
        Here, our ambassadors share insights on personal finance, investment strategies, 
        and financial literacy to help Nigerians build wealth and achieve financial freedom.
</p> <p class="mt-2">
Join our community of financial writers and discover stories that inspire smart money decisions.
        Together, we're building a financially literate Nigeria, one story at a time.
</p> </section> ${renderComponent($$result2, "Hr", $$Hr, {})} ${hasDynamicPosts ? renderTemplate`<!-- Dynamic Posts from Database -->
      <div> ${dynamicFeaturedPosts.length > 0 && renderTemplate`<section id="featured" class="pt-12 pb-6"> <h2 class="text-2xl font-semibold tracking-wide">Featured Posts</h2> <ul class="space-y-4"> ${dynamicFeaturedPosts.map((post) => renderTemplate`<li class="border border-border rounded-lg p-6 hover:shadow-md transition-shadow bg-background"> <article> <header> <h3 class="text-xl font-semibold mb-2"> <a${addAttribute(`/posts/${post.slug}/`, "href")} class="hover:text-accent transition-colors" style="color: var(--color-accent);"> ${post.title} </a> </h3> <div class="flex items-center gap-4 text-sm text-foreground/60 mb-3"> <time${addAttribute(post.publishedAt, "datetime")}> ${new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })} </time> <span>by ${post.author}</span> <span class="px-2 py-1 rounded text-xs" style="background-color: color-mix(in srgb, var(--color-accent) 10%, transparent); color: var(--color-accent);">
Featured
</span> </div> </header> <p class="text-foreground/80 mb-3">${post.description}</p> ${post.tags && post.tags.length > 0 && renderTemplate`<div class="flex flex-wrap gap-1 mt-2"> ${post.tags.map((tag) => renderTemplate`<span class="text-xs px-2 py-1 rounded-full bg-muted text-foreground/70"> ${tag} </span>`)} </div>`} </article> </li>`)} </ul> </section>`} ${dynamicFeaturedPosts.length > 0 && dynamicRecentPosts.length > 0 && renderTemplate`${renderComponent($$result2, "Hr", $$Hr, {})}`} ${dynamicRecentPosts.length > 0 && renderTemplate`<section id="recent-posts" class="pt-12 pb-6"> <h2 class="text-2xl font-semibold tracking-wide">Latest Posts</h2> <ul class="space-y-4"> ${dynamicRecentPosts.slice(0, SITE.postPerIndex).map((post) => renderTemplate`<li class="border border-border rounded-lg p-6 hover:shadow-md transition-shadow bg-background"> <article> <header> <h3 class="text-xl font-semibold mb-2"> <a${addAttribute(`/posts/${post.slug}/`, "href")} class="hover:text-accent transition-colors" style="color: var(--color-accent);"> ${post.title} </a> </h3> <div class="flex items-center gap-4 text-sm text-foreground/60 mb-3"> <time${addAttribute(post.publishedAt, "datetime")}> ${new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })} </time> <span>by ${post.author}</span> </div> </header> <p class="text-foreground/80 mb-3">${post.description}</p> ${post.tags && post.tags.length > 0 && renderTemplate`<div class="flex flex-wrap gap-1 mt-2"> ${post.tags.map((tag) => renderTemplate`<span class="text-xs px-2 py-1 rounded-full bg-muted text-foreground/70"> ${tag} </span>`)} </div>`} </article> </li>`)} </ul> </section>`} </div>` : renderTemplate`<!-- Fallback to Static Posts -->
      <div> ${featuredPosts.length > 0 && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <section id="featured" class="pt-12 pb-6"> <h2 class="text-2xl font-semibold tracking-wide">Featured</h2> <ul> ${featuredPosts.map((data) => renderTemplate`${renderComponent($$result3, "Card", $$Card, { "variant": "h3", ...data })}`)} </ul> </section> ${recentPosts.length > 0 && renderTemplate`${renderComponent($$result3, "Hr", $$Hr, {})}`}` })}`} ${recentPosts.length > 0 && renderTemplate`<section id="recent-posts" class="pt-12 pb-6"> <h2 class="text-2xl font-semibold tracking-wide">Recent Posts</h2> <ul> ${recentPosts.map(
    (data, index) => index < SITE.postPerIndex && renderTemplate`${renderComponent($$result2, "Card", $$Card, { "variant": "h3", ...data })}`
  )} </ul> </section>`} </div>`} <div class="my-8 text-center"> ${renderComponent($$result2, "LinkButton", $$LinkButton, { "href": "/posts/" }, { "default": async ($$result3) => renderTemplate`
All Posts
${renderComponent($$result3, "IconArrowRight", IconArrowRight, { "class": "inline-block rtl:-rotate-180" })} ` })} </div> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })} ${renderScript($$result, "/workspace/src/pages/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/workspace/src/pages/index.astro", void 0);
const $$file = "/workspace/src/pages/index.astro";
const $$url = "";
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
