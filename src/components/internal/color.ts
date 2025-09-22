export function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  const chunkSize = normalized.length === 3 ? 1 : 2;
  const r = parseInt(normalized.slice(0, chunkSize), 16);
  const g = parseInt(normalized.slice(chunkSize, chunkSize * 2), 16);
  const b = parseInt(normalized.slice(chunkSize * 2, chunkSize * 3), 16);
  const toChannel = (value: number) => (chunkSize === 1 ? value * 17 : value);
  return `rgba(${toChannel(r)}, ${toChannel(g)}, ${toChannel(b)}, ${alpha})`;
}
