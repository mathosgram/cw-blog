import { renderers } from "./renderers.mjs";
import { c as createExports } from "./chunks/entrypoint_Dg_KNFS2.mjs";
import { manifest } from "./manifest_qwR11AM6.mjs";
const serverIslandMap = /* @__PURE__ */ new Map();
;
const _page0 = () => import("./pages/_image.astro.mjs");
const _page1 = () => import("./pages/404.astro.mjs");
const _page2 = () => import("./pages/about.astro.mjs");
const _page3 = () => import("./pages/admin.astro.mjs");
const _page4 = () => import("./pages/api/imagekit-auth.astro.mjs");
const _page5 = () => import("./pages/api/posts.astro.mjs");
const _page6 = () => import("./pages/api/upload.astro.mjs");
const _page7 = () => import("./pages/archives.astro.mjs");
const _page8 = () => import("./pages/og.png.astro.mjs");
const _page9 = () => import("./pages/posts/_---slug_/index.png.astro.mjs");
const _page10 = () => import("./pages/posts/_---page_.astro.mjs");
const _page11 = () => import("./pages/posts/_---slug_.astro.mjs");
const _page12 = () => import("./pages/robots.txt.astro.mjs");
const _page13 = () => import("./pages/rss.xml.astro.mjs");
const _page14 = () => import("./pages/search.astro.mjs");
const _page15 = () => import("./pages/tags/_tag_/_---page_.astro.mjs");
const _page16 = () => import("./pages/tags.astro.mjs");
const _page17 = () => import("./pages/index.astro.mjs");
const pageMap = /* @__PURE__ */ new Map([
  ["node_modules/.pnpm/astro@5.12.0_@upstash+redis@1.35.3_jiti@2.4.2_lightningcss@1.30.1_rollup@4.41.1_typescript@5.8.3_yaml@2.7.0/node_modules/astro/dist/assets/endpoint/generic.js", _page0],
  ["src/pages/404.astro", _page1],
  ["src/pages/about.md", _page2],
  ["src/pages/admin.astro", _page3],
  ["src/pages/api/imagekit-auth.ts", _page4],
  ["src/pages/api/posts.ts", _page5],
  ["src/pages/api/upload.ts", _page6],
  ["src/pages/archives/index.astro", _page7],
  ["src/pages/og.png.ts", _page8],
  ["src/pages/posts/[...slug]/index.png.ts", _page9],
  ["src/pages/posts/[...page].astro", _page10],
  ["src/pages/posts/[...slug]/index.astro", _page11],
  ["src/pages/robots.txt.ts", _page12],
  ["src/pages/rss.xml.ts", _page13],
  ["src/pages/search.astro", _page14],
  ["src/pages/tags/[tag]/[...page].astro", _page15],
  ["src/pages/tags/index.astro", _page16],
  ["src/pages/index.astro", _page17]
]);
const _manifest = Object.assign(manifest, {
  pageMap,
  serverIslandMap,
  renderers,
  actions: () => import("./_noop-actions.mjs"),
  middleware: () => import("./_noop-middleware.mjs")
});
const _args = {
  "middlewareSecret": "abbd2336-cec2-46a1-97e6-081d292ad90d",
  "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
export {
  __astrojsSsrVirtualEntry as default,
  pageMap
};
