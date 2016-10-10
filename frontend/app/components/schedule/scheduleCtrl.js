angular.module('keeperApp')
.controller('scheduleCtrl',scheduleCtrl)

function scheduleCtrl($scope,overviewService, $state){



var siteArray = [];

overviewService.overViewSites()
.then(function(res){

var siteObj = res.data;

var currentName;
var titles = []
$scope.siteoverview = res.data;
$scope.showSites = true;


});


$scope.scheduleShift = function(idNum){
  $scope.showSites = false;


  overviewService.showHours(idNum.site_id)
  .then(function(res){
    $scope.hours = res.data;
    console.log(res.data);
  })

  $state.go('schedule.selectshift')
}







}//end of controller
