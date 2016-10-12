angular.module('keeperApp')
.controller('signinCtrl',signinCtrl)

function signinCtrl($scope,loginService){


$scope.submitlogin = function(login){
  console.log(login);
loginService.getLogin(login)
.then(function(res){});
}

}//end of homeCtrl
