export default function CatalogueLoading() {
  return (
    <div className="shell page-intro" role="status">
      <span className="sr-only">Loading lighting catalogue</span>
      <div
        className="catalogue-skeleton catalogue-skeleton-heading"
        aria-hidden="true"
      />
      <div className="card-grid catalogue-skeleton-grid" aria-hidden="true">
        {[0, 1, 2].map((item) => (
          <div
            className="catalogue-skeleton catalogue-skeleton-card"
            key={item}
          />
        ))}
      </div>
    </div>
  );
}
