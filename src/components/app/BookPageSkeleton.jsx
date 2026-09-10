// Mirrors the real book page's shape so the layout does not jump when the
// data lands: text column on the left, cover on the right.
export default function BookPageSkeleton() {
  return (
    <div className="book">
      <div className="book__content--wrapper">
        <div className="book__content">
          <div className="skeleton" style={{ width: "70%", height: 28 }} />
          <div className="skeleton" style={{ width: "30%", height: 16, marginTop: 16 }} />
          <div className="skeleton" style={{ width: "50%", height: 16, marginTop: 12 }} />

          <div className="skeleton" style={{ width: "100%", height: 72, marginTop: 24 }} />

          <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
            <div className="skeleton" style={{ width: 144, height: 40, borderRadius: 4 }} />
            <div className="skeleton" style={{ width: 144, height: 40, borderRadius: 4 }} />
          </div>

          <div className="skeleton" style={{ width: "40%", height: 16, marginTop: 24 }} />
          <div className="skeleton" style={{ width: "100%", height: 120, marginTop: 24 }} />
        </div>

        <div className="book__img--wrapper">
          <div className="skeleton" style={{ width: 300, height: 300 }} />
        </div>
      </div>
    </div>
  );
}
