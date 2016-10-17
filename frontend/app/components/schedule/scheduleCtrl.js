
angular.module('keeperApp').controller('scheduleCtrl', scheduleCtrl)

function scheduleCtrl($scope, overviewService, $state) {

    // var siteArray = [];

    overviewService.overViewSites().then(function(res) {
      // console.log(res.data);
        var siteObj = res.data;
        $scope.siteoverview = res.data;
    });
    // function will hide sites and then bring in site info
    $scope.scheduleShift = function(idNum) {
      overviewService.idNumVar(idNum.site_id);
      // console.log(idNum.site_id);
      overviewService.idNumVar = idNum.site_id;
      $state.go('selectshift')
    }


} //end of controller
