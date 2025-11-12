export const isAuthRoute = (pathname: string) => {
  const authRoutes = ['/unified', '/login', '/register'];
  return authRoutes.some(route => pathname.startsWith(route));
};
