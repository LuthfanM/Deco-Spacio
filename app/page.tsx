import PreviewCard from "@/features/main-canvas/components/PreviewCard";
import Container from "@/shared/components/Container";

export default function Home() {
  const activeImage = null;

  return (
    <Container>
      <section className="mx-auto flex min-h-[60vh] max-w-5xl items-center px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-4 items-start">
          {/* preview card */}
          <div>{/* left */}</div>
          <div className="justify-self-end">
            <PreviewCard image={activeImage} />
          </div>
        </div>
      </section>
    </Container>
  );
}
