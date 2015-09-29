function HomeController($scope,$state,Notification,context){
	
	if(context.getUser() == null)
	{
		$state.go('login');
	}
	else{
		$scope.profileObject 	= context.getUser();
		$scope.companyType  	= "Macys";
		$scope.isSuperAdmin		= ($scope.profileObject.isSuperAdmin == undefined || $scope.profileObject.isSuperAdmin == 'false') ? false:true;
		$scope.lab 				= $scope.profileObject.labs[0];
		console.log("Lab : ",$scope.lab);
		//Add page-signin class in body tag
		angular.element('#id-body').removeClass('page-signin');		
	}	
	
}


angular.module('home',['ngAnimate','ui.router','ui-notification','angularFileUpload'])
	.controller('HomeController',['$scope','$state','Notification','context',HomeController]);
	