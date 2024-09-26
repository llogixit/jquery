/**
 * Socket.io socket
 */
let socket;
/**
 * The stream object used to send media
 */
let localStream = null;
/**
 * All peer connections
 */

let peers = {}

// redirect if not https
//if(location.href.substr(0,5) !== 'https') 
   // location.href = 'https' + location.href.substr(4, location.href.length - 4)


//////////// CONFIGURATION //////////////////

/**
 * RTCPeerConnection configuration 
 */

const configuration = {
    // Using From https://www.metered.ca/tools/openrelay/
    "iceServers": [
    {
      urls: "stun:openrelay.metered.ca:80"
    },
    {
      urls: "turn:openrelay.metered.ca:80",
      username: "openrelayproject",
      credential: "openrelayproject"
    },
    {
      urls: "turn:openrelay.metered.ca:443",
      username: "openrelayproject",
      credential: "openrelayproject"
    },
    {
      urls: "turn:openrelay.metered.ca:443?transport=tcp",
      username: "openrelayproject",
      credential: "openrelayproject"
    }
  ]
}


const firebaseConfig = {

    apiKey: "AIzaSyA5RYLGY-xvIE1a1bNEtoxAibmchjNkKzU",
    authDomain: "msgr-9e72d.firebaseapp.com",
    databaseURL: "https://msgr-9e72d-default-rtdb.firebaseio.com",
    projectId: "msgr-9e72d",
    storageBucket: "msgr-9e72d.appspot.com",
    messagingSenderId: "25174291468",
    appId: "1:25174291468:web:f51996e242f40fd807aa29",
    measurementId: "G-1BTRXG9MJ9"
  
  };
  
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

const firestore = firebase.firestore();
  
const callDoc = firestore.collection('users')
  
var signin = callDoc.doc("users").collection('list');



/**
 * UserMedia constraints
 */
let constraints = {
    audio: true,
    video: {
        width: {
            max: 300
        },
        height: {
            max: 300
        }
    }
}

/////////////////////////////////////////////////////////

constraints.video.facingMode = {
    ideal: "user"
}

// enabling the camera at startup
navigator.mediaDevices.getUserMedia(constraints).then(stream => {
    console.log('Received local stream');

    localVideo.srcObject = stream;
    localStream = stream;

  //  init()

}).catch(e => alert(`getusermedia error ${e.name}`))



$("#offervideo").click(function(){
    socket.emit('offervideo', {
        myname: window.localStorage.getItem("myname"),
        socket_id: window.localStorage.getItem("currentChat")
    })

    $("#videocall").modal('show');
});


/**
 * initialize the socket connections
 */
function init() {

    socket = io()


    socket.on('initReceive', socket_id => {

        console.log('INIT RECEIVE ' + socket_id)
        addPeer(socket_id, false)

        socket.emit('initSend', socket_id)
    })



  socket.on('updateid', socket_id => {


  var user = signin.where("uname", "==", window.localStorage.getItem("user")).get();
  

  user.then((querySnapshot) => {
  
    querySnapshot.forEach((doc) => {

            doc.ref.update({
                theid: socket_id
            });   

    });
    })
    .catch((error) => {
    console.log("Error getting documents: ", error);
    });
    

    })




    socket.on('videooffer', data => {

        addPeer(data.socket_id, false)

        socket.emit('initSend', {
            socket_id: data.socket_id,
            myname: window.localStorage.getItem("myname")
        }
        )
      
        $("#talkingto").text(data.myname);
        $("#onecall1").modal('show');
        
    })


    socket.on('initSend', data=> {
        $("#talkingto").text(data.myname);
        addPeer(data.socket_id, true)
      
    })




    socket.on('removePeer', socket_id => {
        console.log('removing peer ' + socket_id)
        removePeer(socket_id)
    })

    socket.on('disconnect', () => {
        console.log('GOT DISCONNECTED')
        for (let socket_id in peers) {
            removePeer(socket_id)
        }
    })

    socket.on('signal', data => {
        peers[data.socket_id].signal(data.signal)
    })


  //  addPeer(socket_id, false)

   // socket.emit('initSend', socket_id)

}

/**
 * Remove a peer with given socket_id. 
 * Removes the video element and deletes the connection
 * @param {String} socket_id 
 */
function removePeer(socket_id) {

    let videoEl = document.getElementById(socket_id)
    if (videoEl) {

        const tracks = videoEl.srcObject.getTracks();

        tracks.forEach(function (track) {
            track.stop()
        })

        videoEl.srcObject = null
        videoEl.parentNode.removeChild(videoEl)
    }
    if (peers[socket_id]) peers[socket_id].destroy()
    delete peers[socket_id]
}

/**
 * Creates a new peer connection and sets the event listeners
 * @param {String} socket_id 
 *                 ID of the peer
 * @param {Boolean} am_initiator 
 *                  Set to true if the peer initiates the connection process.
 *                  Set to false if the peer receives the connection. 
 */
