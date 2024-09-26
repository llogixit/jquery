

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
if(data.incoming_actions[ window.localStorage.getItem("pos")]["group"]!=null){
  let ident = '#groupchatlist';
 
  loadOtherInfo(data.incoming_actions[ window.localStorage.getItem("pos")]["kind"],ident,data.incoming_actions[ window.localStorage.getItem("pos")]["files"],data.incoming_actions[ window.localStorage.getItem("pos")]["message"], data.incoming_actions[ window.localStorage.getItem("pos")]["from"]);
}

else{
citiesRef.where("uname", "==", window.localStorage.getItem("user")).get().then((querySnapshot) => {

  querySnapshot.forEach((doc) => {

          var monthlies = doc.ref.collection('chats').where("from","==",data.incoming_actions[ window.localStorage.getItem("pos")]["from"]);

          monthlies.get().then((querySnapshot) => {
      
          querySnapshot.forEach((doc) => {
       
          window.localStorage.setItem("isinchat","true");

          let ident = '.messages .chatappend';


          let arr = doc.data().logs;
          arr.push({ from:data.incoming_actions[ window.localStorage.getItem("pos")]["from"], kind: data.incoming_actions[ window.localStorage.getItem("pos")]["kind"], files: data.incoming_actions[ window.localStorage.getItem("pos")]["files"], themessage:data.incoming_actions[ window.localStorage.getItem("pos")]["message"]});
          
          doc.ref.update({
            logs: arr
          
        }); 

addtoList(data.incoming_actions[ window.localStorage.getItem("pos")]["kind"],ident,data.incoming_actions[ window.localStorage.getItem("pos")]["files"],data.incoming_actions[ window.localStorage.getItem("pos")]["message"]);

         // $(".messages").animate({ scrollTop:max }, "fast");
      
      });
      
      });
      
      });     
  
  
  });


}



      
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


function loadOtherInfo(kind, ident, files, message, from){


  citiesRef.where("uname", "==",from).get().then((querySnapshot) => {

    querySnapshot.forEach((doc) => {

      window.localStorage.setItem("otherurl",doc.data().info.profileurl);
      window.localStorage.setItem("othername",doc.data().info.name);
   
  addtoList(kind, ident, files, message);


  });


  }); 
}



