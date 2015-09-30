function HomeController($scope,$state,Notification,context,ReleasesCupService){
	
	$scope.getAllReleaseCupList = function(){
		var rel = ReleasesCupService.get({id:$scope.profileObject.labs[0].uuid});
		rel.$promise.then(
				function(data){
					if(data.meta.code == 200){
						$scope.profileObject.labs[0].releaseCups = null;
						$scope.profileObject.labs[0].releaseCups = data.dataList;
					}
					else{
						Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
					}
				},
				function(error){
					Notification.error({message: "Some error occurred1. Please try again later.", title: 'Error'});
			});
	}
	
	
	if(context.getUser() == null)
	{
		$state.go('login');
	}
	else{
		$scope.profileObject 	= context.getUser();
		console.log("Profile Object: ",$scope.profileObject);
		$scope.companyType  	= "Macys";
		$scope.isSuperAdmin		= ($scope.profileObject.isSuperAdmin == undefined || $scope.profileObject.isSuperAdmin == 'false') ? false:true;
		$scope.navsection = -1;
		
		//Add page-signin class in body tag
		angular.element('#id-body').removeClass('page-signin');	
		$scope.getAllReleaseCupList();
	}	
	
	
	
}


angular.module('home',['ngAnimate','ui.router','ui-notification','angularFileUpload'])
	.controller('HomeController',['$scope','$state','Notification','context','ReleasesCupService',HomeController]);
	