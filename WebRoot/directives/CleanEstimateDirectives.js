angular.module('cleanestimate.directives', [])
.directive('ceSurveySummaryTable',function(){
	return {
		restrict:'E',
		scope	:{
			surveyData:'='
		},
		templateUrl:'directives/SurveySummaryTable.tpl.html',
		controller:function($scope){
			
			console.log("surveyData",$scope.surveyData);
			
			$scope.getTotalOfServiceAreas = function(serviceType){
				var sum = 0;
				for(index in serviceType.serviceAreas ){
					if(!isNaN(serviceType.serviceAreas[index].length) && !isNaN(serviceType.serviceAreas[index].width))
						sum = sum + (serviceType.serviceAreas[index].length*serviceType.serviceAreas[index].width);
				}
				
				return sum < 1 ? "" : sum;
				
			};
			
			$scope.getTotalOfServiceItems = function(serviceType){
				var sum  = 0;
				var index = 0;
				var index2 = 0;
				for(index in serviceType.serviceAreas){
					for(index2 in serviceType.serviceAreas[index].cleaningItems){
						if(!isNaN(serviceType.serviceAreas[index].cleaningItems[index2].quantity)){
							var quantity = Number(serviceType.serviceAreas[index].cleaningItems[index2].quantity);
							sum = sum + quantity;
						}
						
					}
				}
				
				return sum < 1 ? "" : sum;
			};
			
			$scope.deleteServiceType = function(areaIndex, serviceTypeindex){
				var from 	= serviceTypeindex;
				var to		= 0;
				
				//True:Delete Service Type
				//False: Delete Whole Area Type
				if($scope.surveyData[areaIndex].serviceTypes.length>1){
					var rest = $scope.surveyData[areaIndex].serviceTypes.slice((to || from) + 1 || $scope.surveyData[areaIndex].serviceTypes.length);
					$scope.surveyData[areaIndex].serviceTypes.length = from < 0 ? $scope.surveyData[areaIndex].serviceTypes.length + from : from;
					$scope.surveyData[areaIndex].serviceTypes.push.apply($scope.surveyData[areaIndex].serviceTypes, rest);
				}
				else{
					from = areaIndex;
					var rest = $scope.surveyData.slice((to || from) + 1 || $scope.surveyData.length);
					$scope.surveyData.length = from < 0 ? $scope.surveyData.length + from : from;
					$scope.surveyData.push.apply($scope.surveyData, rest);
				}
				
			};
			
			$scope.edit = function(areaIndex, serviceTypeindex){
				
			};
			
		}
	};
});
