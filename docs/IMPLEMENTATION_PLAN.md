# JANGKAU implementation plan

Planning handoff · 6 September 2026 · No application implementation performed.

> Implementation status: the React dashboard, release adapter, recommendation UI, frontend lint/format scripts, Python Ruff configuration, and Cloudflare static-assets adapter are now present. MAPID credentials, the approved release manifest/artifacts, and the AI/Data production API still require their owners before a live deployment can be verified.

Extend the existing `ANKER-JANGKAU/` repository into the seven-screen JANGKAU WebGIS. Preserve Vite, vanilla JavaScript, CSS, and MapLibre; integrate the API and processed datasets supplied by the AI/Data teammate. Prepare two deployment alternatives: Cloudflare Workers and Vercel. This document is the implementation brief for the next model, with unresolved data details explicitly assigned to the supplying team.

**1. Confirmed decisions and source precedence**

| Decision | Implementation instruction |
| --- | --- |
| Project location | Use the existing `ANKER-JANGKAU/` project inside the parent Mapid directory. Do not create a duplicate `jangkau/` or replace the repository. This existing directory satisfies the separate-project-folder request. |
| Scope | Frontend, map interactions, API/data integration, deployment adapters, and verification. AI/Data supplies API business logic, scoring, models, and processed datasets. |
| Geography | Bogor line only. Derive station/catchment counts from the supplied inventory. Treat “73 kawasan,” off-corridor stations, topology, and sample numbers in the wireframes as illustrative. |
| Budget | Monthly rent only, IDR. It does not represent total monthly household expenditure. |
| Commute | Estimated one-way travel to the selected work station, including walking/access, waiting, and rail travel; include transfer components where applicable. No live timetable claims. |
| Score | AI/Data owns the formula, normalization, thresholds, and explanations. The browser never recalculates or repairs it. |
| AI | Deterministic recommendations and supplied explanations; no conversational chatbot or additional LLM. |
| Appearance | Preserve the wireframe structure; adapt the parent `design.md` to it. Semantic map colors/patterns are permitted where useful. |
| Infrastructure | Cloudflare preferred; provide a Vercel alternative. Keep FastAPI. Use R2 for object storage; use D1 only where an application database is actually needed. |
| Schedule | Dependency-based milestones; no calendar deadline or inherited September feature-freeze constraint. |
| Scaffolding | Reuse the existing scaffold. Use official CLI generators for any genuinely new scaffold; never manually recreate a framework starter or overwrite existing application directories. |

Source order: these user decisions; competition obligations; PRD behavior and wireframes; existing repository conventions; proposal suggestions. The proposal's suggested React/LLM stack does not override the existing vanilla-JS repository or the PRD's deterministic recommendation requirement. The user's API ownership and deadline decisions supersede conflicting ownership/freeze passages in `GUIDEBOOK.md`.

Local references, relative to this file:

- [PRD](../../ANKER_PRD_Jangkau.pdf), especially sections 6–9 and wireframe PDF pages 15–17.
- [Proposal](../../Proposal%20Draft%20MAPID-WebGIS-2026.pdf), sections 2.7 and 4.
- [Competition rules](../../Ketentuan%20Data%20%26%20WebGIS%20%20-%20MAPID%20WebGIS%20Competition%202026.pdf), sections B.2, B.6, B.7, and C.
- [Design reference](../../design.md).
- [Repository guidebook](GUIDEBOOK.md) and [contribution guide](../CONTRIBUTING.md).

**2. Existing skeleton: retain versus complete**

This assessment is from source inspection, not a successful build, deployment, or live API test.

