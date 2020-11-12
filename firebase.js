var firebaseConfig = {
	apiKey: "AIzaSyBo3Pr1rDwlpL_dJNw0fEbeX_RmKmd5vRs",
	authDomain: "soundlab-f8308.firebaseapp.com",
	databaseURL: "https://soundlab-f8308.firebaseio.com",
	projectId: "soundlab-f8308",
	storageBucket: "soundlab-f8308.appspot.com",
	messagingSenderId: "297298469083",
	appId: "1:297298469083:web:7f331084b0961623412cfe"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var frequencyGlobal = db.collection("frequency").doc("global");
var frequencyConfig = db.collection("frequency").doc("config");

let firebaseFrequency;

// When global data is updated
frequencyGlobal.onSnapshot(function(doc) {
	    firebaseFrequency = doc.data().frequency;
	});

function setFirebaseFrequency(freq) {
	console.log("set freq " + freq);
	if(freq) {
		frequencyGlobal.set({
			frequency: freq
		});
	}
}

frequencyConfig.onSnapshot(function(doc) {
	    config = doc.data();
	    invalidateConfig();
	});

function setFirebaseConfig(config) {
	console.log("set config " + config);
	if(config) {
		frequencyConfig.set(config);
	}
}