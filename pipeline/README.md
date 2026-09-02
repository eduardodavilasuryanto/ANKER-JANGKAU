# Pipeline (Saturday meal prep)

This folder cooks the scored map **before** the shop opens.

Picture a family that preps lunch on Saturday so Monday morning is fast. The public site does not grind numbers while a user waits. This pipeline turns sealed raw jars into one scored GeoJSON sheet. The kitchen then only reads that sheet.

## Stage order (do not skip)

| Step | Folder | Script | Input | Output |
| ---: | --- | --- | --- | --- |
| 1 | `ingest/` | `01_fetch_mapid.py` | MAPID APIs, OSM, KRL, InaRISK | `data/raw/` and `data/external/` |
| 2 | `clean/` | `02_clean_points.py` | raw points | `data/interim/points_clean.*` |
| 3 | `spatial/` | `03_spatial_join.py` | clean points + isochrones | `data/interim/points_joined.*` |
| 4 | `models/` | `04_hedonic.py` | joined points | model coefficients |
| 5 | `models/` | `05_score.py` | joined catchments + coefficients | `data/processed/catchments_scored.*` |
| 6 | `export/` | `06_export_geojson.py` | processed catchments | `data/outputs/jangkau_bogor_line_scored.geojson` |

Notebooks in `notebooks/` are the scratch paper. Number them `01-`, `02-` in run order. Finished logic moves into a `.py` script. The shop window never imports a notebook.
