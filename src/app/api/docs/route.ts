export function GET() {
  return Response.json({
    name: "Lightweight University CMS API",
    auth: {
      login: "POST /api/auth/login",
      me: "GET /api/auth/me",
      logout: "POST /api/auth/logout",
    },
    endpoints: [
      "GET /api/posts?page=1&pageSize=12&q=&category=&status=",
      "POST /api/posts",
      "GET /api/posts/:id",
      "PUT /api/posts/:id",
      "DELETE /api/posts/:id",
      "GET /api/categories",
      "POST /api/categories",
      "GET /api/media",
      "POST /api/media",
      "PUT /api/media/:id",
      "GET /api/users",
      "POST /api/users",
      "GET /api/dashboard",
    ],
    demoAccounts: {
      admin: "admin@scse.local / set with SEED_ADMIN_PASSWORD",
      user: "user@scse.local / set with SEED_USER_PASSWORD",
    },
  });
}
