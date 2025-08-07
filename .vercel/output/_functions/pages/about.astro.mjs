import { c as createAstro, a as createComponent, r as renderComponent, g as renderTemplate, m as maybeRenderHead, d as renderSlot, u as unescapeHTML } from "../chunks/astro/server_Bp3iFUji.mjs";
import "kleur/colors";
import { $ as $$Layout, a as $$Header, d as $$Footer } from "../chunks/Footer_D4daS1_U.mjs";
import { $ as $$Breadcrumb } from "../chunks/Breadcrumb_C9T3fxxq.mjs";
import { S as SITE } from "../chunks/config_D2KW0BrR.mjs";
import { renderers } from "../renderers.mjs";
const $$Astro = createAstro("https://stack.cowrywise-ambassadors.com/");
const $$AboutLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AboutLayout;
  const { frontmatter: frontmatter2 } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${frontmatter2.title} | ${SITE.title}` }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", $$Header, {})} ${renderComponent($$result2, "Breadcrumb", $$Breadcrumb, {})} ${maybeRenderHead()}<main id="main-content"> <section id="about" class="app-prose mb-28 max-w-app prose-img:border-0"> <h1 class="text-2xl tracking-wider sm:text-3xl">${frontmatter2.title}</h1> ${renderSlot($$result2, $$slots["default"])} </section> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "/workspace/src/layouts/AboutLayout.astro", void 0);
const html = () => '<p>Stack is the official writing platform for the Cowrywise Ambassador Writing Group, bringing together passionate financial writers and educators dedicated to promoting financial literacy across Nigeria.</p>\n<p><img src="/stack-og.jpg" alt="Stack - Cowrywise Ambassador Writing Group"></p>\n<p>Our mission is to democratize financial knowledge by sharing insights, stories, and practical guidance that help Nigerians make informed financial decisions and build sustainable wealth.</p>\n<h2 id="our-vision">Our Vision</h2>\n<p>We believe that financial literacy is the foundation of economic empowerment. Through Stack, our ambassadors create content that:</p>\n<ul>\n<li>Makes complex financial concepts accessible to everyone</li>\n<li>Shares real-world investment strategies and experiences</li>\n<li>Promotes a culture of saving and smart money management</li>\n<li>Builds confidence in financial decision-making</li>\n<li>Inspires the next generation of financially savvy Nigerians</li>\n</ul>\n<h2 id="what-we-offer">What We Offer</h2>\n<p>Stack provides a comprehensive platform where our ambassador writers share:</p>\n<ul>\n<li><strong>Investment Insights</strong> - Learn about various investment opportunities and strategies</li>\n<li><strong>Personal Finance Stories</strong> - Real experiences from people building wealth</li>\n<li><strong>Financial Education</strong> - Beginner-friendly guides to money management</li>\n<li><strong>Market Analysis</strong> - Understanding Nigerian and global financial markets</li>\n<li><strong>Success Stories</strong> - Inspiring journeys of financial growth and independence</li>\n</ul>\n<h2 id="the-cowrywise-ambassador-program">The Cowrywise Ambassador Program</h2>\n<p>Our ambassadors are carefully selected financial enthusiasts who are passionate about:</p>\n<ul>\n<li>Educating others about personal finance and investments</li>\n<li>Building stronger financial communities across Nigeria</li>\n<li>Sharing knowledge about modern fintech solutions</li>\n<li>Promoting financial inclusion and accessibility</li>\n</ul>\n<h2 id="join-our-community">Join Our Community</h2>\n<p>Whether you’re just starting your financial journey or looking to expand your knowledge, Stack welcomes readers from all backgrounds. Follow our stories, engage with our content, and join the conversation about building a financially empowered Nigeria.</p>\n<p>Ready to transform your financial future? Start exploring our content today.</p>';
const frontmatter = { "layout": "../layouts/AboutLayout.astro", "title": "About" };
const file = "/workspace/src/pages/about.md";
const url = "/about";
function rawContent() {
  return "   \n                                    \n              \n   \n\nStack is the official writing platform for the Cowrywise Ambassador Writing Group, bringing together passionate financial writers and educators dedicated to promoting financial literacy across Nigeria.\n\n![Stack - Cowrywise Ambassador Writing Group](/stack-og.jpg)\n\nOur mission is to democratize financial knowledge by sharing insights, stories, and practical guidance that help Nigerians make informed financial decisions and build sustainable wealth.\n\n## Our Vision\n\nWe believe that financial literacy is the foundation of economic empowerment. Through Stack, our ambassadors create content that:\n\n- Makes complex financial concepts accessible to everyone\n- Shares real-world investment strategies and experiences  \n- Promotes a culture of saving and smart money management\n- Builds confidence in financial decision-making\n- Inspires the next generation of financially savvy Nigerians\n\n## What We Offer\n\nStack provides a comprehensive platform where our ambassador writers share:\n\n- **Investment Insights** - Learn about various investment opportunities and strategies\n- **Personal Finance Stories** - Real experiences from people building wealth  \n- **Financial Education** - Beginner-friendly guides to money management\n- **Market Analysis** - Understanding Nigerian and global financial markets\n- **Success Stories** - Inspiring journeys of financial growth and independence\n\n## The Cowrywise Ambassador Program\n\nOur ambassadors are carefully selected financial enthusiasts who are passionate about:\n\n- Educating others about personal finance and investments\n- Building stronger financial communities across Nigeria\n- Sharing knowledge about modern fintech solutions\n- Promoting financial inclusion and accessibility\n\n## Join Our Community\n\nWhether you're just starting your financial journey or looking to expand your knowledge, Stack welcomes readers from all backgrounds. Follow our stories, engage with our content, and join the conversation about building a financially empowered Nigeria.\n\nReady to transform your financial future? Start exploring our content today.\n";
}
async function compiledContent() {
  return await html();
}
function getHeadings() {
  return [{ "depth": 2, "slug": "our-vision", "text": "Our Vision" }, { "depth": 2, "slug": "what-we-offer", "text": "What We Offer" }, { "depth": 2, "slug": "the-cowrywise-ambassador-program", "text": "The Cowrywise Ambassador Program" }, { "depth": 2, "slug": "join-our-community", "text": "Join Our Community" }];
}
const Content = createComponent((result, _props, slots) => {
  const { layout, ...content } = frontmatter;
  content.file = file;
  content.url = url;
  return renderTemplate`${renderComponent(result, "Layout", $$AboutLayout, {
    file,
    url,
    content,
    frontmatter: content,
    headings: getHeadings(),
    rawContent,
    compiledContent,
    "server:root": true
  }, {
    "default": () => renderTemplate`${unescapeHTML(html())}`
  })}`;
});
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Content,
  compiledContent,
  default: Content,
  file,
  frontmatter,
  getHeadings,
  rawContent,
  url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
