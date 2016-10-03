angular.module('keeperApp')
.controller('modalCtrl',modalCtrl)


function modalCtrl($scope,$uibModalInstance,createService){


  $scope.submit = function(site){
    createService.createsite(site)
    .then(function(response){
    })
    $uibModalInstance.close(alert('site created'));
  }



$scope.cancel= function(){
  $uibModalInstance.dismiss();
}

$scope.ok=function(){
  $uibModalInstance.close('Test');
}

}
