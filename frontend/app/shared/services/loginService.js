angular.module('keeperApp')
.service('loginService',loginService);


function loginService($http){

this.getLogin = function(login){
  console.log(login,'service');
  login = {
    username: login.email,
    password: login.password
  }
return $http({
  method:"POST",
  url:'/login',
  data: login
})


}



} //end of service
