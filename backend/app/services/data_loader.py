"""Load catchment data from the bundled constant (Workers-safe)."""

from app.services.catchments_data import CATCHMENTS


class DataLoader:
    _catchments = None

    @classmethod
    def get_catchments(cls):
        if cls._catchments is None:
            cls._catchments = list(CATCHMENTS)
        return cls._catchments
