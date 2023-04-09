const IP = "http://192.168.0.113:19000";
const KEY = "AIzaSyA8dZ3x98ldtcMSpBs5qhUj91Gqr1b1Cm0";
const POSSIBLEAVATARS = {
    "nerd": require('../assets/img/avatar/rayane.png'),
    "beer": require('../assets/img/avatar/beer.gif'),
    "mad": require('../assets/img/avatar/mad.png'),
    "mex": require('../assets/img/avatar/mex.png'),
    "thumbsup": require('../assets/img/avatar/thumbsup.png')
}

exports.IP = IP;
exports.KEY = KEY;
exports.possibleAvatars = POSSIBLEAVATARS;


// cd locs/dev/locs/server
// npm install
// nodemon api

// apprend Context
// pour les noms de chat
// https://stackoverflow.com/questions/63892151/react-native-global-usestate
// https://reactjs.org/docs/context.html#updating-context-from-a-nested-component