import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
    apiVersion: "2025-05-28.basil",
    typescript: true,
})

export const createCheckoutSession = async ({ userEmail, userId }: { userEmail: string, userId: string }) => {
    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: userEmail,
        // This metadata can be used to associate the session with a user in your database using webhooks
        metadata: {
            userId,
        },
        line_items: [
            {
                price: "price_1RaYcvSIwRK9KxYp5s3rSj0K",
                quantity: 1,
            },
        ],
        shipping_address_collection: { allowed_countries: ['IN', 'DE', 'US'] },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    })

    return session;
}
