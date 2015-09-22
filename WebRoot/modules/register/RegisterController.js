function RegisterController($scope,$state,Notification,FileUploader,RegisterService,ErrorUtils,CONSTANTS,context,$cookies,loadContext){
	Notification.success({message: 'Please fill the form for new registration.', title: 'Welcome to FillTheCup'});
	
	$scope.registerText = "SIGN UP";
	    
	//Add page-signup class in body tag 
	angular.element('#id-body').removeClass('page-signin');
	angular.element('#id-body').addClass('page-signup');
			
}
angular.module('register',['ngAnimate','ui.router','ui-notification','angularFileUpload'])
	.controller('RegisterController',['$scope','$state','Notification','FileUploader','RegisterService','ErrorUtils','CONSTANTS','context','$cookies','loadContext',RegisterController]);