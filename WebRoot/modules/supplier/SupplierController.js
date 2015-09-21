function SupplierController($scope,$state,Notification,FileUploader,$http,context){
	
	

	if(context.getEmployee() == null)
	{
		$state.go('login');
	}
	else{
		$scope.firstName 	= context.getEmployee().firstName;
		$scope.lastName		= context.getEmployee().lastName;
		$scope.companyType  = context.getEmployee().company.companyType;
		
		//Add page-signin class in body tag
		angular.element('#id-body').removeClass('page-signin');
		
	}	
	
	
	
}


angular.module('supplier',['ngAnimate','ui.router','ui-notification','angularFileUpload'])
	.controller('SupplierController',['$scope','$state','Notification','FileUploader','$http','context',SupplierController]);
	