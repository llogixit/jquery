

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
  
  window.localStorage.setItem("exists","false");
  
  const callDoc = firestore.collection('users')
  
  var signin = callDoc.doc("users").collection('list');




$("#login").click(function(){
  //const callDoc = firestore.collection('users').doc();
 

  var user = signin.where("uname", "==", $("#username").val()).where("password","==",$("#password").val()).get();
  

  user.then((querySnapshot) => {
  
    querySnapshot.forEach((doc) => {

        window.localStorage.setItem("user",$("#username").val());
  
        window.localStorage.setItem("exists","true");

            doc.ref.update({
                status: "online"
            });   
    });

    if(window.localStorage.getItem("exists")=="false" ){
      Swal.fire({
          title: "User doesn't exists",
          text: "",
          icon: "warning"
        })
      
      
    }
  
    else{
  
      document.location = "chat.html";
  
    }


  })
.catch((error) => {
console.log("Error getting documents: ", error);
});
  

});




$("#signup").click(function(){

    var user = signin.where("uname", "==", $("#username").val()).get();
  

    user.then((querySnapshot) => {
    
      querySnapshot.forEach((doc) => {
  
    
          window.localStorage.setItem("exists","true");

      });
      if(window.localStorage.getItem("exists")=="true"){
        Swal.fire({
            title: "User already exists",
            text: "",
            icon: "warning"
          })
        
        
      }
    
    
      else{

        signin.doc($("#username").val()).set({
            uname: $("#username").val(),
            password: $("#password").val(),
            email: $("#email").val(),
            contacts: [],
            groups: [],
            status : "",
            info: {profileurl:"",name:"",address:""},
            theid: "",
            incoming_actions: []
        })
        .then(() => {
            console.log("Document successfully written!");
            document.location = "login.html";
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    
    
        //
      }
    


    })
  .catch((error) => {
  console.log("Error getting documents: ", error);
  });






});