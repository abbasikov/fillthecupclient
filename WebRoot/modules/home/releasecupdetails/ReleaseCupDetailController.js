function ReleaseCupDetailController($scope,$stateParams,$state,Notification,loadContext,ErrorUtils,context,$timeout,ReleasesService){
	$scope.selectedLab 			= $scope.profileObject.labs[0];
	$scope.selectedReleaseCup	= $scope.profileObject.labs[0].releaseCups[$stateParams.id];
	console.log("selectedReleaseCup : ",$scope.selectedReleaseCup);
	$scope.$parent.navsection = $stateParams.id;
	
	$scope.selectedReleaseCup.sysComponents.unshift({name:'MVP',uuid:'0'})
	for(index in $scope.selectedReleaseCup.sysComponents){
		$scope.selectedReleaseCup.sysComponents.data = '';
	}
	
	$scope.matrix = {
			settings:{
				height: '400',
				width : '100%',
				colHeaders: true,
				contextMenu: ['row_above', 'row_below', 'remove_row'],
				colWidth : '200',
				stretchH:'all',
				className:'htCenter'
				
			},
			columns:$scope.selectedReleaseCup.sysComponents,
			data:[[]]
	};
	      
	
	$scope.test = function(){
		console.log("Data : "+$scope.matrix.data);
	};
}


angular.module('releasecupdetail',['ngAnimate','ui.router','ui-notification'])
	.controller('ReleaseCupDetailController',['$scope','$stateParams','$state','Notification','loadContext','ErrorUtils','context','$timeout','ReleasesService',ReleaseCupDetailController]);