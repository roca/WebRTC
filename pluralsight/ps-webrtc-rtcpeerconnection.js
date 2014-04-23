var myPeerConnection;
var remotePerrConnection;


var PeerConnection = window.RTCPeerConhection || window.mozRTCPeerConhection || window.webkitRTCPeerConhection || window.msPeerConhection;
var SessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription || window.msRTCSessionDescription;

navigator.getWebcam = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

navigator.getWebcam(
       //constraints
       {video:true,audio:false},

       //successCallback
       gotWebcam,

       //errorCallback
       gotError
);

function gotError(err) {
     console.log("Oops! Something's not right." + err)
};

function gotWebcam(stream){


	localVideo.src = window.URL.createObjectURL(stream);
	localVideo.play();

	var video_track = stream.getVideoTracks()[0];
	var output = document.getElementById('output');
	output.innerHTML = "stream id = " + stream.id + "<BR>";
	output.innerHTML += "track readyState = " + video_track.readyState + "<BR>";
	output.innerHTML += "track id = " + video_track.id + "<BR>";
	output.innerHTML += "kind = " + video_track.kind + "<BR>";
	createPeerConnections(stream);
};

function createPeerConnection(stream){
      //Create the local beer connection
      myPeerConnection = new PeerConnection(null);
      console.log("Created local peer connecion object myPeerConnection");

      //Create the local beer connection
      remotePeerConnection = new PeerConnection(null);
      console.log("Created remote peer connecion object remoteConnection");

      //Listen for ICE candidates on each
      myPeerConnection.onicecandidate = gotMyIceCandidate;
      remotePeerConnection.onicecandidate = gotRemoteIceCandidate

      //Handle streams on each peer
      myPeerConnection.addStream(stream);
      console.log("Added local stream to myPeerConnection");
      remotePeerConnection.onaddstream = gotRemoteStream;

      //Create local peer connection offer
      myPeerConnection.createOffer(gotLocalDescription);
      console.log("Created SDP offer on myPeerConnection");

};

//When local ICE canidate is received
function gotMyIceCandidate(event){
	if (event.candidate){
	  //Send the local ICE condidate to the remote peer
      remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
      console.log("Sent my ICE candidates to remotePeerConnection");
	}
}
//When remote ICE canidate is received
function gotRemoteIceCandidate(event){
	if (event.candidate){
	  //Send the remote ICE condidate to the local peer
      myPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
      console.log("Sent remote ICE candidates to myPeerConnection");
	}
}

function gotLocalDescription(description){
	myPeerConnection.setLocalDescription(description);
	console.log("Created offer from myPeerConnection");

}

//Success! Show the remote video...
function gotRemoteStream(event){
	theirVideo.src = URL.createObjectURL(event.stream);
	theirVideo.play();
	console.log("Got remote Stream!");
}