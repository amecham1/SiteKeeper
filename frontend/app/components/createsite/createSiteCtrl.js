angular.module('keeperApp').controller('createSiteCtrl', createSiteCtrl)

function createSiteCtrl($scope, createService, $state, $log) {

    // Goes from create site to create days also creates the first part of the site
    $scope.next = function(site) {
        $state.go('createsitedays');
        createService.createsite(site).then(function(response){});
        createService.createhours(site).then(function(response){});
    }

    // Opens subview from create days into create hours
    $scope.createhours = function(day) {
        $scope.getDay = day;
        $state.go('createsitedays.hour');
    }
// clock step increases
    $scope.hstep = 1;
    $scope.mstep = 15;
// creates the shift object and then pushes it into the service
    $scope.getTimes = function(shift) {
        for (var prop in shift) {
            shift[prop] = (new Date(shift[prop])).getHours() + ':' + (new Date(shift[prop])).getMinutes()
        }
        shift.name = $scope.getDay;
        createService.createhours(shift).then(function(response){});
    };
// clears all of the clock info
    $scope.clear = function() {
        $scope.shift = null;
    };

} //end of controller
