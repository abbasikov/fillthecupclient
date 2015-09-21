angular.module('model.service', [])
	.factory('modelService', function(){
		
		
		var service = {
				getChemicalsDropdowns : function(){
					var cleaningServices = [
											{
												name:'Select Cleaning Service',value:0,cleaningAreas:[],
												name:'Facade Cleaning', 	value:1,cleaningAreas:[
												                        	                       	
																									{
																										name:'Car Parking Canopy',	value:1,applications:[
																										                          	                      {name:'Canopy Cleaning',value:1}
																									                                                 ]
																									},
																									{
																										name:'Cladding Walls',		value:2,applications:[
																										                      		                      {name:'Wall Cladding',value:1}
																										                      		                      ]
																									},
																									{
																										name:'Glass',				value:3,applications:[
																										             				                      {name:'Glass Cleaning',value:1}
																										             				                      ]
																									},
																									{
																										name:'Grill',				value:4,applications:[
																										             				                      {name:'Grill Cleaning',value:1}
																										             				                      ]
																									},
																									{
																										name:'Marble Walls',		value:5, applications:[
																										                    		                       {name:'Wall Marble',value:1}
																										                    		                       ]
																									},
																									{
																										name:'Panel',				value:6, applications:[
																									              					                       {name:'Panel Cleaning',value:1}
																									              					                       ]
																									},
																									{
																										name:'Regular Walls',		value:7, applications:[
																										                     		                       {name:'Wall Cleaning',value:1}
																										                     		                       ]
																									},
																									{
																										name:'Tile Walls',			value:8,applications:[
																										                  			                      	{name:'Wall Tiles',values:1}
																										                  			                      ]}
												                        	                       ]
											},
											{
												name:'Floor Cleaning', 	value:2,cleaningAreas:[
																									{
																										name:'Carpet Floor',			value:1,  applications:[
																																							{name:'Carpet Floor-Shampooing',value:1},
																																							{name:'Carpet Floor-Spotting',value:2}
																										                    			                        ]
																									},
																									{
																										name:'Cobble-Stone',			value:2,  applications:[
																										                    			                     {name:'Cobblestone-Maintainer',value:1}
																										                    			                        ]
																									},
																									{
																										name:'Epoxy',					value:3,  applications:[
																																							{name:'Epoxy-Maintainer',value:1},
																																							{name:'Epoxy-Polishing',value:2}
																										             					                        ]
																									},
																									{
																										name:'Garbage Chute Area',		value:4,  applications:[
																																							{name:'Garbage Chute-Disinfectant',value:1},
																																							{name:'Garbage Chute-Maintainer',value:2}
																										                          		                        ]
																									},
																									{
																										name:'Granite',				value:5,  applications:[
																																							{name:'Granite-Maintainer',value:1},
																																							{name:'Granite-Polishing',value:2}
																										               				                        ]
																									},
																									{
																										name:'Lime-Stone',				value:6,  applications:[
																										                  				                    {name:'Limestone-Maintainer',value:1}
																										                  				                        ]
																									},
																									{
																										name:'Marble',					value:7,  applications:[
																																							{name:'Marble-Crystallization',value:1},
																																							{name:'Marble-Maintainer',value:2}
																										              					                        ]
																									},
																									{
																										name:'Onyx-Stone',				value:8,  applications:[
																																							{name:'OnyxStone-Maintainer',value:1},
																																							{name:'OnyxStone-Wax Polishing',value:2}
																										                  				                        ]
																									},
																									{
																										name:'Parking Floor',			value:9,  applications:[
																																							{name:'Parking Floor-Maintainer',value:1},
																																							{name:'Parking Floor-Scrubbing',value:2}
																										                     			                        ]
																									},
																									{
																										name:'Sand-Stone',				value:10, applications:[
																										                  				                    {name:'Sandstone-Maintainer',value:1}
																										                  				                        ]
																									},
																									{
																										name:'Tile',					value:11, applications:[
																																								{name:'Tile-Maintainer',value:1},
																																								{name:'Tile-Polishing',value:2},
																																								{name:'Tile-Scrubbing/Buffing',value:3}
																										            					                        ]
																									},
																									{
																										name:'Venial',					value:12, applications:[
																																								{name:'Venial-Maintainer',value:1},
																																								{name:'Venial-Wax Polishing',value:2},
																										              					                        ]
																									},
																									{name:'Wooden Floor [Parquet]',		value:13, applications:[
																									                               		                        {name:'Wooden Floor-Polishing',value:1}
																									                               		                        ]}	
											                        	                       ]},
											{name:'Office Furniture', 	value:3,cleaningAreas:[
																									{
																										name:'Brass Products',			value:1,  applications:[
																										                      			                      	{name:'Brass Polishing',value:1}
																										                      			                      	]
																									},
																									{	
																										name:'Leather Furniture',		value:2,	applications:[
																										                         		        	              {name:'Leather Polishing',value:1}
																										                         		        	              ]
																									},
																									{
																										name:'Metal Products',				value:3,	applications:[
																									                       				        	              {name:'Metal Polishing',value:1}
																									                       				        	              ]
																									},
																									{
																										name:'Wooden Furniture',			value:4,applications:[
																										                        			                      {name:'Furniture Polishing',value:1}
																										                                              			]
																									}
											                          	                       ]},
											{name:'Washroom Cleaning', 	value:4,cleaningAreas:[
																									{name:'Steam/Sauna/Shower/Locker Room',value:1,applications:[
																									                                                             {name:'SSSL-Disinfectant',value:1},
																									                                                             {name:'SSSL-Maintainer',value:2}
																									                                                             ]
																									},
																									{name:'Toilet',value:1,applications:[
																																		{name:'Disinfectant',value:1},
																																		{name:'Floor Maintainer',value:2},
																																		{name:'Toilet Bowl Cleaner',value:3}
																									                                     ]},
																									{name:'Washroom/Ablution Area',value:1,applications:[
																																						{name:'Washroom-Disinfectant',value:1},
																																						{name:'Washroom-Maintainer',value:2}
																									                                                     ]}
											                           	                       ]}
					                        ];
					
					return cleaningServices;
				},
				
				getApplications : function(){
					var applications = [
					             {name:'Buffing & Polishing',value:1},
					             {name:'Carpet Extractor',value:2},
					             {name:'Scrubbing',value:3},
					             {name:'Scrubbing & Shampooing',value:4},
					             {name:'Steam Generator',value:5},
					             {name:'Sweeper cum Scrubber',value:6},
					             {name:'Sweeping',value:7},
					             {name:'Vacuuming',value:8},
					             {name:'Other',value:9}
					           ];
					return applications;
				},
				
				getMachineTypes : function(){
					var machineTypes = [
										{name:'Back Pack',value:1},
					                    {name:'Carpet Extracter',value:2}, 
										{name:'Cold Water',value:3},
										{name:'Dry',value:4},
										{name:'Hot Water',value:5},
										{name:'Ride In',value:6},
										{name:'Ride On',value:7},
										{name:'Single Disk',value:8},
										{name:'Steam Generator',value:9},
										{name:'Walk Behid',value:10},
										{name:'Wet and Dry',value:11},
										{name:'Other',value:12}
										];
					return machineTypes;
				},
				
				getFuelTypes : function(){
					var types = [
									{name:'Battery',value:1},
				                    {name:'Diesel',value:2},
				                    {name:'Electric',value:3},
				                    {name:'LPG',value:4},
				                    {name:'Manual Petrol',value:5},
				                    {name:'Other',value:6}
				                 ];
					return types;
				},
				
				getCleaningServices : function(){
					var ser   = [
					          	{name:'Facade Cleaning',value:1},
					          	{name:'Floor Cleaning',value:2},
					          	{name:'Office Furniture ',value:3},
					          	{name:'Washroom Cleaning',value:4}
					          ];
					return ser;
				},
				getAreaTypes : function(){
					var ser = [
					           {name:'Entrances/Lobbies/Reception/Foyer',value:1},
					           {name:'Stairs and Landings',value:2},
					           {name:'Corridor/Hallway',value:3},
					           {name:'Elevators',value:4},
					           {name:'Offices',value:5},
					           {name:'Washroom/Shower/Change Room',value:6},
					           {name:'Library',value:7},
					           {name:'Cafeteria Searing and Circulation Area',value:8},
					           {name:'Meeting/Conference Room',value:9},
					           {name:'Classroom/Lecture Theature',value:10},
					           {name:'Laboratories',value:11},
					           {name:'First Aid Room',value:12},
					           {name:'General Office Space',value:13},
					           {name:'Other Areas',value:14},
					           {name:'Project Work',value:15}
					          ];
					return ser;
				}
				
				
				
		};
		
		return service;
		
	});