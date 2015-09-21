angular.module('rest.service',['ngResource'])
	.constant("CONSTANTS", {
	    //"BASE_REST_URL": "http://localhost:9090/eestimateserver",
		"BASE_REST_URL"	: "https://clean-estimatex.rhcloud.com/eestimateserver",
		"DATE_FORMAT"	: "DD MMM YYYY hh:mm A"
	    	
	})
	.factory('RegisterService',function($resource,CONSTANTS){
		var data = $resource(CONSTANTS.BASE_REST_URL+'/rest/public/register',{},{
			save:{
				method:'POST',
				headers:{'Content-Type':'application/x-www-form-urlencoded '}
			}
		});
		
		return data;
	})
	.factory('PasswordResetService',function($resource,CONSTANTS){
		var data = $resource(CONSTANTS.BASE_REST_URL+'/rest/public/passwordreset',{},{
			save:{
				method:'POST',
				headers:{'Content-Type':'application/x-www-form-urlencoded '}
			}
		});
		
		return data;
	})
	.factory('PasswordChangeService',function($resource,CONSTANTS){
		var data = $resource(CONSTANTS.BASE_REST_URL+'/rest/public/passwordchange',{},{
			save:{
				method:'POST',
				headers:{'Content-Type':'application/x-www-form-urlencoded '}
			}
		});
		
		return data;
	})
	.factory('LoginService',function($resource,CONSTANTS){
		var data = $resource(CONSTANTS.BASE_REST_URL+'/rest/public/login',{},{
			save:{
				method:'POST',
				headers:{'Content-Type':'application/x-www-form-urlencoded '}
			}
		});
		
		return data;
	})
	.factory('AllEmployeesService',function($resource,CONSTANTS){
		var data = $resource(CONSTANTS.BASE_REST_URL+'/rest/public/employees',{},{
			save:{
				method:'POST',
				headers:{'Content-Type':'application/x-www-form-urlencoded '}
			}
		});
		
		return data;
	})
	.factory('ChemicalService',function($resource,CONSTANTS){
		var data = $resource(CONSTANTS.BASE_REST_URL+'/rest/public/suppliers/chemicals/:id',{id:'@id'},{
			save:{
				method:'POST',
				headers:{'Content-Type':'application/x-www-form-urlencoded '}
			},
			update:{
				method:'PUT',
				headers:{'Content-Type':'application/x-www-form-urlencoded '}
			}
		});
		
		return data;
	})
	.factory('ToolsService',function($resource,CONSTANTS){
		var data = $resource(CONSTANTS.BASE_REST_URL+'/rest/public/suppliers/tools/:id',{id:'@id'},{
			save:{
				method:'POST',
				headers:{'Content-Type':'application/x-www-form-urlencoded '}
			},
			update:{
				method:'PUT',
				headers:{'Content-Type':'application/x-www-form-urlencoded '}
			}
		});
		
		return data;
	})
	.factory('MachineService',function($resource,CONSTANTS){
		var data = $resource(CONSTANTS.BASE_REST_URL+'/rest/public/suppliers/machines/:id',{id:'@id'},{
			save:{
				method:'POST',
				headers:{'Content-Type':'application/x-www-form-urlencoded '}
			},
			update:{
				method:'PUT',
				headers:{'Content-Type':'application/x-www-form-urlencoded '}
			}
		});
		
		return data;
	})
	.factory('ProjectService',function($resource,CONSTANTS){
		var data = $resource(CONSTANTS.BASE_REST_URL+'/rest/public/contractors/projects/:id',{id:'@id'},{
			save:{
				method:'POST',
				headers:{'Content-Type':'application/x-www-form-urlencoded '}
			},
			update:{
				method:'PUT',
				headers:{'Content-Type':'application/x-www-form-urlencoded '}
			}
		});
		
		return data;
	})
	.factory('SurveyDataService',function($resource,CONSTANTS){
		var data = $resource(CONSTANTS.BASE_REST_URL+'/rest/public/contractors/projects/surveyJson',{},{
			save:{
				method:'POST',
				headers:{'Content-Type':'application/x-www-form-urlencoded '}
			}
		});
		
		return data;
	})
	.factory('MessageService',function($resource,CONSTANTS){
		var data = $resource(CONSTANTS.BASE_REST_URL+'/rest/public/messages/:id',{id:'@id'},{
			save:{
				method:'POST',
				headers:{'Content-Type':'application/x-www-form-urlencoded '}
			},
			update:{
				method:'PUT',
				headers:{'Content-Type':'application/x-www-form-urlencoded '}
			}
		});
		
		return data;
	});