| Existing item | Finding and planned treatment |
| --- | --- |
| `frontend/package.json` | Vite `^5.4.10`, MapLibre `^4.7.1`, ES modules; a lockfile exists. Retain stack and begin with `npm ci`. Evaluate dependency upgrades separately after establishing a working baseline. |
| `frontend/src/main.js` | Initializes the map and mounts independent panels. Extend with shared UI state and coordinated events. |
| `frontend/src/config/map.js` | Uses MapLibre demo tiles and ignores declared MAPID/viewport environment values. Replace with verified MAPID configuration. |
| `components/layers/layerPanel.js` | Renders checkboxes but does not connect them to map layers. Introduce seven view presets plus real overlay controls. |
| `components/ui/legend.js` | Static three-class legend. Replace with data-driven five-class score legend and appropriate thematic legends. |
| `components/recommend/recommendPanel.js` | Basic English form; free-text station; cards only show name/explanation. Add station selection, validation, complete metrics, state handling, and map highlighting. Replace interpolation of untrusted strings into HTML with safe text rendering. |
| `backend/app/services/engine.py` | Existing deterministic filter/rank logic. It ignores the destination when choosing commute time and defaults missing numerical values to zero. Report and contract-test these issues with AI/Data; do not take over scoring. |
| `backend/app/services/data_loader.py` | Local relative file loader with indefinitely cached contents; missing file becomes an empty list. Add host-compatible loading/version handling with the API owner. Missing data must be distinguishable from a valid no-match result. |
| `backend/app/schemas/recommend.py` | Existing request/response contract is the compatibility baseline. Additional fields require coordinated agreement with AI/Data. |
| `infra/vercel.json` | Self-rewrite `/api/:path*` to itself does not define a working backend deployment. Replace through the selected deployment plan; ensure the platform actually loads the configuration. |
| Root `.env.example` | Setup writes a root `.env`, but Vite and backend launch from their own directories. Make loading paths explicit. Keep server secrets out of Vite's exposed environment. |
| `scripts/*.ps1` | Windows setup only. Document macOS/Linux commands and preserve Windows support. |
| `.github/workflows/ci.yml` | Already builds frontend with `npm ci` and runs backend pytest. Retain and extend only for meaningful integration checks. |
| Data folders | No actual runtime GIS artifacts were found in the inspected file inventory. Do not claim real-data readiness. |

**3. Ownership and data handoff gate**

WebGIS owns UI, map rendering, adapters, safe display, platform packaging, and public-site verification. AI/Data owns ETL/OCR, PostGIS, OTP, model fitting, interpolation, score calculation, recommendation logic, and numerical explanations. Deploying their FastAPI service is packaging work; changes to its semantics are coordinated changes.

Before real-data integration, obtain a small representative processed release and its OpenAPI/schema documentation from AI/Data. Public web search can find MAPID documentation, but cannot supply team credentials, private project URLs, trained models, or the team's computed artifacts.

Required handoff inventory:

| Artifact | Required content and validation |
| --- | --- |
| Release manifest | `schema_version`, `dataset_version`, generated timestamp, source dates, artifact URLs/keys and checksums, bounds, station count, units, field definitions, score legend breaks, and publication eligibility. |
| Station/network dataset | Stable station IDs, canonical names, coordinates, corridor membership, actual route geometry, and ordering. Do not reproduce the wireframe's schematic network as real geography. |
| Isochrones | GeoJSON polygons/multipolygons, unique catchment IDs, station ID, 15/30/45-minute value, mode, travel assumptions, and version. Longitude/latitude coordinate order. Explain whether polygons represent walking or multimodal access. |
| Baseline scores | One 30-minute baseline record per station area for ranking and overview; score, rent, living-cost fields, flood fields, provenance, sample counts, and quality flags. If supplied at a different grain, agree the adapter before displaying rankings. |
| Destination commute data | Lookup by catchment/origin and destination station, with access, waiting, rail, transfer components and total; schedule/reference date and estimation method. A single scalar per catchment cannot serve all destinations. |
| Housing/model metadata | Price metric with explicit tenure and unit; station premium coefficient, sign interpretation, model scope, R², model version, warnings. Rp/month, Rp/m², and Rp/minute are separate quantities. |
| Flood data | Supplied hazard overlay or suitable derived geometry, risk category, and catchment area-exposure percentage. A 0/0.5/1 risk class is not a percentage. |
| Cost-of-living data | Daily and monthly estimates with calculation basis, included categories, sampling limitations, and source dates. Receipt totals alone do not establish household daily/monthly expenditure. |
| Supporting text | Indonesian explanation templates, source attributions, survey contribution summary, methodology and limitations, approved public survey assets. |

