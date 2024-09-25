

if(window.localStorage.getItem("user")==null){
  document.location = "login.html";
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

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};


// Global State
const pc = new RTCPeerConnection(servers);

//const callDoc = firestore.collection('users').doc();
const callDoc = firestore.collection('users')

var citiesRef = callDoc.doc("users").collection('list');

loadInfos();

$("#updateinfo").click(function(){

  if($("#detailsedit").css("display")=="none"){

    citiesRef.where("uname", "==", window.localStorage.getItem("user")).get().then((querySnapshot) => {

      querySnapshot.forEach((doc) => {

        console.log($("#editname").val() );
        doc.ref.update({
          "info.name": $("#editname").val() 
      });

    });

})
.catch((error) => {
console.log("Error getting documents: ", error);
});

  }

loadInfos();

});



citiesRef.where("uname", "==", window.localStorage.getItem("user")).get().then((querySnapshot) => {

  querySnapshot.forEach((doc) => {
    let url = doc.data().info.profileurl;
    $("#avatarimg").attr("src", url);
    $("#profilepic").attr("src", url);
});


})
.catch((error) => {
console.log("Error getting documents: ", error);
});




$("#add_contact").click(function(){

  window.localStorage.setItem("exists","false");
  window.localStorage.setItem("already","false");

var signin = callDoc.doc("users").collection('list');

var user = signin.where("uname", "==", window.localStorage.getItem("user")).get();

user.then((querySnapshot) => {

  querySnapshot.forEach((doc) => {
   
     if(doc.data().contacts.includes($("#username").val()) ){


      window.localStorage.setItem("already","true");

   
     }

  });
})
.catch((error) => {
  console.log("Error getting documents: ", error);
});




var query = signin.where("uname", "==", $("#username").val()).get();

query.then((querySnapshot) => {

  querySnapshot.forEach((doc) => {

    
     window.localStorage.setItem("exists","true");


  });


  var exists = window.localStorage.getItem("exists");
  var already = window.localStorage.getItem("already");
  
  
  if(exists=="false" ){
    Swal.fire({
      title: "User doesn't exists",
      text: "",
      icon: "warning"
    })
  }
  
  else{
    if(already=="true" ){
      Swal.fire({
        title: "User already a contact",
        text: "",
        icon: "warning"
      })
    }

    else{
 
      var user = signin.where("uname", "==", $("#username").val()).get();

user.then((querySnapshot) => {

  querySnapshot.forEach((doc) => {
      let arr = doc.data().requests;
         
      arr.push($("#username").val());
      
 
      doc.ref.update({
         requests: arr
        
      }); 
      
    });   }); 



    }


  }
  

})
.catch((error) => {
  console.log("Error getting documents: ", error);
});


});


window.localStorage.setItem("ia_count","0");


