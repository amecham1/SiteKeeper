angular.module('keeperApp')
.controller('mainpageCtrl',mainpageCtrl);

function mainpageCtrl($scope,mainpageService,overviewService){

mainpageService.getcurrent()
.then(function(res){
  var siteUserId = res.data.passport.user.user_id;
  $scope.usersites = res.data.passport.user;
  mainpageService.getUserSites(siteUserId)
  .then(function(userSites){

  console.log(userSites.data);

  })


})





}//end of mainpageCtrl
