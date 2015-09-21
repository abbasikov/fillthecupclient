function ContractorController($scope,$state,Notification,FileUploader,$http,context){
	
	$scope.strech = false;

	if(context.getEmployee() == null)
	{
		$state.go('login');
	}
	else{
		$scope.firstName 	= context.getEmployee().firstName;
		$scope.lastName		= context.getEmployee().lastName;
		$scope.companyType  = context.getEmployee().company.companyType;
		$scope.companyName	= context.getEmployee().company.name;
		
	}
	
	$scope.toggleSideBar = function(){
		
		$scope.strech = !$scope.strech;
		
		//True:Collapse left
		if($scope.strech){
			$('#leftSide').addClass('collapse-left');
			$('#rightSide').addClass('strech');
		}
		else{
			$('#leftSide').removeClass('collapse-left');
			$('#rightSide').removeClass('strech');
		}
	}
	
	angular.element('#page-signin-bg').hide();
}


angular.module('contractor',['ngAnimate','ui.router','ui-notification','angularFileUpload'])
	.controller('ContractorController',['$scope','$state','Notification','FileUploader','$http','context',ContractorController]);
	