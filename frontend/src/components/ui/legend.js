export function mountLegend(root) {
  if (!root) return;
  root.innerHTML = `
    <h2>Score colors</h2>
    <ul>
      <li><span class="swatch high"></span> 75 to 100 strong</li>
      <li><span class="swatch mid"></span> 50 to 74 fair</li>
      <li><span class="swatch low"></span> under 50 weak</li>
    </ul>
  `;
}
