function RegisterController($scope,$state,Notification,FileUploader,RegisterService,ErrorUtils,CONSTANTS,context,$cookies,loadContext){
	Notification.success({message: 'Please fill the form for new registration.', title: 'Welcome to FillTheCup'});
		
}
angular.module('register',['ngAnimate','ui.router','ui-notification','angularFileUpload'])
	.controller('RegisterController',['$scope','$state','Notification','FileUploader','RegisterService','ErrorUtils','CONSTANTS','context','$cookies','loadContext',RegisterController]);