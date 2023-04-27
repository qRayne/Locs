// pour calculer la distance
// on a besoin de la latitude,longitude de l'utilisateur 
// et de la latitude, longitude de l'endroit
// le calcul ne retournera une distance qui est cera comparer à au rayon du cercle
// si cette distance est plus petite ou egal au rayon du cercle alors l'utilisateur est à l'interieur du lieu


export function calculateDistanceBetweenLocations(firstLocation, secondLocation) {
    const earthRadius = 6371000; // m

    const diffLat = (secondLocation.lat - firstLocation.lat) * Math.PI / 180;
    const diffLng = (secondLocation.lng - firstLocation.lng) * Math.PI / 180;

    const arc = Math.cos(
        firstLocation.lat * Math.PI / 180) * Math.cos(secondLocation.lat * Math.PI / 180)
        * Math.sin(diffLng / 2) * Math.sin(diffLng / 2)
        + Math.sin(diffLat / 2) * Math.sin(diffLat / 2);
    const line = 2 * Math.atan2(Math.sqrt(arc), Math.sqrt(1 - arc));

    const distance = earthRadius * line;

    return distance;
}

// pour verifier si l'usager est dans le perimetre du lieu
// va dessiner un carre autour du lieu et va verifier que l'usager est dans ce carre
export function calculateBoundsBetweenLocations(userLocation, placeLocation, distance) {
    const MAX_DISTANCE_CHECK = 0.5; // c'est le maximum de distance que deux localisation peut être pour être consider comme proche

    if (distance <= MAX_DISTANCE_CHECK) {
        return true; // c'est que les deux localisation sont dans même lieu,car la distance est très petite (surtout en metre)
    }
    else {
        const radiusInDegrees = distance / 111320; // degres de latitude
        const estLat = placeLocation.lat;
        const estLng = placeLocation.lng;

        const latInBounds = userLocation.lat >= estLat - radiusInDegrees && userLocation.lat <= estLat + radiusInDegrees;
        const lngInBounds = userLocation.lng >= estLng - radiusInDegrees && userLocation.lng <= estLng + radiusInDegrees;

        return latInBounds && lngInBounds;
    }
}