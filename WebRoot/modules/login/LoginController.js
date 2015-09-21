function LoginController($scope,$state,Notification,FileUploader,LoginService,loadContext,ErrorUtils,context,$timeout){
	Notification.success({message: 'Please login to begin.', title: 'Welcome to CleanEstimateX'});
	
	$scope.loginText = "SIGN IN";
	$scope.showLoading = false;
	
	//$scope.email = "neoumair@gmail.com";
	//$scope.password = "a";
	
	$scope.login = function(){
		
		
		if($scope.validate()){
			var data = "email="+$scope.email+"&password="+$scope.password;
			$scope.toggleLoading();
			var login = LoginService.save(data);
			
			login.$promise.then(
					function(data){
						$scope.toggleLoading();
						if(data.meta.code == 200){
							Notification.success({message: 'Logged in successfully.', title: 'Success'});
							
							context.setEmployee(data.data);
							
							//Store employee in session storage
							sessionStorage.setItem('employee',JSON.stringify(context.getEmployee()) );
							
							$scope.profileObject = context.getEmployee();
							
							//Redirect to admin module if the user is Admin
							if($scope.profileObject.isAdmin == 'true'){
								$state.go('admin.users');
							}
							else{
								$scope.isPasswordResetFlag = $scope.profileObject['isPasswordReset'];
								
								if($scope.isPasswordResetFlag == "true"){
									$state.go('passwordchange');
								}
								else{
									loadContext.redirectToHomePage();
								}								
							}							
							
						}
						else{
							Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
						}
						
					},
					function(error){
						$scope.toggleLoading();
						Notification.error({message: "Some error occurred. Please try again later.", title: 'Error'});
					});
		}
		
	};
	
	$scope.validate = function(){
		
		if($scope.loginForm.email.$error.required != undefined && $scope.loginForm.email.$error.required){
			Notification.error({message:'Email is required', title: 'Error'});
			return false;
		}
		
		if($scope.loginForm.email.$error.email != undefined && $scope.loginForm.email.$error.email){
			Notification.error({message:'Email is invalid', title: 'Error'});
			return false;
		}
		
		if($scope.password == undefined || $scope.password == ''){
			Notification.error({message:'Password is required', title: 'Error'});
			return false;
		}
		
		return true;
	};
	
	$scope.redirectToHomePage = function(){
		if(context !=null && context.isReady()){
			//Output details
			if(window.console)console.log("Employee:",context.getEmployee());
			
			if(context.getEmployee().company.companyType == "Supplier"){
				$state.go("supplier.machines");
			}
		}
	};
	
	$scope.toggleLoading = function(){
		if($scope.loginText == "SIGN IN"){
			$scope.loginText = "Signing in. Please wait..";
			$scope.showLoading = true;
		}
		else{
			$scope.loginText = "SIGN IN";
			$scope.showLoading = false;
		}
	};
	
	//Remove the employee from session storage and context.
	sessionStorage.removeItem("employee");	
	context.clearContext();
	
	//Add page-signin class in body tag 
	angular.element('#id-body').addClass('page-signin');
	angular.element('#id-body').removeClass('page-signup');
	
	var isMobile = {
		    Android: function() {
		        return navigator.userAgent.match(/Android/i);
		    },
		    BlackBerry: function() {
		        return navigator.userAgent.match(/BlackBerry/i);
		    },
		    iOS: function() {
		        return navigator.userAgent.match(/iPhone|iPod/i);
		    },
		    Opera: function() {
		        return navigator.userAgent.match(/Opera Mini/i);
		    },
		    Windows: function() {
		        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
		    },
		    any: function() {
		        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		    }
		};
	
	if( isMobile.any() ) 
		$state.go('mobilenotsuported');
	else{
		$timeout(function() {
			$('#username_id').focus();
		}, 500);
	}
}


angular.module('login',['ngAnimate','ui.router','ui-notification','angularFileUpload'])
	.controller('LoginController',['$scope','$state','Notification','FileUploader','LoginService','loadContext','ErrorUtils','context','$timeout',LoginController]);