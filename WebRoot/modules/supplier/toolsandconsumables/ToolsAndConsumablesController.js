// Tools And Consumables Controller
function ToolsAndConsumablesController($scope,$state,Notification,FileUploader,$http,ToolsService,context,ErrorUtils,modelService,$modal){
	
	$scope.companyUuid = context.getEmployee().company.uuid;
	
	$scope.showToolsEntryOverlay = false;
	$scope.showToolsEntryLoading = false;
	
	$scope.showToolsListOverlay = false;
	$scope.showToolsListLoading = false;
	
	$scope.ToolsAndConsumablesList = [];
	
	$scope.errorMessage = "";
	
	$scope.applications = modelService.getApplications();
	$scope.applications.unshift({name:'Select Application Purpose',value:0});
	$scope.application = $scope.applications[0];
	
	$scope.submitToolsAndConsumables = function(){
		if($scope.validateToolsAndConsumablesEntry()){
			
			var data = "application="+encodeURIComponent($scope.application.name)+"&" +
					   "description="+encodeURIComponent($scope.description)+"&" +
					   "brand="+encodeURIComponent($scope.brand)+"&" +
					   "model="+encodeURIComponent($scope.model)+"&" +
					   "origin="+encodeURIComponent($scope.origin)+"&" +
					   "packing="+encodeURIComponent($scope.packing)+"&"+
					   "companyUuid="+encodeURIComponent($scope.companyUuid);
			
			var save = ToolsService.save(data);
			$scope.showSubmitLoading();
			
			save.$promise.then(
					function(data){
						$scope.hideSubmitLoading();
						if(data.meta.code == 200){
							
							Notification.success({message: 'ToolsAndConsumables Record saved successfully.', title: 'Success'});
							for(index in data.data){
								$scope.ToolsAndConsumablesList.push(data.data[index]);
							}
						}
						else{
							Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
						}

					},
					function(error){	
						$scope.hideSubmitLoading();
						Notification.error({message: "Some error occurred. Please try again later.", title: 'Error'});
					}
			);
			
			//After Submitting Values Making the input fields null or put them back to default values//
			$scope.applications.unshift({name:'Select Application Purpose',value:0});
			$scope.application = $scope.applications[0];
			$scope.description = "";
			$scope.brand = "";
			$scope.model = "";
			$scope.origin = "";
			$scope.packing = "";	
			
		}else{
			Notification.error({message: $scope.errorMessage, title: 'Error'});
		}
		
	}
	$scope.validateToolsAndConsumablesEntry = function(){
		
		if($scope.application.value == 0 ){
			$scope.errorMessage = "Please select application purpose.";
			return false;
		}
		
		if($scope.description == undefined ||$scope.description == '' ){
			$scope.errorMessage = "Please give some description.";
			return false;
		}
		
		if($scope.brand == undefined || $scope.brand == ''){
			$scope.errorMessage = "Please enter brand.";
			return false;
		}
		
		if($scope.model == undefined || $scope.model == ''){
			$scope.errorMessage = "Please enter model.";
			return false;
		}
		
		if($scope.origin == undefined || $scope.origin == ''){
			$scope.errorMessage = "Please enter origin.";
			return false;
		}
		
		if($scope.packing == undefined || $scope.packing == ''){
			$scope.errorMessage = "Please enter packing.";
			return false;
		}	
		return true;
	}
	
	$scope.showSubmitLoading = function(){
		$scope.showToolsEntryOverlay = true;
		$scope.showToolsEntryLoading = true;
	}
	
	$scope.hideSubmitLoading = function(){
		$scope.showToolsEntryOverlay = false;
		$scope.showToolsEntryLoading = false;
	}
	
	$scope.showListLoading = function(){
		$scope.showToolsListOverlay = true;
		$scope.showToolsListLoading = true;
	}
	
	$scope.hideListLoading = function(){
		$scope.showToolsListOverlay = false;
		$scope.showToolsListLoading = false;
	}
	
	$scope.getToolsAndConsumablesList = function(){
		$scope.ToolsAndConsumablesList = [];
		$scope.showListLoading();
		var get = ToolsService.get({id:$scope.companyUuid});
		
		get.$promise.then(
				function(data){
					$scope.hideListLoading();
					if(data.meta.code == 200){
						console.log("Data:",data);
						for(index in data.data){
							$scope.ToolsAndConsumablesList.push(data.data[index]);
						}
					}
					else{
						Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
					}
					
				},
				function(error){
					$scope.hideListLoading();
					Notification.error({message: "Some error occurred. Please try again later.", title: 'Error'});
				}
		);
	}
	
	$scope.deleteToolsAndConsumables = function(uuid,index){
		var del = ToolsService.delete({id:uuid});
		$scope.showListLoading();
		
		
		del.$promise.then(
				function(data){
					$scope.hideListLoading();
					
					if(data.meta.code == 200){
						//console.log("Data:",data);
						Notification.success({message: 'Record deleted successfully.', title: 'Success'});
						$scope.deleteItemFromToolsAndConsumablesList(index);
					}
					else{
						Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
					}
					
				},
				function(error){
					$scope.hideListLoading();
					
					Notification.error({message: "Some error occurred. Please try again later.", title: 'Error'});
				});
	}
	
	$scope.deleteItemFromToolsAndConsumablesList = function(index){
		var from 	= index;
		var to		= 0;
		var rest = $scope.ToolsAndConsumablesList.slice((to || from) + 1 || $scope.ToolsAndConsumablesList.length);
		$scope.ToolsAndConsumablesList.length = from < 0 ? $scope.ToolsAndConsumablesList.length + from : from;
		$scope.ToolsAndConsumablesList.push.apply($scope.ToolsAndConsumablesList, rest);
	}
	
	$scope.editToolsAndConsumables = function(index){
		$scope.selectedToolsItem = $scope.ToolsAndConsumablesList[index];
		
		var modalInstance = $modal.open({
		      templateUrl: 'modules/supplier/toolsandconsumables/updateToolsAndConsumables.tpl.html',
		      controller : ToolsAndConsumablesUpdateController,
		      scope		 : $scope,
		      resolve: {
		          ToolsAndConsumablesItem: function () {
		            return $scope.selectedToolsItem;
		          }
		        }
		});
		
		modalInstance.result.then(
				function (updatedObj) {
					
					//Dont send update request if there is no change in the values on edit
					var isEqual = $scope.isEqual($scope.selectedToolsItem,updatedObj);
					if(isEqual == false){
						//Send request to update
						var data = "names=application,description,brand,model,origin,packing"+"&"+
					 				"values="+encodeURIComponent(
					 						updatedObj.application.name+","+
					 						updatedObj.description+","+
					 						updatedObj.brand+","+
					 						updatedObj.model+","+
					 						updatedObj.origin+","+
					 						updatedObj.packing
					 						);
					 
					 var update = ToolsService.update({id:$scope.selectedToolsItem.uuid},data);
					 
					 update.$promise.then(
								function(data){
									
									if(data.meta.code == 200){
										Notification.success({message:"Record updated successfully.", title: 'Success'});
										$scope.selectedToolsItem.application        = data.data[0].application;
										$scope.selectedToolsItem.description 	    = data.data[0].description;
										$scope.selectedToolsItem.brand 				= data.data[0].brand;
										$scope.selectedToolsItem.model 				= data.data[0].model;
										$scope.selectedToolsItem.origin 			= data.data[0].origin;
										$scope.selectedToolsItem.packing 			= data.data[0].packing;
									}
									else{
										Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
									}
									
								},
								function(error){
									Notification.error({message: "Some error occurred. Please try again later.", title: 'Error'});
								});
				 }
		    }, 
		    function (error) {
		    	//$scope.hideListLoading();
				//Notification.error({message: "Some error occurred. Please try again later.", title: 'Error'});
		    });
	};
	
	//function to check whether the chnges occur or not on Edit
	$scope.isEqual = function(listItem, updatedObj){
		
		var b1 = listItem.application	== updatedObj.application.name;
		var b2 = listItem.description   == updatedObj.description;
		var b3 = listItem.brand 		== updatedObj.brand;
		var b4 = listItem.model 		== updatedObj.model;
		var b5 = listItem.origin 		== updatedObj.origin;
		var b6 = listItem.packing 		== updatedObj.packing;
		
		if(b1 && b2 && b3 && b4 && b5 && b6)
			return true;
		
		return false;		
	}
	//-----------------------------------------------------------//
	$scope.getToolsAndConsumablesList();
	//----------------------------------------------------------//
}

