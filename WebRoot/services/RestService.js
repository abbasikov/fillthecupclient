angular.module('rest.service',['ngResource'])
	.constant("CONSTANTS", {
		"BASE_REST_URL"	: "http://localhost:9090/fillthecupserver",
		"DATE_FORMAT"	: "DD MMM YYYY hh:mm A"			
	})
	.factory('ReleasesCupByLabService',function($resource,CONSTANTS){
		var data = $resource(CONSTANTS.BASE_REST_URL+'/rest/public/labs/:id/releasecups',{id:'@id'},{
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
	.factory('IPMService',function($resource,CONSTANTS){
		var data = $resource(CONSTANTS.BASE_REST_URL+'/rest/public/releasecups/:id/ipms',{id:'@id'},{
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
	.factory('ReleasesCupService',function($resource,CONSTANTS){
		var data = $resource(CONSTANTS.BASE_REST_URL+'/rest/public/releasecups/:id',{id:'@id'},{
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
	.factory('ReleasesService',function($resource,CONSTANTS){
		var data = $resource(CONSTANTS.BASE_REST_URL+'/rest/public/releases',{},{
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
	.factory('DeleteBusinessObject',function($resource,CONSTANTS){
		var data = $resource(CONSTANTS.BASE_REST_URL+'/rest/public/deletebusinessobject',{},{
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