function addtoList(kind, ident, files, message){

  let rand = generateString(10);
       

  if(kind=="attachment"){
    let tmp1 = files.split("<>");

    $("<li class=\"sent\" id=\""+rand+"\"> <div class=\"d-flex\"> <div class=\"profile mr-4 bg-size\" style=\"background-image: url('"+window.localStorage.getItem("otherurl")+"'); background-size: cover; background-position: center center; display: block;\"></div><div class=\"flex-grow-1\"> <div class=\"contact-name\"> <h5>"+window.localStorage.getItem("othername")+"</h5> <h6>01:35 AM</h6> <ul class=\"msg-box\"> <li class=\"msg-setting-main\"><div class=\"document\"><i class=\"fa fa-file-excel-o font-primary\"></i><div class=\"details\"><h5>"+tmp1[1]+"</h5><h6></h6></div><div class=\"icon-btns\"><a class=\"icon-btn btn-outline-light\" href=\""+tmp1[0]+"\" target=\"_blank\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-download\"><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"></path><polyline points=\"7 10 12 15 17 10\"></polyline><line x1=\"12\" y1=\"15\" x2=\"12\" y2=\"3\"></line></svg></a></div></div><div class=\"badge badge-dark sm ms-2\"> D</div> <div class=\"msg-dropdown-main\"><div class=\"msg-setting\"><i class=\"ti-more-alt\"></i></div><div class=\"msg-dropdown\"> <ul><li><a href=\"#\"><i class=\"fa fa-share\"></i>forward</a></li><li><a href=\"#\"><i class=\"fa fa-clone\"></i>copy</a></li><li><a href=\"#\"><i class=\"fa fa-star-o\"></i>rating</a></li><li><a href=\"#\"><i class=\"ti-trash\"></i>delete</a></li></ul></div></div></li></ul> </div></div></div></li>").appendTo($(ident));

  }


  if(kind=="pics"){

    let vvv = files.split(",");
    let tmp = "";
    for(var c=0; c<vvv.length; c++){
        if(vvv[c]!=""){
            tmp+="<li class=\"bg-size\"  style=\"background-image: url(\""+vvv[c]+"\"); background-size: cover; background-position: center center; display: block;\"><img class=\"bg-img\" src=\""+vvv[c]+"\" alt=\"Avatar\" style=\"display: block; width:80px;\"></li>";

        }
       
    }

  $("<li class=\"sent\" id=\""+rand+"\"> <div class=\"d-flex\"> <div class=\"profile mr-4 bg-size\" style=\"background-image: url('"+window.localStorage.getItem("otherurl")+"'); background-size: cover; background-position: center center; display: block;\"></div><div class=\"flex-grow-1\"> <div class=\"contact-name\"> <h5>"+window.localStorage.getItem("othername")+"</h5> <h6>01:35 AM</h6> <ul class=\"msg-box\"> <li class=\"msg-setting-main\">  <ul class=\"auto-gallery\">"+tmp+"</ul> <div class=\"refresh-block\"> <div class=\"badge badge-outline-primary refresh sm\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-rotate-cw\"><polyline points=\"23 4 23 10 17 10\"></polyline><path d=\"M20.49 15a9 9 0 1 1-2.12-9.36L23 10\"></path></svg></div><div class=\"badge badge-danger sm\">F</div></div><div class=\"msg-dropdown-main\"><div class=\"msg-setting\"><i class=\"ti-more-alt\"></i></div><div class=\"msg-dropdown\"> <ul><li><a href=\"#\"><i class=\"fa fa-share\"></i>forward</a></li><li><a href=\"#\"><i class=\"fa fa-clone\"></i>copy</a></li><li><a href=\"#\"><i class=\"fa fa-star-o\"></i>rating</a></li><li><a href=\"#\"><i class=\"ti-trash\"></i>delete</a></li></ul></div></div></li></ul> </div></div></div></li>").appendTo($(ident));

}


  else{
    $("<li class=\"sent\" id=\""+rand+"\"> <div class=\"d-flex\"> <div class=\"profile mr-4 bg-size\" style=\"background-image: url('"+window.localStorage.getItem("otherurl")+"'); background-size: cover; background-position: center center; display: block;\"></div><div class=\"flex-grow-1\"> <div class=\"contact-name\"> <h5>"+window.localStorage.getItem("othername")+"</h5> <h6>01:35 AM</h6> <ul class=\"msg-box\"> <li> <h5>"+message+"</h5> <div class=\"badge badge-success sm ml-2\"> R</div></li></ul> </div></div></div></li>").appendTo($(ident));

  }


  var bottomElement = document.getElementById(rand).
    lastElementChild;

    bottomElement
    .scrollIntoView({ behavior: 'smooth', block: 'end' });
  
}

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


