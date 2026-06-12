import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

type ContainerProps = {
  children: ReactNode;
};

export default function Container({ children }: ContainerProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-800 selection:bg-indigo-600 selection:text-white">
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}
