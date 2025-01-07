import { NextRequest } from "next/server";

const publicRoutes = ["/landing"];
const authRoutes = [
  "/",
  "/signup",
  "/forgot-password",
  "/confirm-account",
  "/reset-password",
  "/verify-mfa",
];
const DEFAULT_Logged_Redirect = "/home";
const apiAuthPrefix = "/api";

export function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const isLoggedIn = !!req.cookies.get("accessToken")?.value;

  const isApiAuthRoutes = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isPublicRoutes = publicRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoutes) {
    return undefined;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_Logged_Redirect, nextUrl));
    }
    return undefined;
  }

  if (!isLoggedIn && !isPublicRoutes) {
    return Response.redirect(new URL("/", nextUrl));
  }

  return undefined;
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
