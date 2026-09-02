# Utils

Pure helper functions live here. These are small, reusable pieces of logic
that do not touch the DOM and do not call the API.

## Examples of what belongs here

- `formatCurrency(amount)` turns `1800000` into `"Rp1,800,000"`
- `interpolateColor(value, low, high)` picks a green-to-red shade for a score
- `clamp(value, min, max)` keeps a number inside bounds

## What does NOT belong here

- Anything that creates or changes HTML elements (that goes in `components/`)
- Anything that calls the backend (that goes in `services/`)
- Configuration values (those go in `config/`)
