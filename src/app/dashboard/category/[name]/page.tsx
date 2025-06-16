import { db } from "@/db";

import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { DashboardPage } from "@/components/dashboard-page";
import { CategoryPageContent } from "./category-page-content";

interface PageProps {
    params: {
        name: string | string[] | undefined
    }
}

const Page = async ({ params }: PageProps) => {

    if (!params || !params.name || typeof params.name !== "string") return notFound();

    const { name } = params;

    const auth = await currentUser();

    if (!auth) {
        return notFound();
    }

    const user = await db.user.findUnique({
        where: { externalId: auth.id },
    });

    if (!user) return notFound();

    const category = await db.eventCategory.findUnique({
        where: {
            name_userId: {
                name: name,
                userId: user.id,
            },
        },
        include: {
            _count: {
                select: {
                    Event: true,
                },
            },
        },
    });

    if (!category) return notFound();

    const hasEvents = category._count.Event > 0;

    return (
        <DashboardPage title={`${category.emoji} ${category.name} events`}>
            <CategoryPageContent hasEvents={hasEvents} category={category} />
        </DashboardPage>
    )
}

export default Page
