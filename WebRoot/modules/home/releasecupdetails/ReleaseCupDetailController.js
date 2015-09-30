function ReleaseCupDetailController($scope,$stateParams,$state,Notification,loadContext,ErrorUtils,context,$timeout,ReleasesService){
	$scope.selectedLab 			= $scope.profileObject.labs[0];
	$scope.selectedReleaseCup	= $scope.profileObject.labs[0].releaseCups[$stateParams.id];
	console.log("selectedReleaseCup : ",$scope.selectedReleaseCup);
	$scope.$parent.navsection = $stateParams.id;
	//alert("ReleaseCupDetailController");
}


angular.module('releasecupdetail',['ngAnimate','ui.router','ui-notification'])
	.controller('ReleaseCupDetailController',['$scope','$stateParams','$state','Notification','loadContext','ErrorUtils','context','$timeout','ReleasesService',ReleaseCupDetailController]);