import Grid from "@/components/layout/Grid";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function Home() {
  return (
    <main className="p-8 space-y-10">
      <section>
        <h1 className="text-5xl font-serif text-primary">GoWithPorto</h1>
        <p className="mt-2 font-sans text-lg">
          AI-powered Porto travel experience
        </p>
        <div className="mt-6 flex gap-3">
          <Button>Generate AI Plan</Button>
          <Button variant="secondary">Explore Products</Button>
        </div>
      </section>

      <Grid>
        <Card>
          <h3 className="font-serif text-xl">AI Itineraries</h3>
          <p className="mt-2 text-sm">
            Smart day-by-day plans based on your budget.
          </p>
        </Card>
        <Card>
          <h3 className="font-serif text-xl">Local Guides</h3>
          <p className="mt-2 text-sm">Hire verified Porto guides.</p>
        </Card>
        <Card>
          <h3 className="font-serif text-xl">Souvenirs</h3>
          <p className="mt-2 text-sm">Authentic local products delivered.</p>
        </Card>
      </Grid>
    </main>
  );
}
