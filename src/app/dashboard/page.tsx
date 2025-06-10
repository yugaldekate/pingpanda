import { db } from '@/db';

import React from 'react';
import { PlusIcon } from 'lucide-react';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';

import { DashboardPageContent } from './dashboard-page-content';

import { Button } from '@/components/ui/button';
import { DashboardPage } from '@/components/dashboard-page';
import { CreateEventCategoryModal } from '@/components/create-event-category-modal';

const Page = async() => {

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

    return (
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
    )
}

export default Page