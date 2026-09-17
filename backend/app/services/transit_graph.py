"""Transit graph for calculating dynamic commute times on KRL Lin Bogor."""

# Accumulated travel time (in minutes) from Jakarta Kota (Station 0)
# Data is estimated based on average KRL travel times.
STATION_TIMES = {
    "jakarta kota": 0,
    "jayakarta": 3,
    "mangga besar": 5,
    "sawah besar": 7,
    "juanda": 10,
    "gondangdia": 13,
    "cikini": 15,
    "manggarai": 18,
    "tebet": 21,
    "cawang": 24,
    "duren kalibata": 27,
    "pasar minggu baru": 29,
    "pasar minggu": 33,
    "tanjung barat": 37,
    "lenteng agung": 41,
    "universitas pancasila": 43,
    "universitas indonesia": 45,
    "pondok cina": 47,
    "depok baru": 50,
    "depok": 53,
    "citayam": 59,
    "bojonggede": 65,
    "cilebut": 71,
    "bogor": 78
}

def calculate_commute_time(origin: str, destination: str) -> int:
    """
    Calculate the commute time in minutes between two stations.
    Returns absolute difference in accumulated times.
    """
    time_a = STATION_TIMES.get(origin.lower().strip())
    time_b = STATION_TIMES.get(destination.lower().strip())
    
    if time_a is None or time_b is None:
        # Fallback if station not found
        return 999
        
    return abs(time_a - time_b)
