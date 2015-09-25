function LabsController($scope,$state,Notification,FileUploader,$http,context,ErrorUtils,$filter, $modal,modelService,CONSTANTS){
	
}


angular.module('labs',['ngAnimate','ui.router','ui-notification','angularFileUpload','ng.httpLoader','model.service','angularFileUpload'])
	.controller('LabsController',['$scope','$state','Notification','FileUploader','$http','MachineService','context','ErrorUtils','$filter', '$modal','modelService','FileUploader','CONSTANTS',LabsController])
	