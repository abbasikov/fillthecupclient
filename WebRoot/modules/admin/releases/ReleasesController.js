function ReleasesUpdateController($scope,$modalInstance){
	
	
	
}

function ReleasesController($scope,$state,Notification,context,ErrorUtils,DeleteLabService,$modal,UpdateObjectService){
	$scope.releaseName	= "";
	$scope.branchDate  	= "";
	$scope.hardlockDate	= "";
	$scope.mcomDate		= "";
	$scope.bcomDate 	= "";
	
	
}


angular.module('releases',['ngAnimate','ui.router','ui-notification','angularFileUpload','ng.httpLoader','angularFileUpload'])
	.controller('ReleasesController',['$scope','$state','Notification','context','ErrorUtils','DeleteLabService','$modal','UpdateObjectService',ReleasesController])
	