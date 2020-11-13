// Initialize Firebase
var firebaseConfig = {
	apiKey: "AIzaSyBo3Pr1rDwlpL_dJNw0fEbeX_RmKmd5vRs",
	authDomain: "soundlab-f8308.firebaseapp.com",
	databaseURL: "https://soundlab-f8308.firebaseio.com",
	projectId: "soundlab-f8308",
	storageBucket: "soundlab-f8308.appspot.com",
	messagingSenderId: "297298469083",
	appId: "1:297298469083:web:7f331084b0961623412cfe"
};
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

// References to Firebase documents that store the data
var frequencyGlobal = db.collection("frequency").doc("global");
var frequencyConfig = db.collection("frequency").doc("config");

// Local copy of latest known state from Firebase
let firebaseFrequency;
let config = {
  localSound: false,
  showKeys: false
}

// These are called when Firebase tells us data has been updated
frequencyGlobal.onSnapshot(function(doc) {
	    firebaseFrequency = doc.data().frequency;
	});

frequencyConfig.onSnapshot(function(doc) {
	    config = doc.data();
	    invalidateConfig();
	});

// Write values to Firebase
function setFirebaseFrequency(freq) {
	if(freq) {
		frequencyGlobal.set({
			frequency: freq
		});
	}
}

function setFirebaseConfig(config) {
	if(config) {
		frequencyConfig.set(config);
	}
}