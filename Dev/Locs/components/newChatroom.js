const { URL } = require('./constNames.js');

export async function createChatRoom(chatRoom,isPublic = true) {

  const response = await fetch(`${URL}/create-chatRoom`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      place: {
        name: chatRoom.placeName,
        location: {
          latitude: chatRoom.coordinate.latitude, // à changer selon la localisation du lieu
          longitude: chatRoom.coordinate.longitude // à changer selon la localisation du lieu
        }
      },
      isPublic: isPublic
    })
  })
  const data = await response.json();
  return data;
}