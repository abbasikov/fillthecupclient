function AddProjectController($scope,$modalInstance){
	$scope.showErrorMessage = false;
	
	$scope.project = {name:'',description:''};
	
	$scope.create = function(){
		if($scope.project.name != '' && $scope.project.description!=''){
			$modalInstance.close($scope.project);
		}else{
			$scope.showErrorMessage = true;
		}
	};
	
	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	}
	
}

function ContractorAllProjectsController($scope,$state,Notification,context,ProjectService,$modal,CONSTANTS,ErrorUtils){
	
	$scope.companyType  = context.getEmployee().company.companyType;
	$scope.companyUuid	= context.getEmployee().company.uuid;
	$scope.companyName	= context.getEmployee().company.name;
	$scope.projects 	= [];
	$scope.totalProjects = 0;
	$scope.dateFormat	= CONSTANTS.DATE_FORMAT;
	
	$scope.getProjectsByCompany = function(){
		
		var get = ProjectService.get({id:$scope.companyUuid});
		get.$promise.then(
				function(data){
					if(data.meta.code == 200){
						$scope.insertProjectInList(data.data);
					}
					else{
						Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
					}
					
				},
				function(error){
					Notification.error({message: "Some error occurred. Please try again later.", title: 'Error'});
				});
	}
	
	$scope.createNewProject = function(){
		var modalInstance = $modal.open({
		      templateUrl: 'modules/contractor/home/allprojects/NewProject.tpl.html',
		      controller : AddProjectController,
		      scope		 : $scope
		    });
		
		 //Callback of rest call
		 modalInstance.result.then(function (projectObj) {
			 var data = "projectName="+encodeURIComponent(projectObj.name)+"&" +
						"projectDescription="+encodeURIComponent(projectObj.description)+"&" +
						"companyUuid="+encodeURIComponent($scope.companyUuid);
			 
			  var save = ProjectService.save(data);
			  
			  save.$promise.then(
						function(data){
							
							if(data.meta.code == 200){
								Notification.success({message: 'Project created successfully.', title: 'Success'});
								$scope.insertProjectInList(data.data);
							}
							else{
								Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
							}
							
						},
						function(error){	
							Notification.error({message: "Some error occurred. Please try again later.", title: 'Error'});
						});
		    }, function () {
		      
		    });
	}
	
	$scope.insertProjectInList = function(list){
		for(i in list){
			var projectObj = {
								name				: list[i].name,
								description			: list[i].description,
								uuid				: list[i].uuid,
								createdOn			: $scope.getFormattedDate(list[i].createdOnISO8601),
								surveyEntries		: list[i].surveyEntries
								
							};
			$scope.projects.unshift(projectObj);
		}
		
		console.log("Project",$scope.projects); 
		$scope.totalProjects = $scope.projects.length;
	};
	
	$scope.getFormattedDate = function(iso8601Date){
		try{
			return moment(iso8601Date).format($scope.dateFormat);
		}
		catch(err){
			console.log("Error in getFormattedDate: "+err.message);
			return iso8601Date;
		}
		
		
	}
	
	$scope.goProject = function(projectObj){
		context.getEmployee().company.selectedProject = projectObj;
		
		//Update employee in session storage
		sessionStorage.setItem('employee',JSON.stringify(context.getEmployee()) );
		
		$state.go('contractor.project');
	}
	
	$scope.showDropdown = function(){
		$('#dropdownMenu0').dropdown('toggle');
	}
	
	$scope.showProjectName = function(name){
		alert(name);
	}
	
	$scope.getProjectsByCompany();
}

angular.module('contractor.home.allprojects',['ngAnimate','ui.router','ui-notification','angularFileUpload','error.utils'])
	.controller('ContractorAllProjectsController',['$scope','$state','Notification','context','ProjectService','$modal','CONSTANTS','ErrorUtils',ContractorAllProjectsController]);
