import { c as createAstro, a as createComponent, r as renderComponent, m as maybeRenderHead, b as addAttribute, d as renderSlot, e as renderScript, f as renderTransition, g as renderTemplate } from "./astro/server_Bp3iFUji.mjs";
import "kleur/colors";
import { $ as $$Breadcrumb } from "./Breadcrumb_C9T3fxxq.mjs";
/* empty css                         */
const $$Astro = createAstro("https://stack.cowrywise-ambassadors.com/");
const $$Main = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Main;
  const { props } = Astro2;
  const backUrl = Astro2.url.pathname;
  return renderTemplate`${renderComponent($$result, "Breadcrumb", $$Breadcrumb, {})} ${maybeRenderHead()}<main${addAttribute(backUrl, "data-backUrl")} id="main-content" class="mx-auto w-full max-w-app px-4 pb-4"> ${"titleTransition" in props ? renderTemplate`<h1 class="text-2xl font-semibold sm:text-3xl"> ${props.pageTitle[0]} <span${addAttribute(renderTransition($$result, "hn2qarie", "", props.titleTransition), "data-astro-transition-scope")}> ${props.pageTitle[1]} </span> </h1>` : renderTemplate`<h1 class="text-2xl font-semibold sm:text-3xl">${props.pageTitle}</h1>`} <p class="mt-2 mb-6 italic">${props.pageDesc}</p> ${renderSlot($$result, $$slots["default"])} </main> ${renderScript($$result, "/workspace/src/layouts/Main.astro?astro&type=script&index=0&lang.ts")}`;
}, "/workspace/src/layouts/Main.astro", "self");
export {
  $$Main as $
};
