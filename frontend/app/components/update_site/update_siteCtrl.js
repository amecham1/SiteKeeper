angular.module('keeperApp')
.controller('updateSiteCtrl',updateSiteCtrl);


function updateSiteCtrl($scope,updateService,$state){
$scope.showupdate = true;
updateService.updateSite()
.then(function(response){
  // console.log(response.data);
$scope.updatesites = response.data;
});

$scope.updateSite = function(siteview){
updateService.allSiteInfo(siteview.site_id)
.then(function(res){
  console.log(res.data);
})

// $state.go('updatesite.updatefullsite')
}





}//end of controller
