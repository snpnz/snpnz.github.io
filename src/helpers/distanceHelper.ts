type latlon = [number, number]
/**
 * Дистанция между двумя GPS точками в метрах
 * @param {Array<number>} latLon1
 * @param {Array<number>} latLon2
 * @returns {number}
 * @link https://www.movable-type.co.uk/scripts/latlong.html
 */
export function getDistanceBetweenPointsInMeters(
    [lat1, lon1]: latlon,
    [lat2, lon2]: latlon
): number {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2)
        + Math.cos(φ1) * Math.cos(φ2)
        * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres

    return d;
}


export function getDistanceByCoordsInMeters(latLonArray: latlon[]) {
    return latLonArray.reduce((acc, cur, index, arr) => {
        if (index === 0) {
            return acc;
        }

        return acc + getDistanceBetweenPointsInMeters(arr[index - 1], cur);
    }, 0);
}
