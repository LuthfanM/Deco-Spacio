export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400 shrink-0 font-mono mt-auto shadow-inner">
      <div className="w-full px-[5%] flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>
          &copy; 2026 Deco Spacio AI Studio, Inc. Built for design
          craftsmanship.
        </p>
        <div className="flex gap-4">
          <span
            className="hover:text-slate-600 transition-colors cursor-help"
            title="No telemetry logged to standard external sockets."
          >
            Privacy Honored
          </span>
          <span>&middot;</span>
          <span className="hover:text-slate-600 transition-colors cursor-help animate-pulse">
            Core Engine V3.01
          </span>
        </div>
      </div>
    </footer>
  );
}
