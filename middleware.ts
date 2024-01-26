import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  ignoredRoutes:["/api/:path*"],
});
 
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
 