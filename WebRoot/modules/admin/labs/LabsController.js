function LabsController($scope,$state,Notification,context,ErrorUtils,RegisterLabService){
	
	$scope.rcOverlay = false;
	$scope.rcLoading = false;
	
	$scope.listOverlay = false;
	$scope.listLoading = false;
	
	$scope.makeSuperAdmin = false;
	
	$scope.labsList = [];
	
	$scope.submitLab = function(){
		var data = 	"labName="+$scope.labname+"&" +
					"managerName="+$scope.managername+"&"+
					"pdmName="+$scope.pdmname+"&"+
					"userName="+$scope.username+"&"+
					"password="+$scope.password+"&"+
					"isSuperAdmin="+$scope.makeSuperAdmin;
		
		$scope.toggleRecordCreation();
		var register = RegisterLabService.save(data);
		
		register.$promise.then(
				function(data){
					$scope.toggleRecordCreation();
					if(data.meta.code == 200){
						
						Notification.success({message:"Record created successfully.", title: 'Success'});
					}
					else{
						Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
					}
				},
				function(error){
					$scope.toggleRecordCreation();
					Notification.error({message: "Some error occurred. Please try again later.", title: 'Error'});
				});
	};
	
	$scope.toggleRecordCreation = function(){
		if($scope.rcOverlay){
			$scope.rcOverlay = false;
			$scope.rcLoading = false;
		}
		else{
			$scope.rcOverlay = true;
			$scope.rcLoading = true;
		}
	};
	
	$scope.toggleListShow = function(){
		if($scope.listOverlay){
			$scope.listOverlay = false;
			$scope.listLoading = false;
		}
		else{
			$scope.listOverlay = true;
			$scope.listLoading = true;
		}
	};
}


angular.module('labs',['ngAnimate','ui.router','ui-notification','angularFileUpload','ng.httpLoader','angularFileUpload'])
	.controller('LabsController',['$scope','$state','Notification','context','ErrorUtils','RegisterLabService',LabsController])
	