$("#findcontact").change(function(){

  $("#findcontactsresult").html("");


  var query = citiesRef.where("uname", "==", window.localStorage.getItem("user")).get();

  query.then((querySnapshot) => {
  
      querySnapshot.forEach((doc) => {
  
    
        if(doc.data().contacts.includes($("#findcontact").val())){
  

          var query = citiesRef.where("uname", "==", $("#findcontact").val()).get();

          query.then((querySnapshot) => {
          
              querySnapshot.forEach((doc) => {

$("#findcontactsresult").append('<li id="'+$("#findcontact").val()+'"> <div class="chat-box"><div class="d-flex"> <div class="profile offline"><img class="bg-img" src="'+doc.data().info.profileurl+'" style="width:60px;height:60px;" alt="Avatar"/></div><div class="details"> <h5>'+doc.data().info.name+'</h5><h6></h6> </div> <div class="flex-grow-1"><a class="icon-btn btn-outline-primary btn-sm" href="#" id="add_'+$("#findcontact").val()+'" data-tippy-content="Add User"><i class="fa fa-plus"></i></a></div></div></div> </li>');


$("#add_"+$("#findcontact").val()).click(function(){
  
  
  var query = citiesRef.where("uname", "==", $("#findcontact").val()).get();

  query.then((querySnapshot) => {
  
      querySnapshot.forEach((doc) => {
  
    
        if(!doc.data().groups.includes(window.localStorage.getItem("selectedGroup"))){


          let arr = doc.data().groups;
                    
          arr.push(window.localStorage.getItem("selectedGroup"));
   
          doc.ref.update({
             groups: arr
        
          });   

          var docRef = firestore.collection("group_chats").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {

              if(doc.id==window.localStorage.getItem("selectedGroup")){
                let arr = doc.data().members;
               
                arr.push($("#findcontact").val());
           
                doc.ref.update({
                  members: arr
                  
                });   
            
            }
              });
            });


        }

              });

            });

});


});   

});


        }




        });
  });



});


