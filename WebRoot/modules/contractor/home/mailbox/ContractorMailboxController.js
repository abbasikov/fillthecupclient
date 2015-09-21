function NewMessageController($scope,$state,$modal,$modalInstance,LoginUserUuid,AllEmployeesService,MessageService,Notification,ErrorUtils){
	
	$scope.email = {
		To :'',
		From :'',
		Subject :'',
		Body :'',
	};
	$scope.allEmployees = [];
	$scope.allCompanies = [];
	$scope.emailTo = '';// get email from input field
	
	var employees = AllEmployeesService.get();
	employees.$promise.then(
			function(data){
				if(data.meta.code == 200){
					for(index in data.dataList){
						$scope.allEmployees.push(data.dataList[index]);
						$scope.allCompanies[index] = $scope.allEmployees[index].company;
					}
					console.log("All Employees - ",$scope.allEmployees);
					console.log("All Companies - ",$scope.allCompanies);
				}
				else{
					Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
				}
			},
			function(error){
				Notification.error({message: "Some error occurred. Please try again later.", title: 'Error'});
			}
	);
	
	$scope.sendMessage = function(){
		if($scope.validate()){
			
			for(index in $scope.allEmployees){
				if($scope.emailTo.originalObject.uuid == $scope.allEmployees[index].company.uuid){
						
					$scope.email.To = $scope.allEmployees[index].uuid;

					console.log($scope.emailTo.originalObject.uuid);
					console.log($scope.allEmployees[index].company.uuid);
					console.log($scope.allEmployees[index].uuid);
					console.log($scope.email.To);

					break;
				}
			}
			
			$scope.email.From = LoginUserUuid.uuid;
			
			var data = "fromUuid="+$scope.email.From+"&toUuid="+$scope.email.To+
						"&subject="+$scope.email.Subject+"&body="+$scope.email.Body+
						"&messageStatus=read";
			
			var send = MessageService.save(data);
			
			send.$promise.then(
					function(data){
						console.log(data);
						if(data.meta.code == 200){
							Notification.success({message: 'Your Message has been sent', title: 'Success'});
							$modalInstance.dismiss('cancel');
						}
						else{
							Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
						}
					},
					function(error){
						Notification.error({message: "Some error occurred. Please try again later.", title: 'Error'});
					});
		}
		else{
			Notification.error({message: $scope.errorMessage, title: 'Error'});
		}
		//$modalInstance.dismiss('cancel'); // automatically closing the popup of compose message
	}
	$scope.validate = function(){

		if($scope.emailTo == undefined || $scope.emailTo == ''){
			Notification.error({message:'Email is required', title: 'Error'});
			return false;
		}

		if($scope.email.Subject == undefined || $scope.email.Subject == ''){
			Notification.error({message:'Subject is required', title: 'Error'});
			return false;
		}

		if($scope.email.Body == undefined || $scope.email.Body == ''){
			Notification.error({message:'Please Write Message', title: 'Error'});
			return false;
		}

		return true;
	};
	
	$scope.discard = function(){
		$modalInstance.dismiss('cancel');
	}
}

