const GRADIENTS = [
  ['#2DE2E6', '#A855F7'],
  ['#F72585', '#A855F7'],
  ['#4ADE80', '#2DE2E6'],
  ['#F5A524', '#F72585'],
  ['#60A5FA', '#2DE2E6'],
];

function gradientFor(name) {
  const idx = (name || '').charCodeAt(0) % GRADIENTS.length;
  return GRADIENTS[idx] || GRADIENTS[0];
}

export default function Avatar({ name = '?', size = 28 }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const [from, to] = gradientFor(name);

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-display text-xs font-semibold text-ink-950 ring-1 ring-white/10"
      style={{
        width: size,
        height: size,
        backgroundImage: `linear-gradient(135deg, ${from}, ${to})`,
      }}
      title={name}
    >
      {initials}
    </div>
  );
}
