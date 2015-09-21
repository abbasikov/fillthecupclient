function RegisterController($scope,$state,Notification,FileUploader,RegisterService,ErrorUtils,CONSTANTS,context,$cookies,loadContext){
	Notification.success({message: 'Please fill the form for new registration.', title: 'Welcome to FillTheCup'});
	
	$scope.registerText = "SIGN UP";
	$scope.showLoading  = false;
	$scope.companyTradeLicense = "";
	$scope.errorMessage = "";
	$scope.companyUuid = '';
	$scope.isEmployeeRegistered = false;
	$scope.firstName = "";
	
	var uploader = $scope.uploader = new FileUploader({
        url			: CONSTANTS.BASE_REST_URL+'/rest/public/uploads/licenses',
    });
	
	$scope.register = function(){
				
		if($scope.validateRegistration()){

			$scope.toggleLoading();
		

			var registerObject = 	"companyName="+$scope.companyName+"&"+
									"companyOverview="+"&"+
									"companyType="+$scope.companyType.name+"&"+
									"companyWebLink="+$scope.companyWebsite+"&"+
									"companyLicenseNumber="+"&"+
									"companyLicenseLink="+uploader.queue[0].file.name+"&"+
									"companyAddress="+"&"+
									"companyCountry=United Arab Emirates"+"&"+
									"employeeFirstName="+$scope.firstName+"&"+
									"employeeLastName="+$scope.lastName+"&"+
									"employeeEmail="+$scope.email+"&"+
									"employeePassword="+$scope.password+"&"+
									"employeePhone="+$scope.phone;
			
			
			
			var save = RegisterService.save(registerObject);
			save.$promise.then(
					function(data){
						
						if(data.meta.code == 200){

							//Set the context of Employee and Company
							context.setEmployee(data.data);

							//Get the company uuid and add it as a prefix before uploading trade license
							$scope.companyUuid = data.data.company.uuid;

							//Flag to indicate that employee has been registered
							$scope.isEmployeeRegistered = true;

							//Now upload the license
							$scope.uploadTradeLicense();
							
						}
						else{
							$scope.toggleLoading();
							Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
						}
						
					},
					function(error){
						$scope.toggleLoading();
						Notification.error({message: "Some error occurred. Please try again later.", title: 'Error'});
					});
			
		}
		else{
			Notification.error({message: $scope.errorMessage, title: 'Error'});
		}
		
		
		
	}
	
	$scope.toggleLoading = function(){
		if($scope.registerText == "SIGN UP"){
			$scope.registerText = "Signing Up. Please wait..";
			$scope.showLoading = true;
		}
		else{
			$scope.registerText = "SIGN UP";
			$scope.showLoading = false;
		}
	}

	$scope.uploadTradeLicense = function(){
		try{		
			console.log("CompanyUuid: " + $scope.companyUuid);
			uploader.queue[0].file.name	= $scope.companyUuid+"-"+uploader.queue[0].file.name;
			uploader.queue[0].upload();
		}
		catch(err){
			console.log("Uploading Error: "+err.message);
		}
	}
	
	$scope.validateRegistration = function(){
		try{
			if($scope.uploader.queue == undefined || $scope.uploader.queue.length<1){
				$scope.errorMessage = "Please select company trade license.";
				return false;
			}
			
			if($scope.companyType.value == 0 ){
				$scope.errorMessage = "Please select company type.";
				return false;
			}
			
			if($scope.companyName == undefined || $scope.companyName == ''){
				$scope.errorMessage = "Please provide company name.";
				return false;
			}
			
			if($scope.firstName == undefined || $scope.firstName == ''){
				$scope.errorMessage = "Please provide first name.";
				return false;
			} 
			
			if($scope.lastName == undefined || $scope.lastName == ''){
				$scope.errorMessage = "Please provide last name.";
				return false;
			}
			
			if($scope.email == undefined || $scope.email == ''){
				$scope.errorMessage = "Please provide email.";
				return false;
			}
			
			if($scope.password == undefined || $scope.password == ''){
				$scope.errorMessage = "Please provide password.";
				return false;
			}
			
		}
		catch(err){
			console.log("error occurred while validating. Error: "+err.message);
			$scope.errorMessage = "Error occurred while validating form. Please try again later.";
			return false;
		}
		
		return true;
	};
	
	
	$scope.companyTypes = [
	                      	{name:'Company Type',value:0},
	                      	{name:'Building Owner',value:1},
	                      	{name:'Contractor',value:2},
	                      	{name:'Supplier',value:3}
	                      ];
	//Default selection
	$scope.companyType = $scope.companyTypes[0];
	
	
	

    // FILTERS

    uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
    	if(this.queue.length>1){
    		uploader.queue[0] = fileItem;
    		uploader.queue[1].remove();    		
    	}
    	
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);

		$scope.toggleLoading();

        Notification.success({message: 'Registered successfully. Please check your email for confirmation.', title: 'Success'});
							
		//Store employee in session storage
		sessionStorage.setItem('employee',JSON.stringify(context.getEmployee()) );
							
		loadContext.redirectToHomePage();

    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
        $scope.toggleLoading();

        if($scope.isEmployeeRegistered != undefined && $scope.isEmployeeRegistered == true){
        	Notification.success({message:"Registered successfully but a problem occurred while uploading trade license. You can upload again after login. Please check your email for confirmation.", title: 'Registration',delay:4000});	
        }
        else{
        	Notification.error({message:"Some error occurred while uploading. Please try again later.", title: 'Registration Failed'});
        }
        
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
    };
    
	//Add page-signup class in body tag 
	angular.element('#id-body').removeClass('page-signin');
	angular.element('#id-body').addClass('page-signup');
	
	var isMobile = {
		    Android: function() {
		        return navigator.userAgent.match(/Android/i);
		    },
		    BlackBerry: function() {
		        return navigator.userAgent.match(/BlackBerry/i);
		    },
		    iOS: function() {
		        return navigator.userAgent.match(/iPhone|iPod/i);
		    },
		    Opera: function() {
		        return navigator.userAgent.match(/Opera Mini/i);
		    },
		    Windows: function() {
		        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
		    },
		    any: function() {
		        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		    }
		};
	
	if( isMobile.any() ) 
		$state.go('mobilenotsuported');

	
		
}
angular.module('register',['ngAnimate','ui.router','ui-notification','angularFileUpload'])
	.controller('RegisterController',['$scope','$state','Notification','FileUploader','RegisterService','ErrorUtils','CONSTANTS','context','$cookies','loadContext',RegisterController]);