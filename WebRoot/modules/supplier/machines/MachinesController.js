function MachineUpdateController($scope,$modalInstance,machineItem,$filter,modelService,CONSTANTS){
	
	$scope.isError = false;
	$scope.errorMsg = "";
	
	$scope.updatedObj = {
					application	: '',
					machineType	: '',
					fuelType	: '',
					brand		: '',
					model		: '',
					origin		: '',
					runtime		: '',
					areaCoverage: '',
					capacity	: '',
					imageFileName: '',
					catalogFileName: ''
				};
	
	
	
	$scope.updatedApplications = modelService.getApplications();
	var array = $filter('filter')($scope.updatedApplications, {name: machineItem.applicationPurpose});
	$scope.updatedObj.application =$scope.updatedApplications[array[0].value-1];
	
	
	$scope.updatedMachineTypes = modelService.getMachineTypes();
	array = $filter('filter')($scope.updatedMachineTypes, {name: machineItem.machineType});
	$scope.updatedObj.machineType = $scope.updatedMachineTypes[array[0].value-1];
	
	$scope.updatedFuelTypes = modelService.getFuelTypes();
	array = $filter('filter')($scope.updatedFuelTypes, {name: machineItem.fuelType});
	$scope.updatedObj.fuelType = $scope.updatedFuelTypes[array[0].value-1]; 
	
	
	$scope.updatedObj.brand 		= machineItem.brand;
	$scope.updatedObj.model 		= machineItem.model;
	$scope.updatedObj.origin 		= machineItem.origin;
	$scope.updatedObj.runtime 		= machineItem.runtime;
	$scope.updatedObj.areaCoverage 	= machineItem.areaCoverage;
	$scope.updatedObj.capacity 		= machineItem.capacity;
	$scope.updatedObj.imageFileName = machineItem.imageFileName;
	$scope.updatedObj.catalogFileName = machineItem.catalogFileName;
	$scope.updatedObj.imageUrl			= machineItem.imageUrl;
	$scope.updatedObj.catalogUrl		= machineItem.catalogUrl;
	
	
	
	
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
		
		var b1 = $scope.updatedObj.brand == '';
		var b2 = $scope.updatedObj.model == '';
		var b3 = $scope.updatedObj.origin == '';
		var b4 = $scope.updatedObj.runtime == '';
		var b5 = $scope.updatedObj.areaCoverage == '';
		var b6 = $scope.updatedObj.capacity == ''; 	
		if(b1 || b2 || b3 || b4 || b5 || b6)
			return true;
		
		return false;
	};
	
	$scope.openFileDialogForCatalog = function(){
		document.getElementById('idCatalogUploader').click();
	}
}


