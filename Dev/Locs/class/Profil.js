// Cette class utilise le patron de Conception Builder
// dans le builder, on construit au depart uniquement le profil public : username, pronouns, avatar,interests
// après nous avons une class profile qui elle prend en paramètre un profil public 
const AVATARS = {
    ANALYTIC: "analytic",
    ADVENTUROUS: "adventurous",
    CREATIVE: "creative",
    CONFIDENT: "confident",
    FRIENDLY: "friendly",
    INTROVERT: "introvert",
    EXTROVERT: "extrovert",
    AMBITIOUS: "ambitious",
    FUNNY: "funny",
};


class ProfileBuilder {
    constructor(username, pronouns, avatar, interests) {
        
        if (!username || typeof username !== "string") {
            throw new Error("Username is required and must be a string");
        }
        if (typeof pronouns !== "string") {
            throw new Error("Pronouns are required");
        }
        if (!Object.values(AVATARS).includes(avatar)) {
            throw new Error(`Avatar must be one of the avalaible avatars`);
        }
        if (!Array.isArray(interests)) {
            throw new Error("Interests must be an array of strings");
        }

        this.profile = {
            username: username,
            pronouns: pronouns,
            avatar: avatar,
            interests: interests,
        };
    }

    setFirstName(firstName) {
        this.profile.firstName = firstName;
        return this;
    }

    setLastName(lastName) {
        this.profile.lastName = lastName;
        return this;
    }

    setAge(age) {
        this.profile.age = age;
        return this;
    }

    setFacialPhoto(facialPhoto) {
        this.profile.facialPhoto = facialPhoto;
        return this;
    }

    setSocialMediaLinks(socialMediaLinks) {
        this.profile.socialMediaLinks = socialMediaLinks;
        return this;
    }

    setOccupation(occupation) {
        this.profile.occupation = occupation;
        return this;
    }

    build() {
        return new Profile(this.profile);
    }
}

class Profile {
    constructor(profile) {
        this.username = profile.username;
        this.pronouns = profile.pronouns;
        this.avatar = profile.avatar;
        this.interests = profile.interests;
        this.firstName = profile.firstName;
        this.lastName = profile.lastName;
        this.age = profile.age;
        this.facialPhoto = profile.facialPhoto;
        this.socialMediaLinks = profile.socialMediaLinks;
        this.occupation = profile.occupation;
    }
}