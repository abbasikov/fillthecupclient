angular.module('context.service',[])
	.factory('context',function(){
		
		var Context = (function(){
			
			var instance = null;
			
			function init(){
				var _employee		= null;
				
				return {
					setEmployee	: function(model){
						_employee = model;
					},
					getEmployee	: function(){
						return _employee;
					},
					clearContext : function(){
						this.setEmployee(null);
					}
				};
			}
			
			return {
				getInstance: function(){
					if(!instance){
						instance = init();
					}
					
					return instance;
				}
			};
		})();
		
		
		var service = {
				
				clearContext : function(){
					Context.getInstance().clearContext();
					return Context.getInstance();
				},
				getEmployee	: function(){
					return Context.getInstance().getEmployee();
				},
				setEmployee	: function(model){
					Context.getInstance().setEmployee(model);
				},
				isReady		: function(){
					return (this.getEmployee() != null);
				}
				
		};
		
		return service;
	})
	.factory('loadContext',['context','$state',function(context,$state){
		var service = {
			loadContext : function(){
				if(context.isReady()){
					if(window.console){
						console.log("Context is ready!!!");
					}
					return context;	
				}
				else{
					if(window.console){
						console.log("Context is not ready. Getting employee from session storage");
					}
					
					if(sessionStorage.getItem("employee") != null){
						try{
							context.setEmployee($.parseJSON(sessionStorage.getItem("employee")));
						}
						catch(err){
							console.log(err.message);
							return null;
						}
					}
					else{
						if(window.console)
							console.log("Employee not found in session storage. Login again.");
					}
					return null;
				}
			},
			redirectToHomePage : function(){
				if(context.isReady()){
					
					//If Supplier, redirect to supplier home page.
					//If Contractor, redirect to contractor home page.
					if(context.getEmployee().company.companyType == "Supplier"){
						$state.go("supplier.machines");
					}
					else if(context.getEmployee().company.companyType == "Contractor"){
						$state.go("contractor.home.allprojects");
					}
					
					
				}
				else{
					console.log("Unable to redirect. Context not found.");
				}
			}
		};
		return service;
	}]);