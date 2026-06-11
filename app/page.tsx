import Container from "@/shared/components/container";

export default function Home() {
  return (
    <Container>
      <section className="mx-auto flex min-h-[60vh] max-w-5xl items-center px-6 py-16">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
            Deco Spacio
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950">
            Generate your interior preview
          </h1>
        </div>
      </section>
    </Container>
  );
}
