angular.module('keeperApp')
.service('createService',createService)

function createService($http,$q){

this.createsite = function(obj){
  return $http({
    method:"POST",
    url:"localhost:3000/createsite",
    data:obj
  })
}


}//end of service
