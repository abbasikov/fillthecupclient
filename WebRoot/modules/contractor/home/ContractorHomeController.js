function ContractorHomeController($scope,$state,Notification,context){
	
	if(context.getEmployee() == null)
	{
		$state.go('login');
	}
	else{
		$scope.firstName 	= context.getEmployee().firstName;
		$scope.lastName		= context.getEmployee().lastName;
		$scope.companyType  = context.getEmployee().company.companyType;
		$scope.companyUuid	= context.getEmployee().company.companyUuid;
	}
}

angular.module('contractor.home',['ngAnimate','ui.router','ui-notification','angularFileUpload'])
	.controller('ContractorHomeController',['$scope','$state','Notification','context',ContractorHomeController]);
