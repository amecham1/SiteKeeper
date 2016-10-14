angular.module('keeperApp').controller('scheduleCtrl', scheduleCtrl)

function scheduleCtrl($scope, overviewService, $state, createService) {

    var siteArray = [];

    overviewService.overViewSites().then(function(res) {

        var siteObj = res.data;

        var currentName;
        var titles = []
        $scope.siteoverview = res.data;
        $scope.showSites = true;

    });
    // function will hide sites and then bring in site info
    $scope.scheduleShift = function(idNum) {
        $scope.showSites = false;

        overviewService.showHours(idNum.site_id).then(function(res) {
            $scope.hours = res.data;
            $scope.shifts = res.data;

        })
        $state.go('schedule.selectshift')
    }

    var selectedShifts = [];
    $scope.addShiftNum = function(contractId, shiftNum) {
      overviewService.getUserId()
      .then(function(res){
        var empId = res.data.passport.user.user_id;
        if (shiftNum) {
            selectedShifts.push({shift_num: shiftNum, contract_time_fk: contractId, site_id_fk: $scope.shifts[0].site_id_fk, user_id_fk: empId})
        } else {
            var index = selectedShifts.map(function(val) {
                return val.contract_time_fk;
            }).indexOf(contractId);

            selectedShifts.splice(index, 1);
        }

      })

    }




    $scope.submitEmpShifts = function() {
        console.log(selectedShifts);
        selectedShifts.forEach(function(val) {
            // console.log('hello');
            overviewService.employeeSchedule(val).then(function(response) {})

        })

        selectedShifts = [];
        // console.log(selectedShifts);
    }




} //end of controller
