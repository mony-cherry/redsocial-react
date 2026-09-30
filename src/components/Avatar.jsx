export function Avatar({ initials, size = 'regular' }) {
  return <span className={`avatar ${size}`}>{initials}</span>;
}
