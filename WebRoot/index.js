function config($stateProvider, $urlRouterProvider,$httpProvider){
	
	$stateProvider
		.state("login",{
			url			:"/login",
			templateUrl	:"modules/login/Login.tpl.html",
			controller	: LoginController
		})
		.state("signout",{
			url			:"/login",
			templateUrl	:"modules/login/Login.tpl.html",
			controller	: LoginController
		})
		.state("register",{
			url			:"/register",
			templateUrl	:"modules/register/Register.tpl.html",
			controller	: RegisterController
		})
		.state("passwordreset",{
			url			:"/passwordreset",
			templateUrl	:"modules/passwordreset/PasswordReset.tpl.html",
			controller	: PasswordResetController
		})
		.state("passwordchange",{
			url			:"/passwordchange",
			templateUrl	:"modules/passwordchange/PasswordChange.tpl.html",
			controller	: PasswordChangeController
		})
		.state("admin",{
			url			:"/admin",
			templateUrl	:"modules/admin/Admin.tpl.html",
			controller	: AdminController
		})
		.state("admin.users",{
			url			:"/users",
			templateUrl	:"modules/admin/users/Users.tpl.html",
			controller	: UsersController
		})
		.state("mobilenotsuported",{
			url			:"/mobilenotsupported",
			templateUrl	:"templates/not_suported.tpl.html"
		});
	
		//Registering interceptor for showing loading on each ajax request
		$httpProvider.interceptors.push('myHttpInterceptor');
	
}

angular.module('eEstimateApp',['ngImgCrop','angucomplete','ui.router', 'ngAnimate','ngResource','context.service','login','rest.service','error.utils','ngCookies','xeditable','ui.bootstrap','model.service','ngTagsInput'])
	.config(config)
	.factory('myHttpInterceptor', function($q) {
	    return {
	      // optional method
	      'request': function(config) {
	        // do something on success
	    	$("#spinner").show();
	    	return config;
	      },
	
	      // optional method
	     'requestError': function(rejection) {
	        // do something on error
	    	 $("#spinner").hide();
	     },
	
	
	
	      // optional method
	      'response': function(response) {
	        // do something on success
	    	  $("#spinner").hide();
	    	  
	        return response;
	      },
	
	      // optional method
	     'responseError': function(rejection) {
	        // do something on error
	    	 $("#spinner").hide();
	    	 
	      }
	    };
	})
	.run(['$state','loadContext','$cookies',function($state,loadContext,$cookies){
			var model = loadContext.loadContext();
			
			if(model == undefined){
				//re-route to login
				$state.go("login");
			}
			else{
				//re-route to home
				$state.go("home");
			}
	}]);