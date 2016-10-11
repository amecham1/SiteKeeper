angular.module('keeperApp')
.service('updateService',updateService)

function updateService($http){

this.updateSite = function(){
  return $http({
    method:"GET",
    url:'/siteoverview'
  })
}

this.allSiteInfo = function(siteId){
  return $http({
    method:"GET",
    url:'/getsiteandhours/' + siteId
  })
}



}//end of service
