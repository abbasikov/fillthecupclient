function ReleaseCupsController($scope,$state,Notification,loadContext,ErrorUtils,context,$timeout,ReleasesService){
	
	$scope.showReleaseCupsOverlay = false;
	$scope.showReleaseCupsLoading = false;
	$scope.releases				  = [];
	$scope.release				  = "";
	
	$scope.submitReleaseCup = function(){
		alert("hello");
	}
	
	$scope.toggleLoadingRecordCreation = function(){
		if($scope.showReleaseCupsOverlay){
			$scope.showReleaseCupsOverlay = false;
			$scope.showReleaseCupsLoading = false;
		}
		else{
			$scope.showReleaseCupsOverlay = true;
			$scope.showReleaseCupsLoading = true;
		}
	}
	
	$scope.changeRelease = function(){
		$scope.branchCutDate = $scope.release.branchCutDate
		$scope.hardLockDate  = $scope.release.branchHardLockDate;
	}
	
	$scope.getAllReleasesList = function(){
		var rel = ReleasesService.get();
		rel.$promise.then(
				function(data){
					if(data.meta.code == 200){
						$scope.releases = data.dataList;
						$scope.releases.unshift({name:'Select Release',uuid:'0'});
						$scope.release = $scope.releases[0];
						
					}
					else{
						Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
					}
				},
				function(error){
					Notification.error({message: "Some error occurred. Please try again later.", title: 'Error'});
			});
	}
	
	$scope.getAllReleasesList();
}


angular.module('releasecups',['ngAnimate','ui.router','ui-notification'])
	.controller('ReleaseCupsController',['$scope','$state','Notification','loadContext','ErrorUtils','context','$timeout','ReleasesService',ReleaseCupsController]);