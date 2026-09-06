function floodLabel(score) {
  if (score >= 1) return "tinggi";
  if (score >= 0.5) return "sedang";
  return "rendah";
}

export function createDemoRecommendations({ budget, maxCommute }, catchments) {
  return catchments.features
    .map((feature) => feature.properties)
    .filter((properties) => properties.avg_rent <= budget)
    .filter((properties) => properties.total_commute_time <= maxCommute)
    .sort((first, second) => second.composite_score - first.composite_score)
    .map((properties) => ({
      station_id: properties.station_id,
      station_name: properties.station_name,
      composite_score: properties.composite_score,
      avg_rent: properties.avg_rent,
      total_commute_time: properties.total_commute_time,
      flood_risk_score: properties.flood_risk_score,
      data_source: properties.data_source,
      explanation: `Demo: ${properties.station_name} memiliki skor ${properties.composite_score}. Sewa rata-rata ${new Intl.NumberFormat("id-ID").format(properties.avg_rent)} per bulan, waktu tempuh ${properties.total_commute_time} menit, dan risiko banjir ${floodLabel(properties.flood_risk_score)}.`,
    }));
}
