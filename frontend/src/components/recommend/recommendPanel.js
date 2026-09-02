import { fetchRecommendations } from "../../services/api.js";

export function mountRecommendPanel(root) {
  if (!root) return;
  root.innerHTML = `
    <h2>Find a reachable area</h2>
    <form id="recommend-form">
      <label>Monthly rent budget (Rp)
        <input name="budget" type="number" value="1800000" min="100000" required />
      </label>
      <label>Work station
        <input name="work_station" type="text" value="Tebet" required />
      </label>
      <label>Max one-way commute (minutes)
        <input name="max_commute" type="number" value="35" min="5" required />
      </label>
      <button type="submit">Find reachable areas</button>
    </form>
    <div id="recommend-results" class="results"></div>
  `;

  const form = root.querySelector("#recommend-form");
  const results = root.querySelector("#recommend-results");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    results.textContent = "Checking the kitchen...";
    try {
      const payload = {
        budget: Number(data.get("budget")),
        work_station: String(data.get("work_station")),
        max_commute: Number(data.get("max_commute")),
      };
      const body = await fetchRecommendations(payload);
      if (!body.results || body.results.length === 0) {
        results.textContent = "No station area fits this ticket yet. The scored sheet may still be empty.";
        return;
      }
      results.innerHTML = body.results
        .map(
          (card) =>
            `<article class="card"><h3>${card.station_name}</h3><p>${card.explanation}</p></article>`,
        )
        .join("");
    } catch (error) {
      results.textContent = "The kitchen did not answer. Is the backend running on port 8000?";
      console.error(error);
    }
  });
}