function MachinesController($scope,$state,Notification,FileUploader,$http,MachineService,context,ErrorUtils,$filter, $modal,modelService,FileUploader,CONSTANTS){
	
	$scope.companyUuid = context.getEmployee().company.uuid;
	
	$scope.showMachineEntryOverlay = false;
	$scope.showMachineEntryLoading = false;
	
	$scope.showMachineListOverlay = false;
	$scope.showMachineListLoading = false;
	
	
	$scope.isImageUploaded = false;
	$scope.isCatalogUploaded = false;
	
	$scope.imageUploader = new FileUploader({
        url			: CONSTANTS.BASE_REST_URL+'/rest/public/uploads/machines',
    });
	
	$scope.catalogUploader = new FileUploader({
        url			: CONSTANTS.BASE_REST_URL+'/rest/public/uploads/machines',
    });
	
	$scope.errorMessage = "";
	
	
	$scope.applications = modelService.getApplications();
	$scope.applications.unshift({name:'Select Application Purpose',value:0});
	$scope.application = $scope.applications[0];
	
	$scope.machineTypes = modelService.getMachineTypes();
	$scope.machineTypes.unshift({name:'Select Machine Type',value:0});
	$scope.machineType = $scope.machineTypes[0];
	
	
	$scope.fuelTypes = modelService.getFuelTypes();
	$scope.fuelTypes.unshift({name:'Select Fuel Type',value:0});
	$scope.fuelType = $scope.fuelTypes[0];
	
	$scope.machinesList = [];
	
	
	$scope.submitMachine = function(){
		
		if($scope.validateMachineEntry()){
			
			var data = "application="+encodeURIComponent($scope.application.name)+"&" +
				"machineType="+encodeURIComponent($scope.machineType.name)+"&" +
				"brand="+encodeURIComponent($scope.brand)+"&" +
				"model="+encodeURIComponent($scope.model)+"&" +
				"origin="+encodeURIComponent($scope.origin)+"&" +
				"fuelType="+encodeURIComponent($scope.fuelType.name)+"&" +
				"runTime="+encodeURIComponent($scope.runTime)+"&" +
				"areaCoverage="+encodeURIComponent($scope.areaCoverage)+"&" +
				"capacity="+encodeURIComponent($scope.capacity)+"&"+
				"companyUuid="+encodeURIComponent($scope.companyUuid)+"&"+
				"imageFileName="+encodeURIComponent($scope.imageFileName)+"&"+
				"catalogFileName="+encodeURIComponent($scope.catalogFileName);
			
			var save = MachineService.save(data);
			
			$scope.showSubmitLoading();
			
			save.$promise.then(
					function(data){
						$scope.hideSubmitLoading();
						
						if(data.meta.code == 200){
							
							Notification.success({message: 'Machine record saved successfully. Uploading machine image and catalog. ', title: 'Success'});
							for(index in data.data){
								$scope.machinesList.push(data.data[index]);
							}
							
							//Upload Image and Catalog
							$scope.uploadFiles(data.data[0].uuid);
							
						}
						else{
							Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
						}
						
					},
					function(error){	
						$scope.hideSubmitLoading();
						Notification.error({message: "Some error occurred. Please try again later.", title: 'Error'});
					});
			
		}
		else{
			Notification.error({message: $scope.errorMessage, title: 'Error'});
		}
		
		
	};
	
	$scope.uploadFiles = function(uuid){
		try{		
			console.log("MachineId: " + uuid);
			
			$scope.showSubmitLoading();
			
			$scope.imageUploader.queue[0].file.name = uuid+"-"+$scope.imageFileName;
			$scope.imageUploader.queue[0].upload();
			
			$scope.catalogUploader.queue[0].file.name = uuid+"-"+$scope.catalogFileName;
			$scope.catalogUploader.queue[0].upload();
		}
		catch(err){
			console.log("Uploading Error: "+err.message);
		}
	}
	
	$scope.showSubmitLoading = function(){
		$scope.showMachineEntryOverlay = true;
		$scope.showMachineEntryLoading = true;
	}
	
	$scope.hideSubmitLoading = function(){
		$scope.showMachineEntryOverlay = false;
		$scope.showMachineEntryLoading = false;
	}
	
	$scope.showListLoading = function(){
		$scope.showMachineListOverlay = true;
		$scope.showMachineListLoading = true;
	}
	
	$scope.hideListLoading = function(){
		$scope.showMachineListOverlay = false;
		$scope.showMachineListLoading = false;
	}
	
	$scope.validateMachineEntry = function(){
		
		if($scope.application.value == 0 ){
			$scope.errorMessage = "Please select application purpose.";
			return false;
		}
		
		if($scope.machineType.value == 0 ){
			$scope.errorMessage = "Please select machine type.";
			return false;
		}
		
		if($scope.fuelType.value == 0 ){
			$scope.errorMessage = "Please select fuel type.";
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
		
		if($scope.runTime == undefined || $scope.runTime == ''){
			$scope.errorMessage = "Please enter runtime.";
			return false;
		}
		
		if($scope.areaCoverage == undefined || $scope.areaCoverage == ''){
			$scope.errorMessage = "Please enter area coverage.";
			return false;
		}
		
		if($scope.capacity == undefined || $scope.capacity == ''){
			$scope.errorMessage = "Please enter capacity.";
			return false;
		}
		
		if($scope.imageFileName == undefined || $scope.imageFileName == ''){
			$scope.errorMessage = "Please select machine image.";
			return false;
		}
		
		if($scope.catalogFileName == undefined || $scope.catalogFileName == ''){
			$scope.errorMessage = "Please select machine catalog.";
			return false;
		}
		
		if($scope.imageFileName == $scope.catalogFileName){
			$scope.errorMessage = "Image and catalog file names cannot be same. Please select different names.";
			return false;
		}
		
		return true;
	}
	
	$scope.getMachinesList = function(){
		$scope.machinesList = [];
		$scope.showListLoading();
		var get = MachineService.get({id:$scope.companyUuid});
		
		get.$promise.then(
				function(data){
					$scope.hideListLoading();
					if(data.meta.code == 200){
						console.log("Data:",data);
						for(index in data.data){
							$scope.machinesList.push(data.data[index]);
						}
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
	
	$scope.deleteMachine = function(uuid,index){
		var del = MachineService.delete({id:uuid});
		$scope.showListLoading();
		
		
		del.$promise.then(
				function(data){
					$scope.hideListLoading();
					
					if(data.meta.code == 200){
						console.log("Data:",data);
						$scope.deleteItemFromMachinesList(index);
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
	
	$scope.deleteItemFromMachinesList = function(index){
		var from 	= index;
		var to		= 0;
		var rest = $scope.machinesList.slice((to || from) + 1 || $scope.machinesList.length);
		$scope.machinesList.length = from < 0 ? $scope.machinesList.length + from : from;
		$scope.machinesList.push.apply($scope.machinesList, rest);
	}
	
	$scope.editMachine = function(index){
		//Selected machine item to edit
		$scope.selectedMachineItem = $scope.machinesList[index];
		
		var modalInstance = $modal.open({
		      templateUrl: 'modules/supplier/machines/updateMachine.tpl.html',
		      controller : MachineUpdateController,
		      scope		 : $scope,
		      resolve: {
		          machineItem: function () {
		            return $scope.selectedMachineItem;
		          }
		        }
		    });
		
		 //Callback of rest call
		 modalInstance.result.then(function (updatedObj) {
			 
			 console.log("SelectedMachine:",$scope.selectedMachineItem);
			 console.log("UpdatedObj:",updatedObj);
			 	
			 	//Dont send update request if there is no change
			 	var isMachineEqual 			= $scope.isMachinesEqual($scope.selectedMachineItem,updatedObj);
			 
				 if(isMachineEqual == false){
					 //Send request to update
					 var data = "names=applicationPurpose,areaCoverage,brand,capacity,fuelType,machineType,model,origin,runtime"+"&"+
					 			"values="+encodeURIComponent(updatedObj.application.name+","+
					 						updatedObj.areaCoverage+","+
					 						updatedObj.brand+","+
					 						updatedObj.capacity+","+
					 						updatedObj.fuelType.name+","+
					 						updatedObj.machineType.name+","+
					 						updatedObj.model+","+
					 						updatedObj.origin+","+
					 						updatedObj.runtime);
					 console.log("UpdateData:",data)
					 var update = MachineService.update({id:$scope.selectedMachineItem.uuid},data);
					 update.$promise.then(
								function(data){
									if(data.meta.code == 200){
										Notification.success({message:"Record updated successfully.", title: 'Success'});
										$scope.selectedMachineItem.applicationPurpose 	= data.data[0].applicationPurpose;
										$scope.selectedMachineItem.machineType 			= data.data[0].machineType;
										$scope.selectedMachineItem.brand 				= data.data[0].brand;
										$scope.selectedMachineItem.model 				= data.data[0].model;
										$scope.selectedMachineItem.origin 				= data.data[0].origin;
										$scope.selectedMachineItem.fuelType 			= data.data[0].fuelType;
										$scope.selectedMachineItem.runtime 				= data.data[0].runtime;
										$scope.selectedMachineItem.areaCoverage 		= data.data[0].areaCoverage;
										$scope.selectedMachineItem.capacity 			= data.data[0].capacity;
									}
									else{
										Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
									}
									
								},
								function(error){
									Notification.error({message: "Some error occurred. Please try again later.", title: 'Error'});
								});
				 }
			 
		      
		    }, function () {
		      
		    });
	};
	
	$scope.isMachinesEqual = function(listItem, updatedObj){
		
		var b1 = listItem.applicationPurpose	== updatedObj.application.name;
		var b2 = listItem.areaCoverage 			== updatedObj.areaCoverage
		var b3 = listItem.brand 				== updatedObj.brand;
		var b4 = listItem.capacity 				== updatedObj.capacity;
		var b5 = listItem.fuelType 				== updatedObj.fuelType.name;
		var b6 = listItem.machineType 			== updatedObj.machineType.name;
		var b7 = listItem.model 				== updatedObj.model;
		var b8 = listItem.origin 				== updatedObj.origin;
		var b9 = listItem.runtime				== updatedObj.runtime;
		
		if(b1 && b2 && b3 && b4 && b5 && b6 && b7 && b8 && b9)
			return true;
		
		return false;		
	}

	$scope.checkMachineType = function(){
		try{
			if($scope.application.value == 0){
				$scope.machineType = $scope.machineTypes[0];
			}
		}
		catch(err){
			console.log(err.message);
		}
	}
	
	
	$scope.onWhenAddingFileFailedBoth = function(item /*{File|FileLikeObject}*/, filter, options){
		console.log("onWhenAddingFileFailed");
	};
	$scope.imageUploader.onWhenAddingFileFailed = $scope.onWhenAddingFileFailedBoth;
	$scope.catalogUploader.onWhenAddingFileFailed = $scope.onWhenAddingFileFailedBoth;
	
	$scope.onWhenAddingFileFailedBoth = function(item /*{File|FileLikeObject}*/, filter, options){
		console.info('onWhenAddingFileFailed', item, filter, options);
	};
	$scope.imageUploader.onWhenAddingFileFailed = $scope.onWhenAddingFileFailedBoth;
	$scope.catalogUploader.onWhenAddingFileFailed = $scope.onWhenAddingFileFailedBoth;
	

	$scope.onAfterAddingFileImage = function(fileItem){
		console.log("onAfterAddingFile-Image");
		if($scope.imageUploader.queue.length>1){
			$scope.imageUploader.queue[0] = fileItem;
			$scope.imageUploader.queue[1].remove();    		
    	}
		
		$scope.imageFileName = fileItem.file.name;
	};
	$scope.imageUploader.onAfterAddingFile = $scope.onAfterAddingFileImage;
	
	$scope.onAfterAddingFileCatalog = function(fileItem){
		console.log("onAfterAddingFile-Catalog");
		if($scope.catalogUploader.queue.length>1){
			$scope.catalogUploader.queue[0] = fileItem;
			$scope.catalogUploader.queue[1].remove();    		
    	}
		$scope.catalogFileName = fileItem.file.name;
	};
	$scope.catalogUploader.onAfterAddingFile = $scope.onAfterAddingFileCatalog;
	
    $scope.onAfterAddingAllBoth = function(addedFileItems) {
        console.info('onAfterAddingAllBoth', addedFileItems);
    };
    $scope.imageUploader.onAfterAddingAll = $scope.onAfterAddingAllBoth;
    $scope.catalogUploader.onAfterAddingAll = $scope.onAfterAddingAllBoth;

    $scope.onBeforeUploadItemBoth = function(item) {
        console.info('onBeforeUploadItemBoth', item);
    };
    $scope.imageUploader.onBeforeUploadItem = $scope.onBeforeUploadItemBoth;
    $scope.catalogUploader.onBeforeUploadItem = $scope.onBeforeUploadItemBoth;

    $scope.onProgressItemBoth = function(fileItem, progress) {
        console.info('onProgressItemBoth', fileItem, progress);
    };
    $scope.imageUploader.onProgressItem = $scope.onProgressItemBoth;
    $scope.catalogUploader.onProgressItem = $scope.onProgressItemBoth;

    $scope.onProgressAllBoth = function(progress) {
        console.info('onProgressAllBoth', progress);
    };
    $scope.imageUploader.onProgressAll = $scope.onProgressAllBoth;
    $scope.catalogUploader.onProgressAll = $scope.onProgressAllBoth;

    $scope.onSuccessItemImage = function(fileItem, response, status, headers) {
    	console.info('onSuccessItemImage', fileItem, response, status, headers);
    	Notification.success({message:"Machine image uploaded successfully.", title: 'Success'});
    	$scope.isImageUploaded = true;
    };
    $scope.imageUploader.onSuccessItem = $scope.onSuccessItemImage;
    
    $scope.onSuccessItemCatalog = function(fileItem, response, status, headers) {
    	console.info('onSuccessItemCatalog', fileItem, response, status, headers);
    	Notification.success({message:"Machine catalog uploaded successfully.", title: 'Success'});
    	$scope.isCatalogUploaded = true;
        
    };
    $scope.catalogUploader.onSuccessItem = $scope.onSuccessItemCatalog;

    $scope.onErrorItemBoth = function(fileItem, response, status, headers) {
        console.info('onErrorItemBoth', fileItem, response, status, headers);
        Notification.error({message:"Some error occurred while uploading. Please try again later.", title: 'Registration Failed'});
        
    };
    $scope.imageUploader.onErrorItem = $scope.onErrorItemBoth;
    $scope.catalogUploader.onErrorItem = $scope.onErrorItemBoth;

    $scope.onCancelItemBoth = function(fileItem, response, status, headers) {
        console.info('onCancelItemBoth', fileItem, response, status, headers);
    };
    $scope.imageUploader.onCancelItem = $scope.onCancelItemBoth;
    $scope.catalogUploader.onCancelItem = $scope.onCancelItemBoth;

    $scope.onCompleteItemBoth = function(fileItem, response, status, headers) {
        console.info('onCompleteItemBoth', fileItem, response, status, headers);
    };
    $scope.imageUploader.onCompleteItem = $scope.onCompleteItemBoth;
    $scope.catalogUploader.onCompleteItem = $scope.onCompleteItemBoth;

    $scope.onCompleteAllBoth = function() {
        console.info('onCompleteAllBoth');
        if($scope.isCatalogUploaded && $scope.isImageUploaded){
        	$scope.isCatalogUploaded = false;
        	$scope.isImageUploaded = false;
        	$scope.hideSubmitLoading();
        }
    };
    $scope.imageUploader.onCompleteAll = $scope.onCompleteAllBoth;
    $scope.catalogUploader.onCompleteAll = $scope.onCompleteAllBoth;
	
	$scope.getMachinesList();
	

}


angular.module('supplier.machines',['ngAnimate','ui.router','ui-notification','angularFileUpload','ng.httpLoader','model.service','angularFileUpload'])
	.controller('MachinesController',['$scope','$state','Notification','FileUploader','$http','MachineService','context','ErrorUtils','$filter', '$modal','modelService','FileUploader','CONSTANTS',MachinesController])
	