function ReleasesUpdateController($scope,$modalInstance){
	
	
	
}

function ReleasesController($scope,$state,Notification,context,ErrorUtils,DeleteService,$modal,UpdateObjectService){
	$scope.releaseName	= "";
	$scope.branchDate  	= "";
	$scope.hardlockDate	= "";
	$scope.mcomDate		= "";
	$scope.bcomDate 	= "";
	
	$scope.releasesList = [];
	
	
	$scope.getAllReleases = function(){
		
	};
	
	$scope.getAllReleases();
}


angular.module('releases',['ngAnimate','ui.router','ui-notification','angularFileUpload','ng.httpLoader','angularFileUpload'])
	.controller('ReleasesController',['$scope','$state','Notification','context','ErrorUtils','DeleteService','$modal','UpdateObjectService',ReleasesController])
	