Accept only finite, correctly typed values with stable IDs and matching versions. Missing values remain missing; they must not become zero rent, zero commute, zero risk, or an “interpolated” label without evidence. Geometry and recommendation IDs must join exactly.

AI/Data must resolve these documented conflicts before those values appear as authoritative:

- PRD scoring direction/range versus ranking, and the differing guidebook formula. Request a signed-off schema/methodology version, not a browser-side correction.
- Destination dependence of scores versus a single baseline score. Display the supplied baseline as such until AI/Data specifies a destination-specific score contract.
- Isochrone mode, overlapping catchment treatment, and baseline record grain. Do not count three time bands as three distinct station areas.
- Five-class map legend boundaries versus three explanation bands. They need not be identical, but both must have documented semantics.
- Hedonic coefficient sign and scope; wireframe prices per m² cannot be inferred from rent or from one global coefficient.
- Hotspot method/labels: PRD mentions Gi* alongside High-High/Low-Low labels. Display only an approved method and classification supplied by the owner.

These are data acceptance gates, not reasons to invent a new analysis pipeline. Layout can proceed with empty states. Synthetic fixtures may be used in automated tests; a user-facing mock demo requires explicit agreement and visible labeling. Never silently substitute fabricated production values.

**4. MAPID integration research and implementation gate**

The competition rules require MAPID MAPS as the main basemap; they allow an externally hosted custom WebGIS. A custom MapLibre frontend is compatible with that structure.

Publicly verified documentation:

