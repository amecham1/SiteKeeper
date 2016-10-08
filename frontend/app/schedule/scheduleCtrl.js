angular.module('keeperApp')
.controller('scheduleCtrl',scheduleCtrl)

function scheduleCtrl($scope,overviewService){

overviewService.overViewSites()
.then(function(res){
  console.log(res.data[0]);
$scope.siteview = res.data[0];
$scope.contractBegin = res.data[0].contract_begin.;

});


}//end of controller
