function UsersController($scope,$state,Notification,FileUploader,$http,context,ErrorUtils,$filter, $modal,modelService,CONSTANTS){
	
	$scope.registeredUsers = [{name:"Waqas Ahmed",company:{name:"ABC Builders" }},{name:"Maaz Ahmed",company:{name:"XYZ Suppliers"}},
	                          {name:"Umair Abbasi",company:{name:"ABC Contarctors"}}
	];
	
	$scope.showDetails = function(index){
		
		$scope.details = $scope.registeredUsers[index];
		
		var modalInstance = $modal.open({
		      templateUrl: 'modules/admin/users/showUsersDetails.tpl.html',
		      controller : showUserDetailsController,
		      scope		 : $scope,
		      resolve: {
		          UserDetils: function () {
		            return $scope.details;
		          }
		        }
		});
	}
}
function showUserDetailsController($scope,$state,$modalInstance,UserDetils,context,CONSTANTS){
	$scope.show = {
			name	: '',
			companyName : '',
		};
	$scope.show.name = UserDetils.name;
	$scope.show.companyName = UserDetils.company['name'];
	
	$scope.close = function(){
		$modalInstance.dismiss('cancel');
	}
}


angular.module('users',['ngAnimate','ui.router','ui-notification','angularFileUpload','ng.httpLoader','model.service','angularFileUpload'])
	.controller('UsersController',['$scope','$state','Notification','FileUploader','$http','MachineService','context','ErrorUtils','$filter', '$modal','modelService','FileUploader','CONSTANTS',UsersController])
	