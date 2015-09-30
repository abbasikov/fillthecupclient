function ReleaseCupsController($scope,$state,Notification,loadContext,ErrorUtils,context,$timeout,ReleasesService,ReleasesCupService,DeleteBusinessObject){
	
	$scope.availableDevDays = "";
	$scope.devDays			= "";
	$scope.regDays			= "";
	
	$scope.showReleaseCupsOverlay 	= false;
	$scope.showReleaseCupsLoading 	= false;
	
	$scope.tableListOverlay			 = false;		  
	$scope.tableListLoading			 = false;
	
	$scope.releases				  = [];
	$scope.release				  = "";
	$scope.errorMessage			  = "";
	
	$scope.$parent.navsection = -1;
	
	$scope.submitReleaseCup = function(){
		
		if($scope.validate() == false){
			Notification.error({message:$scope.errorMessage, title: 'Error'});
			return;
		}
		
		
		var data="releaseUuid="+$scope.release.uuid+"&labUuid="+$scope.profileObject.labs[0].uuid+"&availableDevDays="+$scope.availableDevDays+"&devDays="+$scope.devDays+"&regressionDays="+$scope.regDays;
		var rel = ReleasesCupService.save(data);
		rel.$promise.then(
				function(data){
					if(data.meta.code == 200){
						$scope.profileObject.labs[0].releaseCups.push(data.data);
						Notification.success({message:"ReleaseCup created. Please check left navigation section.", title: 'Error'});
					}
					else{
						Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
					}
				},
				function(error){
					Notification.error({message: "Some error occurred1. Please try again later.", title: 'Error'});
			});
	}
	
	$scope.validate = function(){
		try{
			var total 	= parseInt($scope.availableDevDays);
			var dev		= parseInt($scope.devDays);
			var reg		= parseInt($scope.regDays);
			
			if(total == (dev+reg))
				return true;
			
			$scope.errorMessage = "Available Dev Days must be equal to Dev and Regression Days."
		}
		catch(err){
			$scope.errorMessage = err.message;
			return false;
		}
		
		return false;
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
	};
	
	$scope.toggleTableListLoading = function(){
		if($scope.tableListOverlay){
			$scope.tableListOverlay			 = false;		  
			$scope.tableListLoading			 = false;
		}
		else{
			$scope.tableListOverlay			 = true;		  
			$scope.tableListLoading			 = true;
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
					Notification.error({message: "Some error occurred1. Please try again later.", title: 'Error'});
			});
	};
	
	
	
	$scope.deleteReleaseCup = function(uuid,index){
		
		var rel = DeleteBusinessObject.save("uuid="+uuid);
		$scope.toggleTableListLoading();
		rel.$promise.then(
				function(data){
					$scope.toggleTableListLoading();
					if(data.meta.code == 200){
						$scope.deleteReleaseCupFromList(index);
					}
					else{
						Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
					}
				},
				function(error){
					$scope.toggleTableListLoading();
					Notification.error({message: "Some error occurred1. Please try again later.", title: 'Error'});
			});
	};
	
	
	
	$scope.deleteReleaseCupFromList = function(index){
		var from 	= index;
		var to		= 0;
		var rest = $scope.profileObject.labs[0].releaseCups.slice((to || from) + 1 || $scope.profileObject.labs[0].releaseCups.length);
		$scope.profileObject.labs[0].releaseCups.length = from < 0 ? $scope.profileObject.labs[0].releaseCups.length + from : from;
		$scope.profileObject.labs[0].releaseCups.push.apply($scope.profileObject.labs[0].releaseCups, rest);
	};
	
	$scope.getAllReleasesList();
	
	
}


angular.module('releasecups',['ngAnimate','ui.router','ui-notification'])
	.controller('ReleaseCupsController',['$scope','$state','Notification','loadContext','ErrorUtils','context','$timeout','ReleasesService','ReleasesCupService','DeleteBusinessObject',ReleaseCupsController]);