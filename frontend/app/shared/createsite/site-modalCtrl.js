angular.module('keeperApp')
.controller('site_modalCtrl',site_modalCtrl)


function site_modalCtrl($scope,$uibModalInstance,createService){


  $scope.submit = function(site){
    createService.createsite(site)
    .then(function(response){
    })
    $uibModalInstance.close(
      createService.sitealert()
    );
  }



$scope.cancel= function(){
  $uibModalInstance.dismiss();
}

$scope.ok=function(){
  $uibModalInstance.close('Test');
}

}
