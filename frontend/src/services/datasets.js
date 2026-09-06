const configuredManifestUrl = import.meta.env.VITE_RELEASE_MANIFEST_URL;
const manifestUrl =
  configuredManifestUrl ||
  (import.meta.env.DEV ? "/data/demo/manifest.json" : "");
function requireFeatureCollection(payload, name) {
  if (
    !payload ||
    payload.type !== "FeatureCollection" ||
    !Array.isArray(payload.features)
  )
    throw new Error(`${name} bukan GeoJSON FeatureCollection yang valid.`);
  return payload;
}
export async function loadRelease(signal) {
  if (!manifestUrl)
    return {
      status: "unavailable",
      reason: "URL rilis data belum dikonfigurasi.",
    };
  const response = await fetch(manifestUrl, {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!response.ok)
    throw new Error(`Manifest mengembalikan ${response.status}.`);
  const manifest = await response.json();
  if (!manifest.dataset_version || !manifest.artifacts?.catchments)
    throw new Error(
      "Manifest belum memiliki dataset_version atau artefak catchments.",
    );
  const artifacts = await Promise.all(
    Object.entries(manifest.artifacts).map(async ([name, url]) => {
      const artifactResponse = await fetch(url, {
        signal,
        headers: { Accept: "application/geo+json, application/json" },
      });
      if (!artifactResponse.ok)
        throw new Error(
          `Artefak ${name} mengembalikan ${artifactResponse.status}.`,
        );
      return [
        name,
        requireFeatureCollection(await artifactResponse.json(), name),
      ];
    }),
  );
  return {
    status: "ready",
    manifest,
    artifacts: Object.fromEntries(artifacts),
  };
}
