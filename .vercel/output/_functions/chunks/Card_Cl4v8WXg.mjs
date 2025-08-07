import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, r as renderComponent, s as spreadAttributes, g as renderTemplate } from "./astro/server_Bp3iFUji.mjs";
import { s as slugifyStr } from "./slugify_Bj2zK5b-.mjs";
import { g as getPath } from "./getPath_9yb9aK6D.mjs";
import { $ as $$Datetime } from "./Datetime_B5Nbtw7A.mjs";
const $$Astro = createAstro("https://stack.cowrywise-ambassadors.com/");
const $$Card = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Card;
  const { variant = "h2", data, id, filePath } = Astro2.props;
  const { title, description, pubDatetime, modDatetime, timezone } = data;
  const headerProps = {
    style: { viewTransitionName: slugifyStr(title) },
    class: "text-lg font-medium decoration-dashed hover:underline"
  };
  return renderTemplate`${maybeRenderHead()}<li class="my-6"> <a${addAttribute(getPath(id, filePath), "href")} class="inline-block text-lg font-medium text-accent decoration-dashed underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0"> ${variant === "h2" ? renderTemplate`<h2${spreadAttributes(headerProps)}>${title}</h2>` : renderTemplate`<h3${spreadAttributes(headerProps)}>${title}</h3>`} </a> ${renderComponent($$result, "Datetime", $$Datetime, { "pubDatetime": pubDatetime, "modDatetime": modDatetime, "timezone": timezone })} <p>${description}</p> </li>`;
}, "/workspace/src/components/Card.astro", void 0);
export {
  $$Card as $
};
