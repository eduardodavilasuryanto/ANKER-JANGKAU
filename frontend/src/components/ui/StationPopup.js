import { formatRupiah } from "../../utils/format.js";

export function buildStationPopupHTML(properties) {
  const schedule = properties.first_train
    ? `<div class="station-popup-row">
        <span class="station-popup-label">Jadwal</span>
        <span class="station-popup-value">${properties.first_train} – ${properties.last_train}</span>
      </div>
      <div class="station-popup-row">
        <span class="station-popup-label">Headway</span>
        <span class="station-popup-value">~${properties.headway_minutes} menit</span>
      </div>`
    : "";

  const transfers =
    properties.transfers !== undefined
      ? `<div class="station-popup-row">
          <span class="station-popup-label">Transfer</span>
          <span class="station-popup-value">${properties.transfers} jalur</span>
        </div>`
      : "";

  const housing = properties.housing_price
    ? `<div class="station-popup-row">
        <span class="station-popup-label">Harga hunian</span>
        <span class="station-popup-value">${formatRupiah(properties.housing_price)}/bln</span>
      </div>`
    : "";

  return `
    <div class="station-popup">
      <div class="station-popup-header">
        <strong class="station-popup-name">${properties.station_name}</strong>
        ${properties.line_name ? `<span class="station-popup-line">${properties.line_name}</span>` : ""}
      </div>
      <div class="station-popup-body">
        ${schedule}
        ${transfers}
        ${housing}
      </div>
    </div>
  `;
}
