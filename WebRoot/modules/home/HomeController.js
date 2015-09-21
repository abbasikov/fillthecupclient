function HomeController($scope,$state,Notification,context){
	
	if(context.getUser() == null)
	{
		$state.go('login');
	}
	else{
		$scope.firstName 	= context.getUser().firstName;
		$scope.lastName		= context.getUser().lastName;
		$scope.companyType  = "Macys";
		
		//Add page-signin class in body tag
		angular.element('#id-body').removeClass('page-signin');
		
	}	
	
}


angular.module('home',['ngAnimate','ui.router','ui-notification','angularFileUpload'])
	.controller('HomeController',['$scope','$state','Notification','context',HomeController]);
	