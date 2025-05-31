import { cn } from "@/utils";
import { ReactNode } from "react";

interface MaxWidthWrapperProps {
    className?: string
    children: ReactNode
}

export const MaxWidthWrapper = ({ className, children }: MaxWidthWrapperProps) => {
    return (
        <div
            className={cn(
                "h-full w-full mx-auto max-w-screen-xl px-2.5 md:px-20",
                className
            )}
        >
            {children}
        </div>
    )
}