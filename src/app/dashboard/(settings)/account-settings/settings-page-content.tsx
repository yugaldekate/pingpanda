"use client"

import Link from "next/link";
import { useState } from "react";

import { Card } from "@/components/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { client } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";

const discordIdSupportLink = "https://support.discord.com/hc/en-us/articles/4407571667351-How-to-Find-User-IDs-for-Law-Enforcement";

export const AccountSettings = ({ discordId: initialDiscordId }: { discordId: string }) => {
    const [discordId, setDiscordId] = useState(initialDiscordId);

    const { mutate, isPending } = useMutation({
        mutationFn: async (discordId: string) => {
            const res = await client.project.setDiscordID.$post({ discordId });
            return await res.json();
        },
    });

    return (
        <Card className="max-w-xl w-full space-y-4">
            <div className="pt-2">
                <Label>Discord ID</Label>
                <Input
                    className="mt-1"
                    value={discordId}
                    onChange={(e) => setDiscordId(e.target.value)}
                    placeholder="Enter your Discord ID"
                />
            </div>

            <p className="mt-2 text-sm/6 text-gray-600">
                Don&apos;t know how to find your Discord ID?{" "}
                <Link href={discordIdSupportLink} target="_blank" className="text-brand-600 hover:text-brand-500">
                    Learn how to obtain it here
                </Link>
                .
            </p>

            <div className="pt-4">
                <Button onClick={() => mutate(discordId)} disabled={isPending}>
                    {isPending ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </Card>
    )
}
