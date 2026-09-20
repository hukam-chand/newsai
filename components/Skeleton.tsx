/**
 * Paper-toned loading states. The magazine never shows a spinner or a rounded
 * techno-placeholder: it shows the shape of the page it is about to print.
 */

export function FeedSkeleton() {
  return (
    <div aria-hidden="true" className="shell">
      <div className="grid-editorial">
        <div className="col-span-12 lg:col-span-5">
          <div className="skeleton h-3 w-28" />
          <div className="skeleton mt-10 h-14 w-full" />
          <div className="skeleton mt-4 h-14 w-4/5" />
          <div className="skeleton mt-8 h-4 w-full" />
          <div className="skeleton mt-3 h-4 w-3/5" />
          <div className="skeleton mt-10 h-12 w-44" />
        </div>
        <div className="col-span-12 lg:col-span-7">
          <div className="skeleton ratio-hero w-full" />
        </div>
      </div>

      <div className="grid-editorial mt-20">
        <div className="col-span-12 lg:col-span-6">
          <div className="skeleton ratio-feature w-full" />
          <div className="skeleton mt-6 h-3 w-24" />
          <div className="skeleton mt-4 h-8 w-full" />
          <div className="skeleton mt-3 h-8 w-2/3" />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <div className="skeleton ratio-feature w-full" />
          <div className="skeleton mt-6 h-3 w-24" />
          <div className="skeleton mt-4 h-8 w-full" />
          <div className="skeleton mt-3 h-8 w-3/4" />
        </div>
      </div>
    </div>
  );
}

export function ArticleSkeleton() {
  return (
    <div aria-hidden="true" className="shell pt-14 md:pt-20">
      <div className="skeleton h-3 w-40" />
      <div className="skeleton mt-10 h-16 w-full" />
      <div className="skeleton mt-4 h-16 w-3/4" />
      <div className="skeleton mt-8 h-4 w-full max-w-2xl" />
      <div className="skeleton mt-3 h-4 w-2/3 max-w-2xl" />
      <div className="skeleton mt-10 h-4 w-64" />
      <div className="skeleton ratio-hero mt-14 w-full" />
      <div className="panel-summary mt-16">
        <div className="skeleton h-3 w-32" />
        <div className="skeleton mt-6 h-5 w-full" />
        <div className="skeleton mt-3 h-5 w-4/5" />
      </div>
      <div className="measure mt-16">
        <div className="skeleton h-4 w-full" />
        <div className="skeleton mt-3 h-4 w-full" />
        <div className="skeleton mt-3 h-4 w-5/6" />
        <div className="skeleton mt-8 h-4 w-full" />
        <div className="skeleton mt-3 h-4 w-3/4" />
      </div>
    </div>
  );
}
