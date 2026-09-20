"use client";

import Masthead from "./Masthead";
import Footer from "./Footer";
import OverlayProvider from "./OverlayProvider";

export interface StaticSection {
  heading: string;
  body: string[];
}

/**
 * Layout for the three internal pages linked from the footer (About, Privacy,
 * Terms). They share the magazine's masthead, type scale and colophon, and
 * carry no reporting, so the search surfaces open with an empty issue.
 */
export default function StaticPage({
  kicker,
  title,
  standfirst,
  sections,
}: {
  kicker: string;
  title: string;
  standfirst: string;
  sections: StaticSection[];
}) {
  return (
    <OverlayProvider articles={[]}>
      <Masthead />
      <main id="main" className="page-fade">
        <div className="shell pt-16 md:pt-24">
          <p className="t-meta text-accent">{kicker}</p>
          <h1 className="t-article mt-6 max-w-5xl">{title}</h1>
          <p className="t-sub measure mt-8">{standfirst}</p>
          <span className="rule-accent mt-10" />
        </div>

        <div className="shell pt-14 md:pt-20">
          <div className="measure space-y-14">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="t-title uppercase">{section.heading}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="t-copy mt-4">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </OverlayProvider>
  );
}
