"use client";

/**
 * The only always-present control on small screens: a quiet floating
 * "Ask NEWSAI" affordance. No hamburger menu, no mobile navbar, no sidebar.
 */
export default function AskFab({
  onOpen,
  hidden = false,
}: {
  onOpen: () => void;
  hidden?: boolean;
}) {
  if (hidden) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-end p-4 md:hidden">
      <button
        type="button"
        onClick={onOpen}
        className="pointer-events-auto inline-flex items-center gap-2 border border-ink bg-paper px-4 py-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink transition-colors duration-300 hover:bg-ink hover:text-paper"
        style={{ borderRadius: 2 }}
      >
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
        Ask NEWSAI
      </button>
    </div>
  );
}
