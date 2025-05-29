import { RecentPost } from "./components/post";

export default async function Home() {
  
  return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-medium font-heading tracking-tight sm:text-[5rem]">
            <span className="text-brand-700">j</span>stack
          </h1>

          <p className="text-center max-w-prose text-balance">
            The modern way to confidently ship high-performance, low-cost
            Next.js apps. End-to-end typesafe with an incredible DX.
          </p>

          <RecentPost />
        </div>
      </main>
  )
}
