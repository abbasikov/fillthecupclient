function ReleaseCupDetailController($scope,$stateParams,$state,Notification,loadContext,ErrorUtils,context,$timeout,ReleasesService,UpdateObjectService,ReleasesCupService,uiGridConstants,$filter){
	
	$scope.mtOverlay 			= false;
	$scope.mtLoading 			= false;
	$scope.ocOverlay			= false;
	$scope.ocLoading			= false;
	$scope.rpOverlay			= false;
	$scope.rpLoading			= false;
	$scope.bgOverlay			= false;
	$scope.bgLoading			= false;
	
	$scope.releaseCupUuid		= $stateParams.id;
	$scope.selectedReleaseCup	= null;
	$scope.$parent.navsection	= $stateParams.id;
	$scope.gridApi				= null;
	$scope.showDeleteButton		= false;
	$scope.occupiedPercentageData = [];
	$scope.remainingPercentageData= [];
	$scope.twoGraphs = {
			occupiedPercentageData 	: [],
			remainingPercentageData : []
	};
	
	$scope.ipmView  	= false;
	$scope.detailView 	= true;
	
	
	
	$scope.barGraphData 			= [];
	
	$scope.ipmArray = [ { id: 'IPM1', ipm: 'IPM1' },{ id: 'IPM2', ipm: 'IPM2' },{ id: 'IPM3', ipm: 'IPM3' },{ id: 'IPM4', ipm: 'IPM4' }];
	
	$scope.colorListOccupied   	= ["#3c8dbc", "#f56954", "#00a65a",'#8A2BE2',"#31C0BE","#c7254e",'#5F9EA0','#6495ED','#DC143C','#00008B',"#f56954", '#483D8B','#483D8B','#483D8B'];
	$scope.colorListRemaining   = ["#3c8dbc", "#f56954", "#00a65a",'#8A2BE2',"#31C0BE","#c7254e",'#5F9EA0','#6495ED','#DC143C','#00008B',"#f56954", '#483D8B','#483D8B','#483D8B'];
	
	$scope.gridOptions = {
			
			enableSorting  	: true,
			enableRowSelection: true,
			showGridFooter: true,
		    showColumnFooter: true,
			columnDefs 		: [],
			data			: []
	};
	$scope.resize = true;
	
	$scope.updateMatrix = function(){
		var names 	= "names=matrixJson";
		$scope.selectedReleaseCup.matrix.data = $scope.gridOptions.data;
		var values 	= "values="+encodeURIComponent(angular.toJson($scope.selectedReleaseCup.matrix));
		var data = "uuid="+$scope.selectedReleaseCup.uuid+"&"+names+"&"+values+"&"+"delimiter=;;;";
		var update = UpdateObjectService.save(data);
		update.$promise.then(
				function(data){
					if(data.meta.code != 200){
						Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
					}
					$scope.rePopulatebarGraphData();
					console.log("Response: ",data);
				},
				function(error){
					console.log("Error: ",error);
				});
	};
	
	$scope.$on('uiGridEventEndCellEdit', function (data) {
		$scope.updateMatrix();
	    
	});
	
	$scope.getReleaseCup = function(){
		var req = ReleasesCupService.get({id:$scope.releaseCupUuid});
		$scope.toggleMtLoading();
		req.$promise.then(
				function(data){
					$scope.toggleMtLoading();
					if(data.meta.code == 200){
						$scope.selectedReleaseCup = data.data;
						console.log("selectedReleaseCup : ",$scope.selectedReleaseCup);
						
						$scope.pushDataInGrid();
						setTimeout(function(){
							$('#idGraphBtn').click();
						},1000);
						$scope.updateLastClicked();
						
					}
					else{
						$scope.toggleMtLoading();
						Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
					}
					
				},
				function(error){
					console.log("Error: ",error);
				});
	};
	
	$scope.deleteRow = function(){
		if($scope.gridApi.selection.getSelectedRows().length > 0){
			for(index in $scope.gridApi.selection.getSelectedRows()){
				var indexToDel = $scope.gridOptions.data.indexOf($scope.gridApi.selection.getSelectedRows()[index]);
				$scope.deleteItemFromList(indexToDel);
			}
		}
		
	};
	
	$scope.deleteItemFromList = function(index){
		var from 	= index;
		var to		= 0;
		var rest = $scope.gridOptions.data.slice((to || from) + 1 || $scope.gridOptions.data.length);
		$scope.gridOptions.data.length = from < 0 ? $scope.gridOptions.data.length + from : from;
		$scope.gridOptions.data.push.apply($scope.gridOptions.data, rest);
		$scope.updateMatrix();
	};
	
	$scope.addRow = function(){
		var dataObj = { };
		for(i in $scope.selectedReleaseCup.matrix.columns){
			var columName = $scope.selectedReleaseCup.matrix.columns[i].name;
			dataObj[columName] = "";
		}
		$scope.gridOptions.data.push(dataObj);
		$scope.updateMatrix();
	};
	
	$scope.showIPMView = function(){
		$scope.ipmView 		= true;
		$scope.detailView 	= false;
	};
	
	$scope.showDetailView = function(){
		$scope.ipmView 		= false;
		$scope.detailView 	= true;
		//$state.go("home.releasecupdetail",{id:'RELCP-E93F2C65-0688'});
	};
	
	
	 $scope.gridOptions.onRegisterApi = function(gridApi){
		 
	      //set gridApi on scope
	      $scope.gridApi = gridApi;
	      gridApi.selection.on.rowSelectionChanged($scope,function(row){
	        $scope.showDeleteButton = row.isSelected;
	      });
	      
	      gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
	          console.log("afterCellEdit");  
	    	  $scope.$apply();
	      });
	 
