"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import Reveal from "./Reveal";

export interface TimelineEvent {
  /** 24-hour stamp printed in the left column, e.g. "09:10". */
  time: string;
  title: string;
  note: string;
  href: string;
  /** The most recent development carries the red marker. */
  active?: boolean;
}

/**
 * "The story so far" — a vertical editorial timeline. Timestamps sit large on
 * the left, a hairline runs down the column, and each entry settles in as the
 * reader scrolls (700ms, reduced-motion aware).
 */
export default function Timeline({
  events,
  label = "Time (GMT)",
}: {
  events: TimelineEvent[];
  label?: string;
}) {
  return (
    <div>
      <div className="grid-editorial border-b border-line pb-4">
        <span className="t-meta col-span-12 md:col-span-2">{label}</span>
        <span className="t-meta col-span-12 mt-1 md:col-span-10 md:mt-0">
          Development
        </span>
      </div>

      <ol className="timeline mt-2">
        {events.map((event, index) => (
          <li
            key={`${event.href}-${event.time}-${index}`}
            className="relative pb-10 pl-6 pt-6 md:pl-10"
          >
            <span
              className={cn(
                "timeline-marker",
                event.active && "timeline-marker-active",
              )}
              aria-hidden="true"
            />
            <Reveal timeline delay={Math.min(index, 6) * 90}>
              <div className="grid-editorial">
                <time className="t-meta col-span-12 text-ink md:col-span-2">
                  {event.time}
                </time>
                <div className="col-span-12 mt-2 md:col-span-10 md:mt-0">
                  <h3 className="t-title-sm">
                    <Link
                      href={event.href}
                      className="link-editorial transition-colors duration-300 hover:text-accent"
                    >
                      {event.title}
                    </Link>
                  </h3>
                  {event.note ? (
                    <p className="t-body mt-2">{event.note}</p>
                  ) : null}
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
