angular.module('rest.service',['ngResource'])
	.constant("CONSTANTS", {
	    "BASE_REST_URL"	: "http://jbossews-abbasikov.rhcloud.com/fillthecupserver",
		"DATE_FORMAT"	: "DD MMM YYYY hh:mm A"
	    	
	})
	.factory('SysComponentService',function($resource,CONSTANTS){
		var data = $resource(CONSTANTS.BASE_REST_URL+'/rest/public/systemcomponents',{},{
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
	.factory('DeleteSysComponentService',function($resource,CONSTANTS){
		var data = $resource(CONSTANTS.BASE_REST_URL+'/rest/public/deletesystemcomponent',{},{
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
	.factory('UpdateObjectService',function($resource,CONSTANTS){
		var data = $resource(CONSTANTS.BASE_REST_URL+'/rest/public/updateobject',{},{
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
	.factory('DeleteLabService',function($resource,CONSTANTS){
		var data = $resource(CONSTANTS.BASE_REST_URL+'/rest/public/deletelab',{},{
			save:{
				method:'POST',
				headers:{'Content-Type':'application/x-www-form-urlencoded '}
			}
		});
		
		return data;
	})
	.factory('LabService',function($resource,CONSTANTS){
		var data = $resource(CONSTANTS.BASE_REST_URL+'/rest/public/labs',{},{
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
	});
