angular.module('keeperApp')
.controller('updateSiteCtrl',updateSiteCtrl);


function updateSiteCtrl($scope,updateService,$state,$filter){
$scope.showupdate = true;
updateService.updateSite()
.then(function(response){
  // console.log(response.data);
$scope.updatesites = response.data;
});
$scope.checkNull = true;
$scope.updateSite = function(siteview){
  $scope.showupdate = false;
updateService.allSiteInfo(siteview.site_id)
.then(function(res){
  // console.log(res.data);
  $scope.siteupdate = res.data.site[0];
  $scope.begintimechange = res.data.site[0].contract_begin
  $scope.endtimechange = res.data.site[0].contract_begin
  $scope.site_begin = $filter('date')($scope.begintimechange);
  $scope.site_end = $filter('date')($scope.endtimechange);
  $scope.checkForNull = res.data.hoursandsite;
  $scope.times = res.data.hoursandsite;

})
$state.go('updatesite.updatefullsite')

}





}//end of controller
