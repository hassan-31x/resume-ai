import { ReactNode } from "react";

interface BrowseLayoutProps {
  children: ReactNode;
}

export default function BrowseLayout({ children }: BrowseLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="py-4">{children}</main>
    </div>
  );
} 