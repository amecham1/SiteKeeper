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


}//end of service
