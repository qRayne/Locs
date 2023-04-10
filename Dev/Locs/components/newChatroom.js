const { URL } = require('./constNames.js');

export async function createChatRoom(chatRoom) {
    const response = await fetch(`${URL}/create-chatRoom`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        place: {
          name: chatRoom.name,
          location: {
            latitude: chatRoom.location.latitude, // à changer selon la localisation du lieu
            longitude: chatRoom.location.longitude // à changer selon la localisation du lieu
          }
        },
        isPublic: chatRoom.isPublic
      })
    })
    const data = await response.json();
    return data;
}