- MAPID describes account-managed service keys in [Manage API Keys](https://mapid.co.id/docs/manage-api-keys?language=eng).
- Its [API documentation](https://mapid.co.id/docs/api-documentation?language=eng) describes GeoJSON access through a project layer's OPEN API URL and requires a valid license. Obtain the actual layer URL from the team's account; there is no verified universal community-data endpoint in the reviewed material.
- Its [complete documentation](https://mapid.co.id/docs/download_all?language=eng) lists Light MAPID and street basemap variants. Prefer a verified light style appropriate to the white UI.

No working team basemap style/tile endpoint or credential was verified in this planning pass. Do not manufacture a `mapid.io` URL, copy an unrelated public token, or call “Connect to API” documentation an export endpoint: that feature imports external APIs into GEO MAPID.

Implementation gate: obtain the licensed style/service URL, auth mechanism, allowed origins, attribution, and permitted delivery/caching behavior. Verify the entire resource chain: style JSON, source/TileJSON, tiles, sprites, glyphs, CORS, and zoom behavior. Record sanitized URL templates in configuration documentation.

Honor the repository's server-secret rule. If the service requires a secret token, plan an allowlisted same-origin MAPID resource gateway and rewrite all credential-bearing nested resource URLs; proxying only the top-level style is insufficient. Reject arbitrary upstream URLs and redact credentials from logs. Confirm this delivery is permitted by the account's terms before deploying it. Only use direct browser credentials if MAPID explicitly designates them for public client use and their use is reconciled with the repository guidance. `VITE_*` values are public, even when stored in an ignored `.env`.

Production must visibly report basemap failure with retry; it must not silently fall back to demo tiles and claim MAPID compliance. Keep the location table usable if WebGL or the basemap fails.

**5. UI and map specification**

The primary experience opens directly into the analytical dashboard. Do not add a Mintlify-style marketing hero, email signup, login, or decorative cloud artwork. Keep Indonesian user-facing labels as in the PRD and English source/documentation conventions from the repository.

Desktop structure follows pages 15–17: product header and question; left selected-area summary with seven navigation items; main contextual heading/description; map with controls and legend; metric/detail card below. Cari Kawasan places the form above results and map. Maintain one map instance when switching views.

| View | Map behavior | Detail and interaction |
| --- | --- | --- |
| Ringkasan | Baseline affordability choropleth; station selection; subtle network context. | Score, relative rank/count, monthly living estimate, rent, destination commute when selected, separately labeled housing price and flood exposure. Hide unavailable metrics rather than inventing them. |
| Jangkauan | Selected station's real 15/30/45-minute polygons; 30-minute baseline initially; distinguish nested bands. | Mode, duration, supplied area, data provenance, and assumptions. No radius circles substituted for network isochrones. |
| Harga Hunian | Graduated station symbols as shown in the wireframe, driven by a clearly named supplied housing price metric. | Housing unit/tenure, mean or median label, premium coefficient with units, model scope and R²/warning. Do not label identical global coefficients as station-specific predictions. |
| Biaya Hidup | Catchment choropleth of a documented daily or monthly living-cost measure. | Food per portion, daily/monthly values when supplied, comparison basis, sample coverage and provenance. |
| Risiko Banjir | Hazard overlay with category/pattern, catchment boundary, readable station markers. | Exposure percentage, risk class, source/year; distinguish unavailable from low risk. |
| Jaringan KRL | Correct Bogor-line geometry, stations and selection. | Station inventory and supplied network metrics. Headway, transfers or length only when supported by the data. |
| Cari Kawasan | Highlight matching baseline catchments; selected result gets a stronger outline and fitted viewport. | Rent budget, canonical work-station selector, total one-way commute ceiling; ranked cards with score, rent, commute, flood, explanation, quality flag and update date. |

Retain a compact five-class score key across views as requested by PRD section 9, explicitly labeled as the score scale. Show a separate active-layer legend with units; avoid suggesting that flood or rent is measured by the score colors. Read exact breaks from the approved release metadata, not sample wireframe values. Gray/hatching means missing data, never poor affordability.

Provide actual layer visibility/opacity controls in addition to view navigation. A view chooses a useful default combination; users can toggle permitted overlays independently. Suppress conflicting opaque thematic fills by default. Draw fills below hazard patterns, network, station symbols, and selected outlines; avoid hiding basemap labels where feasible.

Include a searchable station/location table and selected-feature attribute table to meet competition interaction requirements. Table selection, map clicks, and recommendation cards update the same selected area. Display approved methodology, sources, survey contribution, and limitations through compact in-dashboard panels rather than new top-level product flows. Hotspot results can appear as supplied insight in Ringkasan; do not add an eighth main screen.

Default state: Ringkasan, 30-minute baseline, fit to supplied corridor bounds, no invented destination. Use an unselected summary until a station is chosen. Keep commute blank with “Pilih stasiun kerja” until destination-specific data exists.

**6. Design adaptation and responsiveness**

Use `design.md` as a token/style reference, preserving it as source material. Document resolved dashboard tokens in a future `docs/DESIGN_DECISIONS.md`; do not mutate the parent reference merely to remove its marketing examples.

| Element | Dashboard treatment |
| --- | --- |
| Typography | Inter, weights 400/500/600, 14–16px body and controls, 20–24px section headings; maintain readable labels and clear hierarchy. |
| Surfaces | White canvas, near-black text, mist/cloud gray borders. Subtle shadows only. |
| Actions | Ink-black primary buttons with white text, 4px radius; mint active navigation and focus accents. Resolve contradictory CTA prose in favor of the explicit button component and Do rules. |
| Shape/spacing | 4px buttons/inputs, 16px cards, up to 24px large panels; 12/16/24px dashboard spacing. Do not apply marketing-page 80px section gaps inside the analytical workspace. |
| Theme | No dark mode, glassmorphism, gradients, pill controls or decorative second accent in the application chrome. Ignore invalid `#0c8c5` hero token because no hero is used. |
| Map data | Sequential green score scale; distinguish risk with restrained amber/red plus patterns if needed. These colors encode data and do not become brand/CTA colors. Never rely on color alone. |
| Width | Comfortable sidebar and flexible map; use available viewport for analysis rather than force a narrow landing-page layout. |

At phone widths, replace the permanent sidebar with a labeled view selector and collapsible selected-area/details panel. Stack recommendation form, results and map with explicit “Peta”/“Hasil” controls if space requires it. Keep map attribution and controls unobstructed; resize MapLibre when panels/layout change. Verify approximately 360, 768, 1280, and 1440px widths, keyboard use, visible focus, reduced motion, screen-reader form labels and result announcements, and adequate touch targets. The table is the non-map path through the same information.

**7. Frontend architecture and API contract**

Keep existing directory names and camelCase JavaScript files. Suggested additions fit existing rooms:

| Location | Responsibility |
| --- | --- |
| `src/main.js` | Bootstrap configuration, release loading, map lifecycle and coordinated UI events. |
| `src/utils/appState.js` | Small observable state: active view, selected station/catchment, duration, destination, layer visibility, release version, recommendation query/status/results. No new framework or global state library. |
| `src/config/map.js`, `layers.js` | Validated public configuration, layer IDs, drawing order and view presets. |
| `src/services/api.js` | Typed-by-contract request validation, timeout/cancellation, errors and latest-request protection. |
| `src/services/datasets.js` | Manifest/artifact loading, version consistency, schema checks and shared in-memory cache. |
| `src/components/map/` | Sources/layers, selection/highlights, fit bounds and feature interactions. |
| `src/components/layers/` | Seven-view navigation and functional overlay controls. |
| `src/components/ui/` | Summary/details, contextual legends, location/attribute tables, loading/error states and source/methodology panels. |
| `src/components/recommend/` | Form, ordered results, empty/error states and map synchronization. |
| `src/styles/` | Tokens, dashboard layout, map controls and responsive component styling. |
| `frontend/tests/` | State/formatting/contract tests and browser journeys. |

API compatibility baseline is `POST /api/v1/recommend` with `budget` integer IDR/month (100,000–50,000,000), `work_station` canonical string, and `max_commute` integer minutes (5–180), as currently defined. Preserve these names until AI/Data publishes a coordinated change. Internally use stable IDs; map the selected ID to the canonical API station name when required.

Existing response envelope: `query`, `count`, `results`; each card includes station ID/name, composite score, average rent, total commute, risk, data source and explanation. Request these additive contract fields from the supplier: `dataset_version`, `schema_version`, `catchment_id`, `isochrone_min`, commute breakdown/method, and quality warnings. Other detail fields can be joined from the matching processed release instead of bloating every result.

Proposed integration behavior:

- Preserve server ranking and use the same records for list and map. Tie ordering belongs in the supplier contract. One recommendation per baseline station area, not duplicate time bands.
- Destination changes invalidate old commute displays and recommendations. Late responses from older searches must not replace newer results; cancel superseded requests or reject by request sequence.
- Distinguish loading, success, valid zero matches, invalid input, missing/unsupported dataset, offline/network failure, rate limit, and server failure. Offer relevant retry/correction actions in Indonesian.
- Do not relax budget/commute limits silently. Surface no-match guidance while retaining entered values.
- Show supplied numerical explanations safely. Flag interpolation separately from missing data; do not turn unknown fields into reassuring claims.
- Reject cross-version joins. On release mismatch, reload the matching manifest or show a refresh/retry state rather than mixing map and card values.
- Use integer rupiah formatting and one-decimal score display; preserve unrounded values for filtering in the supplier API. Never round a commute before applying its ceiling.
- If the API only returns matching candidates, use supplied destination-matrix data for ordinary station details. Do not call recommendations with artificially huge limits to masquerade as a general detail endpoint.

The one-way destination is the selected station because the form has no office address. Do not silently claim an office-door arrival time. Display the commute endpoint and assumptions; adding final walking to an office would require a new input/contract decision.

**8. Deployment alternatives**

Both alternatives use the same frontend and AI/Data FastAPI logic. Choose a host during implementation; implementing both simultaneously is not required. Keep adapters separate from business logic so switching hosts is a packaging change.

| Component | A — Cloudflare preferred | B — Vercel alternative |
| --- | --- | --- |
| Frontend | Vite build on Workers Static Assets. | Vite deployment, project root `frontend/`, output `dist/`. |
| API | Supplied FastAPI app adapted to Python Workers ASGI. | Supplied FastAPI app on Vercel, project root `backend/`. |
| Same-origin requests | Frontend Worker routes `/api/*` to the API Worker through a service binding; static paths go to assets. | Frontend deployment rewrites `/api/*` to the actual backend deployment, retaining `/api/v1/...`. |
| Objects | R2 release artifacts; public only for approved derived outputs. | Same R2 storage, accessed via HTTPS for approved public outputs or server-side S3 credentials for private artifacts. |
| Database | D1 release registry if required; no spatial computation or user-search persistence. | Same D1 registry only if needed, accessed through a narrow authenticated Worker endpoint; never expose a Cloudflare account token to the browser. |
| Main tradeoff | Fits user's provider preference; needs Python Workers compatibility and binding integration checks. | Keeps conventional Python hosting and follows existing repo intent; splits hosting/storage providers and requires correct cross-project routing. |
| Release risk gate | Test actual FastAPI dependencies, ASGI lifecycle, fetch/storage adapter and deployed cold/warm behavior. | Test deployed function imports, bundled/remote data availability, project rewrites and cold/warm behavior. |

Cloudflare documents both [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/) and [FastAPI through its ASGI adapter](https://developers.cloudflare.com/workers/languages/python/packages/fastapi/). Python Workers use their own runtime and tooling: do not assume the existing uvicorn process, native dependencies or relative filesystem paths transfer unchanged. Keep QGIS, PostGIS, OTP, Tesseract and model-training dependencies outside the request-serving bundle. Test the actual supplied service before selecting A as production-ready.

For A, retain normal FastAPI module ownership in `backend/app/`; add a thin Worker entrypoint and storage adapter. Keep uvicorn for conventional local development. Route API requests before any SPA/static fallback and preserve HTTP status/body. Configure service bindings and assets against the actual generated Worker configuration.

For B, use two linked platform projects in the existing single repository. Vercel documents [Vite](https://vercel.com/docs/frameworks/frontend/vite) deployment and recognizes a FastAPI `app/main.py` entrypoint in its [FastAPI guide](https://vercel.com/docs/frameworks/backend/fastapi). Set the backend project root so the existing path resolves correctly. Replace the inert self-rewrite with the backend HTTPS origin; match previews to previews rather than accidentally sending preview traffic to production. Keep API routes ahead of SPA fallback. `infra/vercel.json` must be explicitly passed as local configuration or materialized in the relevant project root; its current location alone does not make it active.

R2 exposes an [S3-compatible API](https://developers.cloudflare.com/r2/api/s3/api/), allowing the Vercel alternative to retain Cloudflare storage. Keep storage SDK dependencies isolated from the Worker runtime adapter. Server credentials remain platform secrets.

[D1 uses SQLite semantics](https://developers.cloudflare.com/d1/); it is not a PostGIS replacement. The current application can operate on versioned JSON without a runtime database. Proposed optional D1 tables are `dataset_releases` (version, manifest key, schema/model versions, timestamp, status, checksum) and `active_release` (environment, release version, activation timestamp). Use a transaction for activation. Do not add user accounts, stored searches, favorites or analytics collection simply to justify a database. If a pinned manifest is sufficient, defer D1 provisioning until there is a concrete need.

**9. CLI setup and configuration plan**

No generator, dependency installation, database creation or deployment runs during this planning task. For implementation:

1. Inspect the working tree and read repository instructions again. Preserve others' changes. Start the implementation branch using the existing contribution flow.
2. Reuse `frontend/` and run `npm ci` there, then establish the current build baseline. Create the conventional backend virtual environment with `python3 -m venv backend/.venv` and install its existing requirements when working on that runtime. Run baseline pytest.
3. Do not run `create-vite` over the existing frontend. If an isolated comparison scaffold becomes necessary, generate it with `npm create vite@latest <temporary-path> -- --template vanilla`, inspect its diff and selectively reconcile it. The official [Vite CLI guide](https://vite.dev/guide/) is the reference; verify Node compatibility before changing major versions.
4. For a new Cloudflare frontend adapter scaffold, use the official `npm create cloudflare@latest` interactive CLI in an isolated temporary directory, select a minimal appropriate Worker template, and record the chosen CLI version/options. Integrate generated platform files into existing `infra/`/frontend responsibilities, without nesting a second product or copying an entire starter over the repo. See [C3 CLI documentation](https://developers.cloudflare.com/workers/get-started/guide/).
5. For Python Workers, generate the platform scaffold in an isolated temporary directory using `uvx --from workers-py pywrangler init`; reconcile generated configuration with the existing `backend/pyproject.toml` and app. Do not run init destructively over existing metadata. Official [Python Workers tooling](https://developers.cloudflare.com/workers/languages/python/) documents `uv run pywrangler dev` and `uv run pywrangler deploy`. Pin the selected tooling in the implementation.
6. For Vercel, link the existing frontend/backend directories with the Vercel CLI and configure their roots/build settings; no replacement application scaffold is needed. Verify a preview before production deployment.
7. Document macOS/Linux and Windows setup, supported runtime versions, project roots, and exact final commands in README/infra docs. Retain generator-created provenance and lockfiles.

Configuration contract:

- Public frontend: API base (prefer empty for same-origin), MAPID gateway/style URL with no server secret, public manifest URL/version, optional map viewport defaults.
- Backend: environment, allowed origins when direct calls are necessary, dataset version/manifest or artifact binding, logging level; conventional file path only for local development or deliberately bundled releases.
- Platform secrets: MAPID secret, private R2 credentials for Vercel, any narrow release-registry token. Cloudflare uses bindings where available.
- Resolve `.env` paths explicitly by runtime, rather than assuming the root file is automatically loaded. The local Vite `/api` proxy should be used consistently instead of bypassed by a default `http://localhost:8000` browser base URL.
- Keep canonical platform configuration in `infra/` where practical, with explicit build/CLI paths or documented generated root copies. Ensure asset and entrypoint paths resolve from the config's real location.

**10. Artifact publishing, freshness and failure behavior**

AI/Data controls when a new dataset is produced. WebGIS consumes completed releases; it does not schedule or implement the scientific pipeline. The PRD's weekly cadence can be supported without hardcoding expired dates.

Publish immutable artifacts under a versioned R2 prefix. Validate schema, checksums, record counts, field ranges and cross-artifact IDs before activating a release. Publish the manifest last and only then switch the active-release pointer or deployment-pinned version. Retain the previous working release for rollback.

An application session pins a release version. Both API results and map artifacts identify that version. The API must either support the requested retained version or explicitly indicate a version mismatch so the client can reload. Never update one file in place while leaving the rest of the release stale.

Use long-lived caching for immutable artifact URLs, short/revalidated caching for an active manifest, and version-aware backend caches. Replace the current permanent path-only cache. Do not rely on an in-memory cache surviving a serverless restart, or perform a full object download on every recommendation request.

Only publish approved aggregated/derived outputs. Keep raw MAPID/community data, receipt photos, personal information, private survey details and credentials out of frontend assets and public buckets. Public maps inherently expose the geometry/properties sent to the browser; strip nonpublic attributes before publication rather than relying on hidden UI fields.

Display release/source dates and quality flags. A failed refresh keeps the last validated release with clear freshness information; a service without any valid release returns an unavailable state, not a valid empty recommendation set. API health should distinguish process liveness from dataset readiness. Use structured platform logs with duration/status/version; avoid logging personal input or secrets unnecessarily.

**11. Ordered milestones and completion checks**

| Milestone | Work | Exit condition |
| --- | --- | --- |
| M0 — Baseline and contracts | Verify existing build/tests, explicit env loading, inventory supplied data/API, confirm MAPID service configuration; reconcile ownership and outdated guidebook passages. | Reproducible baseline and written API/artifact contract. Missing supplier items are tracked with owners. No invented production data. |
| M1 — UI shell | Apply design tokens and Indonesian copy; build wireframe navigation, selected-area summary, map/detail layout, responsive behavior and loading/empty states. | All seven views navigable at desktop/phone widths; no unnecessary new framework. |
| M2 — Map foundation | Connect MAPID, load one validated release, correct corridor network, real sources/layers, feature selection, view presets, overlay controls, legends and tables. | Clicking a station/catchment or table row selects the same area; visible layers/legends agree; no off-corridor placeholder data. |
| M3 — Analytical views | Complete overview, reach, housing/premium, living cost, flood and network detail metrics; provenance/methodology panels. | Every displayed number has a field, unit, version and source; missing fields visibly remain missing. |
| M4 — Recommendations | Integrate supplied endpoint, canonical destination selection, total-commute contract, states/cancellation, result cards and map highlights. | Different destinations use the appropriate commute data; rent/commute boundaries honored; map/list/results versions agree. |
| M5 — Selected hosting alternative | Generate/reconcile platform adapter via CLI, provision only needed R2/D1 resources, configure routes/secrets, release loader/cache and preview deployment. | Public preview passes API/map/resource-chain smoke tests and release rollback. Host-specific failures are resolved before production. |
| M6 — Verification and handoff | Complete browser/contract tests, performance measurement, accessibility checks, documentation and production deployment checklist. | Acceptance matrix passes with real supplied data; no demo tiles, fake scores, raw-data leaks or inactive controls. |

Dependencies: M1 can proceed with explicit unavailable states while M0 data access is pending. M2/M3 require approved artifacts. M4 requires the supplied API and destination semantics. A small host compatibility check can run early after M0, before investing in the full adapter. Scientific-data gates must not be bypassed to declare M6 complete.

**12. Verification matrix**

| Concern | Meaningful verification |
| --- | --- |
| Existing regressions | `npm ci` / `npm run build` in frontend; `python -m pytest -q` in backend when its dependencies are installed. Run again after relevant changes, not endlessly without a reason. |
| Data contracts | Invalid IDs, missing/NaN values, wrong units, malformed polygons, wrong corridor, duplicate baseline entries, mismatched versions and missing required fields fail validation. |
| API semantics | Supplier-approved fixtures at exact budget and commute boundaries; two destination stations; unreachable route; missing rent/commute/risk; interpolated record; no matches; dataset unavailable. Assert filtering/explanation numbers against known expected outputs. |
| UI concurrency | Rapid successive searches and destination changes cannot display stale results; timeout and retry preserve input; strings from API cannot inject markup. |
| Maps | Seven views, actual toggles, expected legends, overlap selection, selected outlines, fit bounds and map/table/card synchronization. Map failures leave usable tabular information. |
| Accessibility/responsiveness | Keyboard form/navigation/table operation, labels and announced statuses, readable contrast, patterns beyond color, reduced motion, phone/tablet/desktop layouts and real mobile-browser checks. |
| Performance | Measure first usable MAPID map with baseline data on a documented mobile/network profile; target under 3 seconds, pursue the stricter PRD under-2-second aspiration where practical. Measure warm recommendation endpoint under 800ms and report cold-start/end-to-end latency separately. |
| Deployment | Direct and proxied API status codes, unknown `/api/*` returning API errors rather than SPA HTML, refreshed page loading, preview isolation, CORS/resource-chain success, secrets absent from frontend bundle and responses. |
| Release operation | Valid upload/activation, partial or invalid release rejection, new version invalidation, old-session mismatch behavior and rollback to previous complete dataset. |

Use focused unit tests for shared state/formatting/schema adapters and browser journeys for cross-component behavior. If adding a browser test tool, install/init it with its official CLI into `frontend/tests/` and record that setup. Do not write snapshot tests for every CSS rule. Runtime adapters need deployed smoke checks; a successful local Python test alone does not establish Worker compatibility.

**13. Handoff instructions for the implementing model**

Read this plan and the existing guidebook before edits. Start at M0 and preserve the repository's working stack and room names. Only create new scaffolding through official CLI tools. Do not rebuild the scientific pipeline, change the score, infer commute components, or substitute wireframe example values for missing data.

When a required provider URL, credential, dataset field or numerical definition is missing, ask the user or record the precise request for the AI/Data owner before dependent implementation. Continue independent UI work using explicit missing-data states. Do not send messages to teammates without user authorization.

Maintain a milestone checklist and a short decision log. Update API/ownership/deployment sections of the guidebook when agreed contracts are integrated. Keep the two hosting alternatives documented; choose one after its compatibility gate. The final implementation handoff should identify what works, what was tested with real data, the chosen hosting route, any unresolved supplier dependencies, and exact development/deployment commands.
