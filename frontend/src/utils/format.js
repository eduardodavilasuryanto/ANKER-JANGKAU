export function formatRupiah(value) {
  if (!Number.isFinite(Number(value))) return "Data belum tersedia";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatScore(value) {
  return Number.isFinite(Number(value)) ? Number(value).toFixed(1) : "—";
}

export function formatMinutes(value) {
  return Number.isFinite(Number(value))
    ? `${Math.round(value)} menit`
    : "Pilih stasiun kerja";
}
