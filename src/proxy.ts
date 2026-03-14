import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { jwtUtils } from './lib/jwtUtils';
import { getDefualtDashboardRoute, getRouteOwner, isAuthRoute, UserRole } from './lib/authUtils';

export function proxy(request: NextRequest) {
    try {
        const { pathname } = request.nextUrl;
        const accessToken = request.cookies.get("accessToken")?.value;
        const refreshToken = request.cookies.get("refreshToken")?.value;

        const decodedAccessToken = accessToken && jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string).data;

        const isValidAccessToken = accessToken && jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string).success;

        let userRole: UserRole | null = null;

        if (decodedAccessToken) {
            userRole = decodedAccessToken.role as UserRole;
        }

        const routerOwner = getRouteOwner(pathname);

        const unitySuperAdminAndAdminRole = userRole === "SUPER_ADMIN" ? "ADMIN" : userRole;

        userRole = unitySuperAdminAndAdminRole;

        const isAuth = isAuthRoute(pathname);
        // login route
        if (isAuth && isValidAccessToken) {
            return NextResponse.redirect(new URL(getDefualtDashboardRoute(userRole as UserRole), request.url));
        }

        // public route
        if (routerOwner === null) {
            return NextResponse.next();
        }
        // user is not logged in but public route access
        if (!accessToken) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }
        // user trying to access common protected route
        if (routerOwner === "COMMON") {
            return NextResponse.next();
        }

        // user trying to visit role based protected but does not hove required to their default dashboard

        if(routerOwner === "ADMIN" || routerOwner === "DOCTOR" || routerOwner === "PATIENT" ){
            return NextResponse.redirect(new URL(getDefualtDashboardRoute(userRole as UserRole), request.url));
        }

        return NextResponse.next();


    } catch (error) {
        console.error("Error in proxy Middleware", error)
    }
}


export const config = {
    matcher: [
        '/((?!api/_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)'
    ]
}