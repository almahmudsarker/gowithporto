import Card from "@/components/ui/Card";

export default function AIResultPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-10">
      <section>
        <h1 className="font-serif text-3xl mb-4">Your AI Travel Plan ✨</h1>
        <Card>
          <p className="text-lg">Your AI-generated travel plan is ready.</p>
        </Card>
      </section>

      <section>
        <h2 className="font-serif text-2xl mb-4">Itinerary</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <h3 className="font-semibold mb-2">Day 1</h3>
            <p>Historic Center & Ribeira</p>
          </Card>
          <Card>
            <h3 className="font-semibold mb-2">Day 2</h3>
            <p>Douro Valley & Wine</p>
          </Card>
          <Card>
            <h3 className="font-semibold mb-2">Day 3</h3>
            <p>Foz do Douro & Atlantic Coast</p>
          </Card>
        </div>
      </section>
    </div>
  );
}
