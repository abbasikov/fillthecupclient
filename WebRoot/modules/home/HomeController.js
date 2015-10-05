function HomeController($scope,$state,Notification,context,ReleasesCupService,ReleasesCupByLabService){
	
	$scope.releaseCupsList		= [];
	$scope.getAllReleaseCupList = function(){
		var rel = ReleasesCupByLabService.get({id:$scope.profileObject.labs[0].uuid});
		rel.$promise.then(
				function(data){
					if(data.meta.code == 200){
						$scope.releaseCupsList = data.dataList;
					}
					else{
						Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
					}
				},
				function(error){
					Notification.error({message: "Some error occurred1. Please try again later.", title: 'Error'});
			});
	}
	
	$scope.deleteReleaseCupFromList = function(index){
		var from 	= index;
		var to		= 0;
		var rest = $scope.releaseCupsList.slice((to || from) + 1 || $scope.releaseCupsList.length);
		$scope.releaseCupsList.length = from < 0 ? $scope.releaseCupsList.length + from : from;
		$scope.releaseCupsList.push.apply($scope.releaseCupsList, rest);
	};
	
	
	
	
	if(context.getUser() == null)
	{
		$state.go('login');
	}
	else{
		$scope.profileObject 	= context.getUser();
		console.log("Profile Object: ",$scope.profileObject);
		
		$scope.companyType  	= "Macys";
		$scope.isSuperAdmin		= ($scope.profileObject.isSuperAdmin == undefined || $scope.profileObject.isSuperAdmin == 'false') ? false:true;
		$scope.navsection 		= -1;
		
		//Add page-signin class in body tag
		angular.element('#id-body').removeClass('page-signin');	
		$scope.getAllReleaseCupList();
	}	
	
	
	
}


angular.module('home',['ngAnimate','ui.router','ui-notification','angularFileUpload'])
	.controller('HomeController',['$scope','$state','Notification','context','ReleasesCupService','ReleasesCupByLabService',HomeController]);
	