angular.module('keeperApp')
.directive('menuDirective',function(){

return{
  restrict: 'E',
  templateUrl: 'app/shared/menu/menu.html',
  controller: function($scope,$uibModal){
    console.log('fired!')
    $scope.open=function(){
      var modalInstance = $uibModal.open({
        size:'lg',
        templateUrl:'app/shared/createsite/createsitemodal.html',
        controller:'modalCtrl'
      })
    }
    }
  }

})
