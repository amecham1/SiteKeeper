angular.module('keeperApp').service('createService', createService);

function createService($http, $q) {
    // this will create the beginning of the site w/o days and hours
    var siteId;
    this.createsite = function(obj) {
        return $http({method: "POST", url: "/createsite", data: obj})
        .then(function(res){
          siteId = res.data[0].site_id;
          return res;
        });
        // console.log(obj);
    };
    // this will create the rest of the site -- days and hours
    var dayFk;
    this.createhours = function(shift) {
      shift.site_id = siteId;
      shift.contract_days_fk = dayFk;
        return $http({method: "POST", url: "/createdayandhours", data: shift});
        // .then(function(res){
        //   dayFk = res.data[0].cd_id;
        // })
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
