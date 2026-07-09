import { A as ALL_SESSION_COOKIES } from './adminSession_CjGRXWxI.mjs';

const prerender = false;
const GET = async ({ cookies, redirect }) => {
  for (const name of ALL_SESSION_COOKIES) {
    cookies.delete(name, { path: "/" });
  }
  return redirect("/admin/login");
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
