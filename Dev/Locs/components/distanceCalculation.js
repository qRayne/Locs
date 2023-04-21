// pour calculer la distance
// on a besoin de la latitude,longitude de l'utilisateur 
// et de la latitude, longitude de l'endroit
// le calcul ne retournera une distance qui est cera comparer à au rayon du cercle
// si cette distance est plus petite ou egal au rayon du cercle alors l'utilisateur est à l'interieur du lieu


export function calculateDistanceBetweenLocations(firstLocation,secondLocation){
    const earthRadius = 6371; // km 

    const diffLat = (secondLocation.lat-firstLocation.lat) * Math.PI / 180;  
    const diffLng = (secondLocation.lng-firstLocation.lng) * Math.PI / 180;  

    const arc = Math.cos(
                    firstLocation.lat * Math.PI / 180) * Math.cos(secondLocation.lat * Math.PI / 180) 
                    * Math.sin(diffLng/2) * Math.sin(diffLng/2)
                    + Math.sin(diffLat/2) * Math.sin(diffLat/2);
    const line = 2 * Math.atan2(Math.sqrt(arc), Math.sqrt(1-arc));

    const distance = earthRadius * line; 

    return distance;
}