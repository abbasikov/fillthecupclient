function RegisterController($scope,$state,Notification,FileUploader,RegisterService,ErrorUtils,CONSTANTS,context,$cookies,loadContext){
	Notification.success({message: 'Please fill the form for new registration.', title: 'Welcome to FillTheCup'});
	
	$scope.registerText = "SIGN UP";
	$scope.showLoading  = false;
	$scope.companyTradeLicense = "";
	$scope.errorMessage = "";
	$scope.companyUuid = '';
	$scope.isEmployeeRegistered = false;
	$scope.firstName = "";
	
	$scope.example1model = [];
	$scope.example1data = [
		{id: 1, label: "Profile Lean Lab"},
		{id: 2, label: "PDP Lean Lab"},
		{id: 3, label: "Wallet Lean Lab"}];
	
	$scope.settings = {
		    scrollableHeight		: '200px',
		    scrollable				: true
	};
	
	
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
			return false;
		}
		
		return true;
	};
	
	
	$scope.companyTypes = [
	                      	{name:'Profile Lean Lab',value:0},
	                      	{name:'PDP Lean Lab',value:1},
	                      	{name:'Contractor',value:2},
	                      	{name:'Supplier',value:3}
	                      ];
	//Default selection
	$scope.companyType = $scope.companyTypes[0];
	    
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