import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "chat",
  description: "chat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">{children}</div>
  );
}