$("#groupname").click(function(){

$(this).html("");
$(this).html('<form class="form-radious form-sm" style="display: block;"><div class="form-group mb-2"><input class="form-control" type="text" id="editname" value=""></div></form>');

});

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
               
                if($("#group").hasClass("active")){
          
                  $("#group").css("display","block");

                  let rand  = generateString(10);
            
                  const callDoc = firestore.collection('group_chats');

                  callDoc.doc(rand).set({
                        members: [window.localStorage.getItem("user"),$("#searchcontact").val()],
                        title:"",
                        logs: []

                    })
                    .then(() => {
                
              var query = citiesRef.where("uname", "==",window.localStorage.getItem("user")).get();

              query.then((querySnapshot) => {
              
                  querySnapshot.forEach((doc) => {

        
                   let arr = doc.data().groups;
                    
                   arr.push(rand);
            
                   doc.ref.update({
                      groups: arr
                 
                   });   
         


                  });
              
                  
              })
              .catch((error) => {
                  console.log("Error getting documents: ", error);
              });



              //ADd selected to group
              var query = citiesRef.where("uname", "==",$("#searchcontact").val()).get();

              query.then((querySnapshot) => {
              
                  querySnapshot.forEach((doc) => {

                   let arr = doc.data().groups;
                    
                   arr.push(rand);
            
                   doc.ref.update({
                      groups: arr
                 
                   });   
         
                  });
              
                  
              })
              .catch((error) => {
                  console.log("Error getting documents: ", error);
              });




                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
                }
               
                else{



                }

                
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
    let isingroupchat = false;

    $(".recentitem").each(function(){
      if($(this).attr("id")==tid){
          isinrecent = true;
        
      } 
      });
      

      if(!isinrecent ){
          $('.owl-carousel').owlCarousel('add', '<div class="item recentitem" ><div class="recent-box"><div class="dot-btn dot-danger grow"></div> <div class="recent-profile"><img class="bg-img" src="'+profileurl+'" alt="Avatar" style="width:100%;height:100%;"/><h6>'+name+'</h6></div></div></div>').owlCarousel('update');
      }
      

      //FOR DIRECT CHAT
      if($("#direct-tab").hasClass("active")){
  
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


      //FOR ADDING GROUPS
 
      else{
        $("#groupslist").append("<li class=\"active group_item\" data-to=\"group_chat\"><div class=\"group-box\"><div class=\"profile\"><img class=\"bg-img\" src=\"assets/images/avtar/teq.jpg\" alt=\"Avatar\"/></div> <div class=\"details\"><h5></h5> <h6></h6></div><div class=\"date-status\"><ul class=\"grop-icon\"><li><a class=\"group-tp\" href=\"#\" data-tippy-content=\"Josephin\"></a> <img src=\"assets/images/contact/1.jpg\" alt=\"group-icon-img\"/></a></li><li><a class=\"group-tp\" href=\"#\" data-tippy-content=\"Jony \"> <img src=\"assets/images/contact/2.jpg\" alt=\"group-icon-img\"/></a></li> <li><a class=\"group-tp\" href=\"#\" data-tippy-content=\"Pabelo\"> <img src=\"assets/images/contact/3.jpg\" alt=\"group-icon-img\"/></a></li><li>+ 35</li> </ul></div></div></li>");

        $(".group_item").click(function(){
          $("#group").css("display","block");
          reloadChats(profileurl);
        });

     
      }

}


function reloadChats(profileurl){

  $('.messages .chatappend').html("");

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
                let tmp1 = doc.data().logs[i].files.split(",");
                src = src.replace("{profileurl}",$("#avatarimg").attr("src"));
                src = src.replace("{fileurl}",tmp1[0]);
                src = src.replace("{filename}",tmp1[1]);
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

                let tmp1 = doc.data().logs[i].files.split(",");
              

                $("<li class=\"sent\"> <div class=\"d-flex\"> <div class=\"profile mr-4 bg-size\" style=\"background-image: url('"+window.localStorage.getItem("otherurl")+"'); background-size: cover; background-position: center center; display: block;\"></div><div class=\"flex-grow-1\"> <div class=\"contact-name\"> <h5>"+window.localStorage.getItem("othername")+"</h5> <h6>01:35 AM</h6> <ul class=\"msg-box\"> <li class=\"msg-setting-main\"><div class=\"document\"><i class=\"fa fa-file-excel-o font-primary\"></i><div class=\"details\"><h5>"+tmp1[1]+"</h5><h6></h6></div><div class=\"icon-btns\"><a class=\"icon-btn btn-outline-light\" href=\""+tmp1[0]+"\" target=\"_blank\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-download\"><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"></path><polyline points=\"7 10 12 15 17 10\"></polyline><line x1=\"12\" y1=\"15\" x2=\"12\" y2=\"3\"></line></svg></a></div></div><div class=\"badge badge-dark sm ms-2\"> D</div> <div class=\"msg-dropdown-main\"><div class=\"msg-setting\"><i class=\"ti-more-alt\"></i></div><div class=\"msg-dropdown\"> <ul><li><a href=\"#\"><i class=\"fa fa-share\"></i>forward</a></li><li><a href=\"#\"><i class=\"fa fa-clone\"></i>copy</a></li><li><a href=\"#\"><i class=\"fa fa-star-o\"></i>rating</a></li><li><a href=\"#\"><i class=\"ti-trash\"></i>delete</a></li></ul></div></div></li></ul> </div></div></div></li>").appendTo($('.messages .chatappend'));


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
  loadContacts("#thecontacts");
 
});



function loadContacts(ident){

  var query = citiesRef.where("uname", "==",window.localStorage.getItem("user")).get();

  query.then((querySnapshot) => {
  
querySnapshot.forEach((doc) => {

for(var x=0; x<doc.data().contacts.length; x++){

  var query = citiesRef.where("uname", "==",doc.data().contacts[x]).get();

  query.then((querySnapshot) => {
  
  querySnapshot.forEach((doc) => {

    if(ident.includes("thecontacts")){
      $(ident).append('  <li> <div class="contact-box"><div class="profile offline"><img class="bg-img" src="'+doc.data().info.profileurl+'" alt="Avatar" style="width:60px;height:60px;"></div><div class="details"><h5>'+doc.data().info.name+'</h5> <h6> </h6> </div><div class="contact-action"><div class="icon-btn btn-outline-primary btn-sm button-effect"><i data-feather="phone"></i></div><div class="icon-btn btn-outline-success btn-sm button-effect"><i data-feather="video"></i></div></div></div></li>');
      feather.replace();
    }

    else{
      
    }




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

}

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



  $("#direct-tab").click(function(){
    $("#chating").removeClass("group_chat");
    $("#group").css("display","none");
    $("#chatlist").html("");
    $(".chat-main").html("");

    citiesRef.where("uname", "==", window.localStorage.getItem("user")).get().then((querySnapshot) => {

      querySnapshot.forEach((doc) => {

      var monthlies = doc.ref.collection('chats').get();
      
      monthlies.then((querySnapshot) => {
    
        querySnapshot.forEach((doc) => {
          console.log(doc.data());

          citiesRef.where("uname", "==", doc.data().from).get().then((querySnapshot) => {

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






        });
        });
      });
    });
    $("#direct").css("display","block");
  
  });
  

$("#group-tab").click(function(){

  $("#direct").css("display","none");
     
  var query = citiesRef.where("uname", "==",window.localStorage.getItem("user")).get();

  query.then((querySnapshot) => {
  
      querySnapshot.forEach((doc) => {

      let arr = doc.data().groups;

      $("#groupslist").html("");

      for(var x=0; x<arr.length; x++){

        $("#groupslist").append("<li class=\" group_item\"  id=\""+arr[x]+"\" data-to=\"group_chat\"><div class=\"group-box\"><div class=\"profile\"><img class=\"bg-img\" src=\"assets/images/avtar/teq.jpg\" alt=\"Avatar\"/></div> <div class=\"details\"><h5>"+arr[x]+"</h5> <h6>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h6></div><div class=\"date-status\"><ul class=\"grop-icon\"><li><a class=\"group-tp\" href=\"#\" data-tippy-content=\"Josephin\"></a> <img src=\"assets/images/contact/1.jpg\" alt=\"group-icon-img\"/></a></li><li><a class=\"group-tp\" href=\"#\" data-tippy-content=\"Jony \"> <img src=\"assets/images/contact/2.jpg\" alt=\"group-icon-img\"/></a></li> <li><a class=\"group-tp\" href=\"#\" data-tippy-content=\"Pabelo\"> <img src=\"assets/images/contact/3.jpg\" alt=\"group-icon-img\"/></a></li><li></li> </ul></div></div></li>");

        $(".group_item").click(function(){
          
          window.localStorage.setItem("selectedGroup",$(this).attr("id"));

          $("#groupchatlist").children("li").each(function(){
            if(!$(this).hasClass("groupuser")){
              $(this).remove();
            }
          });


          $("#group").css("display","block");


          var docRef = firestore.collection("group_chats").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {

          // doc.data() is never undefined for query doc snapshots
        if(doc.id==window.localStorage.getItem("selectedGroup")){
          console.log(doc.data().logs);

          $(".gr-profile").each(function(){
            $(this).remove();
          });

          for(var i=0; i<doc.data().members.length; i++){

          
         $("#memberslist").append('<div class="gr-profile dot-btn dot-success grow bg-size" style="background-image: url(&quot;assets/images/avtar/3.jpg&quot;); background-size: cover; background-position: center center; display: block;"><img class="bg-img" src="assets/images/avtar/3.jpg" alt="Avatar" style="display: none;"></div>');
          }


        }
        });
      
      });


       
          var docRef = firestore.collection("group_chats").get().then((querySnapshot) => {

            querySnapshot.forEach((doc) => {

                // doc.data() is never undefined for query doc snapshots
              if(doc.id== $(this).attr("id")){
               console.log(doc.data().logs);

              addToGroup(doc.data().logs,0);


              }


            });
        });
      });


    }
              
  });
});  


  //
  $("#group").css("display","block");
  $("#content").css("display","block");
});




function addToGroup(logs,i){
  try{
  if(logs[i].from==window.localStorage.getItem("user")){

           
    if(logs[i].kind=="attachment"){
      
      let src = $("#get").html();
      let tmp3 = logs[i].files.split("<>");
      src = src.replace("{profileurl}",$("#avatarimg").attr("src"));
      src = src.replace("{fileurl}",tmp3[0]);
      src = src.replace("{filename}",tmp3[1]);
      src = src.replace("{name}",window.localStorage.getItem("myname"));
      
      $(src).appendTo($('#groupchatlist'));


    }

    if(logs[i].kind=="pics"){

      let vvv = logs[i].files.split(",");
      let tmp = "";
      
      for(var c=0; c<vvv.length; c++){
          if(vvv[c]!=""){
              tmp+="<li class=\"bg-size\"  style=\"background-image: url(\""+vvv[c]+"\"); background-size: cover; background-position: center center; display: block;\"><img class=\"bg-img\" src=\""+vvv[c]+"\" alt=\"Avatar\" style=\"display: <block; width:80px;\"></li>";

          }
         
      }

    $("<li class=\"replies\"> <div class=\"d-flex\"> <div class=\"profile mr-4 bg-size\" style=\"background-image: url('"+$("avatarimg").attr("src")+"'); background-size: cover; background-position: center center; display: block;\"></div><div class=\"flex-grow-1\"> <div class=\"contact-name\"> <h5>"+window.localStorage.getItem("myname")+"</h5> <h6>01:35 AM</h6> <ul class=\"msg-box\"> <li class=\"msg-setting-main\">  <ul class=\"auto-gallery\">"+tmp+"</ul> <div class=\"refresh-block\"> <div class=\"badge badge-outline-primary refresh sm\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-rotate-cw\"><polyline points=\"23 4 23 10 17 10\"></polyline><path d=\"M20.49 15a9 9 0 1 1-2.12-9.36L23 10\"></path></svg></div><div class=\"badge badge-danger sm\">F</div></div><div class=\"msg-dropdown-main\"><div class=\"msg-setting\"><i class=\"ti-more-alt\"></i></div><div class=\"msg-dropdown\"> <ul><li><a href=\"#\"><i class=\"fa fa-share\"></i>forward</a></li><li><a href=\"#\"><i class=\"fa fa-clone\"></i>copy</a></li><li><a href=\"#\"><i class=\"fa fa-star-o\"></i>rating</a></li><li><a href=\"#\"><i class=\"ti-trash\"></i>delete</a></li></ul></div></div></li></ul> </div></div></div></li>").appendTo($('#groupchatlist'));
    
  }


    else{

      $("<li class=\"replies\"> <div class=\"d-flex\"> <div class=\"profile mr-4 bg-size\" style=\"background-image: url('"+$("#avatarimg").attr("src")+"'); background-size: cover; background-position: center center;\"></div><div class=\"flex-grow-1\"> <div class=\"contact-name\"> <h5>"+window.localStorage.getItem("myname")+"</h5> <h6>01:42 AM</h6> <ul class=\"msg-box\"> <li> <h5>" + logs[i].themessage + "</h5> </li></ul> </div></div></div></li>").appendTo($('#groupchatlist'));

    }
    i+=1;
    addToGroup(logs,i);
    

  }


  else{
 
    var query = citiesRef.where("uname", "==",logs[i].from).get();
    window.localStorage.setItem("kind",logs[i].kind);
    window.localStorage.setItem("themessage",logs[i].themessage);
    
    window.localStorage.setItem("files",logs[i].files);

    query.then((querySnapshot) => {
    
        querySnapshot.forEach((doc) => {
   
          if( window.localStorage.getItem("kind")=="attachment"){

            $("<li class=\"sent\"> <div class=\"d-flex\"> <div class=\"profile mr-4 bg-size\" style=\"background-image: url('"+doc.data().info.profileurl+"'); background-size: cover; background-position: center center; display: block;\"></div><div class=\"flex-grow-1\"> <div class=\"contact-name\"> <h5>"+doc.data().info.name+"</h5> <h6>01:35 AM</h6> <ul class=\"msg-box\"> <li class=\"msg-setting-main\"><div class=\"document\"><i class=\"fa fa-file-excel-o font-primary\"></i><div class=\"details\"><h5>Document.xlsx</h5><h6></h6></div><div class=\"icon-btns\"><a class=\"icon-btn btn-outline-light\" href=\""+window.localStorage.getItem("files")+"\" target=\"_blank\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-download\"><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"></path><polyline points=\"7 10 12 15 17 10\"></polyline><line x1=\"12\" y1=\"15\" x2=\"12\" y2=\"3\"></line></svg></a></div></div><div class=\"badge badge-dark sm ms-2\"> D</div> <div class=\"msg-dropdown-main\"><div class=\"msg-setting\"><i class=\"ti-more-alt\"></i></div><div class=\"msg-dropdown\"> <ul><li><a href=\"#\"><i class=\"fa fa-share\"></i>forward</a></li><li><a href=\"#\"><i class=\"fa fa-clone\"></i>copy</a></li><li><a href=\"#\"><i class=\"fa fa-star-o\"></i>rating</a></li><li><a href=\"#\"><i class=\"ti-trash\"></i>delete</a></li></ul></div></div></li></ul> </div></div></div></li>").appendTo($('.messages .chatappend'));


          }


          if(window.localStorage.getItem("kind")=="pics"){
            
            let vvv = window.localStorage.getItem("files").split(",");
            let tmp = "";
            
            for(var c=0; c<vvv.length; c++){
                if(vvv[c]!=""){
                    tmp+="<li class=\"bg-size\"  style=\"background-image: url(\""+vvv[c]+"\"); background-size: cover; background-position: center center; display: block;\"><img class=\"bg-img\" src=\""+vvv[c]+"\" alt=\"Avatar\" style=\"display: block; width:80px;\"></li>";
    
                }
           
        }

      $("<li class=\"sent\" > <div class=\"d-flex\"> <div class=\"profile mr-4 bg-size\" style=\"background-image: url('"+doc.data().info.profileurl+"'); background-size: cover; background-position: center center; display: block;\"></div><div class=\"flex-grow-1\"> <div class=\"contact-name\"> <h5>"+doc.data().info.name+"</h5> <h6>01:35 AM</h6> <ul class=\"msg-box\"> <li class=\"msg-setting-main\">  <ul class=\"auto-gallery\">"+tmp+"</ul> <div class=\"refresh-block\"> <div class=\"badge badge-outline-primary refresh sm\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-rotate-cw\"><polyline points=\"23 4 23 10 17 10\"></polyline><path d=\"M20.49 15a9 9 0 1 1-2.12-9.36L23 10\"></path></svg></div><div class=\"badge badge-danger sm\">F</div></div><div class=\"msg-dropdown-main\"><div class=\"msg-setting\"><i class=\"ti-more-alt\"></i></div><div class=\"msg-dropdown\"> <ul><li><a href=\"#\"><i class=\"fa fa-share\"></i>forward</a></li><li><a href=\"#\"><i class=\"fa fa-clone\"></i>copy</a></li><li><a href=\"#\"><i class=\"fa fa-star-o\"></i>rating</a></li><li><a href=\"#\"><i class=\"ti-trash\"></i>delete</a></li></ul></div></div></li></ul> </div></div></div></li>").appendTo($('.messages .chatappend'));


          }
         
          else{
          $("<li class=\"sent\"> <div class=\"d-flex\"> <div class=\"profile mr-4 bg-size\" style=\"background-image: url('"+doc.data().info.profileurl+"'); background-size: cover; background-position: center center; display: block;\"></div><div class=\"flex-grow-1\"> <div class=\"contact-name\"> <h5>"+doc.data().info.name+"</h5> <h6>01:35 AM</h6> <ul class=\"msg-box\"> <li> <h5>"+window.localStorage.getItem("themessage")+"</h5> <div class=\"badge badge-success sm ml-2\"> R</div></li></ul> </div></div></div></li>").appendTo($("#groupchatlist"));

          }
          i+=1;
          addToGroup(logs,i);
          

        });

      });

  


  }

}catch{}
}







$(".showadd").click(function(){

    $("#addcontacttogroup").css("display","block");

});

$("#showcontacts").click(function(){
  $("#contact-list .chat-main").html("");
  loadContacts("#contact-list .chat-main");
 

}
);


let localStream = null;
let remoteStream = null;
