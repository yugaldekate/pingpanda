import { db } from "@/db";
import { router } from "../__internals/router";
import { privateProcedure } from "../procedures";

import { z } from "zod";
import { HTTPException } from "hono/http-exception";
import { startOfDay, startOfMonth, startOfWeek } from "date-fns";

import { parseColor } from "@/utils";
import { CATEGORY_NAME_VALIDATOR } from "@/lib/validators/category-validator";

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

    createEventCategory: privateProcedure
        .input(
            z.object({
                name: CATEGORY_NAME_VALIDATOR,
                color: z
                    .string()
                    .min(1, "Color is required")
                    .regex(/^#[0-9A-F]{6}$/i, "Invalid color format."),
                emoji: z.string().emoji("Invalid emoji").optional(),
            })
        )
        .mutation(async ({ c, ctx, input }) => {
            const { user } = ctx;
            const { color, name, emoji } = input;

            // TODO: ADD PAID PLAN LOGIC

            const eventCategory = await db.eventCategory.create({
                data: {
                    name: name.toLowerCase(),
                    color: parseColor(color),
                    emoji,
                    userId: user.id,
                },
            })

            return c.json({ eventCategory });
        }), 
        
    insertQuickstartCategories: privateProcedure.mutation(async ({ ctx, c }) => {
        const { user } = ctx;

        const categories = await db.eventCategory.createMany({
            data: [
                { name: "Bug", emoji: "🐛", color: 0xff6b6b },
                { name: "Sale", emoji: "💰", color: 0xffeb3b },
                { name: "Question", emoji: "🤔", color: 0x6c5ce7 },
            ].map((category) => ({
                ...category,
                userId: user.id,
            })),
        });

        return c.json({ success: true, count: categories.count });
    }),

    pollCategory: privateProcedure
        .input(z.object({ name: CATEGORY_NAME_VALIDATOR }))
        .query(async ({ c, ctx, input }) => {
            const { name } = input;
            const { user } = ctx;

            const category = await db.eventCategory.findUnique({
                where: { 
                    name_userId: { 
                        name: name, 
                        userId: user.id 
                    } 
                },
                include: {
                    _count: {
                        select: {
                            Event: true,
                        },
                    },
                },
            });

            if (!category) {
                throw new HTTPException(404, {
                    message: `Category "${name}" not found`,
                });
            }

            const hasEvents = category._count.Event > 0;

            return c.json({ hasEvents });
        }),

    getEventsByCategoryName: privateProcedure
        .input(z.object({
                name: CATEGORY_NAME_VALIDATOR,
                page: z.number(),
                limit: z.number().max(50),
                timeRange: z.enum(["today", "week", "month"]),
            })
        )
        .query(async ({ c, ctx, input }) => {
            const { name, page, limit, timeRange } = input;
            const { user } = ctx;

            const now = new Date();
            let startDate: Date;

            switch (timeRange) {
                case "today":
                    startDate = startOfDay(now);
                    break;
                case "week":
                    startDate = startOfWeek(now, { weekStartsOn: 1 }); // Start of week (Monday)
                    break;
                case "month":
                    startDate = startOfMonth(now);
                    break;
            }

            const [events, eventsCount, uniqueFieldCount] = await Promise.all([
                // 1) Fetch events for the given category name & userId, paginated and filtered by time range
                db.event.findMany({
                    where: {
                        EventCategory: { 
                            name: name, 
                            userId: user.id 
                        },
                        createdAt: { 
                            gte: startDate 
                        },
                    },
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { createdAt: "desc" },
                }),

                // 2) Count total events for the given category name & userId, filtered by time range
                db.event.count({
                    where: {
                        EventCategory: { 
                            name: name, 
                            userId: user.id 
                        },
                        createdAt: { 
                            gte: startDate 
                        },
                    },
                }),

                // 3) Count unique field names in events for the given category name & userId, filtered by time range
                db.event.findMany({
                    where: {
                        EventCategory: { 
                            name: name, 
                            userId: user.id 
                        },
                        createdAt: { 
                            gte: startDate 
                        },
                    },
                    select: {
                        fields: true,
                    },
                    distinct: ["fields"],
                })
                .then((events) => {
                    const fieldNames = new Set<string>();

                    events.forEach((event) => {
                        Object.keys(event.fields as object).forEach((fieldName) => {
                            fieldNames.add(fieldName);
                        })
                    })

                    return fieldNames.size;
                }),
            ]);

            return c.superjson({
                events,
                eventsCount,
                uniqueFieldCount,
            });
        }),    
});