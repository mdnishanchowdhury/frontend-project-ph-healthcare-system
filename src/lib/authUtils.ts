export type UserRole = "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT";

export const authRoutes = ["/login", "/regidter", "/forget-password", "/reset-password", "/verify-email"];

export const isAuthRoute = (pathname: string) => {
    return authRoutes.some((router: string) => router === pathname);
}

export type RouteConfig = {
    exact: string[],
    pattern: RegExp[]
}

export const commonProtectedRoutes: RouteConfig = {
    exact: ["/my-profile", "/change-password"],
    pattern: []
}

export const doctorProtectedRoutes: RouteConfig = {
    pattern: [/^\/doctor\/dashboar/],
    exact: ["/payment/success"]
}
export const adminProtectedRoutes: RouteConfig = {
    pattern: [/^\/admin\/dashboar/],
    exact: ["/payment/success"]
}

// export const superAdminProtectedRoutes: RouteConfig = {
//     pattern: [/^\/admin\/dashboar/],
//     exact: ["/payment/success"]
// }

export const patientProtectedRoutes: RouteConfig = {
    pattern: [/^\/dashboard/],
    exact: ["/payment/success"]
}

export const isRouteMatch = (pathname: string, routes: RouteConfig) => {
    if (routes.exact.includes(pathname)) {
        return true;
    }
    return routes.pattern.some((pattern: RegExp) => pattern.test(pathname));
}

export const getRouteOwner = (pathname: string): "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT" | "COMMON" | null => {

    if (isRouteMatch(pathname, doctorProtectedRoutes)) {
        return ("DOCTOR");
    }

    // if (isRouteMatch(pathname, superAdminProtectedRoutes)) {
    //     return ("SUPER_ADMIN");
    // }

    if (isRouteMatch(pathname, adminProtectedRoutes)) {
        return ("ADMIN");
    }

    if (isRouteMatch(pathname, patientProtectedRoutes)) {
        return ("PATIENT");
    }

    if (isRouteMatch(pathname, commonProtectedRoutes)) {
        return ("COMMON");
    }

    return null;
}

export const getDefualtDashboardRoute = (role: UserRole) => {

    if (role === "ADMIN" || role === "SUPER_ADMIN") {
        return "/admin/dashboard";
    }
    if (role === "DOCTOR") {
        return "/doctor/dashboard";
    }
    if (role === "PATIENT") {
        return "/dashboard"
    }

    return "/"
}