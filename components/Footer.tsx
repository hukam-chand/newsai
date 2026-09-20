import Link from "next/link";
import { issueDate, issueNumber } from "@/lib/editorial";

/**
 * The last page of the magazine: one enormous wordmark, one line of belief,
 * three internal links and a great deal of paper.
 */
export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line md:mt-32">
      <div className="shell pb-16 pt-16 md:pb-24 md:pt-24">
        <p className="t-meta">
          Issue {issueNumber()} · {issueDate()} · Independent editorial
          intelligence
        </p>

        <p
          className="mt-12 font-serif uppercase leading-[0.82] tracking-[-0.02em] text-ink"
          style={{ fontSize: "clamp(3.2rem, 15vw, 12rem)" }}
        >
          NEWSAI
        </p>

        <p className="t-sub mt-8 max-w-xl italic">
          “A magazine that thinks.”
        </p>

        <nav
          aria-label="Publication"
          className="mt-16 flex flex-wrap gap-x-12 gap-y-4 border-t border-line pt-8"
        >
          <Link className="t-meta link-editorial hover:text-ink" href="/about">
            About
          </Link>
          <Link className="t-meta link-editorial hover:text-ink" href="/privacy">
            Privacy
          </Link>
          <Link className="t-meta link-editorial hover:text-ink" href="/terms">
            Terms
          </Link>
        </nav>

        <p className="t-note mt-10 max-w-2xl">
          Every brief in this edition is verified internally before publication.
          NEWSAI does not link out to other publications, and no third-party
          name, mark or address appears anywhere in this issue.
        </p>
      </div>
    </footer>
  );
}
