angular.module('keeperApp').service('createService', createService);

function createService($http, $q) {
    // this will create the beginning of the site w/o days and hours
    var siteId;
    this.shifts = [];
    this.site;
    this.day;
    this.createsite = function(obj) {
        return $http({method: "POST", url: "/createsite", data: obj}).then(function(res) {
            siteId = res.data[0].site_id;
            return res;
        });
    };
    // this will create the rest of the site -- days and hours
    this.createhours = function(shift) {
        console.log(shift);
        shift.site_id = siteId;
        return $http({method: "POST", url: "/createdayandhours", data: shift});
    };
    // this will create an employee
    var employeeId;
    this.createemployee = function(emp) {
        return $http({method: "POST", url: "/createemployee", data: emp}).then(function(res) {
            employeeId = res.data[0].user_id;
            console.log(employeeId);
            return res;
        });
    };

    // this makes an alert saying the site has been created
    this.sitealert = function() {
        swal({title: "Site Created!", type: "success", confirmButtonText: "Ok", allowOutsideClick: true});

    };
    // this makes an alert saying that the employee has been created
    this.employeealert = function() {
        swal({title: "Employee Created!", type: "success", confirmButtonText: "Ok", allowOutsideClick: true});

    };

    this.addtoShifts = function(shifts) {
        this.shifts.push(shifts);
        // console.log(this.shifts);

    };

} //end of service
