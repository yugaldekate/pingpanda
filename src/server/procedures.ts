import { db } from "@/db";
import { j } from "./__internals/j";
import { currentUser } from "@clerk/nextjs/server";
import { HTTPException } from "hono/http-exception";

const authMiddleware = j.middleware(async ({ c, next }) => {
    const authHeader = c.req.header("Authorization");

    if (authHeader) {
        const apiKey = authHeader.split(" ")[1]; // bearer <API_KEY>

        const user = await db.user.findUnique({
            where: { apiKey },
        })

        if (user) return next({ user });
    }

    // If no API key is provided, we check if user is logged in via Clerk
    const auth = await currentUser();

    // If no user is logged in, we throw an error
    if (!auth) {
        throw new HTTPException(401, { message: "Unauthorized" });
    }

    // If user is logged in, we check if they exist in our database
    const user = await db.user.findUnique({
        where: { externalId: auth.id },
    });

    // If user does not exist in our database, we throw an error
    if (!user) {
        throw new HTTPException(401, { message: "Unauthorized" });
    }

    return next({ user });
});

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const baseProcedure = j.procedure;
export const publicProcedure = baseProcedure;
export const privateProcedure = publicProcedure.use(authMiddleware);
