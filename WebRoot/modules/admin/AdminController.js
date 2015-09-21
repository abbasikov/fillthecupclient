function AdminController($scope,$state,Notification,FileUploader,$http,context){
	
	

	if(context.getEmployee() == null)
	{
		$state.go('login');
	}
	else{
		$scope.firstName 	= context.getEmployee().firstName;
		$scope.lastName		= context.getEmployee().lastName;
		$scope.companyType  = 'CleanEstimateX';
		
		//Add page-signin class in body tag
		angular.element('#id-body').removeClass('page-signin');
		
		angular.element('#id-body').removeClass('skin-blue');
		angular.element('#id-body').addClass('skin-black');
	}	
}


angular.module('admin',['ngAnimate','ui.router','ui-notification','angularFileUpload'])
	.controller('AdminController',['$scope','$state','Notification','FileUploader','$http','context',AdminController]);
	