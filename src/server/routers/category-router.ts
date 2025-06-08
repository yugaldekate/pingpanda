import { db } from "@/db";
import { router } from "../__internals/router";
import { privateProcedure } from "../procedures";

import { z } from "zod"
import { startOfMonth } from "date-fns";

export const categoryRouter = router({
    getEventCategories: privateProcedure.query(async ({ c, ctx }) => {
        // Find all eventCategories for the authenticated user
        const categories = await db.eventCategory.findMany({
            where: { 
                userId: ctx.user.id 
            },
            select: {
                id: true,
                name: true,
                emoji: true,
                color: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { updatedAt: "desc" },
        });

        // For each category, calculate:
        // 1. Count of unique fields in events for this category since the start of the month
        // 2. Count of total events for this category since the start of the month
        // 3. Last event created for this category
        // Used Promise.all to handle asynchronous operations efficiently
        const categoriesWithCounts = await Promise.all(
            categories.map(async (category) => {
                const now = new Date();
                const firstDayOfMonth = startOfMonth(now);

                const [uniqueFieldsCount, eventsCount, lastPing] = await Promise.all([
                    // 1. Count unique fields in events for this category since the start of the month
                    db.event.findMany({
                        where: {
                            EventCategory: { 
                                id: category.id 
                            },
                            createdAt: { 
                                gte: firstDayOfMonth 
                            },
                        },
                        select: { fields: true },
                        distinct: ["fields"],
                    })
                    .then((events) => {
                        const fieldNames = new Set<string>();

                        events.forEach((event) => {
                            Object.keys(event.fields as object).forEach((fieldName) => {
                                fieldNames.add(fieldName);
                            });
                        });

                        return fieldNames.size;
                    }),

                    // 2. Count total events for this category since the start of the month
                    db.event.count({
                        where: {
                            EventCategory: { 
                                id: category.id 
                            },
                            createdAt: { 
                                gte: firstDayOfMonth 
                            },
                        },
                    }),

                    // 3. Get the last event created for this category
                    db.event.findFirst({
                        where: {
                            EventCategory: { 
                                id: category.id 
                            },
                        },
                        orderBy: { createdAt: "desc" },
                        select: { createdAt: true },
                    }),
                ]);

                return {
                    ...category,
                    uniqueFieldsCount,
                    eventsCount,
                    lastPing: lastPing?.createdAt || null,
                };
            })
        );

        return c.superjson({ categories: categoriesWithCounts });
    }),

    deleteCategory: privateProcedure
        .input(z.object({ name: z.string() }))
        .mutation(async ({ c, input, ctx }) => {
            const { name } = input;

            await db.eventCategory.delete({
                where: { 
                    name_userId: { 
                        name: name, 
                        userId: ctx.user.id
                    } 
                },
            });

            return c.json({ success: true });
        }),
});