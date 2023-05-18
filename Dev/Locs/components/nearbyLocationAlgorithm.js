import { calculateDistanceBetweenLocations, calculateBoundsBetweenLocations } from './distanceCalculation';


// ce fichier contient notre algorithme de recherche de la localisation la plus proche
// qui est un chatroom
// on utilise deux autres fonctions qui nous permette de determiner la solution
// le calcul de distance ainsi que le calcul du "inbonds"
// la liste de chatrooms ont chacun une latitude et longitude

export function getWritableChatRoomWithinRadius(listeChatrooms, userLocation, radiusOfSearch) {

    if (listeChatrooms.length === 0) {
        return;
    }

    const allDistances = listeChatrooms.map(({ coordinate }) =>
        calculateDistanceBetweenLocations(userLocation, coordinate)
    );
    const minDistance = Math.min(...allDistances);
    const minDistanceIndex = allDistances.indexOf(minDistance);
    const nearestChatRoom = listeChatrooms[minDistanceIndex];

    if (nearestChatRoom && allDistances[minDistanceIndex] <= radiusOfSearch) {
        const { coordinate, placeName } = nearestChatRoom;

        if (calculateBoundsBetweenLocations(userLocation, coordinate, minDistance)) {
            return placeName;
        }
    }
    return;
}