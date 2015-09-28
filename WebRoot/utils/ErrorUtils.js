angular.module('error.utils',[])
	.factory('ErrorUtils',function(){
		
		var errorObj = {
						'1000':'Email already exists',
						'1001':'Blank field not allowed',
						'1002':'User not found',
						'1003':'Invalid credentials',
						'1004':'Internal server error',
						'1005':'Invalid business object type',
						'1006':'Missing annotation',
						'1007':'Invalid request',
						'1008':'Length not equal',
						'1009':'Business object not found',
						'1010':'Invalid path key. File upload failed',
						'1015':'Username already exists.'
					};
		
		var service = {
				getMessageByMetadata:function(meta){
					try{
						//If code is not found return detail message.
						if(errorObj[meta.code] == undefined)
							return meta.details;
						else
							return errorObj[meta.code];
					}
					catch(err){
						return err.message;
					}
				}
				
		};
		
		return service;
	});