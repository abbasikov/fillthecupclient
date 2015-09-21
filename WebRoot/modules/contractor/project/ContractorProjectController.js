function AddSurveyEntryController($scope,$modalInstance,modelService,CONSTANTS,selectedAreaTypes,$timeout){
	
	$scope.isError = false;
	$scope.errorMsg = "";
	$scope.selectedServiceTypes = [];
	
	$scope.newSurveyEntry = {
			areaType:'',
			description:'',
			serviceTypes:[],
	};
	
	$scope.regenerateAreaTypes = function(){
		
		var areaTypes = modelService.getAreaTypes();
		var areaTypes2 = [];
		if(selectedAreaTypes == undefined || selectedAreaTypes ==''){
			return modelService.getAreaTypes();
		}
		
		for (v in areaTypes) {
			if(selectedAreaTypes.indexOf(areaTypes[v].name) == -1){
				areaTypes2.unshift(areaTypes[v]);
			}
		}
		
		return areaTypes2;
	};
	
	//$scope.areaTypes = $scope.regenerateAreaTypes();
	$scope.areaTypes = modelService.getAreaTypes();
	$scope.areaTypes.unshift({name:'Select Area Type',value:0});
	$scope.areaType = $scope.areaTypes[0]; 
	
	$scope.serviceTypes = modelService.getChemicalsDropdowns();
	
	//Insert booleans property for checkbox
	for(index in $scope.serviceTypes){
		$scope.serviceTypes[index].checked = false;
		$scope.serviceTypes[index].expand  = false;
		
		//Now add length n width property for each cleaning area against one serviceType
		for(index2 in $scope.serviceTypes[index].cleaningAreas){
			
			$scope.serviceTypes[index].cleaningAreas[index2].checked 		= false;
			$scope.serviceTypes[index].cleaningAreas[index2].quantity 		= "";
			$scope.serviceTypes[index].cleaningAreas[index2].length 		= "";
			$scope.serviceTypes[index].cleaningAreas[index2].width 			= "";
			$scope.serviceTypes[index].cleaningAreas[index2].cleaningItems 	= [];
			
		}
	}
	
	$scope.toggleDiv = function(item){
		var old_expand = item.expand;
		for(index in $scope.serviceTypes){
			$scope.serviceTypes[index].expand  = false;
		}
		item.expand = (old_expand)?false:true;
	};
	
	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	};
	
	$scope.add = function(){
		angular.element('#addButton').addClass('disabled');
		if($scope.validate()){
			//Now make entry object
			$scope.newSurveyEntry.areaType = $scope.areaType.name;
			for(index9 in $scope.selectedServiceTypes){
				var surveyServiceTypeObj = {name:$scope.selectedServiceTypes[index9].name,serviceAreas:[]};
				
				//Selected Service Areas
				var selectedServiceAreas = $scope.getSelectedServiceAreasByServiceType($scope.selectedServiceTypes[index9]);
				for(index10 in selectedServiceAreas){
					
					var surveyServiceArea = {
												name	:selectedServiceAreas[index10].name,
												length		:selectedServiceAreas[index10].length,
												width		:selectedServiceAreas[index10].width,
												quantity	:selectedServiceAreas[index10].quantity,
												cleaningItems:selectedServiceAreas[index10].cleaningItems,
											};
					surveyServiceTypeObj.serviceAreas.push(surveyServiceArea);
				}
				$scope.newSurveyEntry.serviceTypes.push(surveyServiceTypeObj);
			}
			
			$modalInstance.close($scope.newSurveyEntry);
			
		}
		else{
			$timeout(function(){
				$scope.isError = false;
			},5000);
		}
		angular.element('#addButton').removeClass('disabled');
	};
	
	$scope.validate = function(){
		
		$scope.isError = false;
		
		if($scope.areaType.value == 0){
			$scope.isError = true;
			$scope.errorMsg = "Please select area type.";
			return false;
		}
		else if($scope.newSurveyEntry.description == ''){
			$scope.isError = true;
			$scope.errorMsg = "Please enter description.";
			return false;
		}
		else{
			
			$scope.selectedServiceTypes = $scope.getSelectedServiceTypes();
			if($scope.selectedServiceTypes.length<1){
				$scope.isError = true;
				$scope.errorMsg = "Please select atleast one service type";
				return false;
			}
			else{
				
				for(index3 in $scope.selectedServiceTypes){
					var serviceAreas = $scope.getSelectedServiceAreasByServiceType($scope.selectedServiceTypes[index3]);
					
					if(serviceAreas.length<1){
						$scope.isError = true;
						$scope.errorMsg = "Please select atleast one service area of '"+$scope.selectedServiceTypes[index3].name+"' service type";
						return false;
					}
					
					for(index4 in serviceAreas){
						
						if(serviceAreas[index4].checked && $scope.selectedServiceTypes[index3].name != 'Office Furniture'){
							
							if(serviceAreas[index4].length == '' || isNaN(serviceAreas[index4].length)){
								$scope.isError = true;
								$scope.errorMsg = "Length is invalid in "+$scope.selectedServiceTypes[index3].name+" -> "+serviceAreas[index4].name;
								return false;
							}
							
							if(serviceAreas[index4].width == '' || isNaN(serviceAreas[index4].width)){
								$scope.isError = true;
								$scope.errorMsg = "Width is invalid in "+$scope.selectedServiceTypes[index3].name+"->"+serviceAreas[index4].name;
								return false;
							}
						}
						
						if(serviceAreas[index4].checked && $scope.selectedServiceTypes[index3].name == 'Office Furniture'){
							
							if(serviceAreas[index4].quantity == '' || isNaN(serviceAreas[index4].quantity)){
								$scope.isError = true;
								$scope.errorMsg = "Quantity is invalid in "+$scope.selectedServiceTypes[index3].name+" -> "+serviceAreas[index4].name;
								return false;
							}
						}
					}
				}
			}
			
		}
		
		return true;
	};
	
	$scope.getSelectedServiceTypes = function(){
		var array = [];
		for(k in $scope.serviceTypes){
			if($scope.serviceTypes[k].checked == true){
				array.push($scope.serviceTypes[k]);
			}
		}
		
		return array;
	};
	
	$scope.getSelectedServiceAreasByServiceType = function(serviceType){
		var array = [];
		for(l in serviceType.cleaningAreas){
			if(serviceType.cleaningAreas[l].checked == true){
				array.push(serviceType.cleaningAreas[l]);
			}
		}
		return array;
	};
	
	$scope.addCleaningItem = function(item){
		var obj = {name:'',quantity:''};
		item.cleaningItems.push(obj);
	};
	
	$scope.deleteCleaningItem = function(washroomIndex,cleaningAreaIndex,cleaningItemIndex){
		var from 	= cleaningItemIndex;
		var to		= 0;
		
		var rest = $scope.serviceTypes[washroomIndex].cleaningAreas[cleaningAreaIndex].cleaningItems.slice((to || from) + 1 || $scope.serviceTypes[washroomIndex].cleaningAreas[cleaningAreaIndex].cleaningItems.length);
		$scope.serviceTypes[washroomIndex].cleaningAreas[cleaningAreaIndex].cleaningItems.length = from < 0 ? $scope.serviceTypes[washroomIndex].cleaningAreas[cleaningAreaIndex].cleaningItems.length + from : from;
		$scope.serviceTypes[washroomIndex].cleaningAreas[cleaningAreaIndex].cleaningItems.push.apply($scope.serviceTypes[washroomIndex].cleaningAreas[cleaningAreaIndex].cleaningItems, rest);
	}
	
	console.log($scope.serviceTypes[0]);
	
	
}//end-AddSurveyEntryController