citiesRef.where("uname", "==",window.localStorage.getItem("user")).onSnapshot((snapshot) => {

  snapshot.docChanges().forEach((change) => {
      
 
    if (change.type === 'modified') {

      let data = change.doc.data();

      let tmp =  window.localStorage.getItem("ia_count");

      window.localStorage.setItem("haschat","no");
      window.localStorage.setItem("pos",0);

      if(parseInt(tmp)<data.incoming_actions.length){
        
        for(var i=data.incoming_actions.length-1; i>-1; i-=1){
        
          console.log(data.incoming_actions[i]["action"]);

          if(data.incoming_actions[i]["action"]=="incoming_video"){
          

            $("#onecall1").modal('show');
            $("#acceptvideo").click(function(){
            $("#onecall1").modal('hide');
            $("#videocall").modal('show');

         });
         
          }

          

          if(data.incoming_actions[i]["action"]=="incoming_message"){
          
            let isinchat = false;
            let isinrecent = false;

            $(".recentitem").each(function(){
              if($(this).attr("id")==data.incoming_actions[i]["from"]){
                  isinrecent = true;
                
              } 
              });
              

              if(!isinrecent ){
              //    $("#recentchats").append('<div class="item recentitem" ><div class="recent-box"><div class="dot-btn dot-danger grow"></div> <div class="recent-profile"><img class="bg-img" src="assets/images/avtar/1.jpg" alt="Avatar"/><h6>'+data.incoming_actions[i]["from"]+'</h6></div></div></div>');
              }

            

            $(".chat_item").each(function(){
              if($(this).attr("id")==data.incoming_actions[i]["from"]){
                  isinchat = true;
                
              }
              });
              
            
              if(!isinchat ){
              
                window.localStorage.setItem("chatfrom",data.incoming_actions[i]["from"]);                
                
                citiesRef.where("uname", "==", data.incoming_actions[i]["from"]).get().then((querySnapshot) => {

                  querySnapshot.forEach((doc) => {
                
                    $(".chat-main").append(' <li data-to="blank" class="chat_item" id="'+window.localStorage.getItem("chatfrom")+'"><div class="chat-box"><div class="profile offline"><img class="bg-img" src="'+doc.data().info.profileurl+'" alt="Avatar" style="width:60px;height:60px;"/></div> <div class="details"> <h5>'+doc.data().info.name+'</h5><h6></h6> </div><div class="date-status"><i class="ti-pin2"></i><h6>22/10/23</h6><h6 class="font-success status"> Seen</h6></div></div></li>');
                
                    $(".chat_item").click(function(){

                      $("#currentchat_name").text(doc.data().info.name);
                      $("#selectprofilename").text(doc.data().info.name);

                      window.localStorage.setItem("talkingto",window.localStorage.getItem("chatfrom"));

                      selectChat(doc.data().info.name,$(this).attr("id"),doc.data().info.profileurl);
                      
                    });
        
                });
                
              });


              }


            window.localStorage.setItem("pos",i);
      

            citiesRef.where("uname", "==", window.localStorage.getItem("user")).get().then((querySnapshot) => {

            querySnapshot.forEach((doc) => {

            var monthlies = doc.ref.collection('chats').where("from","==",data.incoming_actions[ window.localStorage.getItem("pos")]["from"]);

            monthlies.get().then((querySnapshot) => {

        
            querySnapshot.forEach((doc) => {

              window.localStorage.setItem("haschat","yes");

              });


              
      if(window.localStorage.getItem("haschat")=="no"  ){

        citiesRef.where("uname", "==",  window.localStorage.getItem("user")).get().then((querySnapshot) => {

          querySnapshot.forEach((doc) => {
            //FOCUS 1 
            doc.ref.collection('chats').doc(data.incoming_actions[ window.localStorage.getItem("pos")]["from"]).set({
              from: data.incoming_actions[ window.localStorage.getItem("pos")]["from"],
              logs:[]

          })
          .then(() => {
              console.log("Document successfully written!");
          })
          .catch((error) => {
              console.error("Error writing document: ", error);
          });
        
      

        });
        
      });
        


        }


//ADD INCOMING MESSAGE TO CHAT LOGS

citiesRef.where("uname", "==", window.localStorage.getItem("user")).get().then((querySnapshot) => {

  querySnapshot.forEach((doc) => {

          var monthlies = doc.ref.collection('chats').where("from","==",data.incoming_actions[ window.localStorage.getItem("pos")]["from"]);

          monthlies.get().then((querySnapshot) => {
      
          querySnapshot.forEach((doc) => {
       
          window.localStorage.setItem("isinchat","true");

          let arr = doc.data().logs;
         
          arr.push({ from:data.incoming_actions[ window.localStorage.getItem("pos")]["from"], kind: data.incoming_actions[ window.localStorage.getItem("pos")]["kind"], files: data.incoming_actions[ window.localStorage.getItem("pos")]["files"], themessage:data.incoming_actions[ window.localStorage.getItem("pos")]["message"]});
          
     
       
          
          let rand = generateString(10);
          

          if(data.incoming_actions[ window.localStorage.getItem("pos")]["kind"]=="attachment"){

            $("<li class=\"sent\" id=\""+rand+"\"> <div class=\"d-flex\"> <div class=\"profile mr-4 bg-size\" style=\"background-image: url('"+window.localStorage.getItem("otherurl")+"'); background-size: cover; background-position: center center; display: block;\"></div><div class=\"flex-grow-1\"> <div class=\"contact-name\"> <h5>"+window.localStorage.getItem("othername")+"</h5> <h6>01:35 AM</h6> <ul class=\"msg-box\"> <li class=\"msg-setting-main\"><div class=\"document\"><i class=\"fa fa-file-excel-o font-primary\"></i><div class=\"details\"><h5>Document.xlsx</h5><h6></h6></div><div class=\"icon-btns\"><a class=\"icon-btn btn-outline-light\" href=\""+data.incoming_actions[ window.localStorage.getItem("pos")]["files"]+"}\" target=\"_blank\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-download\"><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"></path><polyline points=\"7 10 12 15 17 10\"></polyline><line x1=\"12\" y1=\"15\" x2=\"12\" y2=\"3\"></line></svg></a></div></div><div class=\"badge badge-dark sm ms-2\"> D</div> <div class=\"msg-dropdown-main\"><div class=\"msg-setting\"><i class=\"ti-more-alt\"></i></div><div class=\"msg-dropdown\"> <ul><li><a href=\"#\"><i class=\"fa fa-share\"></i>forward</a></li><li><a href=\"#\"><i class=\"fa fa-clone\"></i>copy</a></li><li><a href=\"#\"><i class=\"fa fa-star-o\"></i>rating</a></li><li><a href=\"#\"><i class=\"ti-trash\"></i>delete</a></li></ul></div></div></li></ul> </div></div></div></li>").appendTo($('.messages .chatappend'));

          }


          if(data.incoming_actions[ window.localStorage.getItem("pos")]["kind"]=="pics"){

            let vvv = data.incoming_actions[ window.localStorage.getItem("pos")]["files"].split(",");

            for(var c=0; c<vvv.length; c++){
                if(vvv[c]!=""){
                    tmp+="<li class=\"bg-size\"  style=\"background-image: url(\""+vvv[c]+"\"); background-size: cover; background-position: center center; display: block;\"><img class=\"bg-img\" src=\""+vvv[c]+"\" alt=\"Avatar\" style=\"display: block; width:80px;\"></li>";
    
                }
               
            }

          $("<li class=\"sent\" id=\""+rand+"\"> <div class=\"d-flex\"> <div class=\"profile mr-4 bg-size\" style=\"background-image: url('"+window.localStorage.getItem("otherurl")+"'); background-size: cover; background-position: center center; display: block;\"></div><div class=\"flex-grow-1\"> <div class=\"contact-name\"> <h5>"+window.localStorage.getItem("othername")+"</h5> <h6>01:35 AM</h6> <ul class=\"msg-box\"> <li class=\"msg-setting-main\">  <ul class=\"auto-gallery\">"+tmp+"</ul> <div class=\"refresh-block\"> <div class=\"badge badge-outline-primary refresh sm\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-rotate-cw\"><polyline points=\"23 4 23 10 17 10\"></polyline><path d=\"M20.49 15a9 9 0 1 1-2.12-9.36L23 10\"></path></svg></div><div class=\"badge badge-danger sm\">F</div></div><div class=\"msg-dropdown-main\"><div class=\"msg-setting\"><i class=\"ti-more-alt\"></i></div><div class=\"msg-dropdown\"> <ul><li><a href=\"#\"><i class=\"fa fa-share\"></i>forward</a></li><li><a href=\"#\"><i class=\"fa fa-clone\"></i>copy</a></li><li><a href=\"#\"><i class=\"fa fa-star-o\"></i>rating</a></li><li><a href=\"#\"><i class=\"ti-trash\"></i>delete</a></li></ul></div></div></li></ul> </div></div></div></li>").appendTo($('.messages .chatappend'));

        }


          else{
            $("<li class=\"sent\" id=\""+rand+"\"> <div class=\"d-flex\"> <div class=\"profile mr-4 bg-size\" style=\"background-image: url('"+window.localStorage.getItem("otherurl")+"'); background-size: cover; background-position: center center; display: block;\"></div><div class=\"flex-grow-1\"> <div class=\"contact-name\"> <h5>"+window.localStorage.getItem("othername")+"</h5> <h6>01:35 AM</h6> <ul class=\"msg-box\"> <li> <h5>"+data.incoming_actions[ window.localStorage.getItem("pos")]["message"]+"</h5> <div class=\"badge badge-success sm ml-2\"> R</div></li></ul> </div></div></div></li>").appendTo($('.messages .chatappend'));

          }


          doc.ref.update({
            logs: arr
          
        }); 

          var bottomElement = document.getElementById(rand).
            lastElementChild;
        
            bottomElement
            .scrollIntoView({ behavior: 'smooth', block: 'end' });
          
         // $(".messages").animate({ scrollTop:max }, "fast");
      
      });
      
      });
      
      });     
  
  
  });




      
  citiesRef.where("uname", "==", window.localStorage.getItem("user")).get().then((querySnapshot) => {

    querySnapshot.forEach((doc) => {

    doc.ref.update({
       incoming_actions: []
      //  logs: 
    });   

});


});   


            });

          });    
        
        });  

      }



    }
        

      }
 
    }

  });
});





