import StaticPage from "@/components/StaticPage";

export default function AboutPage() {
  return (
    <StaticPage
      kicker="About"
      title="A magazine built for clear thinking."
      standfirst="NEWSAI curates a small, well-verified issue each day so readers can understand what matters without the noise of a feed."
      sections={[
        {
          heading: "Editorial model",
          body: [
            "NEWSAI is designed as a daily magazine, not a social stream. Every issue is cut down to a small set of verified filings, ordered by importance and relevance, and presented with a calm editorial rhythm.",
            "The system reads incoming reports, normalizes the signal, removes upstream branding, and rebuilds the narrative inside a single publication. The result is a cleaner reading experience and a clearer idea of what changed.",
          ],
        },
        {
          heading: "Why it exists",
          body: [
            "The internet has become too loud for serious reading. NEWSAI strips out the noise and focuses on a simple promise: show what happened, why it matters, and what moved next.",
            "By keeping every story internal and editing it like a magazine, the product feels more like a publication than a portal. That makes the reading experience calmer, more deliberate and easier to trust.",
          ],
        },
      ]}
    />
  );
}
