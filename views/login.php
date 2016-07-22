<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>BSERI - HTML5 Responsive Template</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="">
        <meta name="author" content="">
        <link rel="stylesheet" href="css/bootstrap.min.css" media="all" />
        <link rel="stylesheet" href="css/font-awesome.min.css" media="all" />
        <link rel="stylesheet" href="css/superfish.css" media="all" />
        <link rel="stylesheet" href="css/owl.carousel.css" media="all" />
        <link rel="stylesheet" href="css/owl.theme.css" media="all" />
        <link rel="stylesheet" href="css/jquery.navgoco.css"/>
        <link rel="stylesheet" href="css/bbpress.css" media="all">
        <link rel="stylesheet" href="style.css">
        <link rel="stylesheet" href="css/responsive.css"/>
        <link href='http://fonts.googleapis.com/css?family=Source+Sans+Pro:400,300,300italic,400italic,600,600italic,700italic,700' rel='stylesheet' type='text/css'>
        <link href='http://fonts.googleapis.com/css?family=Raleway:400,300,500,600,700,800' rel='stylesheet' type='text/css'>
        <script src="js/modernizr.custom.js"></script>

        <!-- Le fav and touch icons -->
        <link rel="shortcut icon" href="img/favicon.ico">
        <link rel="apple-touch-icon" href="img/apple-touch-icon.png">
        <link rel="apple-touch-icon" sizes="72x72" href="img/apple-touch-icon-72x72.png">
        <link rel="apple-touch-icon" sizes="114x114" href="img/apple-touch-icon-114x114.png">


    </head>

<body>

  <?php


  include('header.php');

  include('register.php');
  include('signin.php');

  //include('page-header.html');

  ?>
	<div class="main">
		<form>
    		<h1><span>User</span> Login  </h1>
  			<div class="login-container">
					<div class=col-md-3>
					</div>
            <div class="col-md-6">
              <p>
    	    		 <h3>EMAIL ADDRESS</h3>
               <br>
              <input type="text" placeholder="" required/>
    				 </p>
      				<p>
							<br>
  				    <h3>PASSWORD</h3>
              <br>
              <input type="password" placeholder="" required/>
  				    </p>

						  <p>
						    <input type="checkbox" name="remember" id="remember">
						    <label for="remember">Remember me for 14 days</label>
						  </p>

			  <p class="p-container">
			    <span><a href="#">Forgot password ?</a></span>
			    <input type="submit" value="Login">
			  </p>
			</div>
		</div>
		</form>
	</div>
</body>
