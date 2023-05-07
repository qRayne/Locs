class ChatRoom {
    // ma class ChatRoom prend en paramètre une place qui est une instance de Place
    // on verifie dans le constructeur que la place est une instance de la class Place
    // même chose pour le users/chats qui doivent être une liste
    constructor(place, users, chats, isPublic) {
        if (place instanceof Place) {
            this.place = place;
        } else {
            throw new Error('Place must be an instance of Place');
        }

        if (Array.isArray(users)) {
            this.users = users;
        } else {
            throw new Error('Users must be an array');
        }

        if (Array.isArray(chats)) {
            this.chats = chats;
        } else {
            throw new Error('Chats must be an array');
        }

        this.isPublic = isPublic;
    }

    // methode ajoutant un utilistaeur dans ma liste de user
    addUser(user) {
        if (user instanceof User) {
            this.users.push(user);
        } else {
            throw new Error('User must be an instance of User');
        }
    }

    // methode pour enlever un utilisateur
    removeUser(user){
        if (user instanceof User && this.users.includes(user)){
            if (this.users.indexOf(user) !== -1){
                this.users.splice(this.users.indexOf(user),1);
            }
        }
    }

    // methode pour ajouter un chat
    addChat(chat){
        if (typeof chat === 'string') {
            this.chats.push(chat);
        } else {
            throw new Error('chat must be a string');
        }
    }

    // methode pour enlever un chat
    removeChat(chat){
        if (typeof chat === 'string' && this.chats.includes(chat)){
            if (this.chats.indexOf(chat) !== -1){
                this.chats.splice(this.chats.indexOf(chat),1);
            }
        }
    }

    get place() {
        return this.place;
    }

    set place(place) {
        this.place = place;
    }

    get users() {
        return this.users;
    }

    set users(users) {
        this.users = users;
    }

    get chats() {
        return this.chats;
    }

    set chats(chats) {
        this.chats = chats;
    }

    get isPublic() {
        return this.isPublic;
    }

    set isPublic(isPublic) {
        this.isPublic = isPublic;
    }
}