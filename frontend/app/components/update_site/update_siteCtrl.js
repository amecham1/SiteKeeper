angular.module('keeperApp')
.controller('updateSiteCtrl',updateSiteCtrl);


function updateSiteCtrl($scope,updateService){

console.log(updateService.updateSite());

updateService.updateSite()
.then(function(response){
$scope.sites = response;
});






}//end of controller
