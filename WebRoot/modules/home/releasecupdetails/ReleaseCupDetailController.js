function ReleaseCupDetailController($scope,$stateParams,$state,Notification,loadContext,ErrorUtils,context,$timeout,ReleasesService){
	
	$scope.selectedLab 			= $scope.profileObject.labs[0];
	$scope.sysComponents		= $scope.profileObject.labs[0].releaseCups[$stateParams.id].sysComponents;
	$scope.$parent.navsection 	= $stateParams.id;
	
	$scope.sysComponentsSorted = [];
	for(index1 in $scope.sysComponents){
		if($scope.sysComponents[index1].name == 'MVPs'){
			$scope.sysComponentsSorted.push($scope.sysComponents[index1]);
			break;
		}	
	}
	for(index2 in $scope.sysComponents){
		if($scope.sysComponents[index2].name != 'MVPs'){
			$scope.sysComponentsSorted.push($scope.sysComponents[index2]);
		}	
	}
	$scope.matrix = {
			settings:{
				height: '400',
				width : '100%',
				colHeaders: true,
				contextMenu: ['row_above', 'row_below', 'remove_row'],
				colWidth : '200',
				stretchH:'all',
				className:'htCenter',
				colHeaders : true
				
			},
			columns:$scope.sysComponentsSorted,
			data:[[]]			
	};
	  
	console.log("Matrix : ",$scope.matrix);
	
	$scope.test = function(){
		console.log("Data : "+$scope.matrix.data);
	};
}


angular.module('releasecupdetail',['ngAnimate','ui.router','ui-notification'])
	.controller('ReleaseCupDetailController',['$scope','$stateParams','$state','Notification','loadContext','ErrorUtils','context','$timeout','ReleasesService',ReleaseCupDetailController]);