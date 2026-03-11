import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input"; 
import type { AnyFieldApi } from "@tanstack/react-form";
import React from "react";

const getErrorMessage = (error: unknown): string => {
    if (typeof error === "string") return error;
    if (error && typeof error === "object") {
        if ("message" in error && typeof error.message === "string") {
            return error.message;
        }
    }
    return String(error);
};

type AppFieldProps = {
    field: AnyFieldApi;
    label: string;
    type?: "text" | "email" | "password" | "number";
    placeholder?: string;
    append?: React.ReactNode;
    prepend?: React.ReactNode;
    className?: string;
    disable?: boolean;
};

export const AppField = ({
    field,
    label,
    type = "text",
    placeholder,
    append,
    prepend,
    className,
    disable = false,
}: AppFieldProps) => {
    const firstError =
        field.state.meta.isTouched && field.state.meta.errors.length > 0
            ? getErrorMessage(field.state.meta.errors[0])
            : null;

    const hasError = firstError !== null;

    return (
        <div className={cn("space-y-1.5 w-full", className)}>
            <Label
                htmlFor={field.name}
                className={cn(hasError && "text-destructive")}
            >
                {label}
            </Label>

            <div className="relative flex flex-col gap-1">
                <div className="relative flex items-center">
                    {/* Prepend Icon/Text */}
                    {prepend && (
                        <div className="absolute left-3 flex items-center justify-center pointer-events-none z-10 text-muted-foreground">
                            {prepend}
                        </div>
                    )}

                    {/* Input field - এখন এটি কন্ডিশনের বাইরে */}
                    <Input
                        id={field.name}
                        name={field.name}
                        type={type}
                        value={field.state.value}
                        placeholder={placeholder}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={disable}
                        aria-invalid={hasError}
                        className={cn(
                            prepend && "pl-10",
                            append && "pr-10",
                            hasError && "border-destructive focus-visible:ring-destructive"
                        )}
                    />

                    {/* Append Icon/Button */}
                    {append && (
                        <div className="absolute right-0 flex items-center justify-center pr-1 z-10">
                            {append}
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {hasError && (
                    <p
                        id={`${field.name}-error`}
                        role="alert"
                        className="text-xs font-medium text-destructive mt-1"
                    >
                        {firstError}
                    </p>
                )}
            </div>
        </div>
    );
};