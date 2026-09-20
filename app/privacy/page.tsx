import StaticPage from "@/components/StaticPage";

export default function PrivacyPage() {
  return (
    <StaticPage
      kicker="Privacy"
      title="No public tracking, no third-party noise."
      standfirst="NEWSAI avoids the clutter that normally surrounds digital publishing. The product keeps reading simple, internal and respectful."
      sections={[
        {
          heading: "How it works",
          body: [
            "NEWSAI stores the content it needs for the issue, but it does not build a surveillance layer around the reader. The interface is intentionally quiet and minimal, and it avoids third-party data collection patterns.",
            "This project is designed to be self-contained and editorial rather than ad-driven. Reader trust is treated as a product feature, not a tradeoff.",
          ],
        },
        {
          heading: "What we keep",
          body: [
            "The system stores only the data needed to render the issue: article text, timestamps, source metadata, and summary content. It does not expose upstream publication identities in the public interface.",
            "The experience remains deliberately clean. There are no tracker badges, sponsor calls, or provider names in the front-end.",
          ],
        },
      ]}
    />
  );
}
