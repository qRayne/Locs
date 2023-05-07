class Locationn {
    // ma class Locationn prend en paramètre une latitude et une longitude
    // les deux doit être un nombre et les deux ne doivent pas être vide
    constructor(latitude, longitude) {
        if (typeof latitude !== 'number' || typeof longitude !== 'number' || isNaN(latitude) || isNaN(longitude)) {
            throw new Error('Latitude and longitude must be valid numbers');
        }
        this.latitude = latitude;
        this.longitude = longitude;
    }

    // methode pour calculer une distance
    // code recuperer sur ce site : https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
    calculateDistance(otherLocation) {
        const R = 6371; // radius of the earth in km
        const dLat = degToRad(otherLocation.latitude - this.latitude);
        const dLon = degToRad(otherLocation.longitude - this.longitude);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(degToRad(this.latitude)) * Math.cos(degToRad(otherLocation.latitude)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    }

    // methode qui transforme les degrees en radiants
    degToRad(degrees) {
        return degrees * (Math.PI/180);
    }

    // methode pour recuperer en latitude et longitude le lieux
    getLocation() {
        return [this.latitude, this.longitude];
    }

    get latitude() {
        return this.latitude;
    }

    set latitude(latitude) {
        this.latitude = latitude;
    }

    get longitude() {
        return this.longitude;
    }

    set longitude(longitude) {
        this.longitude = longitude;
    }
}