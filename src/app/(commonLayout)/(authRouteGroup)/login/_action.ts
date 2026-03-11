"use  server";

import { httpClient } from "@/lib/axios/httpClient";
import { setTokenINCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.type";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const loginAction = async (payload: ILoginPayload): Promise<ILoginResponse | ApiErrorResponse> => {
    const parsedPayload = loginZodSchema.safeParse(payload);

    if (!parsedPayload.success) {
        const firstError = parsedPayload.error.issues[0].message || "Invalid input";
        return {
            success: false,
            message: firstError
        }
    }
    try {
        const response = await httpClient.post<ILoginResponse>("/auth/login", parsedPayload.data);

        const { accessToken, refreshToken, token, user } = response.data;
        await setTokenINCookies("better-auth.session_token", accessToken);
        await setTokenINCookies("better-auth.session_token", refreshToken);
        await setTokenINCookies("better-auth.session_token", token);

        redirect("/dashboard");

    } catch (error: any) {
        return {
            success: false,
            message: `Login Failed : ${error.message}`,
        }
    }
}