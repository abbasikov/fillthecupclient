function ReleaseCupDetailController($scope,$stateParams,$state,Notification,loadContext,ErrorUtils,context,$timeout,ReleasesService,UpdateObjectService){
	
	$scope.selectedLab 			= $scope.profileObject.labs[0];
	$scope.$parent.navsection 	= $stateParams.id;
	$scope.selectedReleaseCup	= $scope.releaseCupsList[parseInt($stateParams.id)];
	$scope.matrix 				= $scope.selectedReleaseCup.matrix;

	$scope.settings = {
			height 		: "400",
			width		: "100%",
			contextMenu : ["row_above", "row_below", "remove_row"],
			colWidth 	: "200",
			stretchH	: "all",
			className	: "htCenter"			
	}
	
	$scope.updateMatrix = function(){
		var names 	= "names=matrixJson";
		var values 	= "values="+encodeURIComponent(angular.toJson($scope.matrix));
		var data = "uuid="+$scope.selectedReleaseCup.uuid+"&"+names+"&"+values+"&"+"delimiter=;";
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
	
	$scope.onAfterChange = function(){
		$scope.updateMatrix();
	}
	
}


angular.module('releasecupdetail',['ngAnimate','ui.router','ui-notification'])
	.controller('ReleaseCupDetailController',['$scope','$stateParams','$state','Notification','loadContext','ErrorUtils','context','$timeout','ReleasesService','UpdateObjectService',ReleaseCupDetailController]);