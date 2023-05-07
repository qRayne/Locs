class Chat {
    // ma class Chat prend en paramètre un Sender qui est une instance de User
    // on verifie dans le constructeur que le sender est une instance de la class User
    // même chose pour le message mais avec le typeof et pour la date avec instanceOf
    constructor(sender, message, timeStamp) {
        if (sender instanceof User) {
            this.sender = sender;
        } else {
            throw new Error('Sender must be an instance of User');
        }

        if (typeof message === 'string') {
            this.message = message;
        } else {
            throw new Error('Message must be a string');
        }

        if (timeStamp instanceof Date) {
            this.timeStamp = timeStamp;
        } else {
            throw new Error('Timestamp must be a Date object');
        }
    }

    get sender() {
        return this.sender;
    }

    set sender(value) {
        this.sender = value;
    }

    get message() {
        return this.message;
    }

    set message(value) {
        this.message = value;
    }

    get timeStamp() {
        return this.timeStamp;
    }

    set timeStamp(value) {
        this.timeStamp = value;
    }
}