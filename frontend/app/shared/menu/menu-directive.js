angular.module('keeperApp').directive('menuDirective', function() {

    return {
        restrict: 'E',
        templateUrl: 'app/shared/menu/menu.html',
        controller: function($scope, $uibModal) {
            // opens create site modal
            $scope.siteopen = function() {
                var modalInstance = $uibModal.open({
                    size: 'md', templateUrl: 'app/shared/createsite/createsitemodal.html', controller: 'site_modalCtrl',
                    // windowTemplateUrl:'app/shared/createsite/createsitemodal.html'
                })
            };
            // opens create employee modal
            $scope.employeeopen = function() {
                var modalInstance = $uibModal.open({size: 'md', templateUrl: 'app/shared/create_employee/employee_modal.html', controller: 'employee_modalCtrl'})
            };
        }
    }

})//end of directive
