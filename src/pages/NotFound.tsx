import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/common/primitives";
import { NAV_LINKS } from "@/data/site";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <Section tone="paper" className="py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl rounded-xl border border-line bg-card p-8 shadow-neo sm:p-12">
          <p className="font-display text-6xl font-bold leading-none">404</p>
          <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
            This page does not exist — but your future still does.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            The link may be old or mistyped. Here is where most students go next.
          </p>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-xl border border-line bg-paper px-4 py-3 text-sm font-bold hover:bg-neo-yellow"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="neo-blue" className="font-bold">
              <Link to="/catalog">Course & exam catalogue</Link>
            </Button>
            <Button asChild variant="neo" className="font-bold">
              <Link to="/pathfinder">Find your path</Link>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
