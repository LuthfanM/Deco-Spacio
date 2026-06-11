import type { ReactNode } from "react";
import Footer from "./footer";
import Header from "./header";

type ContainerProps = {
  children: ReactNode;
};

export default function Container({ children }: ContainerProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-800 selection:bg-indigo-600 selection:text-white">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
