import Navigation from "@/components/home/Navigation";
import Main from "@/components/home/Main";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navigation />
      <Main />
    </div>
  )
}
