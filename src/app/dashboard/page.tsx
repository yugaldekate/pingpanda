import { db } from '@/db';

import React from 'react';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { DashboardPage } from '@/components/dashboard-page';
import { DashboardPageContent } from './dashboard-page-content';

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
        <DashboardPage title="Dashboard" >
            <DashboardPageContent/>
        </DashboardPage>
    )
}

export default Page