// declare all characters
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}




function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    // Typescript users: use following line
    // reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}


//const offerCandidates = callDoc.collection('offerCandidates');

$("#acceptvideo").click(function(){
  $("#onecall1").modal('hide');
  $("#videocall").modal('show');
 });


$("#theavatar").click(function(){
      
  let input = document.createElement('input');
  input.type = 'file';

  input.addEventListener("change", async function({target}){

        if (target.files && target.files.length) {
      
              const uploadedImageBase64 = convertFileToBase64(target.files[0]); 
            
              // Create a root reference
            var storageRef = firebase.storage().ref();

            // Create a reference to 'mountains.jpg'
            var mountainsRef = storageRef.child('mountains.jpg');
            mountainsRef.put(target.files[0]).then((snapshot) => {
             
             mountainsRef.getDownloadURL()
              .then((url) => {
                console.log(url);
                // `url` is the download URL for 'images/stars.jpg'
            
          citiesRef.where("uname", "==", window.localStorage.getItem("user")).get().then((querySnapshot) => {

            querySnapshot.forEach((doc) => {

              console.log(doc.data());

                  // Or inserted into an <img> element
                  $("#avatarimg").attr("src", url);
                  $("#avatarimg1").attr("src", url);

                  $("#avatarimg").css("display","block");
                  $("#avatarimg").css("width","60px");
                  $("#avatarimg").css("height","60px");

                  $("#avatarimg1").css("display","block");
                  $("#avatarimg1").css("width","60px");
                  $("#avatarimg1").css("height","60px");
                  
                  $("#profilepic").attr("src", url);
          
              doc.ref.update({
                "info.profileurl": url
            });

          });
         
    
})
.catch((error) => {
    console.log("Error getting documents: ", error);
});
            
              })
              .catch((error) => {
                alert(error);
              });



            });

           
          }
      })


  input.click();
  
});


