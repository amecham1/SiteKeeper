angular.module('keeperApp')
.service('createService',createService)

function createService($http,$q){

this.createsite = function(obj){
  return $http({
    method:"POST",
    url:"/createsite",
    data:obj
  })
};

this.createemployee = function(emp){
  return $http({
    method:"POST",
    url:"/createemployee",
    data:emp
  })
};


this.sitealert = function(){swal({
    title: "Site Created!",
    type: "success",
    confirmButtonText: "Ok",
    allowOutsideClick: true
  });

};

this.employeealert = function(){swal({
    title: "Employee Created!",
    type: "success",
    confirmButtonText: "Ok",
    allowOutsideClick: true
  });

};



}//end of service
