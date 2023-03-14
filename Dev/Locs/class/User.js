// librarire permettant de hasher le mot de passe en utilisant l'algorithme de SHA-3
const CryptoJS = require("crypto-js");

class User {
    // ma class user prend en paramètre un email, une location,un password, un profil et un status
    // on verifie tous ces parmetres lorsqu'on instancie la class 
    constructor(email, location, password, profil, status) {
        if (typeof email !== 'string') {
            throw new Error('Email must be a string');
        }
        if (!(location instanceof Locations)) {
            throw new Error('Location must be an instance of the Location class');
        }
        if (typeof password !== 'string' || !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/.test(password)) {
            throw new Error('Password must be a string and meet the criteria: minimum 1 upper letter, un number and one symbole and need to be the length minimal of 8');
        }
        if (!(profil instanceof Profil)) {
            throw new Error('Profil must be an instance of the Profil class');
        }
        if (typeof status !== 'boolean') {
            throw new Error('Status must be a boolean');
        }

        this.email = email;
        this.location = location;
        this.password = password;
        this.profile = profil;
        this.status = status;
    }

    hashPassword(){
        // prend le mot de password de l'instance et le hash et le met en string
        return CryptoJS.SHA3(this.password).toString();
    }


    get email(){
        return this.email;
    }

    set email(email){
        this.email = email;
    }

    get location(){
        return this.location;
    }

    set location(location){
        this.location = location;
    }

    get password(){
        return this.password;
    }

    set password(password){
        this.password = password;
    }

    get profil(){
        return this.profil;
    }

    set profil(profil){
        this.profil = profil;
    }

    get status(){
        return this.status;
    }


}