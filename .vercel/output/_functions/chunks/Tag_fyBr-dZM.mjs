import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, r as renderComponent, f as renderTransition, g as renderTemplate } from "./astro/server_Bp3iFUji.mjs";
import "kleur/colors";
import { c as createSvgComponent } from "./Footer_D4daS1_U.mjs";
/* empty css                         */
const IconHash = createSvgComponent({ "meta": { "src": "/_astro/IconHash.D97SZ4jU.svg", "width": 24, "height": 24, "format": "svg" }, "attributes": { "width": "24", "height": "24", "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", "class": "icon icon-tabler icons-tabler-outline icon-tabler-hash" }, "children": '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 9l14 0" /><path d="M5 15l14 0" /><path d="M11 4l-4 16" /><path d="M17 4l-4 16" />' });
const $$Astro = createAstro("https://stack.cowrywise-ambassadors.com/");
const $$Tag = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Tag;
  const { tag, tagName, size = "sm" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<li${addAttribute([
    "group inline-block group-hover:cursor-pointer",
    size === "sm" ? "my-1 underline-offset-4" : "mx-1 my-3 underline-offset-8"
  ], "class:list")}> <a${addAttribute(`/tags/${tag}/`, "href")}${addAttribute([
    "relative pe-2 text-lg underline decoration-dashed group-hover:-top-0.5 group-hover:text-accent focus-visible:p-1 focus-visible:no-underline",
    { "text-sm": size === "sm" }
  ], "class:list")}${addAttribute(renderTransition($$result, "36ssibgs", "", tag), "data-astro-transition-scope")}> ${renderComponent($$result, "IconHash", IconHash, { "class:list": [
    "inline-block opacity-80",
    { "-me-3.5 size-4": size === "sm" },
    { "-me-5 size-6": size === "lg" }
  ] })}
&nbsp;<span>${tagName}</span> </a> </li>`;
}, "/workspace/src/components/Tag.astro", "self");
export {
  $$Tag as $
};
