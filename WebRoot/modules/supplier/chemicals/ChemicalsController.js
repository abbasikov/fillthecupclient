function ChemicalUpdateController($scope,$modalInstance,chemicalItem,$filter,modelService){
	console.log("ChemicalItem",chemicalItem);
	$scope.isError = false;
	$scope.errorMsg = "";
	
	$scope.updatedObj = {
			 	cleaningService 	: '',
			 	cleaningArea		: '',
			 	application			: '',
			 	proposedBrand		: '',
             	proposedChemical	: '',
             	dilutionRatio		: '',
             	areaCoverage		: '',
             	origin				: '',
             	certification		: '',
             	packing				: '',
             	totalAreaCoverage	: ''
				};
	
	
	
	$scope.updatedCleaningServices = modelService.getChemicalsDropdowns();
	
	var array = $filter('filter')($scope.updatedCleaningServices, {name: chemicalItem.cleaningService});
	$scope.updatedObj.cleaningService = $scope.updatedCleaningServices[array[0].value-1];
	
	var array1 = $filter('filter')($scope.updatedCleaningServices[array[0].value-1].cleaningAreas,{name:chemicalItem.cleaningArea});
	$scope.updatedObj.cleaningArea = $scope.updatedCleaningServices[array[0].value-1].cleaningAreas[array1[0].value-1];
	
	var array2 = $filter('filter')($scope.updatedCleaningServices[array[0].value-1].cleaningAreas[array1[0].value-1].applications,{name:chemicalItem.application});
	$scope.updatedObj.application		 = $scope.updatedCleaningServices[array[0].value-1].cleaningAreas[array1[0].value-1].applications[array2[0].value-1];
	
	$scope.checkUpdateCleaningArea = function(){
		try{			
			$scope.updatedObj.cleaningArea = $scope.updatedObj.cleaningService.cleaningAreas[0];
			$scope.updatedObj.application = $scope.updatedObj.cleaningArea.applications[0];
		}
		catch(err){
			
		}
	};
	
	$scope.checkUpdateApplication = function(){
		try{			
			$scope.updatedObj.application = $scope.updatedObj.cleaningArea.applications[0];			
		}
		catch(err){
			
		}
	};
	
	
	
	$scope.updatedObj.proposedBrand		 = chemicalItem.proposedBrand;
	$scope.updatedObj.proposedChemical	 = chemicalItem.proposedChemical;
	$scope.updatedObj.dilutionRatio		 = chemicalItem.dilutionRatio;
	$scope.updatedObj.areaCoverage		 = chemicalItem.areaCoverage;
	$scope.updatedObj.origin			 = chemicalItem.origin;
	$scope.updatedObj.certification		 = chemicalItem.certification;
	$scope.updatedObj.packing		     = chemicalItem.packing;
	$scope.updatedObj.totalAreaCoverage	 = chemicalItem.totalAreaCoverage;
	
	
	
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
		
		var b4 = $scope.updatedObj.proposedBrand	== '';
		var b5 = $scope.updatedObj.proposedChemical	== '';
		var b6 = $scope.updatedObj.dilutionRatio	== '';
		var b7 = $scope.updatedObj.areaCoverage		== '';
		var b8 = $scope.updatedObj.origin			== '';
		var b9 = $scope.updatedObj.certification	== '';
		var b10= $scope.updatedObj.packing		    == '';
		var b11= $scope.updatedObj.totalAreaCoverage=='';
		
		if(b4 || b5 || b6 || b7 || b8 || b9 || b10 || b11)
			return true;
		
		return false;
	}
	
}


