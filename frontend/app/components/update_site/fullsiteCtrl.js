angular.module('keeperApp').controller('fullsiteCtrl', fullsiteCtrl);

function fullsiteCtrl($scope, updateService, $state,$filter) {


    updateService.allSiteInfo(25).then(function(res) {
        console.log(res.data);
        $scope.siteupdate = res.data.site[0];
        $scope.begintimechange = res.data.site[0].contract_begin;
        $scope.endtimechange = res.data.site[0].contract_end;
        $scope.siteupdate.contract_begin = $filter('date')($scope.begintimechange);
        $scope.siteupdate.contract_end = $filter('date')($scope.endtimechange);
        // $scope.checkForNull = res.data.hoursandsite;
        // console.log($scope.checkForNull);
        console.log(res.data.hoursandsite);
        $scope.times = res.data.hoursandsite;
    });

    $scope.submitUpdate = function(site, time) {
        // console.log(site);
        // console.log(time);
        var siteIdNum = site.site_id;
        updateService.updatesite(siteIdNum, site).then(function(response) {});
        time.forEach(function(val) {

            var siteId = val.contract_time_id;
            updateService.updatehours(siteId, val).then(function(res) {});
            siteId = 0;
        });
    };

} //end of controller
