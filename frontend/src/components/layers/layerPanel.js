export function mountLayerPanel(root, layers) {
  if (!root) return;
  root.innerHTML = `<h2>Layers</h2>`;
  const list = document.createElement("ul");
  layers.forEach((layer) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <label>
        <input type="checkbox" data-layer="${layer.id}" ${layer.defaultOn ? "checked" : ""} />
        ${layer.label}
      </label>
    `;
    list.appendChild(item);
  });
  root.appendChild(list);
}