function ToolsAndConsumablesUpdateController($scope,$modalInstance,ToolsAndConsumablesItem,$filter,modelService,CONSTANTS){
	$scope.isError = false;
	$scope.errorMsg = "";
	
	$scope.updatedObj = {
					application	: '',
					description : '',
					brand		: '',
					model		: '',
					origin		: '',
					packing     : ''
				};
	
	$scope.updatedApplications = modelService.getApplications();
	var array = $filter('filter')($scope.updatedApplications, {name: ToolsAndConsumablesItem.application});
	$scope.updatedObj.application =$scope.updatedApplications[array[0].value-1];
	
	$scope.updatedObj.description   = ToolsAndConsumablesItem.description
	$scope.updatedObj.brand 		= ToolsAndConsumablesItem.brand;
	$scope.updatedObj.model 		= ToolsAndConsumablesItem.model;
	$scope.updatedObj.origin 		= ToolsAndConsumablesItem.origin;
	$scope.updatedObj.packing 		= ToolsAndConsumablesItem.packing;
	
	$scope.update = function(){
		if($scope.anyBlankField() == false){
			$modalInstance.close($scope.updatedObj);
		}
		else{
			$scope.isError = true;
			$scope.errorMsg = "* All fields are mandatory.";
		}
	};
	
	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	};
	
	$scope.anyBlankField = function(){
		
		var b1 = $scope.updatedObj.description == '';
		var b2 = $scope.updatedObj.brand == '';
		var b3 = $scope.updatedObj.model == '';
		var b4 = $scope.updatedObj.origin == '';
		var b5 = $scope.updatedObj.packing == '';	
		if(b1 || b2 || b3 || b4 || b5 )
			return true;
		
		return false;
	};
}

angular.module('supplier.toolsandconsumables',['ngAnimate','ui.router','ui-notification','angularFileUpload','model.service'])
	.controller('ToolsAndConsumablesController',['$scope','$state','http','Notification','FileUploader','ToolsService','context','ErrorUtils','modelService','$modal',ToolsAndConsumablesController]);