import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MaxWidthWrapper } from "./max-width-wrapper";

import { SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

import { Button, buttonVariants } from "@/components/ui/button";

export const Navbar = async () => {

    const user = await currentUser();

    return (
        <nav className="sticky z-[100] h-16 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg transition-all">
            <MaxWidthWrapper>
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="flex z-40 font-semibold">
                        Ping<span className="text-brand-700">Panda</span>
                    </Link>

                    <div className="h-full flex items-center space-x-4">
                        <Link
                            href="/pricing"
                            className={buttonVariants({
                                size: "sm",
                                variant: "ghost",
                            })}
                        >
                            Pricing
                        </Link>
                        {user ? (
                            <>
                                <SignOutButton>
                                    <Button size="sm" variant="ghost">
                                        Sign out
                                    </Button>
                                </SignOutButton>

                                <Link
                                    href="/dashboard"
                                    className={buttonVariants({
                                        size: "sm",
                                        className: "flex items-center gap-1",
                                    })}
                                >
                                    Dashboard <ArrowRight className="ml-1.5 size-4" />
                                </Link>
                            </>
                        ) : (
                            <>
        
                                <div className="h-8 w-px bg-gray-200" />

                                <Link
                                    href="/sign-in"
                                    className={buttonVariants({
                                        size: "sm",
                                        className: "flex items-center gap-1.5",
                                    })}
                                >
                                    Sign In <ArrowRight className="size-4" />
                                </Link>
                            </>
                        )}
                    </div>    
                </div>
            </MaxWidthWrapper>    
        </nav>
    )
}