angular.module('keeperApp')
.controller('signinCtrl',signinCtrl)

function signinCtrl($scope,loginService,$state){

//$scope.login = false;
$scope.done = false;
$scope.realbutton = false;

$scope.beginlogin = function(){
  // TweenMax.staggerTo(".login-button", 1, {rotation:360, y:50}, .1);
  // $scope.login = false;
  $scope.done = true;
  // $scope.realbutton = false;
}

$scope.login = {
  username: 'a@a.com',
  password: 'a'
}


$scope.submitlogin = function(login){
  loginService.getLogin(login)
    .then(function(res){
      if(res.status === 200) $state.go('mainpage');
    }, function(err) {
      console.log(err)
    });
}

}//end of homeCtrl
