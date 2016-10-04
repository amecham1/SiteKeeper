angular.module('keeperApp')
.service('createService',createService)

function createService($http,$q){

this.createsite = function(obj){
  return $http({
    method:"POST",
    url:"/createsite",
    data:obj
  })
}


this.alert = function(){swal({
    title: "Site Created!",
    type: "success",
    confirmButtonText: "Ok", 
    allowOutsideClick: true
  });

    }


}//end of service
