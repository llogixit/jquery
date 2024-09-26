<!DOCTYPE html>
<html lang="en">
  <head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="description" content="Chitchat">
    <meta name="keywords" content="Chitchat">
    <meta name="author" content="Chitchat">
    <link rel="icon" href="assets/images/favicon/favicon.png" type="image/x-icon">
    <link rel="shortcut icon" href="assets/images/favicon/favicon.png" type="image/x-icon">
    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,500,600,700,800&amp;display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,500,600&amp;display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Rubik:300,300i,400,400i,500,500i,700,700i,900,900i&amp;display=swap" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="assets/css/date-picker.css">
    <link rel="stylesheet" type="text/css" href="assets/css/magnific-popup.css">
    <link rel="stylesheet" type="text/css" href="assets/css/style.css" media="screen" id="color">
    <link rel="stylesheet" type="text/css" href="assets/css/themify-icons.css">
    <link rel="stylesheet" type="text/css" href="assets/css/tour.css">
    <link rel="stylesheet" type="text/css" href="assets/js/ckeditor/skins/moono-lisa/editor.css?t=HBDD">
    <link rel="stylesheet" type="text/css" href="assets/js/ckeditor/plugins/scayt/skins/moono-lisa/scayt.css">
    <link rel="stylesheet" type="text/css" href="assets/js/ckeditor/plugins/scayt/dialogs/dialog.css">
    <link rel="stylesheet" type="text/css" href="assets/js/ckeditor/plugins/tableselection/styles/tableselection.css">
    <link rel="stylesheet" type="text/css" href="assets/js/ckeditor/plugins/wsc/skins/moono-lisa/wsc.css">
    <link rel="stylesheet" type="text/css" href="assets/js/ckeditor/plugins/copyformatting/styles/copyformatting.css">

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <script src="https://www.gstatic.com/firebasejs/7.14.6/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/7.14.6/firebase-firestore.js"></script>



  </head>
  <!-- login page start //-->
  <body>
    <div class="login-page2 animat-rate">
      <div class="login-content-main"> 
        <div class="login-content2">
          <div class="theme-tab">       
            <ul class="nav nav-tabs" id="myTab" role="tablist">
              <li class="nav-item"><a class="nav-link" id="login-tab" data-bs-toggle="tab" href="login.html" role="tab" aria-selected="false">login</a></li>
              <li class="nav-item"><a class="nav-link active" id="signup-tab" data-bs-toggle="tab" href="signup.html" role="tab" aria-selected="true">Signup</a></li>
            </ul>
          </div>
        </div>
        <div class="login-content">
          <div class="login-content-header"><img class="img-fluid" src="assets/images/logo/logo.webp" alt="images" style="height:130px;"></div>
          <h3>Hello Everyone , We are Voxer</h3>
          <h4>Wellcome to Voxer please, login to your account.</h4>
          <form class="form2">
            <div class="form-group">
              <label class="col-form-label" for="inputEmail3">Username</label>
              <input class="form-control"  type="email" placeholder="" id="username">
            </div>
            <div class="form-group">
              <label class="col-form-label" for="inputPassword3">Password</label><span> </span>
              <input class="form-control" id="password" type="password" placeholder="Password">
            </div>
            <div class="form-group">
              <div class="rememberchk">                  
                <input class="form-check-input" id="gridCheck1" type="checkbox">
                <label class="form-check-label ps-4" for="gridCheck1">Remember Me.</label>
                <h6 class="pull-right">Forgot Password?</h6>
              </div>
            </div>
            <!--
            <ul class="medialogo">
              <li><a class="icon-btn btn-facebook button-effect rouded15" href="https://www.facebook.com/"><i class="fa fa-facebook-f"></i></a></li>
              <li><a class="icon-btn btn-danger button-effect rouded15" href="https://www.google.com/"><i class="fa fa-google"></i></a></li>
              <li><a class="icon-btn btn-primary button-effect rouded15" href="https://twitter.com/"><i class="fa fa-twitter"></i></a></li>
            </ul>-->

            <div class="form-group mb-0">
              <div class="buttons"><a class="btn button-effect btn-primary" href="#" id="login">Login</a></div>
            </div>

          </form>
        </div>
      </div>
      <div class="animation-block">
        <div class="bg_circle">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div class="cross"></div>
        <div class="cross1"></div>
        <div class="cross2"></div>
        <div class="dot"></div>
        <div class="dot1"></div>
        <div class="top-circle"></div>
        <div class="center-circle"></div>
        <div class="bottom-circle1"></div>
        <div class="right-circle"></div>
        <div class="right-circle1"></div>
        <div class="quarterCircle"></div><img class="cloud-logo" src="assets/images/login_signup/2.png" alt="login logo"/><img class="cloud-logo1" src="assets/images/login_signup/2.png" alt="login logo"/><img class="cloud-logo2" src="assets/images/login_signup/2.png" alt="login logo"/><img class="cloud-logo3" src="assets/images/login_signup/2.png" alt="login logo"/><img class="cloud-logo4" src="assets/images/login_signup/2.png" alt="login logo"/><img class="cloud-logo5" src="assets/images/login_signup/2.png" alt="login logo"/>
      </div>
    </div>

    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
    <input type="hidden" name="cmd" value="_s-xclick" />
    <input type="hidden" name="hosted_button_id" value="2GK686PVHKZHY" />
    <table>
      <tr>
        <td>
          <input type="hidden" name="on0" value="Voxer messenger"/>
          Voxer messenger
        </td>
      </tr>
      <tr>
        <td>
          <select name="os0">
            <option value=" Introducing our versatile Messenger Software Template Kit, desi">
               Introducing our versatile Messenger Software Template Kit, desi
            </option>
          </select>
        </td>
      </tr>
    </table>
    <input type="hidden" name="currency_code" value="USD" />
    <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_buynow_SM.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Buy Now" />
  </form>

  </body>
  <script src="assets/js/jquery-3.7.1.min.js"></script>
  <script src='js/user.js' lang="text/javascript"></script>


</html>