function ReleaseCupDetailController($scope,$stateParams,$state,Notification,loadContext,ErrorUtils,context,$timeout,ReleasesService,UpdateObjectService){
	
	$scope.selectedLab 			= $scope.profileObject.labs[0];
	$scope.$parent.navsection 	= $stateParams.id;
	$scope.matrix 				= $scope.profileObject.labs[0].releaseCups[parseInt($stateParams.id)].matrix;

	
	$scope.updateMatrix = function(){
		var names 	= "names=matrixJson";
		var values 	= "values="+encodeURIComponent($scope.matrix);
		var data = "uuid="+$scope.profileObject.labs[0].releaseCups[parseInt($stateParams.id)].uuid+"&"+names+"&"+values;
		console.log("Data To Update:"+data);
		var update = UpdateObjectService.save(data);
		update.$promise.then(
				function(data){
					console.log("Response: ",data);
				},
				function(error){
					console.log("Error: ",error);
				});
	}
	
	$scope.onAfterCreateRow = function(){
		$scope.updateMatrix();
	}
	
	$scope.onAfterRemoveRow = function(){
		$scope.updateMatrix();
	}
	
}


angular.module('releasecupdetail',['ngAnimate','ui.router','ui-notification'])
	.controller('ReleaseCupDetailController',['$scope','$stateParams','$state','Notification','loadContext','ErrorUtils','context','$timeout','ReleasesService','UpdateObjectService',ReleaseCupDetailController]);