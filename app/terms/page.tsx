import StaticPage from "@/components/StaticPage";

export default function TermsPage() {
  return (
    <StaticPage
      kicker="Terms"
      title="A simple publication charter."
      standfirst="NEWSAI is a magazine-style reading experience. Its purpose is to organise verified reporting into a clear issue structure and present it with editorial care."
      sections={[
        {
          heading: "Use of the service",
          body: [
            "Users may read the reporting in the issue, search the available filings, and navigate internal story pages. Content is presented for editorial consumption, not as a general-purpose social feed.",
            "The site is designed to be clear, readable and stable from one update to the next. It is not built to encourage behavior that disrupts the reading experience.",
          ],
        },
        {
          heading: "Editorial integrity",
          body: [
            "NEWSAI intends to show a clean and verified version of the day's reporting. Where information is unclear or incomplete, the model should not invent certainty. It prefers silence over speculation.",
            "This is an internal publication layer. It does not replicate a newsroom or endorse claims beyond the materials available in the issue window.",
          ],
        },
      ]}
    />
  );
}