function ContractorMailboxController($scope,$state,$modal,context,AllEmployeesService,MessageService,Notification,ErrorUtils,context){
	
	$scope.profileObject = context.getEmployee();
	
	$scope.showLoading = false;
	
	$scope.globalCheck = false;
	
	$scope.getInboxMessages = function(){
		
		var inbox = MessageService.get({id:$scope.profileObject.uuid,messageType:'inbox'});
		
		$scope.toggleLoading();//Show loading
		
		inbox.$promise.then(
				function(data){
					$scope.inboxMessages = [];
					
					$scope.toggleLoading();
					if(data.meta.code == 200){
						for(index in data.dataList){
							//inject new checkbox field before inserting in array
							data.dataList[index].checked=false;
							
							$scope.inboxMessages.push(data.dataList[index]);
						}
						
					}
					else{
						Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
					}
				},
				function(error){
					$scope.toggleLoading();
					Notification.error({message: "Some error occurred. Please try again later.", title: 'Error'});
				}
		);
	};
	
	
	$scope.getSentMessages = function(){
		
		var sentbox = MessageService.get({id:$scope.profileObject.uuid,messageType:'sent'});
		
		$scope.toggleLoading();//Show loading
		
		sentbox.$promise.then(
				function(data){
					$scope.toggleLoading();//Show loading
					$scope.sentboxMessages = [];
					
					if(data.meta.code == 200){
						for(index in data.dataList){
							//inject new checkbox field before inserting in array
							data.dataList[index].checked=false;
							
							$scope.sentboxMessages.push(data.dataList[index]);
						}
					}
					else{
						Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
					}
				},
				function(error){
					$scope.toggleLoading();//Show loading
					
					Notification.error({message: "Some error occurred. Please try again later.", title: 'Error'});
				}
		);
	};
	
	$scope.getTrashMessages = function(){
		var trashbox = MessageService.get({id:$scope.profileObject.uuid,messageType:'trash'});
		
		$scope.toggleLoading();//Show loading
		
		trashbox.$promise.then(
				function(data){
					$scope.toggleLoading();//Show loading
					$scope.trashMessages = [];
					
					if(data.meta.code == 200){
						for(index in data.dataList){
							//inject new checkbox field before inserting in array
							data.dataList[index].checked=false;
							
							$scope.trashMessages.push(data.dataList[index]);
						}
					}
					else{
						Notification.error({message:ErrorUtils.getMessageByMetadata(data.meta), title: 'Error'});
					}
				},
				function(error){
					$scope.toggleLoading();//Show loading
					
					Notification.error({message: "Some error occurred. Please try again later.", title: 'Error'});
				}
		);
	}
	
	$scope.newMessage = function(){
		
		var modalInstance = $modal.open({
		      templateUrl: 'modules/contractor/home/mailbox/NewMessage.tpl.html',
		      controller : NewMessageController,
		      scope		 : $scope,
		      resolve    :{
		    	  LoginUserUuid: function () {
			            return $scope.profileObject;
			      }
		      }
		});
	};
	
	$scope.tabSwitch = function(tabNumber){
		$scope.tab = tabNumber;
		$scope.globalCheck = false;
		$scope.searchText = '';
		switch(tabNumber){
			//Get Inbox Messages
			case 1:{
				$scope.getInboxMessages();
				break;
			}
				
			//Get Sent Messages
			case 2:{
				$scope.getSentMessages();
				break;
			}	
				
			//Get trash Messages
			case 3:{
				$scope.getTrashMessages();
				break;
			}
			
		}
		
	};
	
	$scope.toggleLoading = function(){
		$scope.showLoading = ($scope.showLoading == true) ? false : true; 
	};
	
	$scope.globalCheckChange = function(){
		
		switch($scope.tab){
			//Inbox Messages
			case 1:{
				for(index in $scope.inboxMessages){
					$scope.inboxMessages[index].checked = $scope.globalCheck;
				}
				break;
			}
				
			//Sent Messages
			case 2:{
				for(index in $scope.sentboxMessages){
					$scope.sentboxMessages[index].checked = $scope.globalCheck;
				}
				break;
			}	
				
			//trash Messages
			case 3:{
				break;
			}
		
		}
	};
	
	
	$scope.removeItemFromList = function(list, index){
		var from 	= index;
		var to		= 0;
		var rest = list.slice((to || from) + 1 || list.length);
		list.length = from < 0 ? list.length + from : from;
		list.push.apply(list, rest);
	};
	
	$scope.updateMessageStatus = function(uuid,status){
		switch($scope.tab){
		//Inbox Messages
		case 1:{
			for(index in $scope.inboxMessages){
				if($scope.inboxMessages[index].uuid == uuid){
					$scope.inboxMessages[index].messageStatus = status;
					if(status == 'TRASH'){
						$scope.removeItemFromList($scope.inboxMessages,index);
					}
					break;
				}
			}
			break;
		}
			
		//Sent Messages
		case 2:{
			for(index in $scope.sentboxMessages){
				if($scope.sentboxMessages[index].uuid == uuid){
					$scope.sentboxMessages[index].messageStatus = status;
					if(status == 'TRASH'){
						$scope.removeItemFromList($scope.sentboxMessages,index);
					}
					break;
				}
			}
			break;
		}	
			
		//trash Messages
		case 3:{
			break;
		}
	
	}
	}
	
	
	$scope.callMessageUpdateService = function(uuid,status){
		var data = "names=messageStatus"+"&"+"values="+status;
		var update = MessageService.update({id:uuid},data);
		update.$promise.then(function(data){
			if(data.meta.code == 200){
				$scope.updateMessageStatus(data.data.uuid,status);
			}
		},
		function(error){
			console.log(error);
		});
	}
	
	
	$scope.markReadGlobal = function(){
		switch($scope.tab){
			//Inbox Messages
			case 1:{
				for(index in $scope.inboxMessages){
					//Change the status if message is checked and 'UNREAD'
					if($scope.inboxMessages[index].checked == true && $scope.inboxMessages[index].messageStatus == 'UNREAD'){
						
						//Call REST service to update message
						$scope.callMessageUpdateService($scope.inboxMessages[index].uuid,'READ');
					}
					
				}
				break;
			}
				
			//Sent Messages
			case 2:{
				for(index in $scope.sentboxMessages){
					//Change the status if message is checked and 'UNREAD'
					if($scope.sentboxMessages[index].checked == true && $scope.sentboxMessages[index].messageStatus == 'UNREAD'){
						
						//Call REST service to update message
						$scope.callMessageUpdateService($scope.sentboxMessages[index].uuid,'READ');
					}
				}
				break;
			}	
				
			//trash Messages
			case 3:{
				break;
			}
	
		}
	};
	
	$scope.markUnReadGlobal = function(){
		switch($scope.tab){
			//Inbox Messages
			case 1:{
				for(index in $scope.inboxMessages){
					//Change the status if message is checked and 'READ'
					if($scope.inboxMessages[index].checked == true && $scope.inboxMessages[index].messageStatus == 'READ'){
						
						//Call REST service to update message
						$scope.callMessageUpdateService($scope.inboxMessages[index].uuid,'UNREAD');
					}
					
				}
				break;
			}
				
			//Sent Messages
			case 2:{
				for(index in $scope.sentboxMessages){
					//Change the status if message is checked and 'READ'
					if($scope.sentboxMessages[index].checked == true && $scope.sentboxMessages[index].messageStatus == 'READ'){
						
						//Call REST service to update message
						$scope.callMessageUpdateService($scope.sentboxMessages[index].uuid,'UNREAD');
					}
				}
				break;
			}	
				
			//trash Messages
			case 3:{
				break;
			}

		}
	};
	
	$scope.moveTrashGlobal = function(){
		switch($scope.tab){
		//Inbox Messages
		case 1:{
			for(index in $scope.inboxMessages){
				//Change the status if message is checked
				if($scope.inboxMessages[index].checked == true){
					
					//Call REST service to update message
					$scope.callMessageUpdateService($scope.inboxMessages[index].uuid,'TRASH');
				}
				
			}
			break;
		}
			
		//Sent Messages
		case 2:{
			for(index in $scope.sentboxMessages){
				//Change the status if message is checked 
				if($scope.sentboxMessages[index].checked == true){
					
					//Call REST service to update message
					$scope.callMessageUpdateService($scope.sentboxMessages[index].uuid,'TRASH');
				}
			}
			break;
		}	
			
		//trash Messages
		case 3:{
			break;
		}

	}
	};
	
	
	//Get inbox messages on controller load.
	$scope.getInboxMessages();
}


angular.module('contractor.home.mailbox',['ngAnimate','ui.router','ui-notification','angularFileUpload'])
	.controller('ContractorMailboxController',['$scope','$state','$modal','context','AllEmployeesService','MessageService','Notification','ErrorUtils','context',ContractorMailboxController]);