function ChemicalsController($scope,$state,Notification,FileUploader,ChemicalService,context,modelService,$modal,CONSTANTS){

	$scope.companyUuid = context.getEmployee().company.uuid;
	
	$scope.showChemicalListLoading = false;
	$scope.showChemicalListOverlay = false;
	
	$scope.showChemicalEntryOverlay = false;
	$scope.showChemicalEntryLoading = false;
	
	$scope.isImageUploaded = false;
	$scope.isCatalogUploaded = false;
	
	
	$scope.imageUploader = new FileUploader({
        url			: CONSTANTS.BASE_REST_URL+'/rest/public/uploads/chemicals',
    });
	
	$scope.catalogUploader = new FileUploader({
        url			: CONSTANTS.BASE_REST_URL+'/rest/public/uploads/chemicals',
    });
	
	
	
	
	$scope.cleaningServices = modelService.getChemicalsDropdowns();
	$scope.cleaningServices.unshift({name:'Select Cleaning Service',value:0,cleaningAreas:[]});
	$scope.cleaningService = $scope.cleaningServices[0];
	
	$scope.cleaningService.cleaningAreas.unshift({name:'Select Cleaning Area',value:0,applications:[]});
	$scope.cleaningArea = $scope.cleaningService.cleaningAreas[0];
	
	$scope.cleaningArea.applications.unshift({name:'Select Application Area',value:0});
	$scope.application =  $scope.cleaningArea.applications[0];
	
	$scope.checkCleaningArea = function(){
		try{
			if($scope.cleaningService.value != 0 ){
				if($scope.cleaningService.cleaningAreas[0].value!=0){
					$scope.cleaningService.cleaningAreas.unshift({name:'Select Cleaning Area',value:0});
					$scope.cleaningArea = $scope.cleaningService.cleaningAreas[0];	
					
				}
				else{
					$scope.cleaningArea = $scope.cleaningService.cleaningAreas[0];
				}
			}
		}
		catch(err){
			
		}
	}
	
	$scope.checkApplicationArea = function(){
		try{
			if($scope.cleaningArea.value != 0 ){
				if($scope.cleaningArea.applications[0].value!=0){
					$scope.cleaningArea.applications.unshift({name:'Select Application',value:0});
					$scope.application = $scope.cleaningArea.applications[0];	
				}
				else{
					$scope.application = $scope.cleaningArea.applications[0];
				}
			}
		}
		catch(err){
			
		}
	}
	
	$scope.chemicalsList = [];
	
	
	$scope.submitChemical = function(){
		
		if($scope.validateChemicalEntry()){
			
			$scope.showSubmitLoading();
			
			
			var data = 	"cleaningService="+encodeURIComponent($scope.cleaningService.name)+"&" +
			"cleaningArea="+encodeURIComponent($scope.cleaningArea.name)+"&" +
			"application="+encodeURIComponent($scope.application.name)+"&" +
			"proposedBrand="+encodeURIComponent($scope.proposedBrand)+"&" +
			"proposedChemical="+encodeURIComponent($scope.proposedChemical)+"&" +
			"dilutionRatio="+encodeURIComponent($scope.dilutionRatio)+"&" +
			"areaCoverage="+encodeURIComponent($scope.areaCoverage)+"&" +
			"origin="+encodeURIComponent($scope.origin)+"&" +
			"certification="+encodeURIComponent($scope.certification)+"&" +
			"packing="+encodeURIComponent($scope.packing)+"&" +
			"totalAreaCoverage="+encodeURIComponent($scope.totalAreaCoverage)+"&" +
			"companyUuid="+encodeURIComponent($scope.companyUuid)+"&"+
			"imageFileName="+encodeURIComponent($scope.imageFileName)+"&"+
			"catalogFileName="+encodeURIComponent($scope.catalogFileName);
			var save = ChemicalService.save(data);
			
			save.$promise.then(
					function(data){
						$scope.hideSubmitLoading();
						if(data.meta.code == 200){
							console.log("Data:",data);
							Notification.success({message: 'Record saved successfully. Uploading chemical image and catalog', title: 'Success'});
							for(index in data.data){
								$scope.chemicalsList.push(data.data[index]);
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
			console.log("Chemical: " + uuid);
			
			$scope.showSubmitLoading();
			
			$scope.imageUploader.queue[0].file.name = uuid+"-"+$scope.imageFileName;
			$scope.imageUploader.queue[0].upload();
			
			$scope.catalogUploader.queue[0].file.name = uuid+"-"+$scope.catalogFileName;
			$scope.catalogUploader.queue[0].upload();
		}
		catch(err){
			console.log("Uploading Error: "+err.message);
		}
	};
	
	$scope.validateChemicalEntry = function(){
		
		if($scope.cleaningService.value == 0 ){
			$scope.errorMessage = "Please select cleaning service.";
			return false;
		}
		
		
		if($scope.cleaningArea.value == 0){
			$scope.errorMessage = "Please select cleaning area.";
			return false;
		}
		
		if($scope.application.value == 0){
			$scope.errorMessage = "Please select application.";
			return false;
		}
		
		if($scope.proposedBrand == undefined || $scope.proposedBrand == ''){
			$scope.errorMessage = "Please enter proposed brand.";
			return false;
		}
		
		if($scope.proposedChemical == undefined || $scope.proposedChemical == ''){
			$scope.errorMessage = "Please enter proposed chemical.";
			return false;
		}
		
		if($scope.dilutionRatio == undefined || $scope.dilutionRatio == ''){
			$scope.errorMessage = "Please enter area dilution ratio.";
			return false;
		}
		
		if($scope.areaCoverage == undefined || $scope.areaCoverage == ''){
			$scope.errorMessage = "Please enter area coverage.";
			return false;
		}
		
		if($scope.origin == undefined || $scope.origin == ''){
			$scope.errorMessage = "Please enter origin.";
			return false;
		}
		
		if($scope.certification == undefined || $scope.certification == ''){
			$scope.errorMessage = "Please enter certification.";
			return false;
		}
		
		if($scope.packing == undefined || $scope.packing == ''){
			$scope.errorMessage = "Please enter packing.";
			return false;
		}
		
		if($scope.totalAreaCoverage == undefined || $scope.totalAreaCoverage == ''){
			$scope.errorMessage = "Please enter total area coverage.";
			return false;
		}
		
		if($scope.imageFileName == undefined || $scope.imageFileName == ''){
			$scope.errorMessage = "Please select chemical image.";
			return false;
		}
		
		if($scope.catalogFileName == undefined || $scope.catalogFileName == ''){
			$scope.errorMessage = "Please select chemical catalog.";
			return false;
		}
		
		if($scope.imageFileName == $scope.catalogFileName){
			$scope.errorMessage = "Image and catalog file names cannot same. Please select different names.";
			return false;
		}
		
		return true;
		

	}
	
	
	
	$scope.getChemicalsList = function(){
		$scope.chemicalsList = [];
		var get = ChemicalService.get({id:$scope.companyUuid});
		$scope.showListLoading();
		get.$promise.then(
				function(data){
					$scope.hideListLoading();
					if(data.meta.code == 200){
						console.log("Data:",data);
						for(index in data.data){
							$scope.chemicalsList.push(data.data[index]);
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
	
	$scope.deleteChemical = function(uuid,index){
		var del = ChemicalService.delete({id:uuid});
		$scope.showListLoading();
		del.$promise.then(
				function(data){
					$scope.hideListLoading();
					if(data.meta.code == 200){
						console.log("Data:",data);
						$scope.deleteItemFromChemicalsList(index);
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
	
	$scope.deleteItemFromChemicalsList = function(index){
		var from 	= index;
		var to		= 0;
		var rest = $scope.chemicalsList.slice((to || from) + 1 || $scope.chemicalsList.length);
		$scope.chemicalsList.length = from < 0 ? $scope.chemicalsList.length + from : from;
		$scope.chemicalsList.push.apply($scope.chemicalsList, rest);
	}
	
	$scope.editChemical = function(index){
		//Selected chemical item to edit
		$scope.selectedChemicalItem = $scope.chemicalsList[index];
		
		var modalInstance = $modal.open({
		      templateUrl: 'modules/supplier/chemicals/updateChemical.tpl.html',
		      controller : ChemicalUpdateController,
		      scope		 : $scope,
		      resolve: {
		          chemicalItem: function () {
		            return $scope.selectedChemicalItem;
		          }
				
		        }
		    });
		
		
		//Callback of rest call
		 modalInstance.result.then(function (updatedObj) {
			 
			 console.log("SelectedChemical:",$scope.selectedChemicalItem);
			 console.log("UpdatedObj:",updatedObj);
			 	
			 	//Dont send update request if there is no change
			 	var isChemicalsEqual = $scope.isChemicalsEqual($scope.selectedChemicalItem,updatedObj);
			 
				 if(isChemicalsEqual == false){
					 //Send request to update
					 
					 var data = "names=cleaningService,cleaningArea,application,proposedBrand,proposedChemical,dilutionRatio,areaCoverage,origin,certification,packing,totalAreaCoverage"+"&"+
					 			"values="+encodeURIComponent(
									 					 updatedObj.cleaningService.name+","+ 
														 updatedObj.cleaningArea.name+","+
														 updatedObj.application.name+","+
														 updatedObj.proposedBrand+","+
														 updatedObj.proposedChemical+","+
														 updatedObj.dilutionRatio+","+
														 updatedObj.areaCoverage+","+
														 updatedObj.origin+","+
														 updatedObj.certification+","+
														 updatedObj.packing+","+
														 updatedObj.totalAreaCoverage
														);
					 
					 console.log("UpdateData:",data)
					 var update = ChemicalService.update({id:$scope.selectedChemicalItem.uuid},data);
					 update.$promise.then(
								function(data){
									if(data.meta.code == 200){
										Notification.success({message:"Record updated successfully.", title: 'Success'});
										$scope.selectedChemicalItem.cleaningService     = data.data[0].cleaningService;
										$scope.selectedChemicalItem.cleaningArea		= data.data[0].cleaningArea;
										$scope.selectedChemicalItem.application			= data.data[0].application;
										$scope.selectedChemicalItem.proposedBrand		= data.data[0].proposedBrand;
										$scope.selectedChemicalItem.proposedChemical	= data.data[0].proposedChemical;
										$scope.selectedChemicalItem.dilutionRatio		= data.data[0].dilutionRatio;
										$scope.selectedChemicalItem.areaCoverage		= data.data[0].areaCoverage;
										$scope.selectedChemicalItem.origin				= data.data[0].origin;
										$scope.selectedChemicalItem.certification		= data.data[0].certification;
										$scope.selectedChemicalItem.packing				= data.data[0].packing;
										$scope.selectedChemicalItem.totalAreaCoverage	= data.data[0].totalAreaCoverage;
										
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
	}
	
	$scope.isChemicalsEqual = function(listItem, updatedObj){
		
		var b1 = listItem.cleaningService 	== updatedObj.cleaningService.name; 
		var b2 = listItem.cleaningArea		== updatedObj.cleaningArea;
		var b3 = listItem.application		== updatedObj.application;
		var b4 = listItem.proposedBrand		== updatedObj.proposedBrand;
		var b5 = listItem.proposedChemical	== updatedObj.proposedChemical;
		var b6 = listItem.dilutionRatio		== updatedObj.dilutionRatio;
		var b7 = listItem.areaCoverage		== updatedObj.areaCoverage;
		var b8 = listItem.origin			== updatedObj.origin;
		var b9 = listItem.certification		== updatedObj.certification;
		var b10= listItem.packing		    == updatedObj.packing;
		var b11= listItem.totalAreaCoverage	== updatedObj.totalAreaCoverage;
		
		if(b1 && b2 && b3 && b4 && b5 && b6 && b7 && b8 && b9 && b10 && b11)
			return true;
		
		return false;		
	}
	
	$scope.showSubmitLoading = function(){
		$scope.showChemicalEntryOverlay = true;
		$scope.showChemicalEntryLoading = true;
	}
	
	$scope.hideSubmitLoading = function(){
		$scope.showChemicalEntryOverlay = false;
		$scope.showChemicalEntryLoading = false;
	}
	
	$scope.showListLoading = function(){
		$scope.showChemicalListLoading = true;
		$scope.showChemicalListOverlay = true;
	}
	
	$scope.hideListLoading = function(){
		$scope.showChemicalListLoading = false;
		$scope.showChemicalListOverlay = false;
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
    	Notification.success({message:"Chemical image uploaded successfully.", title: 'Success'});
    	$scope.isImageUploaded = true;
    };
    $scope.imageUploader.onSuccessItem = $scope.onSuccessItemImage;
    
    $scope.onSuccessItemCatalog = function(fileItem, response, status, headers) {
    	console.info('onSuccessItemCatalog', fileItem, response, status, headers);
    	Notification.success({message:"Chemical catalog uploaded successfully.", title: 'Success'});
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
	
	$scope.getChemicalsList();
}


angular.module('supplier.chemicals',['ngAnimate','ui.router','ui-notification','angularFileUpload','model.service'])
	.controller('ChemicalsController',['$scope','$state','Notification','FileUploader','ChemicalService','context','modelService','$modal',ChemicalsController]);