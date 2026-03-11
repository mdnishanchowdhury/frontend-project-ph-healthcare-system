import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Input } from "@base-ui/react";
import type { AnyFieldApi } from "@tanstack/react-form"
import React from "react";

const getErrorMessage = (error: unknown): string => {
    if (typeof error === "string") return error;

    if (error && typeof error === "object") {
        if ("message" in error && typeof error && typeof error.message === "string") {
            return error.message;
        }
    }
    return String(error);
}

type AppFieldProps = {
    field: AnyFieldApi;
    label: string;
    type?: "text" | "email" | "password" | "number";
    placeholder?: string;
    append: React.ReactNode;
    prepend?: React.ReactNode;
    className?: string;
    disable?: boolean;
}

const AppField = ({
    field,
    label,
    type = "text",
    placeholder,
    append,
    prepend,
    className,
    disable = false,
}: AppFieldProps) => {

    const firstError = field.state.meta.isTouched && field.state.meta.errors.length > 0 ? getErrorMessage(field.state.meta.errors[0]) : null;

    const hasError = firstError !== null;


    return (
        <div className={cn("space-y-1.5", className)}>
            <Label
                htmlFor={field.name}
                className={cn(hasError && "text-destructive")}
            >
                {label}
            </Label>

            <div className="relative">
                {
                    prepend && (
                        <div className="absolute inset-y-0 left-0 items-center pl-3 pointer-events-none z-10">
                            <Input
                                id={field.name}
                                name={field.name}
                                type={type}
                                value={field.state.value}
                                placeholder={placeholder}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                aria-invalid={hasError}
                                aria-describedby={hasError ? `${field.name}-error` : undefined}
                                disabled={disable}
                                className={cn(
                                    prepend && "pl-10",
                                    append && "pr-10"
                                )}
                            />

                            {
                                append && (
                                    <div className="absolute inset-0 right-0 items-center pr-3 pointer-events-none z-10">
                                        {append}
                                    </div>)
                            }
                            {
                                hasError && (
                                    <p id={`${field.name}-error`}
                                        role="alert"
                                        className="text-sm text-destructive"
                                    >
                                        {firstError}
                                    </p>
                                )
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}