function ContractorProjectController($scope,$state,Notification,context,$modal,modelService,SurveyDataService){
	
	if(context.getEmployee().company.selectedProject == undefined){
		console.log("selectedProject is undefined");
		$state.go('login');
		return;
	}
	$scope.selectedProject = context.getEmployee().company.selectedProject;
	
	$scope.projectUuid 	= $scope.selectedProject.uuid;
	$scope.projectName 	= $scope.selectedProject.name;
	$scope.createdOn	= $scope.selectedProject.createdOn;
	
	console.log("SelectedProjected ",$scope.selectedProject);
	
	//Assign selected project survey entries to survey data to show data
	$scope.surveyData = ($scope.selectedProject.surveyEntries == null || $scope.selectedProject.surveyEntries == undefined) ? [] : $scope.selectedProject.surveyEntries ;
	
	$scope.addNewSurveyEntry = function(){
		
		
		var modalInstance = $modal.open({
		      templateUrl: 'modules/contractor/project/AddNewSurveyForm.tpl.html',
		      controller : AddSurveyEntryController,
		      scope		 : $scope,
		      resolve: {
		    	  selectedAreaTypes: function () {
		            return $scope.getEnteredAreaTypes();
		          }
		        }
		    });
		
		
		 modalInstance.result.then(function (surveyEntry) {
			 console.log("SurveyEntry:",surveyEntry);
			 $scope.surveyData.push(surveyEntry);
			 $scope.saveSurveyData();
		    }, function () {
		      
		    });
	};
	
	$scope.saveSurveyData = function(){
		
		var data = 	"projectUuid="+encodeURIComponent($scope.projectUuid)+"&" +
					"surveyDataJson="+encodeURIComponent(angular.toJson($scope.surveyData));
		
	
		var save = SurveyDataService.save(data);
	
		save.$promise.then(
			function(data){
				console.log("Data ",data);
				if(data.meta.code == 200){
					
				}
				else{
					Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
				}
				
			},
			function(error){	
				Notification.error({message: "Some error occurred. Please try again later.", title: 'Error'});
			});
	};
	
	$scope.getEnteredAreaTypes = function(){
		var arr = "";
		for(m in $scope.surveyData){
			arr += $scope.surveyData[m].areaType+",";
		}
		return arr;
	};
	
}

angular.module('contractor.project',['ngAnimate','ui.router','ui-notification','angularFileUpload'])
	.controller('ContractorProjectController',['$scope','$state','Notification','context','$modal','modelService','SurveyDataService',ContractorProjectController]);
