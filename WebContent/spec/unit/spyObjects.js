
'use strict'


var SpyObjects = function(){
	
	
  this.modal = jasmine.createSpyObj('$uibModalInstance', ['close', '$dismiss']);
	
	
};

module.exports = new SpyObjects();


