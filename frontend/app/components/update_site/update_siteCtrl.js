angular.module('keeperApp').controller('updateSiteCtrl', updateSiteCtrl);

function updateSiteCtrl($scope, updateService, $state, $filter) {
    $scope.showupdate = true;
    updateService.updateSite().then(function(response) {
        $scope.updatesites = response.data;
    });

    $scope.checkNull = true;

    $scope.updateSite = function(siteview) {
        $scope.showupdate = false;
        updateService.allSiteInfo(siteview.site_id).then(function(res) {
            // console.log(res.data);
            $scope.siteupdate = res.data.site[0];
            $scope.begintimechange = res.data.site[0].contract_begin
            $scope.endtimechange = res.data.site[0].contract_end
            $scope.siteupdate.contract_begin = $filter('date')($scope.begintimechange);
            $scope.siteupdate.contract_end = $filter('date')($scope.endtimechange);
            $scope.checkForNull = res.data.hoursandsite;
            // console.log($scope.checkForNull);
            $scope.times = res.data.hoursandsite;
        })
        $state.go('updatesite.updatefullsite')
    }

    $scope.submitUpdate = function(site,time){
      console.log(site);
        console.log(time);
      var siteIdNum = site.site_id;
      updateService.updatesite(siteIdNum,site)
      .then(function(response){
      })
      time.forEach(function(val){

        var siteId = val.contract_time_id;
        updateService.updatehours(siteId,val)
        .then(function(res){});
        siteId =0;
      })
    }

    updateService.showemployee()
    .then(function(emp){
      // console.log(emp);

      $scope.employee = emp.data;
    })

    $scope.updateEmp = function(emp){
      $scope.showupdate = false;
      $scope.empupdate = emp
      console.log(emp);
      $state.go('showemployee.updateemployee')
    }

    $scope.submitEmployee = function(empchange){
      var employeeId = empchange.user_id;
      updateService.updateemployee(employeeId,empchange)
      .then(function(res){});
    }



} //end of controller
