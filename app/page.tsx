'use client'

import Navigation from "@/components/home/Navigation/index";
import Main from "@/components/home/Main/index";  
import { useAppStore } from "@/stores";

export default function Home() {
  const { isDrawerOpen } = useAppStore()
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {isDrawerOpen && <Navigation />}
      <Main />
    </div>
  )
}
