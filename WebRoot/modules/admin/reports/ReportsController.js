function ReportsController($scope,$state,Notification,context,ErrorUtils,DeleteLabService,$modal,UpdateObjectService){
	
}


angular.module('reports',['ngAnimate','ui.router','ui-notification'])
	.controller('ReportsController',['$scope','$state','Notification','context','ErrorUtils','DeleteLabService','$modal','UpdateObjectService',ReportsController])
	