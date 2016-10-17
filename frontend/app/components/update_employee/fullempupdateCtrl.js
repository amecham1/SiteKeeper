angular.module('keeperApp')
.controller('fullempupdateCtrl',fullempupdateCtrl)


function fullempupdateCtrl($scope,updateService,$state){

var getEmpId = updateService.getEmpId();

console.log(getEmpId);

$scope.empupdate = getEmpId;

$scope.submitEmployee = function(data){
updateService.updateemployee(data)
.then(function(response){});

}





}//end of controller
