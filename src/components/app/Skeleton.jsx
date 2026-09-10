// Skeleton loading state. The documentation asks for one on "everything that
// needs time to be retrieved", so this is a plain box you size to whatever it
// stands in for.
export default function Skeleton({ width, height, className = "", radius }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}
