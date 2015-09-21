function config($stateProvider, $urlRouterProvider,$httpProvider){
	
	$stateProvider
		.state("login",{
			url			:"/login",
			templateUrl	:"modules/login/Login.tpl.html",
			controller	: LoginController
		})
		.state("signout",{
			url			:"/login",
			templateUrl	:"modules/login/Login.tpl.html",
			controller	: LoginController
		})
		.state("register",{
			url			:"/register",
			templateUrl	:"modules/register/Register.tpl.html",
			controller	: RegisterController
		})
		.state("passwordreset",{
			url			:"/passwordreset",
			templateUrl	:"modules/passwordreset/PasswordReset.tpl.html",
			controller	: PasswordResetController
		})
		.state("passwordchange",{
			url			:"/passwordchange",
			templateUrl	:"modules/passwordchange/PasswordChange.tpl.html",
			controller	: PasswordChangeController
		})
		.state("admin",{
			url			:"/admin",
			templateUrl	:"modules/admin/Admin.tpl.html",
			controller	: AdminController
		})
		.state("admin.users",{
			url			:"/users",
			templateUrl	:"modules/admin/users/Users.tpl.html",
			controller	: UsersController
		})
		.state("contractor",{
			url			:"/contractor",
			templateUrl	:"modules/contractor/Contractor.tpl.html",
			controller	: ContractorController
		})
		.state("contractor.home",{
			url			:"/home",
			templateUrl	:"modules/contractor/home/ContractorHome.tpl.html",
			controller	: ContractorHomeController
		})
		.state("contractor.home.allprojects",{
			url			:"/allprojects",
			templateUrl	:"modules/contractor/home/allprojects/ContractorAllProjects.tpl.html",
			controller	: ContractorAllProjectsController
		})
		.state("contractor.home.paymentinfo",{
			url			:"/paymentinfo",
			templateUrl	:"modules/contractor/home/paymentinfo/ContractorPaymentInfo.tpl.html",
			controller	: ContractorPaymentInfoController
		})
		.state("contractor.home.reports",{
			url			:"/reports",
			templateUrl	:"modules/contractor/home/reports/ContractorReports.tpl.html",
			controller	: ContractorReportsController
		})
		.state("contractor.home.settings",{
			url			:"/settings",
			templateUrl	:"modules/contractor/home/settings/ContractorSettings.tpl.html",
			controller	: ContractorSettingsController
		})
		.state("contractor.home.mailbox",{
			url			:"/mailbox",
			templateUrl	:"modules/contractor/home/mailbox/ContractorMailbox.tpl.html",
			controller	: ContractorMailboxController
		})
		.state("contractor.project",{
			url			:"/project",
			templateUrl	:"modules/contractor/project/ContractorProject.tpl.html",
			controller	: ContractorProjectController
		})
		.state("supplier",{
			url			:"/supplier",
			templateUrl	:"modules/supplier/Supplier.tpl.html",
			controller	: SupplierController
		})
		.state("supplier.machines",{
			url			:"/machines",
			templateUrl	:"modules/supplier/machines/Machines.tpl.html",
			controller	: MachinesController
		})
		.state("supplier.chemicals",{
			url			:"/chemicals",
			templateUrl	:"modules/supplier/chemicals/Chemicals.tpl.html",
			controller	: ChemicalsController
		})
		.state("supplier.toolsandconsumables",{
			url			:"/toolsandconsumables",
			templateUrl	:"modules/supplier/toolsandconsumables/ToolsAndConsumables.tpl.html",
			controller	: ToolsAndConsumablesController
		})
		.state("mobilenotsuported",{
			url			:"/mobilenotsupported",
			templateUrl	:"templates/not_suported.tpl.html"
		});
	
		//Registering interceptor for showing loading on each ajax request
		$httpProvider.interceptors.push('myHttpInterceptor');
	
}

angular.module('eEstimateApp',['ngImgCrop','angucomplete','ui.router', 'ngAnimate','ngResource','context.service','login','rest.service','error.utils','ngCookies','xeditable','ui.bootstrap','model.service','ngTagsInput','cleanestimate.directives','cleanestimate.filters'])
	.config(config)
	.factory('myHttpInterceptor', function($q) {
	    return {
	      // optional method
	      'request': function(config) {
	        // do something on success
	    	$("#spinner").show();
	    	return config;
	      },
	
	      // optional method
	     'requestError': function(rejection) {
	        // do something on error
	    	 $("#spinner").hide();
	     },
	
	
	
	      // optional method
	      'response': function(response) {
	        // do something on success
	    	  $("#spinner").hide();
	    	  
	        return response;
	      },
	
	      // optional method
	     'responseError': function(rejection) {
	        // do something on error
	    	 $("#spinner").hide();
	    	 
	      }
	    };
	})
	.run(['$state','loadContext','$cookies',function($state,loadContext,$cookies){
			var model = loadContext.loadContext();
			
			if(model == undefined){
				//re-route to login
				$state.go("login");
			}
			else{
				//re-route to home
				$state.go("home");
			}
	}]);