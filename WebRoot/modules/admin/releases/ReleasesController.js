function ReleasesUpdateController($scope,$modalInstance){
	
	
	
}

function ReleasesController($scope,$state,Notification,context,ErrorUtils,DeleteLabService,$modal,UpdateObjectService){
	
	$scope.releaseOverlay = false;
	$scope.releaseLoading = false;
	
	$scope.today = function() {
	    $scope.dt = new Date();
	  };
	$scope.today();

	$scope.clear = function () {
	    $scope.dt = null;
	};

	
	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];

	$scope.open = function($event) {
	    $scope.status.opened = true;
	  };
	
}


angular.module('releases',['ngAnimate','ui.router','ui-notification','angularFileUpload','ng.httpLoader','angularFileUpload'])
	.controller('ReleasesController',['$scope','$state','Notification','context','ErrorUtils','DeleteLabService','$modal','UpdateObjectService',ReleasesController])
	