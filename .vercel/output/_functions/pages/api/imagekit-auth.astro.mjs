import { g as getAuthenticationParameters } from "../../chunks/imagekit_CYVDiiEP.mjs";
import { a as authenticateRequest } from "../../chunks/auth_dCEp9oh9.mjs";
import { renderers } from "../../renderers.mjs";
const prerender = false;
const GET = async ({ request }) => {
  try {
    const auth = await authenticateRequest(request);
    if (!auth.success) {
      return new Response(JSON.stringify({
        success: false,
        error: auth.error
      }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const authParams = getAuthenticationParameters();
    return new Response(JSON.stringify({
      success: true,
      data: authParams
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    console.error("Error generating ImageKit auth:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to generate authentication parameters"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
