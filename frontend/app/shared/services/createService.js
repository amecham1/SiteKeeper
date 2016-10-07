angular.module('keeperApp').service('createService', createService);

function createService($http, $q) {
    // this will create the beginning of the site w/o days and hours
    this.createsite = function(obj) {
        return $http({method: "POST", url: "/createsite", data: obj});
        // console.log(obj);
    };
    // this will create the rest of the site -- days and hours
    this.createhours = function(shift) {
        return $http({method: "POST", url: "/scheduledata", data: shift});
        // console.log(shift);
    };
    // this will create an employee
    this.createemployee = function(emp) {
        return $http({method: "POST", url: "/createemployee", data: emp});
    };

    // this makes an alert saying the site has been created
    this.sitealert = function() {
        swal({title: "Site Created!", type: "success", confirmButtonText: "Ok", allowOutsideClick: true});

    };
    // this makes an alert saying that the employee has been created
    this.employeealert = function() {
        swal({title: "Employee Created!", type: "success", confirmButtonText: "Ok", allowOutsideClick: true});

    };

} //end of service
