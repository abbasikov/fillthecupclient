function LabUpdateController($scope,$modalInstance,labItem){
	
	$scope.isError = false;
	$scope.errorMsg = "";
	
	$scope.updatedObj = {
			labName		: '',
			managerName	: '',
			pdmName		: '',
			userName	: '',
			isSuperAdmin: ''
	};
	
	$scope.updatedObj.labName		= labItem.name;
	$scope.updatedObj.managerName	= labItem.managerName;
	$scope.updatedObj.pdmName		= labItem.pdmName;
	$scope.updatedObj.userName		= labItem.users[0].username;
	$scope.updatedObj.isSuperAdmin	= (labItem.users[0].isSuperAdmin == "true") ? true : false;
	
	
	$scope.update = function(){
		$modalInstance.close($scope.updatedObj);
	};
	
	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	};
	
}

function LabsController($scope,$state,Notification,context,ErrorUtils,LabService,DeleteLabService,$modal,UpdateObjectService,SysComponentService,DeleteSysComponentService){
	
	$scope.rcOverlay = false;
	$scope.rcLoading = false;
	
	$scope.listOverlay = false;
	$scope.listLoading = false;
	
	$scope.componentOverlay = false;
	$scope.componentLoading = false;
	
	$scope.makeSuperAdmin = false;
	
	$scope.labsList = [];
	$scope.globalSystemComponents = [];
	
	$scope.submitLab = function(){
		var data = 	"labName="+$scope.labname+"&" +
					"managerName="+$scope.managername+"&"+
					"pdmName="+$scope.pdmname+"&"+
					"userName="+$scope.username+"&"+
					"password="+$scope.password+"&"+
					"isSuperAdmin="+$scope.makeSuperAdmin;
		
		$scope.toggleRecordCreation();
		var register = LabService.save(data);
		
		register.$promise.then(
				function(data){
					$scope.toggleRecordCreation();
					if(data.meta.code == 200){
						Notification.success({message:"Record created successfully.", title: 'Success'});
						$scope.labsList.push(data.data);
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
	
	$scope.toggleComponentShow = function(){
		if($scope.componentOverlay){
			$scope.componentOverlay = false;
			$scope.componentLoading = false;
		}
		else{
			$scope.componentOverlay = true;
			$scope.componentLoading = true;
		}
	};
	
	$scope.deleteLab = function(uuid,index){
		var labs = DeleteLabService.save("uuid="+uuid);
		$scope.toggleListShow();
		labs.$promise.then(
				function(data){
					$scope.toggleListShow();
					if(data.meta.code == 200){
						$scope.deleteItemFromLabsList(index);
					}
					else{
						Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
					}
					
				},
				function(error){
					$scope.toggleListShow();
					Notification.error({message: "Some error occurred. Please try again later.", title: 'Error'});
				});
	};
	
	
	$scope.editLab = function(index){
		
		$scope.selectedLabItem = $scope.labsList[index];
		
		var modalInstance = $modal.open({
		      templateUrl	: 'modules/admin/labs/updateLab.tpl.html',
		      controller	: LabUpdateController,
		      scope			: $scope,
		      resolve		: {
		          labItem: function () {
		            return $scope.selectedLabItem;
		          }
		        }
		    });
		
		modalInstance.result.then(function (updatedObj) {
			 console.log("SelectedMachine:",$scope.selectedLabItem);
			 console.log("UpdatedObj:",updatedObj);
			 
			 $scope.updateUser($scope.selectedLabItem, updatedObj);
			 $scope.updateLab($scope.selectedLabItem, updatedObj);
			 	 
		    }, function () {
		      
		    });
		 
	};
	
	$scope.updateUser = function(selectedLabItem,updatedObj){
		var names 	= "names=";
		var values 	= "values=";
		var update	= false;
		
		if(selectedLabItem.users[0].username	!= updatedObj.userName){
			names += "userName"+",";
			values += encodeURIComponent(updatedObj.userName)+",";
			update = true;
		}
		
		if(selectedLabItem.users[0].isSuperAdmin	!= (updatedObj.isSuperAdmin+"")){
			names += "isSuperAdmin"+",";
			values += (updatedObj.isSuperAdmin+"")+",";
			update = true;
		}
		
		if(update){
			var data = "uuid="+selectedLabItem.users[0].uuid+"&"+names+"&"+values;
			var update = UpdateObjectService.save(data);
			$scope.toggleListShow();
			update.$promise.then(
					function(data){
						$scope.toggleListShow();
						if(data.meta.code == 200){
							$scope.selectedLabItem.users[0].username 		= updatedObj.userName;
							$scope.selectedLabItem.users[0].isSuperAdmin 	= (updatedObj.isSuperAdmin+"");
						}
						else{
							Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
						}
					},
					function(error){
						$scope.toggleListShow();
						Notification.error({message: "Some error occurred. Please try again later.", title: 'Error'});
					});
			
		}
	};
	
	$scope.updateLab = function(selectedLabItem,updatedObj){
		var names 	= "names=";
		var values 	= "values=";
		var update  = false;
		
		if(selectedLabItem.managerName != updatedObj.managerName){
			names += "managerName"+",";
			values += encodeURIComponent(updatedObj.managerName)+",";
			update = true;
		}
		
		if(selectedLabItem.pdmName != updatedObj.pdmName){
			names += "pdmName"+",";
			values += encodeURIComponent(updatedObj.pdmName)+",";
			update = true;
		}
		
		if(update){
			var data = "uuid="+selectedLabItem.uuid+"&"+names+"&"+values;
			var update = UpdateObjectService.save(data);
			$scope.toggleListShow();
			update.$promise.then(
					function(data){
						$scope.toggleListShow();
						if(data.meta.code == 200){
							$scope.selectedLabItem.managerName 		= updatedObj.managerName;
							$scope.selectedLabItem.pdmName		 	= updatedObj.pdmName;
						}
						else{
							Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
						}
					},
					function(error){
						$scope.toggleListShow();
						Notification.error({message: "Some error occurred. Please try again later.", title: 'Error'});
					});
			
		}
		
	};
	
	
	$scope.deleteItemFromLabsList = function(index){
		var from 	= index;
		var to		= 0;
		var rest = $scope.labsList.slice((to || from) + 1 || $scope.labsList.length);
		$scope.labsList.length = from < 0 ? $scope.labsList.length + from : from;
		$scope.labsList.push.apply($scope.labsList, rest);
	};
	
	$scope.deleteItemFromComponentList = function(index){
		var from 	= index;
		var to		= 0;
		var rest = $scope.globalSystemComponents.slice((to || from) + 1 || $scope.globalSystemComponents.length);
		$scope.globalSystemComponents.length = from < 0 ? $scope.globalSystemComponents.length + from : from;
		$scope.globalSystemComponents.push.apply($scope.globalSystemComponents, rest);
	};
	
	$scope.getAllLabs = function(){
		var labs = LabService.get();
		
		labs.$promise.then(
				function(data){
					if(data.meta.code == 200){
						$scope.labsList = data.dataList;
					}
					else{
						Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
					}
				},
				function(error){
					Notification.error({message: "Some error occurred. Please try again later.", title: 'Error'});
				});
	};
	
	$scope.addComponent = function(){
		if($scope.componentName){
			var labs = SysComponentService.save("name="+$scope.componentName);
			$scope.toggleComponentShow();
			labs.$promise.then(
					function(data){
						$scope.toggleComponentShow();
						if(data.meta.code == 200){
							$scope.globalSystemComponents.push(data.data);
							$scope.componentName = "";
						}
						else{
							Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
						}
					},
					function(error){
						$scope.toggleComponentShow();
						Notification.error({message: "Some error occurred. Please try again later.", title: 'Error'});
					});
		} 
	};
	
	$scope.removeComponent = function(index){
		var labs = DeleteSysComponentService.save("uuid="+$scope.globalSystemComponents[index].uuid);
		$scope.toggleComponentShow();
		labs.$promise.then(
				function(data){
					$scope.toggleComponentShow();
					if(data.meta.code == 200){
						$scope.deleteItemFromComponentList(index);
					}
					else{
						Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
					}
				},
				function(error){
					$scope.toggleComponentShow();
					Notification.error({message: "Some error occurred. Please try again later.", title: 'Error'});
				});
	};
	
	$scope.getAllSysComponents = function(){
		var labs = SysComponentService.get();
		$scope.toggleComponentShow();
		labs.$promise.then(
				function(data){
					$scope.toggleComponentShow();
					if(data.meta.code == 200){
						$scope.globalSystemComponents = data.dataList;
					}
					else{
						Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
					}
				},
				function(error){
					$scope.toggleComponentShow();
					Notification.error({message: "Some error occurred. Please try again later.", title: 'Error'});
				});
	};
	
	$scope.getAllLabs();
	$scope.getAllSysComponents();
}


angular.module('labs',['ngAnimate','ui.router','ui-notification','angularFileUpload','ng.httpLoader','angularFileUpload'])
	.controller('LabsController',['$scope','$state','Notification','context','ErrorUtils','LabService','DeleteLabService','$modal','UpdateObjectService','SysComponentService','DeleteSysComponentService',LabsController])
	