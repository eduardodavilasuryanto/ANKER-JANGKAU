/**
 * Seven transparent sheets stacked on the map.
 * Toggle order is the drawing order from bottom to top.
 */
export const MAP_LAYERS = [
  {
    id: "affordability",
    label: "Ringkasan",
    description: "Skor keterjangkauan per kawasan",
    defaultOn: true,
  },
  {
    id: "catchments",
    label: "Jangkauan",
    description: "Isochrones 15, 30, dan 45 menit",
    defaultOn: false,
  },
  {
    id: "station-premium",
    label: "Harga hunian",
    description: "Harga dan premi stasiun",
    defaultOn: false,
  },
  {
    id: "cost-of-living",
    label: "Biaya hidup",
    description: "Estimasi pengeluaran harian",
    defaultOn: false,
  },
  {
    id: "flood-risk",
    label: "Risiko banjir",
    description: "Paparan bahaya banjir",
    defaultOn: false,
  },
  {
    id: "krl-network",
    label: "Jaringan KRL",
    description: "Lintasan dan stasiun Lin Bogor",
    defaultOn: true,
  },
  {
    id: "ai-highlight",
    label: "Cari kawasan",
    description: "Rekomendasi sesuai preferensi",
    defaultOn: false,
  },
];
export const VIEW_COPY = {
  affordability: [
    "Berapa biaya sebenarnya tinggal dekat stasiun KRL?",
    "Bandingkan skor keterjangkauan antar kawasan pada baseline catchment yang disediakan tim data.",
  ],
  catchments: [
    "Seberapa jauh bisa dicapai dari sini?",
    "Jangkauan mengikuti jaringan dan asumsi perjalanan yang dicatat dalam rilis data.",
  ],
  "station-premium": [
    "Bagaimana harga hunian berubah di sekitar stasiun?",
    "Harga dan model premium ditampilkan hanya ketika metadata model tersedia.",
  ],
  "cost-of-living": [
    "Berapa biaya hidup harian di kawasan ini?",
    "Estimasi berbasis data Menu Go dan Struk Go; periksa cakupan serta tanggal pembaruan.",
  ],
  "flood-risk": [
    "Seberapa besar paparan risiko banjir?",
    "Risiko dan persentase paparan dibedakan agar tidak disalahartikan sebagai skor keterjangkauan.",
  ],
  "krl-network": [
    "Jaringan dan titik stasiun Lin Bogor",
    "Pilih stasiun untuk melihat konteks jaringan dan kawasan yang terkait.",
  ],
  "ai-highlight": [
    "Cari kawasan sesuai preferensi",
    "Masukkan batas sewa bulanan, stasiun kerja, dan waktu perjalanan satu arah.",
  ],
};