function addPeer(socket_id, am_initiator) {

    peers[socket_id] = new SimplePeer({
        initiator: am_initiator,
        stream: localStream,
        config: configuration
    })

    peers[socket_id].on('signal', data => {
        socket.emit('signal', {
            signal: data,
            socket_id: socket_id
        })
    })

    peers[socket_id].on('stream', stream => {

        $("#videos").css("position","absolute");
        $("#videos").css("top",$("#identimg").css("top"));
        $("#videos").css("left",$("#identimg").css("left"));
        $("#videos").css("width","100%");
        $("#videos").css("height","60%");
     
        let newVid = document.createElement('video')
        newVid.srcObject = stream
        newVid.id = socket_id
        newVid.playsinline = false
        newVid.autoplay = true
        newVid.style.position = "relative";
        newVid.style.top = "30%";

        newVid.style.width = "100%";
        newVid.style.height = "100%";
        newVid.className = "vid"
        newVid.onclick = () => openPictureMode(newVid)
        newVid.ontouchstart = (e) => openPictureMode(newVid)
        document.getElementById("videos").appendChild(newVid)
        //newVid.className = "vid"
        
      //  newVid.onclick = () => openPictureMode(newVid)
       
       // newVid.ontouchstart = (e) => openPictureMode(newVid)
       // videos.appendChild(newVid)

    })


   
}

/**
 * Opens an element in Picture-in-Picture mode
 * @param {HTMLVideoElement} el video element to put in pip mode
 */
function openPictureMode(el) {
    console.log('opening pip')
    el.requestPictureInPicture()
}

/**
 * Switches the camera between user and environment. It will just enable the camera 2 cameras not supported.
 */
function switchMedia() {
    if (constraints.video.facingMode.ideal === 'user') {
        constraints.video.facingMode.ideal = 'environment'
    } else {
        constraints.video.facingMode.ideal = 'user'
    }

    const tracks = localStream.getTracks();

    tracks.forEach(function (track) {
        track.stop()
    })

    localVideo.srcObject = null
    navigator.mediaDevices.getUserMedia(constraints).then(stream => {

        for (let socket_id in peers) {
            for (let index in peers[socket_id].streams[0].getTracks()) {
                for (let index2 in stream.getTracks()) {
                    if (peers[socket_id].streams[0].getTracks()[index].kind === stream.getTracks()[index2].kind) {
                        peers[socket_id].replaceTrack(peers[socket_id].streams[0].getTracks()[index], stream.getTracks()[index2], peers[socket_id].streams[0])
                        break;
                    }
                }
            }
        }

        localStream = stream
        localVideo.srcObject = stream

        updateButtons()
    })
}

/**
 * Enable screen share
 */
function setScreen() {
    navigator.mediaDevices.getDisplayMedia().then(stream => {
        for (let socket_id in peers) {
            for (let index in peers[socket_id].streams[0].getTracks()) {
                for (let index2 in stream.getTracks()) {
                    if (peers[socket_id].streams[0].getTracks()[index].kind === stream.getTracks()[index2].kind) {
                        peers[socket_id].replaceTrack(peers[socket_id].streams[0].getTracks()[index], stream.getTracks()[index2], peers[socket_id].streams[0])
                        break;
                    }
                }
            }

        }
        localStream = stream

        localVideo.srcObject = localStream
        socket.emit('removeUpdatePeer', '')
    })
    updateButtons()
}

/**
 * Disables and removes the local stream and all the connections to other peers.
 */
function removeLocalStream() {
    if (localStream) {
        const tracks = localStream.getTracks();

        tracks.forEach(function (track) {
            track.stop()
        })

        localVideo.srcObject = null
    }

    for (let socket_id in peers) {
        removePeer(socket_id)
    }
}

/**
 * Enable/disable microphone
 */
function toggleMute() {
    for (let index in localStream.getAudioTracks()) {
        localStream.getAudioTracks()[index].enabled = !localStream.getAudioTracks()[index].enabled
        muteButton.innerText = localStream.getAudioTracks()[index].enabled ? "Unmuted" : "Muted"
    }
}
/**
 * Enable/disable video
 */
function toggleVid() {
    for (let index in localStream.getVideoTracks()) {
        localStream.getVideoTracks()[index].enabled = !localStream.getVideoTracks()[index].enabled
        vidButton.innerText = localStream.getVideoTracks()[index].enabled ? "Video Enabled" : "Video Disabled"
    }
}

/**
 * updating text of buttons
 */
function updateButtons() {
    for (let index in localStream.getVideoTracks()) {
        vidButton.innerText = localStream.getVideoTracks()[index].enabled ? "Video Enabled" : "Video Disabled"
    }
    for (let index in localStream.getAudioTracks()) {
        muteButton.innerText = localStream.getAudioTracks()[index].enabled ? "Unmuted" : "Muted"
    }
}