$("#searchcontact").change(function(){

var query = citiesRef.where("uname", "==", window.localStorage.getItem("user")).get();

query.then((querySnapshot) => {

    querySnapshot.forEach((doc) => {

  
      if(doc.data().contacts.includes($("#searchcontact").val())){

        var query = citiesRef.where("uname", "==", $("#searchcontact").val()).get();

        query.then((querySnapshot) => {
        
            querySnapshot.forEach((doc) => {

              $("#contactsresult").append(' <li class="resultitem" data-to="blank"><div class="chat-box"><div class="profile offline"><img class="bg-img" src="'+doc.data().info.profileurl+'" alt="Avatar" style="width:60px;height:60px;"/></div><div class="details"><h5>'+doc.data().info.name+'</h5><h6></h6></div><div class="date-status"><i class="ti-pin2"></i><h6>22/10/23</h6><h6 class="font-success status"> Seen</h6></div></div></li>');


              $(".resultitem").click(function(){

                window.localStorage.setItem("currentChat",doc.data().theid);
               
                window.localStorage.setItem("talkingto",$("#searchcontact").val());
              
                $("#selectprofilename").text(doc.data().info.name);

                $(this).addClass("active");

                setTimeout(selectChat(doc.data().info.name,$("#searchcontact").val(),doc.data().info.profileurl),1000);

              });


      });

    
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
    
      }



    });

    
})
.catch((error) => {
    console.log("Error getting documents: ", error);
});

});



function selectChat(name,tid,profileurl){
  

    $("#msgchatModal").modal('hide');
 

    let isinrecent = false;
    let isinchat = false;

    $(".recentitem").each(function(){
      if($(this).attr("id")==tid){
          isinrecent = true;
        
      } 
      });
      

      if(!isinrecent ){

   
          $('.owl-carousel').owlCarousel('add', '<div class="item recentitem" ><div class="recent-box"><div class="dot-btn dot-danger grow"></div> <div class="recent-profile"><img class="bg-img" src="'+profileurl+'" alt="Avatar" style="width:100%;height:100%;"/><h6>'+name+'</h6></div></div></div>').owlCarousel('update');


      }
      

      $(".chat_item").each(function(){

        if($(this).attr("id")==tid){
            isinchat = true;
          
        }
        });
        
      
        if(!isinchat ){
          
          $(".chat-main").append(' <li data-to="blank" class="chat_item" id="'+tid+'"><div class="chat-box"><div class="profile online"><img class="bg-img" src="'+profileurl+'" alt="Avatar" style="width:60px;height:60px;"/></div> <div class="details"> <h5>'+name+'</h5><h6</h6> </div><div class="date-status"><i class="ti-pin2"></i><h6><!--22/10/23--></h6><h6 class="font-success status"></h6></div></div></li>');
          
          $(".chat_item").click(function(){
        
            window.localStorage.setItem("talkingto",name);
            reloadChats(profileurl);
          });


        }


        reloadChats(profileurl);
     
}


function reloadChats(profileurl){

  $('.messages .chatappend').html();
          
  citiesRef.where("uname", "==", window.localStorage.getItem("user")).get().then((querySnapshot) => {

    querySnapshot.forEach((doc) => {

            var monthlies = doc.ref.collection('chats').where("from","==",window.localStorage.getItem("talkingto"));

            monthlies.get().then((querySnapshot) => {
        
            querySnapshot.forEach((doc) => {
              
            window.localStorage.setItem("isinchat","true");
             
            console.log(doc.data());
          
            for(var i=0; i<doc.data().logs.length; i++){

            if(doc.data().logs[i].from==window.localStorage.getItem("user")){

           
              if(doc.data().logs[i].kind=="attachment"){

                let src = $("#get").html();
             
                src = src.replace("{profileurl}",$("#avatarimg").attr("src"));
                src = src.replace("{fileurl}",doc.data().logs[i].files);
                
                src = src.replace("{name}",window.localStorage.getItem("myname"));
                
                $(src).appendTo($('.messages .chatappend'));


              }

              if(doc.data().logs[i].kind=="pics"){

                let vvv = doc.data().logs[i].files.split(",");
                let tmp = "";
                
                for(var c=0; c<vvv.length; c++){
                    if(vvv[c]!=""){
                        tmp+="<li class=\"bg-size\"  style=\"background-image: url(\""+vvv[c]+"\"); background-size: cover; background-position: center center; display: block;\"><img class=\"bg-img\" src=\""+vvv[c]+"\" alt=\"Avatar\" style=\"display: block; width:80px;\"></li>";
        
                    }
                   
                }
    
              $("<li class=\"replies\"> <div class=\"d-flex\"> <div class=\"profile mr-4 bg-size\" style=\"background-image: url('"+$("avatarimg").attr("src")+"'); background-size: cover; background-position: center center; display: block;\"></div><div class=\"flex-grow-1\"> <div class=\"contact-name\"> <h5>"+window.localStorage.getItem("myname")+"</h5> <h6>01:35 AM</h6> <ul class=\"msg-box\"> <li class=\"msg-setting-main\">  <ul class=\"auto-gallery\">"+tmp+"</ul> <div class=\"refresh-block\"> <div class=\"badge badge-outline-primary refresh sm\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-rotate-cw\"><polyline points=\"23 4 23 10 17 10\"></polyline><path d=\"M20.49 15a9 9 0 1 1-2.12-9.36L23 10\"></path></svg></div><div class=\"badge badge-danger sm\">F</div></div><div class=\"msg-dropdown-main\"><div class=\"msg-setting\"><i class=\"ti-more-alt\"></i></div><div class=\"msg-dropdown\"> <ul><li><a href=\"#\"><i class=\"fa fa-share\"></i>forward</a></li><li><a href=\"#\"><i class=\"fa fa-clone\"></i>copy</a></li><li><a href=\"#\"><i class=\"fa fa-star-o\"></i>rating</a></li><li><a href=\"#\"><i class=\"ti-trash\"></i>delete</a></li></ul></div></div></li></ul> </div></div></div></li>").appendTo($('.messages .chatappend'));
    
            }
    

              else{

                $("<li class=\"replies\"> <div class=\"d-flex\"> <div class=\"profile mr-4 bg-size\" style=\"background-image: url('"+$("#avatarimg").attr("src")+"'); background-size: cover; background-position: center center;\"></div><div class=\"flex-grow-1\"> <div class=\"contact-name\"> <h5>"+window.localStorage.getItem("myname")+"</h5> <h6>01:42 AM</h6> <ul class=\"msg-box\"> <li> <h5>" + doc.data().logs[i].themessage + "</h5> </li></ul> </div></div></div></li>").appendTo($('.messages .chatappend'));

              }
              

            }


            else{
           
            
              var query = citiesRef.where("uname", "==",doc.data().logs[i].from).get();

              query.then((querySnapshot) => {
              
                  querySnapshot.forEach((doc) => {

                    window.localStorage.setItem("othername",doc.data().info.name);
                    window.localStorage.setItem("otherurl",doc.data().info.profileurl);
                 
                  });
              
                  
              })
              .catch((error) => {
                  console.log("Error getting documents: ", error);
              });
         
              if(doc.data().logs[i].kind=="attachment"){

                $("<li class=\"sent\"> <div class=\"d-flex\"> <div class=\"profile mr-4 bg-size\" style=\"background-image: url('"+window.localStorage.getItem("otherurl")+"'); background-size: cover; background-position: center center; display: block;\"></div><div class=\"flex-grow-1\"> <div class=\"contact-name\"> <h5>"+window.localStorage.getItem("othername")+"</h5> <h6>01:35 AM</h6> <ul class=\"msg-box\"> <li class=\"msg-setting-main\"><div class=\"document\"><i class=\"fa fa-file-excel-o font-primary\"></i><div class=\"details\"><h5>Document.xlsx</h5><h6></h6></div><div class=\"icon-btns\"><a class=\"icon-btn btn-outline-light\" href=\""+doc.data().logs[i].files+"\" target=\"_blank\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-download\"><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"></path><polyline points=\"7 10 12 15 17 10\"></polyline><line x1=\"12\" y1=\"15\" x2=\"12\" y2=\"3\"></line></svg></a></div></div><div class=\"badge badge-dark sm ms-2\"> D</div> <div class=\"msg-dropdown-main\"><div class=\"msg-setting\"><i class=\"ti-more-alt\"></i></div><div class=\"msg-dropdown\"> <ul><li><a href=\"#\"><i class=\"fa fa-share\"></i>forward</a></li><li><a href=\"#\"><i class=\"fa fa-clone\"></i>copy</a></li><li><a href=\"#\"><i class=\"fa fa-star-o\"></i>rating</a></li><li><a href=\"#\"><i class=\"ti-trash\"></i>delete</a></li></ul></div></div></li></ul> </div></div></div></li>").appendTo($('.messages .chatappend'));


              }


              if(doc.data().logs[i].kind=="pics"){
                
            let vvv = data.incoming_actions[ window.localStorage.getItem("pos")]["files"].split(",");

            for(var c=0; c<vvv.length; c++){
                if(vvv[c]!=""){
                    tmp+="<li class=\"bg-size\"  style=\"background-image: url(\""+vvv[c]+"\"); background-size: cover; background-position: center center; display: block;\"><img class=\"bg-img\" src=\""+vvv[c]+"\" alt=\"Avatar\" style=\"display: block; width:80px;\"></li>";
    
                }
               
            }

          $("<li class=\"sent\" > <div class=\"d-flex\"> <div class=\"profile mr-4 bg-size\" style=\"background-image: url('"+window.localStorage.getItem("otherurl")+"'); background-size: cover; background-position: center center; display: block;\"></div><div class=\"flex-grow-1\"> <div class=\"contact-name\"> <h5>"+window.localStorage.getItem("othername")+"</h5> <h6>01:35 AM</h6> <ul class=\"msg-box\"> <li class=\"msg-setting-main\">  <ul class=\"auto-gallery\">"+tmp+"</ul> <div class=\"refresh-block\"> <div class=\"badge badge-outline-primary refresh sm\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-rotate-cw\"><polyline points=\"23 4 23 10 17 10\"></polyline><path d=\"M20.49 15a9 9 0 1 1-2.12-9.36L23 10\"></path></svg></div><div class=\"badge badge-danger sm\">F</div></div><div class=\"msg-dropdown-main\"><div class=\"msg-setting\"><i class=\"ti-more-alt\"></i></div><div class=\"msg-dropdown\"> <ul><li><a href=\"#\"><i class=\"fa fa-share\"></i>forward</a></li><li><a href=\"#\"><i class=\"fa fa-clone\"></i>copy</a></li><li><a href=\"#\"><i class=\"fa fa-star-o\"></i>rating</a></li><li><a href=\"#\"><i class=\"ti-trash\"></i>delete</a></li></ul></div></div></li></ul> </div></div></div></li>").appendTo($('.messages .chatappend'));


              }
             
              else{
              $("<li class=\"sent\"> <div class=\"d-flex\"> <div class=\"profile mr-4 bg-size\" style=\"background-image: url('"+window.localStorage.getItem("otherurl")+"'); background-size: cover; background-position: center center; display: block;\"></div><div class=\"flex-grow-1\"> <div class=\"contact-name\"> <h5>"+window.localStorage.getItem("othername")+"</h5> <h6>01:35 AM</h6> <ul class=\"msg-box\"> <li> <h5>"+doc.data().logs[i].themessage+"</h5> <div class=\"badge badge-success sm ml-2\"> R</div></li></ul> </div></div></div></li>").appendTo($('.messages .chatappend'));

              }

          

            }
           }


        });
        
        });
        
        });     
    
    
    });   

$("#avatarimg2").attr("src",profileurl);  
$("#avatarimg2").css("display","block");
$("#avatarimg2").css("width","60px");
$("#avatarimg2").css("height","60px");

$("#content").css("display","block");

}


$("#contacts-tab").click(function(){
  $("#thecontacts").html("");
  var query = citiesRef.where("uname", "==",window.localStorage.getItem("user")).get();

  query.then((querySnapshot) => {
  
      querySnapshot.forEach((doc) => {

for(var x=0; x<doc.data().contacts.length; x++){

  var query = citiesRef.where("uname", "==",doc.data().contacts[x]).get();

  query.then((querySnapshot) => {
  
      querySnapshot.forEach((doc) => {

$("#thecontacts").append('  <li> <div class="contact-box"><div class="profile offline"><img class="bg-img" src="'+doc.data().info.profileurl+'" alt="Avatar" style="width:60px;height:60px;"></div><div class="details"><h5>'+doc.data().info.name+'</h5> <h6> </h6> </div><div class="contact-action"><div class="icon-btn btn-outline-primary btn-sm button-effect"><i data-feather="phone"></i></div><div class="icon-btn btn-outline-success btn-sm button-effect"><i data-feather="video"></i></div></div></div></li>');
feather.replace();


});
  
      
})
.catch((error) => {
    console.log("Error getting documents: ", error);
});



}

});
  
      
})
.catch((error) => {
    console.log("Error getting documents: ", error);
});
});





$("#requests-tab").click(function(){
  
  var query = citiesRef.where("uname", "==",window.localStorage.getItem("user")).get();

  query.then((querySnapshot) => {
      let pos = 0;
      querySnapshot.forEach((doc) => {

        for(var j=0; j<doc.data().requests.length; j++){
       
$("#therequests").append('<li class="request-item" id="'+doc.data().requests[j]+'"><div class="contact-box"><div class="profile online"><img class="bg-img" src="assets/images/contact/1.jpg" alt="Avatar"/></div><div class="details"><h5>'+doc.data().requests[j]+'</h5> <h6> </h6></div> <div class="contact-action"><div class="icon-btn btn-outline-primary btn-sm button-effect accept-request accept-now"><i data-feather="check"   ></i></div><div class="icon-btn btn-outline-success btn-sm button-effect cancel-now"><i data-feather="x"></i></div></div></div></li>');


feather.replace();

              let v = "#"+doc.data().requests[j];
              
              $(v).find(".accept-now ").click(function(){
            
                let arr = doc.data().contacts;
                       
                arr.push($(v).attr("id"));
                console.log(arr);
                doc.ref.update({
                    contacts: arr
              
                });   

             
                arr = doc.data().requests;
                arr.splice(j-1, 1);
                doc.ref.update({
                 requests: arr
            
              });   

              $(v).remove();

              })



              $(v).find(".cancel-now ").click(function(){

               
                let arr = doc.data().requests;
                arr.splice(j-1, 1);
                doc.ref.update({
                 requests: arr
            
              });   

            $(v).remove();

              })



            
         
   


        }
   
      
      });
  
      
  })
  .catch((error) => {
      console.log("Error getting documents: ", error);
  });
  
  


  //$("#therequests").append('    <li class="active"> <div class="contact-box"> <div class="profile offline"><img class="bg-img" src="assets/images/contact/2.jpg" alt="Avatar"/></div> <div class="details"><h5>Jgggg</h5> <h6>+21 3523 25544 </h6></div><div class="contact-action"> <div class="icon-btn btn-outline-primary btn-sm button-effect"><i data-feather="check"></i></div><div class="icon-btn btn-outline-success btn-sm button-effect"><i data-feather="video"></i></div></div></div></li>');



});

function loadInfos(){

  var query = citiesRef.where("uname", "==", window.localStorage.getItem("user")).get();
  
  query.then((querySnapshot) => {
  
      querySnapshot.forEach((doc) => {
        window.localStorage.setItem("myname",doc.data().info.name);

        $("#myname").text(doc.data().info.name);
        $("#myaddress").text(doc.data().info.address);
  
        $("#avatarimg").attr("src", doc.data().info.profileurl);
        $("#avatarimg").css("display","block");
        $("#avatarimg").css("width","60px");
        $("#avatarimg").css("height","60px");
        
        $("#avatarimg1").attr("src", doc.data().info.profileurl);
        $("#avatarimg1").css("display","block");
        $("#avatarimg1").css("width","60px");
        $("#avatarimg1").css("height","60px");

      });
  
      
  })
  .catch((error) => {
      console.log("Error getting documents: ", error);
  });
  
  }
  

$("#group-tab").click(function(){

  $("#content").css("display","block");

});


let localStream = null;
let remoteStream = null;
