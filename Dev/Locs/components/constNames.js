const URL = "http://10.57.38.19:3000";
const KEY = "AIzaSyDFjVC-uP7O4brKM44aMOLMwNmRSL-tBT4";
const POSSIBLEAVATARS = {
    "nerd": require('../assets/img/avatar/rayane.png'),
    "beer": require('../assets/img/avatar/beer.gif'),
    "mad": require('../assets/img/avatar/mad.png'),
    "mex": require('../assets/img/avatar/mex.png'),
    "thumbsup": require('../assets/img/avatar/thumbsup.png')
}

exports.URL = URL;
exports.KEY = KEY;
exports.possibleAvatars = POSSIBLEAVATARS;


// cd locs/dev/locs/server
// npm install
// nodemon api

// apprend Context
// pour les noms de chat
// https://stackoverflow.com/questions/63892151/react-native-global-usestate
// https://reactjs.org/docs/context.html#updating-context-from-a-nested-component