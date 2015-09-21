function ContractorSettingsController($scope,$state,PasswordChangeService,Notification,context,ErrorUtils){
	
	$scope.profileObject = context.getEmployee();
	
	//console.log("ProfileObj: ",$scope.profileObject);
	
	$scope.myImage='';
	$scope.myCroppedImage='';
	$scope.disabled = true; // use to disable Save Button
	
	$scope.showImageOverlay = false;
	$scope.showImageLoading = false;
	
	$scope.handleFileSelect = function(files) 
	{
		var file = files[0];
		var reader = new FileReader();
		reader.onload = function (evt) 
		{
			$scope.showLoading();
			$scope.$apply(function($scope)
			{
				$scope.myImage = evt.target.result;
				$scope.disabled = false;         //use to enable Save Button
				
			});
			$scope.stopLoading();
		};
		reader.readAsDataURL(file);
	};
	
	$scope.showLoading = function(){
		$scope.showImageOverlay = true;
		$scope.showImageLoading = true;
	}
	$scope.stopLoading = function(){
		$scope.showImageOverlay = false;
		$scope.showImageLoading = false;
	}
	
	//============================ Password Change Functionality ===========================================//
	$scope.showPasswordLoading  = false;
	$scope.showPasswordImageLoading = false;
	$scope.errorMessage = "";
	
	$scope.newPassword ="";
	$scope.confirmNewPassword ="";
	
	$scope.savePassword = function(){
		if($scope.validatePassword()){
			
			$scope.showSavePasswordLoading();
			
			$scope.email = $scope.profileObject['email']; //$scope.profileObject  Declared above line no.03
			
			var data = "newpassword="+$scope.newPassword+"&email="+$scope.email;

			var passwordChange = PasswordChangeService.save(data);

			passwordChange.$promise.then(
					function(data){
						
						$scope.stopSavePasswordLoading();
						
						if(data.meta.code == 200){
							Notification.success({message: 'Check your Email ... ', title: 'Success'});
						}
						else{
							Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
						}
					},
					function(error){
						$scope.toggleLoading();
						Notification.error({message: "Some error occurred. Please try again later.", title: 'Error'});
					});
		}
		else
			Notification.error({message: $scope.errorMessage, title: 'Error'});
		
		$scope.newPassword="";
		$scope.confirmNewPassword="";
	}
	$scope.validatePassword = function(){
		if($scope.newPassword == undefined || $scope.newPassword == ''){
			$scope.errorMessage = "Please provide new Password.";
			return false;
		}
		
		if($scope.confirmNewPassword == undefined || $scope.confirmNewPassword == ''){
			$scope.errorMessage = "Please confirm new Password.";
			return false;
		}
		
		if($scope.newPassword != $scope.confirmNewPassword){
			$scope.errorMessage = "Password does not match.";
			return false;
		}
		
		return true;
	}
	
	$scope.showSavePasswordLoading = function(){
		$scope.showPasswordLoading = true;
		$scope.showPasswordImageLoading = true;
	}
	$scope.stopSavePasswordLoading = function(){
		$scope.showPasswordLoading = false;
		$scope.showPasswordImageLoading = false;
	}	
	
	$scope.cancelPassword = function(){
	}
	//======================================================================================================//
}

angular.module('contractor.home.settings',['ngAnimate','ui.router','ui-notification','angularFileUpload'])
	.controller('ContractorSettingsController',['$scope','$state','PasswordChangeService','Notification','context','ErrorUtils',ContractorSettingsController]);
