angular.module('keeperApp')
.controller('createCtrl',createCtrl)


function createCtrl($scope,createService){


  var newSite = {
    name: $scope.name,
    address: $scope.address,
    site_info: $scope.siteinfo,
    contract_length: $scope.contract,
    hours: $scope.hours
  }

$scope.addSite = function(){
createService.createsite(){
.then(function(newSite){
})

}

}




}//end of controller
