function HomeController($scope,$state,Notification,context,ReleasesCupService,ReleasesCupByLabService){
	
	$scope.releaseCupsList		= [];
	$scope.getAllReleaseCupList = function(){
		var rel = ReleasesCupByLabService.get({id:$scope.profileObject.labs[0].uuid});
		rel.$promise.then(
				function(data){
					if(data.meta.code == 200){
						$scope.releaseCupsList = data.dataList;
						$scope.redirectToLastReleaseCup();
					}
					else{
						Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
					}
				},
				function(error){
					Notification.error({message: "Some error occurred1. Please try again later.", title: 'Error'});
			});
	};
	
	$scope.redirectToLastReleaseCup = function(){
		try{
			var sortedReleaseCups = $scope.sortArray($scope.releaseCupsList,"lastClicked",true);
			$state.go("home.releasecupdetail",{id:sortedReleaseCups[0].uuid});
		}
		catch(err){
			console.log("Error In redirectToLastReleaseCup: Erorr: "+err.message);
			$state.go("home.releasecups");
		}
	};
	
	$scope.sortArray = function(items, field, reverse) {
	    var filtered = [];
	    angular.forEach(items, function(item) {
	      filtered.push(item);
	    });
	    filtered.sort(function (a, b) {
	      return (a[field] > b[field] ? 1 : -1);
	    });
	    
	    if(reverse) 
	    	filtered.reverse();
	    return filtered;
	  };

	
	$scope.deleteReleaseCupFromList = function(index){
		var from 	= index;
		var to		= 0;
		var rest = $scope.releaseCupsList.slice((to || from) + 1 || $scope.releaseCupsList.length);
		$scope.releaseCupsList.length = from < 0 ? $scope.releaseCupsList.length + from : from;
		$scope.releaseCupsList.push.apply($scope.releaseCupsList, rest);
	};
	
	
	
	
	if(context.getUser() == null)
	{
		$state.go('login');
	}
	else{
		$scope.profileObject 	= context.getUser();
		console.log("Profile Object: ",$scope.profileObject);
		
		$scope.companyType  	= "Macys";
		$scope.isSuperAdmin		= ($scope.profileObject.isSuperAdmin == undefined || $scope.profileObject.isSuperAdmin == 'false') ? false:true;
		$scope.navsection 		= -1;
		
		//Add page-signin class in body tag
		angular.element('#id-body').removeClass('page-signin');	
		$scope.getAllReleaseCupList();
	}	
	
	
	
}


angular.module('home',['ngAnimate','ui.router','ui-notification','angularFileUpload'])
	.controller('HomeController',['$scope','$state','Notification','context','ReleasesCupService','ReleasesCupByLabService',HomeController]);
	