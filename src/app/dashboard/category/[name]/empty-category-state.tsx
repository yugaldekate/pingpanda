import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { client } from "@/lib/client";
import { Card } from "@/components/card";

export const EmptyCategoryState = ({ categoryName }: { categoryName: string }) => {
    const router = useRouter();

    const { data } = useQuery({
        queryKey: ["category", categoryName, "hasEvents"],
        queryFn: async () => {
            const res = await client.category.pollCategory.$get({
                name: categoryName,
            });

            return await res.json();
        },
        refetchInterval(query) {
            return query.state.data?.hasEvents ? false : 1000;
        },
        retry: 10,
    });

    const hasEvents = data?.hasEvents;

    useEffect(() => {
        if (hasEvents) router.refresh();
    }, [hasEvents, router]);

    const codeSnippet = `await fetch('https://pingpanda-jade.vercel.app/api/v1/events', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer <YOUR_API_KEY>'
        },
        body: JSON.stringify({
            category: '${categoryName}',
            fields: {
                field1: 'value1', // for example: user id
                field2: 'value2' // for example: user email
            }
        })
    })`

    return (
        <Card
            className="flex-1 flex items-center justify-center"
            contentClassName="max-w-2xl w-full flex flex-col items-center p-6"
        >
            <h2 className="text-xl/8 font-medium text-center tracking-tight text-gray-950">
                Create your first{" "}
                <span className="font-bold text-2xl/8 text-brand-700">
                    {categoryName}
                </span>{" "}
                event
            </h2>
            <p className="text-sm/6 text-gray-600 mb-8 max-w-md text-center text-pretty">
                Get started by sending a request to our tracking API:
            </p>

            <div className="w-full max-w-2xl  bg-gray-900 rounded-xl shadow-lg overflow-hidden">
                <div className="flex justify-between items-center w-full rounded-t-lg bg-gray-800 px-4 py-2">
                    <div className="flex space-x-2">
                        <div className="size-3 rounded-full bg-red-500" />
                        <div className="size-3 rounded-full bg-yellow-500" />
                        <div className="size-3 rounded-full bg-green-500" />
                    </div>

                    <span className="text-gray-400 text-sm">your-first-event.js</span>
                </div>

                <SyntaxHighlighter
                    language="typescript"
                    style={{
                        ...oneDark,
                        'pre[class*="language-"]': {
                            ...oneDark['pre[class*="language-"]'],
                            background: "transparent",
                            overflow: "hidden",
                        },
                        'code[class*="language-"]': {
                            ...oneDark['code[class*="language-"]'],
                            background: "transparent",
                        },
                    }}
                    customStyle={{
                        borderRadius: "0px",
                        margin: 0,
                        padding: "1rem",
                        fontSize: "0.875rem",
                        lineHeight: "1.5",
                    }}
                >
                    {codeSnippet}
                </SyntaxHighlighter>
            </div>

            <div className="mt-8 flex flex-col items-center space-x-2">
                <div className="flex gap-2 items-center">
                    <div className="size-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm text-gray-600">
                        Listening to incoming events...
                    </span>
                </div>

                <p className="text-sm/6 text-gray-600 mt-2">
                    Need help? Check out our{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                        documentation
                    </a>{" "}
                    or{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                        contact support
                    </a>
                    .
                </p>
            </div>
        </Card>
    )
}
