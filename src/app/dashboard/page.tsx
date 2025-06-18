import { db } from '@/db';

import React from 'react';
import { PlusIcon } from 'lucide-react';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';


import { createCheckoutSession } from '@/lib/stripe';

import { Button } from '@/components/ui/button';
import { DashboardPage } from '@/components/dashboard-page';
import { DashboardPageContent } from './dashboard-page-content';
import { PaymentSuccessModal } from '@/components/payment-success-modal';
import { CreateEventCategoryModal } from '@/components/create-event-category-modal';

interface PageProps {
    searchParams: {
        [key: string]: string | string[] | undefined
    }
}

const Page = async({ searchParams }: PageProps) => {

    const auth = await currentUser();

    if (!auth) {
        redirect("/sign-in");
    }

    const user = await db.user.findUnique({
        where: { externalId: auth.id },
    });

    if (!user) {
        return redirect("/welcome");
    }

    const intent = searchParams.intent;

    if (intent === "upgrade") {
        const session = await createCheckoutSession({
            userEmail: user.email,
            userId: user.id,
        });

        if (session.url) redirect(session.url);
    }

    const success = searchParams.success;

    return (
        <>
            {success ? <PaymentSuccessModal /> : null}

            <DashboardPage 
                title="Dashboard" 
                cta={
                    <CreateEventCategoryModal>
                        <Button className="w-full sm:w-fit">
                            <PlusIcon className="size-4 mr-2" />
                            Add Category
                        </Button>
                    </CreateEventCategoryModal>
                }
                >
                <DashboardPageContent/>
            </DashboardPage>
        </>
    )
}

export default Page