// pour calculer la distance
// on a besoin de la latitude,longitude de l'utilisateur 
// et de la latitude, longitude de l'endroit
// le calcul ne retournera une distance qui est cera comparer à au rayon du cercle
// si cette distance est plus petite ou egal au rayon du cercle alors l'utilisateur est à l'interieur du lieu

export function calculateDistanceBetweenLocations(firstLocation, secondLocation) {
    const earthRadius = 6371000; // m

    const diffLat = (secondLocation.latitude - firstLocation.latitude) * Math.PI / 180;
    const diffLng = (secondLocation.longitude - firstLocation.longitude) * Math.PI / 180;

    const arc = Math.cos(
        firstLocation.latitude * Math.PI / 180) * Math.cos(secondLocation.latitude * Math.PI / 180)
        * Math.sin(diffLng / 2) * Math.sin(diffLng / 2)
        + Math.sin(diffLat / 2) * Math.sin(diffLat / 2);
    const line = 2 * Math.atan2(Math.sqrt(arc), Math.sqrt(1 - arc));

    const distance = earthRadius * line;
    return distance;
}

// pour verifier si l'usager est dans le perimetre du lieu
// va dessiner un carre autour du lieu et va verifier que l'usager est dans ce carre
export function calculateBoundsBetweenLocations(userLocation, placeLocation, distance) {
    const MAX_DISTANCE_CHECK = 25;

    if (distance <= MAX_DISTANCE_CHECK) {
        return true;
    }

    const radiusInDegrees = distance / 111320;

    const estLat = placeLocation.latitude;
    const estLng = placeLocation.longitude;

    const latDiff = Math.abs(userLocation.latitude - estLat);
    const lngDiff = Math.abs(userLocation.longitude - estLng);

    const latInBounds = latDiff <= radiusInDegrees;
    const lngInBounds = lngDiff <= radiusInDegrees;

    // certe on reverifie que la distance est plus petite que notre max distance
    // on permet ainsi de retourner que le lieu est à 100% dans notre localisation
    return latInBounds && lngInBounds && distance <= MAX_DISTANCE_CHECK;
}