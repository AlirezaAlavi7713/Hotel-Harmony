export function countNights(start, end) {
  if (!start || !end) return 0;

  const d1 = new Date(start);
  const d2 = new Date(end);
  const diff = d2 - d1;

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}