//	      gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
//	        var msg = 'rows changed ' + rows.length;
//	        alert("row changed");
//	        $log.log(msg);
//	      });
	};
	
	$scope.pushDataInGrid = function(){
		$scope.selectedReleaseCup.matrix = JSON.parse($scope.selectedReleaseCup.matrix);
		$scope.gridOptions.columnDefs  	= $scope.selectedReleaseCup.matrix.columns;
		$scope.gridOptions.data  		=  $scope.selectedReleaseCup.matrix.data;
		
		//Iterate thru each colum
		for(i in $scope.gridOptions.columnDefs){
			$scope.gridOptions.columnDefs[i].enableCellEdit = true;
			$scope.gridOptions.columnDefs[i].enableCellEdit = true;
			if($scope.gridOptions.columnDefs[i].name == "MVPs" ){
				$scope.gridOptions.columnDefs[i].type	 		= "text";
			}
			else if($scope.gridOptions.columnDefs[i].name == "IPM"){
				$scope.gridOptions.columnDefs[i].type	 				= "text";
				$scope.gridOptions.columnDefs[i].editableCellTemplate 	= 'ui-grid/dropdownEditor';
				//$scope.gridOptions.columnDefs[i].cellFilter 			= 'mapIPM';
				$scope.gridOptions.columnDefs[i].editDropdownValueLabel	= 'ipm';
				$scope.gridOptions.columnDefs[i].editDropdownOptionsArray= $scope.ipmArray;
			}
			else{
				$scope.gridOptions.columnDefs[i].type	 		= "number";
				$scope.gridOptions.columnDefs[i].aggregationType = uiGridConstants.aggregationTypes.sum;
				$scope.gridOptions.columnDefs[i].footerCellTemplate = $scope.footerCellTempateFunc();
			}
				
			$scope.gridOptions.columnDefs[i].cellClass		= 'grid-text-align';
			$scope.gridOptions.columnDefs[i].headerCellClass		= 'grid-text-align grid-header';
		}//end-for-loop
		
		$scope.gridOptions.showGridFooter = false;
	};
	
	
	
	
	$scope.footerCellTempateFunc = function(){
		var template = '<div class="ui-grid-cell-contents" id="{{col.uid}}" col-index="renderIndex"><div">Total:&nbsp;{{col.getAggregationValue()}}</div></div>';
		return template;
	};
	
	$scope.toggleMtLoading = function(){
		if($scope.mtOverlay){
			$scope.mtOverlay = false;
			$scope.mtLoading = false;
		}
		else{
			$scope.mtOverlay = true;
			$scope.mtLoading = true;
		}
	};
	
	$scope.toggleOcLoading = function(){
		if($scope.ocOverlay){
			$scope.ocOverlay			= false;
			$scope.ocLoading			= false;	
		}
		else{
			$scope.ocOverlay			= true;
			$scope.ocLoading			= true;
		}	
	};
	
	$scope.toggleRpLoading = function(){
		if($scope.rpOverlay){
			$scope.rpOverlay			= false;
			$scope.rpLoading			= false;	
		}
		else{
			$scope.rpOverlay			= true;
			$scope.rpLoading			= true;
		}
		
	};
	
	$scope.toggleBgLoading = function(){
		if($scope.bgOverlay){
			$scope.bgOverlay			= false;
			$scope.bgLoading			= false;
		}
		else{
			$scope.bgOverlay			= true;
			$scope.bgLoading			= true;
		}		
	};
	
	$scope.graphFormatter = function(input){
		try{
			var number  =$filter('number')( input, 2) + "";
			var dotIndex = number.indexOf(".");
			if(dotIndex>0){
				if(number.charAt(dotIndex+1) == '0' && number.charAt(dotIndex+2) == '0')
					return Math.round(number)+"%";
			}
			return number+"%";
		}
		catch(err){
			return input+"%";
		}
		
	};
	
	$scope.graphFormatter = function(input,suffix){
		try{
			var number  =$filter('number')( input, 2) + "";
			var dotIndex = number.indexOf(".");
			if(dotIndex>0){
				if(number.charAt(dotIndex+1) == '0' && number.charAt(dotIndex+2) == '0')
					return Math.round(number)+suffix;
			}
			return number+suffix;
		}
		catch(err){
			return input+suffix;
		}
		
	};
	
	$scope.rePopulateDonutGraphData = function(){
		
		$scope.twoGraphs.occupiedPercentageData = [];
		$scope.twoGraphs.remainingPercentageData=[];
		
		//For Occupied
		for(var i=2;i<$scope.gridOptions.columnDefs.length;i++){
			var occObj = {label:'', value:''};
			var remObj = {label:'', value:''};
			
			occObj.label = $scope.gridOptions.columnDefs[i].name;
			remObj.label = $scope.gridOptions.columnDefs[i].name;
			
			var devDays = parseInt($scope.selectedReleaseCup.devDays);
			var gridApiColIndex= -1;
			
			//Find aggregation value of colum  occObj.label
			for(j in $scope.gridApi.grid.columns){
				if($scope.gridApi.grid.columns[j].name == occObj.label){
					gridApiColIndex = j;
					break;					
				}
			}
			
			//Calculating Percentage
			var aggregateValue 		= $scope.gridApi.grid.columns[gridApiColIndex].getAggregationValue();
			var percentValOcc		= (aggregateValue/devDays)*100;
			var percentValRem		= ((devDays-aggregateValue)/devDays)*100;
			
			occObj.value = percentValOcc;
			remObj.value = percentValRem;
			
			console.log("OP "+occObj.label+" :  aggregateValue: "+aggregateValue+", devDays:"+devDays+", Percent:"+occObj.value);
			$scope.twoGraphs.occupiedPercentageData.push(occObj);
			$scope.twoGraphs.remainingPercentageData.push(remObj);		
			
		}
		
	};
	
	$scope.rePopulatebarGraphData = function(){
		
		//For Best User Experience
//		$scope.toggleBgLoading();
//		$timeout(function(){
//			$scope.toggleBgLoading();
//		},2000);
		$scope.barGraphData 			= [];
		
		for(var i=2;i<$scope.gridOptions.columnDefs.length;i++){
			var comObj 			= {component:'', occ:'', rem:''};
			comObj.component 	= $scope.gridOptions.columnDefs[i].name;
			
			var devDays = parseInt($scope.selectedReleaseCup.devDays);
			var gridApiColIndex= -1;
			
			//Find aggregation value of colum  occObj.label
			for(j in $scope.gridApi.grid.columns){
				if($scope.gridApi.grid.columns[j].name == comObj.component){
					gridApiColIndex = j;
					break;					
				}
			}
			
			//Calculating Percentage
			var aggregateValue 		= $scope.gridApi.grid.columns[gridApiColIndex].getAggregationValue();
			var percentValOcc		= (aggregateValue/devDays)*100;
			var percentValRem		= ((devDays-aggregateValue)/devDays)*100;
			
			comObj.occ = $scope.graphFormatter(percentValOcc,"");
			comObj.rem = $scope.graphFormatter(percentValRem,"");
			
			$scope.barGraphData.push(comObj);		
		}
		
	};
	
	$scope.updateLastClicked = function(){
		var currentDate = new Date();
		var names 	= "names=lastClicked";
		var values 	= "values="+currentDate.toISOString();
		var data = "uuid="+$scope.selectedReleaseCup.uuid+"&"+names+"&"+values+"&"+"delimiter=;;;";
		var update = UpdateObjectService.save(data);
		update.$promise.then(
				function(data){
					console.log("Response LastClick: ",data);
				},
				function(error){
					console.log("Error: ",error);
				});
	};
	
	$scope.getReleaseCup();
}


angular.module('releasecupdetail',['ngAnimate','ui.router','ui-notification'])
	.controller('ReleaseCupDetailController',['$scope','$stateParams','$state','Notification','loadContext','ErrorUtils','context','$timeout','ReleasesService','UpdateObjectService','ReleasesCupService','uiGridConstants','$filter',ReleaseCupDetailController]);
	