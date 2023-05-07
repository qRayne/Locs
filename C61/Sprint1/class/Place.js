class Place{
    // ma class Place prend en paramètre un nom ainsi qu'une location
    // on verifie dans le constructeur que le nom est une string et que la localisation est une instace de localisation
    constructor(name,location){
        if (typeof name == "string"){
            this.name = name;
        } else {
            throw new Error('Place name must be a String');
        }

        if (location instanceof Locationn){
            this.location = location;
        } else{
            throw new Error('Location must be an instance of Location')
        }
    }

    get name(){
        return this.name;
    }

    set name(name){
        this.name = name;
    }

    get location(){
        return this.location;
    }

    set location(location){
        this.location = location;
    }
}