angular.module('keeperApp', ['ui.router','ui.bootstrap','ngAnimate','satellizer'])
.config(function($stateProvider, $urlRouterProvider, $authProvider) {


    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('signin',{
      url:'/',
      templateUrl: 'app/components/signin/signin.html',
      controller: 'signinCtrl'
    })
    .state('mainpage',{
      url:'/mainpage',
      templateUrl: 'app/components/main/mainpage.html',
      controller: 'mainpageCtrl'
    })
    .state('createsite',{
      url:'/createsite',
      templateUrl:'app/components/createsite/createsite.html',
      controller:'createSiteCtrl'
    })
    .state('createsitedays', {
      url: '/days',
      templateUrl: 'app/components/createsite/createsitedays.html',
      controller: 'createSiteCtrl'
    })
    .state('hour',{
      url:'/hours',
      templateUrl:'app/components/createsite/createhours.html',
      controller: 'createSiteCtrl'
    })
    // .state('updateemployee',{
    //   url:'/updateemployee',
    //   templateUrl:'app/components/update_site/update_employee.html',
    //   controller:'updateSiteCtrl'
    // })
    .state('createemployee',{
      url:'/createemployee',
      templateUrl:'app/components/createsite/create_employee.html',
      controller:'createSiteCtrl'
    })
    .state('schedule',{
      url:'/schedulesites',
      templateUrl:'app/components/schedule/schedule.html',
      controller:'scheduleCtrl'
    })
    .state('selectshift',{
      url:'/scheduleshifts',
      templateUrl:'app/components/schedule/scheduleshifts.html',
      controller:'schedulehoursCtrl'
    })
    .state('updatesite',{
      url:'/updatesite',
      templateUrl:'app/components/update_site/update_site.html',
      controller:'updateSiteCtrl'
    })
    .state('updatefullsite',{
      url:'/fullsiteupdate',
      templateUrl:'app/components/update_site/update_fullsite.html',
      controller:'fullsiteCtrl'
    })
    .state('showemployee',{
      url:'/viewemployee',
      templateUrl:'app/components/update_site/view_employee.html',
      controller:'empupdateCtrl'
    })
    .state('updateemployee',{
      url:'/updateemployee',
      templateUrl:'app/components/update_site/update_employee.html',
      controller: 'fullempupdateCtrl'
    })
    .state('requestchange',{
      url:'/requestchange',
      templateUrl:'app/components/request_change/request_change.html',
      controller:'requestchangeCtrl'
    });






});//end of angular app

angular.module('keeperApp')
.controller('mainCtrl',mainCtrl)

function mainCtrl($scope){

$scope.test="hello"


} //end of controller

angular.module('keeperApp')
.controller('mainpageCtrl',mainpageCtrl);

function mainpageCtrl($scope,mainpageService,overviewService){

mainpageService.getcurrent()
.then(function(res){
  var siteUserId = res.data.passport.user.user_id;
  $scope.username = res.data.passport.user;
  mainpageService.getUserSites(siteUserId)
  .then(function(userSites){
    $scope.usersites = userSites.data;
  console.log(userSites.data);

  })


})





}//end of mainpageCtrl

angular.module('keeperApp').controller('createSiteCtrl', createSiteCtrl)

function createSiteCtrl($scope, createService, $state) {
$scope.showshifts1 = false;
    // Goes from create site to create days also creates the first part of the site
    $scope.next = function(name) {
        createService.createsite(name).then(function(response) {
            $scope.siteId = response.data[0].site_id;
            createService.site=$scope.siteId;
              $state.go('createsitedays');
          });

    }
    // Opens subview from create days into create hours
    $scope.createhours = function(day) {
        createService.day = day;
        $state.go('hour');
    }
    // clears all of the clock info
    $scope.clear = function() {
        $scope.shift = null;
    };
    // clock step increases
    $scope.hstep = 1;
    $scope.mstep = 15;

    // creates the shift object and then pushes it into the service
    $scope.getMoreHours = function(shift) {


        for (var prop in shift) {
            shift[prop] = (new Date(shift[prop])).getHours() + ':' + (new Date(shift[prop])).getMinutes()
        }
        shift.contract_day = createService.day;
        shift.siteId = createService.site;
        shift.site_id_fk = createService.site;

        $scope.addtoShifts(shift);
          };


    $scope.employeeId;
    // creates an employee and returns that id
    $scope.createEmployee = function(employee) {
        createService.createemployee(employee).then(function(response) {
          $scope.employeeId = response.data[0].user_id;

        })
    }

    $scope.addtoShifts = function(shift){
      console.log(shift);
      createService.addtoShifts(shift);
      $state.go('createsitedays');
    }


    $scope.getTimes=function(){
      createService.shifts.forEach(function(val){
        console.log(val);
        if(!val){
          val = null;
        }
        else{
        createService.createhours(val).then(function(response) {});
      }
      })

    }


    $scope.pickShift = function(v){

    if(v === 1){
      $scope.showshifts1 = !$scope.showshifts1;
    }
    if(v === 2){
      $scope.showshifts2 = !$scope.showshifts2;
    }
    if(v === 3){
      $scope.showshifts3 = !$scope.showshifts3;
    }
    if(v === 4){
      $scope.showshifts4 = !$scope.showshifts4;
    }

    }

} //end of controller


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

angular.module('keeperApp').controller('schedulehoursCtrl', schedulehoursCtrl)

function schedulehoursCtrl($scope, overviewService, $state) {


    overviewService.showHours(overviewService.idNumVar).then(function(res) {
      console.log(overviewService.idNumVar);
        $scope.hours = res.data;
        $scope.shifts = res.data;

    })

    var selectedShifts = [];
    $scope.addShiftNum = function(contractId, shiftNum) {
      // console.log(contractId,'contractId');
      // console.log(shiftNum,'shiftNum');
        overviewService.getUserId().then(function(res) {
          // console.log(res, 'getUserId');
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
      console.log('fired');
      console.log(selectedShifts);
        selectedShifts.forEach(function(val) {
            overviewService.employeeSchedule(val).then(function(response) {})
        })
        selectedShifts = [];
    }

} //end of controller

angular.module('keeperApp')
.controller('requestchangeCtrl', requestchangeCtrl)


function requestchangeCtrl($scope){





}//end of controller

angular.module('keeperApp').controller('fullsiteCtrl', fullsiteCtrl);

function fullsiteCtrl($scope, updateService, $state,$filter) {

var siteService = updateService.siteView
console.log(siteService);

    updateService.allSiteInfo().then(function(res) {
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

angular.module('keeperApp').controller('updateSiteCtrl', updateSiteCtrl);

function updateSiteCtrl($scope, updateService, $state) {



    updateService.updateSite().then(function(response) {
        $scope.updatesites = response.data;
        // return updateService.siteView = response.data;
        // console.log(response.data);
    });

    // $scope.checkNull = true;

    $scope.updateSite = function(siteview) {
      updateService.getSiteview = siteview;
      console.log(siteview);
    //  updateService.showHours(siteview.site_id);
        // console.log(updateService.siteView);
        $state.go('updatefullsite');
  };

        // updateService.allSiteInfo(updateService.siteview.site_id).then(function(res) {
        //     // console.log(res.data);
        //     $scope.siteupdate = res.data.site[0];
        //     $scope.begintimechange = res.data.site[0].contract_begin;
        //     $scope.endtimechange = res.data.site[0].contract_end;
        //     $scope.siteupdate.contract_begin = $filter('date')($scope.begintimechange);
        //     $scope.siteupdate.contract_end = $filter('date')($scope.endtimechange);
        //     // $scope.checkForNull = res.data.hoursandsite;
        //     // console.log($scope.checkForNull);
        //     $scope.times = res.data.hoursandsite;
        // });



    // $scope.submitUpdate = function(site,time){
    //   // console.log(site);
    //     // console.log(time);
    //   var siteIdNum = site.site_id;
    //   updateService.updatesite(siteIdNum,site)
    //   .then(function(response){
    //   });
    //   time.forEach(function(val){
    //
    //     var siteId = val.contract_time_id;
    //     updateService.updatehours(siteId,val)
    //     .then(function(res){});
    //     siteId =0;
    //   });
    // };

    // updateService.showemployee()
    // .then(function(emp){
    //   console.log(emp);
    //
    //   $scope.employee = emp.data;
    // });

    $scope.updateEmp = function(emp){
      $scope.showupdate = false;
      $scope.empupdate = emp;
      // console.log(emp);
      $state.go('showemployee.updateemployee');
    };

    $scope.submitEmployee = function(empchange){
      var employeeId = empchange.user_id;
      updateService.updateemployee(employeeId,empchange)
      .then(function(res){});
    };



} //end of controller

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

angular.module('keeperApp')
.controller('empupdateCtrl',empupdateCtrl)


function empupdateCtrl($scope,updateService,$state){


  updateService.showemployee()
  .then(function(emp){
    console.log(emp);

    $scope.employee = emp.data;
  });





}//end of controller

angular.module('keeperApp')
.controller('fullempupdateCtrl',fullempupdateCtrl)


function fullempupdateCtrl($scope,updateService,$state){




}//end of controller

angular.module('keeperApp')
.service('loginService',loginService);


function loginService($http){

this.getLogin = function(login){
  return $http({
    method:"POST",
    url:'/auth/login',
    data: login
  });
}



} //end of service

angular.module('keeperApp')
.service('mainpageService',mainpageService);

function mainpageService($http){

this.getcurrent = function(){
  return $http({
    method:"GET",
    url: "/auth/current"
  })
}

this.getUserSites = function(userSiteId){
  return $http({
    method:"GET",
    url:"/getUserSites/" + userSiteId
  })
}



}//end of service

angular.module('keeperApp')
.service('overviewService',overviewService)

function overviewService($http){

this.idNumVar = function(val){
  if(val){

  }
};

console.log(this.idNumVar);

// this.siteView = {};
// console.log(this.siteView);


this.overViewSites = function(){
  return $http({
    method:"GET",
    url:"/siteoverview"
  })
}

this.showDays = function(idNum){

  return $http({
    method:"GET",
    url:"/scheduleDays/" + idNum
  })
}

this.showHours = function(idNum){
  // console.log(idNum);
  return $http({
    method:"GET",
    url: "/scheduleHours/" + idNum
  })
}

this.employeeSchedule = function(scheduleShift){
  // console.log(scheduleShift);
  return $http({
    method:"POST",
    url:"/employeeschedule",
    data:scheduleShift
  })
}

this.getUserInfo = function(userId){
  return $http({
    method:"GET",
    url:"/getUserInfo/" + userId
  })
}

this.getUserId = function(){
  return $http({
    method:"GET",
    url:"/auth/current"
  })
}


} //end of service

angular.module('keeperApp')
.service('updateService',updateService)

function updateService($http){

// this.siteView;
//
// this.getSiteId = function(val){
//   console.log(val);
//   return val;
// }
//
//   // this.siteView = val;
//   console.log(this.siteView);

this.siteView = {};
console.log(this.siteView);

this.updateSite = function(){
  return $http({
    method:"GET",
    url:'/siteoverview'
  })
}

this.allSiteInfo = function(siteId){
  return $http({
    method:"GET",
    url:'/getsiteandhours/' + siteId
  })
}

this.updatesite = function(updateId,updateSite){
  return $http({
    method: "PUT",
    url:'/updatesite/' + updateId,
    data: updateSite
  })
}

this.updatehours = function(updateId, updateTime){
  return $http({
    method: "PUT",
    url:'/updatehours/' + updateId,
    data: updateTime
  })
}

this.updateemployee = function(updateId, updateEmployee){
  return $http({
    method: "PUT",
    url: '/updateemployee/' + updateId,
    data: updateEmployee
  })
}

this.showemployee = function(){
  return $http({
    method: "GET",
    url:"/viewemployee"
  })
}




}//end of service

angular.module('keeperApp')
.controller('signinCtrl',signinCtrl)

function signinCtrl($scope,loginService,$state){




$scope.login = {
  username: 'a@a.com',
  password: 'a'
}


$scope.submitlogin = function(login){
  loginService.getLogin(login)
    .then(function(res){
      if(res.status === 200) $state.go('mainpage');
    }, function(err) {
      console.log(err)
    });
}

}//end of homeCtrl

angular.module('keeperApp')
.animation('.slide-down', function() {
  return {
    enter: function(element, done) {
      TweenMax.from(element, 1, {opacity:0, y:50, onComplete:done})
    },
    leave: function(element, done) {
      TweenMax.to(element, 1, {opacity:0, y:50, onComplete:done})
    }
  }
});

// ('.main-content', [function(){
//   return {
//     enter: function(element, done) {
//       TweenMax.from(element, 1, {opacity:0, y:50, onComplete:done})
//     },
//     leave: function(element, done) {
//       TweenMax.to(element, 1, {opacity:0, y:50, onComplete:done})
//     }
//   }
// }])

angular.module('keeperApp').directive('menuDirective', function() {

    return {
        restrict: 'E',
        templateUrl: 'app/shared/menu/menu.html',
        controller: function($scope) {
        
        }
    }

}) //end of directive

angular.module('keeperApp').directive('titleDirective', function() {

    return {
        restrict: 'E',
        templateUrl: 'app/shared/menu/title.html'

      }

})//end of directive

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5DdHJsLmpzIiwiY29tcG9uZW50cy9tYWluL21haW5wYWdlQ3RybC5qcyIsImNvbXBvbmVudHMvY3JlYXRlc2l0ZS9jcmVhdGVTaXRlQ3RybC5qcyIsImNvbXBvbmVudHMvc2NoZWR1bGUvc2NoZWR1bGVDdHJsLmpzIiwiY29tcG9uZW50cy9zY2hlZHVsZS9zY2hlZHVsZV9ob3Vyc0N0cmwuanMiLCJjb21wb25lbnRzL3JlcXVlc3RfY2hhbmdlL3JlcXVlc3RfY2hhbmdlQ3RybC5qcyIsImNvbXBvbmVudHMvdXBkYXRlX3NpdGUvZnVsbHNpdGVDdHJsLmpzIiwiY29tcG9uZW50cy91cGRhdGVfc2l0ZS91cGRhdGVfc2l0ZUN0cmwuanMiLCJzaGFyZWQvc2VydmljZXMvY3JlYXRlU2VydmljZS5qcyIsInNoYXJlZC9zZXJ2aWNlcy9lbXB1cGRhdGVDdHJsLmpzIiwic2hhcmVkL3NlcnZpY2VzL2Z1bGxlbXB1cGRhdGVDdHJsLmpzIiwic2hhcmVkL3NlcnZpY2VzL2xvZ2luU2VydmljZS5qcyIsInNoYXJlZC9zZXJ2aWNlcy9tYWlucGFnZVNlcnZpY2UuanMiLCJzaGFyZWQvc2VydmljZXMvb3ZlcnZpZXdTZXJ2aWNlLmpzIiwic2hhcmVkL3NlcnZpY2VzL3VwZGF0ZVNlcnZpY2UuanMiLCJjb21wb25lbnRzL3NpZ25pbi9zaWduaW5DdHJsLmpzIiwic2hhcmVkL2FuaW1hdGlvbnMvdWktdmlldy1hbmltYXRpb24uanMiLCJzaGFyZWQvbWVudS9tZW51LWRpcmVjdGl2ZS5qcyIsInNoYXJlZC9tZW51L3RpdGxlLWRpcmVjdGl2ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnLCBbJ3VpLnJvdXRlcicsJ3VpLmJvb3RzdHJhcCcsJ25nQW5pbWF0ZScsJ3NhdGVsbGl6ZXInXSlcbi5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGF1dGhQcm92aWRlcikge1xuXG5cbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XG5cbiAgICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnc2lnbmluJyx7XG4gICAgICB1cmw6Jy8nLFxuICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvY29tcG9uZW50cy9zaWduaW4vc2lnbmluLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ3NpZ25pbkN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ21haW5wYWdlJyx7XG4gICAgICB1cmw6Jy9tYWlucGFnZScsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9jb21wb25lbnRzL21haW4vbWFpbnBhZ2UuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnbWFpbnBhZ2VDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdjcmVhdGVzaXRlJyx7XG4gICAgICB1cmw6Jy9jcmVhdGVzaXRlJyxcbiAgICAgIHRlbXBsYXRlVXJsOidhcHAvY29tcG9uZW50cy9jcmVhdGVzaXRlL2NyZWF0ZXNpdGUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOidjcmVhdGVTaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnY3JlYXRlc2l0ZWRheXMnLCB7XG4gICAgICB1cmw6ICcvZGF5cycsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9jb21wb25lbnRzL2NyZWF0ZXNpdGUvY3JlYXRlc2l0ZWRheXMuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnY3JlYXRlU2l0ZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ2hvdXInLHtcbiAgICAgIHVybDonL2hvdXJzJyxcbiAgICAgIHRlbXBsYXRlVXJsOidhcHAvY29tcG9uZW50cy9jcmVhdGVzaXRlL2NyZWF0ZWhvdXJzLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ2NyZWF0ZVNpdGVDdHJsJ1xuICAgIH0pXG4gICAgLy8gLnN0YXRlKCd1cGRhdGVlbXBsb3llZScse1xuICAgIC8vICAgdXJsOicvdXBkYXRlZW1wbG95ZWUnLFxuICAgIC8vICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL3VwZGF0ZV9zaXRlL3VwZGF0ZV9lbXBsb3llZS5odG1sJyxcbiAgICAvLyAgIGNvbnRyb2xsZXI6J3VwZGF0ZVNpdGVDdHJsJ1xuICAgIC8vIH0pXG4gICAgLnN0YXRlKCdjcmVhdGVlbXBsb3llZScse1xuICAgICAgdXJsOicvY3JlYXRlZW1wbG95ZWUnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL2NyZWF0ZXNpdGUvY3JlYXRlX2VtcGxveWVlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjonY3JlYXRlU2l0ZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3NjaGVkdWxlJyx7XG4gICAgICB1cmw6Jy9zY2hlZHVsZXNpdGVzJyxcbiAgICAgIHRlbXBsYXRlVXJsOidhcHAvY29tcG9uZW50cy9zY2hlZHVsZS9zY2hlZHVsZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6J3NjaGVkdWxlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnc2VsZWN0c2hpZnQnLHtcbiAgICAgIHVybDonL3NjaGVkdWxlc2hpZnRzJyxcbiAgICAgIHRlbXBsYXRlVXJsOidhcHAvY29tcG9uZW50cy9zY2hlZHVsZS9zY2hlZHVsZXNoaWZ0cy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6J3NjaGVkdWxlaG91cnNDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCd1cGRhdGVzaXRlJyx7XG4gICAgICB1cmw6Jy91cGRhdGVzaXRlJyxcbiAgICAgIHRlbXBsYXRlVXJsOidhcHAvY29tcG9uZW50cy91cGRhdGVfc2l0ZS91cGRhdGVfc2l0ZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6J3VwZGF0ZVNpdGVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCd1cGRhdGVmdWxsc2l0ZScse1xuICAgICAgdXJsOicvZnVsbHNpdGV1cGRhdGUnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL3VwZGF0ZV9zaXRlL3VwZGF0ZV9mdWxsc2l0ZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6J2Z1bGxzaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnc2hvd2VtcGxveWVlJyx7XG4gICAgICB1cmw6Jy92aWV3ZW1wbG95ZWUnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL3VwZGF0ZV9zaXRlL3ZpZXdfZW1wbG95ZWUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOidlbXB1cGRhdGVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCd1cGRhdGVlbXBsb3llZScse1xuICAgICAgdXJsOicvdXBkYXRlZW1wbG95ZWUnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL3VwZGF0ZV9zaXRlL3VwZGF0ZV9lbXBsb3llZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdmdWxsZW1wdXBkYXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgncmVxdWVzdGNoYW5nZScse1xuICAgICAgdXJsOicvcmVxdWVzdGNoYW5nZScsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvcmVxdWVzdF9jaGFuZ2UvcmVxdWVzdF9jaGFuZ2UuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOidyZXF1ZXN0Y2hhbmdlQ3RybCdcbiAgICB9KTtcblxuXG5cblxuXG5cbn0pOy8vZW5kIG9mIGFuZ3VsYXIgYXBwXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5jb250cm9sbGVyKCdtYWluQ3RybCcsbWFpbkN0cmwpXG5cbmZ1bmN0aW9uIG1haW5DdHJsKCRzY29wZSl7XG5cbiRzY29wZS50ZXN0PVwiaGVsbG9cIlxuXG5cbn0gLy9lbmQgb2YgY29udHJvbGxlclxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcignbWFpbnBhZ2VDdHJsJyxtYWlucGFnZUN0cmwpO1xuXG5mdW5jdGlvbiBtYWlucGFnZUN0cmwoJHNjb3BlLG1haW5wYWdlU2VydmljZSxvdmVydmlld1NlcnZpY2Upe1xuXG5tYWlucGFnZVNlcnZpY2UuZ2V0Y3VycmVudCgpXG4udGhlbihmdW5jdGlvbihyZXMpe1xuICB2YXIgc2l0ZVVzZXJJZCA9IHJlcy5kYXRhLnBhc3Nwb3J0LnVzZXIudXNlcl9pZDtcbiAgJHNjb3BlLnVzZXJuYW1lID0gcmVzLmRhdGEucGFzc3BvcnQudXNlcjtcbiAgbWFpbnBhZ2VTZXJ2aWNlLmdldFVzZXJTaXRlcyhzaXRlVXNlcklkKVxuICAudGhlbihmdW5jdGlvbih1c2VyU2l0ZXMpe1xuICAgICRzY29wZS51c2Vyc2l0ZXMgPSB1c2VyU2l0ZXMuZGF0YTtcbiAgY29uc29sZS5sb2codXNlclNpdGVzLmRhdGEpO1xuXG4gIH0pXG5cblxufSlcblxuXG5cblxuXG59Ly9lbmQgb2YgbWFpbnBhZ2VDdHJsXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuY29udHJvbGxlcignY3JlYXRlU2l0ZUN0cmwnLCBjcmVhdGVTaXRlQ3RybClcblxuZnVuY3Rpb24gY3JlYXRlU2l0ZUN0cmwoJHNjb3BlLCBjcmVhdGVTZXJ2aWNlLCAkc3RhdGUpIHtcbiRzY29wZS5zaG93c2hpZnRzMSA9IGZhbHNlO1xuICAgIC8vIEdvZXMgZnJvbSBjcmVhdGUgc2l0ZSB0byBjcmVhdGUgZGF5cyBhbHNvIGNyZWF0ZXMgdGhlIGZpcnN0IHBhcnQgb2YgdGhlIHNpdGVcbiAgICAkc2NvcGUubmV4dCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgY3JlYXRlU2VydmljZS5jcmVhdGVzaXRlKG5hbWUpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRzY29wZS5zaXRlSWQgPSByZXNwb25zZS5kYXRhWzBdLnNpdGVfaWQ7XG4gICAgICAgICAgICBjcmVhdGVTZXJ2aWNlLnNpdGU9JHNjb3BlLnNpdGVJZDtcbiAgICAgICAgICAgICAgJHN0YXRlLmdvKCdjcmVhdGVzaXRlZGF5cycpO1xuICAgICAgICAgIH0pO1xuXG4gICAgfVxuICAgIC8vIE9wZW5zIHN1YnZpZXcgZnJvbSBjcmVhdGUgZGF5cyBpbnRvIGNyZWF0ZSBob3Vyc1xuICAgICRzY29wZS5jcmVhdGVob3VycyA9IGZ1bmN0aW9uKGRheSkge1xuICAgICAgICBjcmVhdGVTZXJ2aWNlLmRheSA9IGRheTtcbiAgICAgICAgJHN0YXRlLmdvKCdob3VyJyk7XG4gICAgfVxuICAgIC8vIGNsZWFycyBhbGwgb2YgdGhlIGNsb2NrIGluZm9cbiAgICAkc2NvcGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJHNjb3BlLnNoaWZ0ID0gbnVsbDtcbiAgICB9O1xuICAgIC8vIGNsb2NrIHN0ZXAgaW5jcmVhc2VzXG4gICAgJHNjb3BlLmhzdGVwID0gMTtcbiAgICAkc2NvcGUubXN0ZXAgPSAxNTtcblxuICAgIC8vIGNyZWF0ZXMgdGhlIHNoaWZ0IG9iamVjdCBhbmQgdGhlbiBwdXNoZXMgaXQgaW50byB0aGUgc2VydmljZVxuICAgICRzY29wZS5nZXRNb3JlSG91cnMgPSBmdW5jdGlvbihzaGlmdCkge1xuXG5cbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBzaGlmdCkge1xuICAgICAgICAgICAgc2hpZnRbcHJvcF0gPSAobmV3IERhdGUoc2hpZnRbcHJvcF0pKS5nZXRIb3VycygpICsgJzonICsgKG5ldyBEYXRlKHNoaWZ0W3Byb3BdKSkuZ2V0TWludXRlcygpXG4gICAgICAgIH1cbiAgICAgICAgc2hpZnQuY29udHJhY3RfZGF5ID0gY3JlYXRlU2VydmljZS5kYXk7XG4gICAgICAgIHNoaWZ0LnNpdGVJZCA9IGNyZWF0ZVNlcnZpY2Uuc2l0ZTtcbiAgICAgICAgc2hpZnQuc2l0ZV9pZF9mayA9IGNyZWF0ZVNlcnZpY2Uuc2l0ZTtcblxuICAgICAgICAkc2NvcGUuYWRkdG9TaGlmdHMoc2hpZnQpO1xuICAgICAgICAgIH07XG5cblxuICAgICRzY29wZS5lbXBsb3llZUlkO1xuICAgIC8vIGNyZWF0ZXMgYW4gZW1wbG95ZWUgYW5kIHJldHVybnMgdGhhdCBpZFxuICAgICRzY29wZS5jcmVhdGVFbXBsb3llZSA9IGZ1bmN0aW9uKGVtcGxveWVlKSB7XG4gICAgICAgIGNyZWF0ZVNlcnZpY2UuY3JlYXRlZW1wbG95ZWUoZW1wbG95ZWUpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAkc2NvcGUuZW1wbG95ZWVJZCA9IHJlc3BvbnNlLmRhdGFbMF0udXNlcl9pZDtcblxuICAgICAgICB9KVxuICAgIH1cblxuICAgICRzY29wZS5hZGR0b1NoaWZ0cyA9IGZ1bmN0aW9uKHNoaWZ0KXtcbiAgICAgIGNvbnNvbGUubG9nKHNoaWZ0KTtcbiAgICAgIGNyZWF0ZVNlcnZpY2UuYWRkdG9TaGlmdHMoc2hpZnQpO1xuICAgICAgJHN0YXRlLmdvKCdjcmVhdGVzaXRlZGF5cycpO1xuICAgIH1cblxuXG4gICAgJHNjb3BlLmdldFRpbWVzPWZ1bmN0aW9uKCl7XG4gICAgICBjcmVhdGVTZXJ2aWNlLnNoaWZ0cy5mb3JFYWNoKGZ1bmN0aW9uKHZhbCl7XG4gICAgICAgIGNvbnNvbGUubG9nKHZhbCk7XG4gICAgICAgIGlmKCF2YWwpe1xuICAgICAgICAgIHZhbCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgY3JlYXRlU2VydmljZS5jcmVhdGVob3Vycyh2YWwpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHt9KTtcbiAgICAgIH1cbiAgICAgIH0pXG5cbiAgICB9XG5cblxuICAgICRzY29wZS5waWNrU2hpZnQgPSBmdW5jdGlvbih2KXtcblxuICAgIGlmKHYgPT09IDEpe1xuICAgICAgJHNjb3BlLnNob3dzaGlmdHMxID0gISRzY29wZS5zaG93c2hpZnRzMTtcbiAgICB9XG4gICAgaWYodiA9PT0gMil7XG4gICAgICAkc2NvcGUuc2hvd3NoaWZ0czIgPSAhJHNjb3BlLnNob3dzaGlmdHMyO1xuICAgIH1cbiAgICBpZih2ID09PSAzKXtcbiAgICAgICRzY29wZS5zaG93c2hpZnRzMyA9ICEkc2NvcGUuc2hvd3NoaWZ0czM7XG4gICAgfVxuICAgIGlmKHYgPT09IDQpe1xuICAgICAgJHNjb3BlLnNob3dzaGlmdHM0ID0gISRzY29wZS5zaG93c2hpZnRzNDtcbiAgICB9XG5cbiAgICB9XG5cbn0gLy9lbmQgb2YgY29udHJvbGxlclxuIiwiXG5hbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuY29udHJvbGxlcignc2NoZWR1bGVDdHJsJywgc2NoZWR1bGVDdHJsKVxuXG5mdW5jdGlvbiBzY2hlZHVsZUN0cmwoJHNjb3BlLCBvdmVydmlld1NlcnZpY2UsICRzdGF0ZSkge1xuXG4gICAgLy8gdmFyIHNpdGVBcnJheSA9IFtdO1xuXG4gICAgb3ZlcnZpZXdTZXJ2aWNlLm92ZXJWaWV3U2l0ZXMoKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgLy8gY29uc29sZS5sb2cocmVzLmRhdGEpO1xuICAgICAgICB2YXIgc2l0ZU9iaiA9IHJlcy5kYXRhO1xuICAgICAgICAkc2NvcGUuc2l0ZW92ZXJ2aWV3ID0gcmVzLmRhdGE7XG4gICAgfSk7XG4gICAgLy8gZnVuY3Rpb24gd2lsbCBoaWRlIHNpdGVzIGFuZCB0aGVuIGJyaW5nIGluIHNpdGUgaW5mb1xuICAgICRzY29wZS5zY2hlZHVsZVNoaWZ0ID0gZnVuY3Rpb24oaWROdW0pIHtcbiAgICAgIG92ZXJ2aWV3U2VydmljZS5pZE51bVZhcihpZE51bS5zaXRlX2lkKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGlkTnVtLnNpdGVfaWQpO1xuICAgICAgb3ZlcnZpZXdTZXJ2aWNlLmlkTnVtVmFyID0gaWROdW0uc2l0ZV9pZDtcbiAgICAgICRzdGF0ZS5nbygnc2VsZWN0c2hpZnQnKVxuICAgIH1cblxuXG59IC8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKS5jb250cm9sbGVyKCdzY2hlZHVsZWhvdXJzQ3RybCcsIHNjaGVkdWxlaG91cnNDdHJsKVxuXG5mdW5jdGlvbiBzY2hlZHVsZWhvdXJzQ3RybCgkc2NvcGUsIG92ZXJ2aWV3U2VydmljZSwgJHN0YXRlKSB7XG5cblxuICAgIG92ZXJ2aWV3U2VydmljZS5zaG93SG91cnMob3ZlcnZpZXdTZXJ2aWNlLmlkTnVtVmFyKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgY29uc29sZS5sb2cob3ZlcnZpZXdTZXJ2aWNlLmlkTnVtVmFyKTtcbiAgICAgICAgJHNjb3BlLmhvdXJzID0gcmVzLmRhdGE7XG4gICAgICAgICRzY29wZS5zaGlmdHMgPSByZXMuZGF0YTtcblxuICAgIH0pXG5cbiAgICB2YXIgc2VsZWN0ZWRTaGlmdHMgPSBbXTtcbiAgICAkc2NvcGUuYWRkU2hpZnROdW0gPSBmdW5jdGlvbihjb250cmFjdElkLCBzaGlmdE51bSkge1xuICAgICAgLy8gY29uc29sZS5sb2coY29udHJhY3RJZCwnY29udHJhY3RJZCcpO1xuICAgICAgLy8gY29uc29sZS5sb2coc2hpZnROdW0sJ3NoaWZ0TnVtJyk7XG4gICAgICAgIG92ZXJ2aWV3U2VydmljZS5nZXRVc2VySWQoKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcywgJ2dldFVzZXJJZCcpO1xuICAgICAgICAgICAgdmFyIGVtcElkID0gcmVzLmRhdGEucGFzc3BvcnQudXNlci51c2VyX2lkO1xuICAgICAgICAgICAgaWYgKHNoaWZ0TnVtKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRTaGlmdHMucHVzaCh7c2hpZnRfbnVtOiBzaGlmdE51bSwgY29udHJhY3RfdGltZV9mazogY29udHJhY3RJZCwgc2l0ZV9pZF9mazogJHNjb3BlLnNoaWZ0c1swXS5zaXRlX2lkX2ZrLCB1c2VyX2lkX2ZrOiBlbXBJZH0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHNlbGVjdGVkU2hpZnRzLm1hcChmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbC5jb250cmFjdF90aW1lX2ZrO1xuICAgICAgICAgICAgICAgIH0pLmluZGV4T2YoY29udHJhY3RJZCk7XG5cbiAgICAgICAgICAgICAgICBzZWxlY3RlZFNoaWZ0cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG5cbiAgICB9XG5cbiAgICAkc2NvcGUuc3VibWl0RW1wU2hpZnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICBjb25zb2xlLmxvZygnZmlyZWQnKTtcbiAgICAgIGNvbnNvbGUubG9nKHNlbGVjdGVkU2hpZnRzKTtcbiAgICAgICAgc2VsZWN0ZWRTaGlmdHMuZm9yRWFjaChmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgIG92ZXJ2aWV3U2VydmljZS5lbXBsb3llZVNjaGVkdWxlKHZhbCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge30pXG4gICAgICAgIH0pXG4gICAgICAgIHNlbGVjdGVkU2hpZnRzID0gW107XG4gICAgfVxuXG59IC8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLmNvbnRyb2xsZXIoJ3JlcXVlc3RjaGFuZ2VDdHJsJywgcmVxdWVzdGNoYW5nZUN0cmwpXG5cblxuZnVuY3Rpb24gcmVxdWVzdGNoYW5nZUN0cmwoJHNjb3BlKXtcblxuXG5cblxuXG59Ly9lbmQgb2YgY29udHJvbGxlclxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpLmNvbnRyb2xsZXIoJ2Z1bGxzaXRlQ3RybCcsIGZ1bGxzaXRlQ3RybCk7XG5cbmZ1bmN0aW9uIGZ1bGxzaXRlQ3RybCgkc2NvcGUsIHVwZGF0ZVNlcnZpY2UsICRzdGF0ZSwkZmlsdGVyKSB7XG5cbnZhciBzaXRlU2VydmljZSA9IHVwZGF0ZVNlcnZpY2Uuc2l0ZVZpZXdcbmNvbnNvbGUubG9nKHNpdGVTZXJ2aWNlKTtcblxuICAgIHVwZGF0ZVNlcnZpY2UuYWxsU2l0ZUluZm8oKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXMuZGF0YSk7XG4gICAgICAgICRzY29wZS5zaXRldXBkYXRlID0gcmVzLmRhdGEuc2l0ZVswXTtcbiAgICAgICAgJHNjb3BlLmJlZ2ludGltZWNoYW5nZSA9IHJlcy5kYXRhLnNpdGVbMF0uY29udHJhY3RfYmVnaW47XG4gICAgICAgICRzY29wZS5lbmR0aW1lY2hhbmdlID0gcmVzLmRhdGEuc2l0ZVswXS5jb250cmFjdF9lbmQ7XG4gICAgICAgICRzY29wZS5zaXRldXBkYXRlLmNvbnRyYWN0X2JlZ2luID0gJGZpbHRlcignZGF0ZScpKCRzY29wZS5iZWdpbnRpbWVjaGFuZ2UpO1xuICAgICAgICAkc2NvcGUuc2l0ZXVwZGF0ZS5jb250cmFjdF9lbmQgPSAkZmlsdGVyKCdkYXRlJykoJHNjb3BlLmVuZHRpbWVjaGFuZ2UpO1xuICAgICAgICAvLyAkc2NvcGUuY2hlY2tGb3JOdWxsID0gcmVzLmRhdGEuaG91cnNhbmRzaXRlO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUuY2hlY2tGb3JOdWxsKTtcbiAgICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEuaG91cnNhbmRzaXRlKTtcbiAgICAgICAgJHNjb3BlLnRpbWVzID0gcmVzLmRhdGEuaG91cnNhbmRzaXRlO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLnN1Ym1pdFVwZGF0ZSA9IGZ1bmN0aW9uKHNpdGUsIHRpbWUpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coc2l0ZSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRpbWUpO1xuICAgICAgICB2YXIgc2l0ZUlkTnVtID0gc2l0ZS5zaXRlX2lkO1xuICAgICAgICB1cGRhdGVTZXJ2aWNlLnVwZGF0ZXNpdGUoc2l0ZUlkTnVtLCBzaXRlKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7fSk7XG4gICAgICAgIHRpbWUuZm9yRWFjaChmdW5jdGlvbih2YWwpIHtcblxuICAgICAgICAgICAgdmFyIHNpdGVJZCA9IHZhbC5jb250cmFjdF90aW1lX2lkO1xuICAgICAgICAgICAgdXBkYXRlU2VydmljZS51cGRhdGVob3VycyhzaXRlSWQsIHZhbCkudGhlbihmdW5jdGlvbihyZXMpIHt9KTtcbiAgICAgICAgICAgIHNpdGVJZCA9IDA7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbn0gLy9lbmQgb2YgY29udHJvbGxlclxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpLmNvbnRyb2xsZXIoJ3VwZGF0ZVNpdGVDdHJsJywgdXBkYXRlU2l0ZUN0cmwpO1xuXG5mdW5jdGlvbiB1cGRhdGVTaXRlQ3RybCgkc2NvcGUsIHVwZGF0ZVNlcnZpY2UsICRzdGF0ZSkge1xuXG5cblxuICAgIHVwZGF0ZVNlcnZpY2UudXBkYXRlU2l0ZSgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgJHNjb3BlLnVwZGF0ZXNpdGVzID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgLy8gcmV0dXJuIHVwZGF0ZVNlcnZpY2Uuc2l0ZVZpZXcgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZS5kYXRhKTtcbiAgICB9KTtcblxuICAgIC8vICRzY29wZS5jaGVja051bGwgPSB0cnVlO1xuXG4gICAgJHNjb3BlLnVwZGF0ZVNpdGUgPSBmdW5jdGlvbihzaXRldmlldykge1xuICAgICAgdXBkYXRlU2VydmljZS5nZXRTaXRldmlldyA9IHNpdGV2aWV3O1xuICAgICAgY29uc29sZS5sb2coc2l0ZXZpZXcpO1xuICAgIC8vICB1cGRhdGVTZXJ2aWNlLnNob3dIb3VycyhzaXRldmlldy5zaXRlX2lkKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2codXBkYXRlU2VydmljZS5zaXRlVmlldyk7XG4gICAgICAgICRzdGF0ZS5nbygndXBkYXRlZnVsbHNpdGUnKTtcbiAgfTtcblxuICAgICAgICAvLyB1cGRhdGVTZXJ2aWNlLmFsbFNpdGVJbmZvKHVwZGF0ZVNlcnZpY2Uuc2l0ZXZpZXcuc2l0ZV9pZCkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgLy8gICAgIC8vIGNvbnNvbGUubG9nKHJlcy5kYXRhKTtcbiAgICAgICAgLy8gICAgICRzY29wZS5zaXRldXBkYXRlID0gcmVzLmRhdGEuc2l0ZVswXTtcbiAgICAgICAgLy8gICAgICRzY29wZS5iZWdpbnRpbWVjaGFuZ2UgPSByZXMuZGF0YS5zaXRlWzBdLmNvbnRyYWN0X2JlZ2luO1xuICAgICAgICAvLyAgICAgJHNjb3BlLmVuZHRpbWVjaGFuZ2UgPSByZXMuZGF0YS5zaXRlWzBdLmNvbnRyYWN0X2VuZDtcbiAgICAgICAgLy8gICAgICRzY29wZS5zaXRldXBkYXRlLmNvbnRyYWN0X2JlZ2luID0gJGZpbHRlcignZGF0ZScpKCRzY29wZS5iZWdpbnRpbWVjaGFuZ2UpO1xuICAgICAgICAvLyAgICAgJHNjb3BlLnNpdGV1cGRhdGUuY29udHJhY3RfZW5kID0gJGZpbHRlcignZGF0ZScpKCRzY29wZS5lbmR0aW1lY2hhbmdlKTtcbiAgICAgICAgLy8gICAgIC8vICRzY29wZS5jaGVja0Zvck51bGwgPSByZXMuZGF0YS5ob3Vyc2FuZHNpdGU7XG4gICAgICAgIC8vICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUuY2hlY2tGb3JOdWxsKTtcbiAgICAgICAgLy8gICAgICRzY29wZS50aW1lcyA9IHJlcy5kYXRhLmhvdXJzYW5kc2l0ZTtcbiAgICAgICAgLy8gfSk7XG5cblxuXG4gICAgLy8gJHNjb3BlLnN1Ym1pdFVwZGF0ZSA9IGZ1bmN0aW9uKHNpdGUsdGltZSl7XG4gICAgLy8gICAvLyBjb25zb2xlLmxvZyhzaXRlKTtcbiAgICAvLyAgICAgLy8gY29uc29sZS5sb2codGltZSk7XG4gICAgLy8gICB2YXIgc2l0ZUlkTnVtID0gc2l0ZS5zaXRlX2lkO1xuICAgIC8vICAgdXBkYXRlU2VydmljZS51cGRhdGVzaXRlKHNpdGVJZE51bSxzaXRlKVxuICAgIC8vICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgIC8vICAgfSk7XG4gICAgLy8gICB0aW1lLmZvckVhY2goZnVuY3Rpb24odmFsKXtcbiAgICAvL1xuICAgIC8vICAgICB2YXIgc2l0ZUlkID0gdmFsLmNvbnRyYWN0X3RpbWVfaWQ7XG4gICAgLy8gICAgIHVwZGF0ZVNlcnZpY2UudXBkYXRlaG91cnMoc2l0ZUlkLHZhbClcbiAgICAvLyAgICAgLnRoZW4oZnVuY3Rpb24ocmVzKXt9KTtcbiAgICAvLyAgICAgc2l0ZUlkID0wO1xuICAgIC8vICAgfSk7XG4gICAgLy8gfTtcblxuICAgIC8vIHVwZGF0ZVNlcnZpY2Uuc2hvd2VtcGxveWVlKClcbiAgICAvLyAudGhlbihmdW5jdGlvbihlbXApe1xuICAgIC8vICAgY29uc29sZS5sb2coZW1wKTtcbiAgICAvL1xuICAgIC8vICAgJHNjb3BlLmVtcGxveWVlID0gZW1wLmRhdGE7XG4gICAgLy8gfSk7XG5cbiAgICAkc2NvcGUudXBkYXRlRW1wID0gZnVuY3Rpb24oZW1wKXtcbiAgICAgICRzY29wZS5zaG93dXBkYXRlID0gZmFsc2U7XG4gICAgICAkc2NvcGUuZW1wdXBkYXRlID0gZW1wO1xuICAgICAgLy8gY29uc29sZS5sb2coZW1wKTtcbiAgICAgICRzdGF0ZS5nbygnc2hvd2VtcGxveWVlLnVwZGF0ZWVtcGxveWVlJyk7XG4gICAgfTtcblxuICAgICRzY29wZS5zdWJtaXRFbXBsb3llZSA9IGZ1bmN0aW9uKGVtcGNoYW5nZSl7XG4gICAgICB2YXIgZW1wbG95ZWVJZCA9IGVtcGNoYW5nZS51c2VyX2lkO1xuICAgICAgdXBkYXRlU2VydmljZS51cGRhdGVlbXBsb3llZShlbXBsb3llZUlkLGVtcGNoYW5nZSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJlcyl7fSk7XG4gICAgfTtcblxuXG5cbn0gLy9lbmQgb2YgY29udHJvbGxlclxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpLnNlcnZpY2UoJ2NyZWF0ZVNlcnZpY2UnLCBjcmVhdGVTZXJ2aWNlKTtcblxuZnVuY3Rpb24gY3JlYXRlU2VydmljZSgkaHR0cCwgJHEpIHtcbiAgICAvLyB0aGlzIHdpbGwgY3JlYXRlIHRoZSBiZWdpbm5pbmcgb2YgdGhlIHNpdGUgdy9vIGRheXMgYW5kIGhvdXJzXG4gICAgdmFyIHNpdGVJZDtcbiAgICB0aGlzLnNoaWZ0cyA9IFtdO1xuICAgIHRoaXMuc2l0ZTtcbiAgICB0aGlzLmRheTtcbiAgICB0aGlzLmNyZWF0ZXNpdGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgcmV0dXJuICRodHRwKHttZXRob2Q6IFwiUE9TVFwiLCB1cmw6IFwiL2NyZWF0ZXNpdGVcIiwgZGF0YTogb2JqfSkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgIHNpdGVJZCA9IHJlcy5kYXRhWzBdLnNpdGVfaWQ7XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8vIHRoaXMgd2lsbCBjcmVhdGUgdGhlIHJlc3Qgb2YgdGhlIHNpdGUgLS0gZGF5cyBhbmQgaG91cnNcbiAgICB0aGlzLmNyZWF0ZWhvdXJzID0gZnVuY3Rpb24oc2hpZnQpIHtcbiAgICAgICAgY29uc29sZS5sb2coc2hpZnQpO1xuICAgICAgICBzaGlmdC5zaXRlX2lkID0gc2l0ZUlkO1xuICAgICAgICByZXR1cm4gJGh0dHAoe21ldGhvZDogXCJQT1NUXCIsIHVybDogXCIvY3JlYXRlZGF5YW5kaG91cnNcIiwgZGF0YTogc2hpZnR9KTtcbiAgICB9O1xuICAgIC8vIHRoaXMgd2lsbCBjcmVhdGUgYW4gZW1wbG95ZWVcbiAgICB2YXIgZW1wbG95ZWVJZDtcbiAgICB0aGlzLmNyZWF0ZWVtcGxveWVlID0gZnVuY3Rpb24oZW1wKSB7XG4gICAgICAgIHJldHVybiAkaHR0cCh7bWV0aG9kOiBcIlBPU1RcIiwgdXJsOiBcIi9jcmVhdGVlbXBsb3llZVwiLCBkYXRhOiBlbXB9KS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgZW1wbG95ZWVJZCA9IHJlcy5kYXRhWzBdLnVzZXJfaWQ7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlbXBsb3llZUlkKTtcbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyB0aGlzIG1ha2VzIGFuIGFsZXJ0IHNheWluZyB0aGUgc2l0ZSBoYXMgYmVlbiBjcmVhdGVkXG4gICAgdGhpcy5zaXRlYWxlcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgc3dhbCh7dGl0bGU6IFwiU2l0ZSBDcmVhdGVkIVwiLCB0eXBlOiBcInN1Y2Nlc3NcIiwgY29uZmlybUJ1dHRvblRleHQ6IFwiT2tcIiwgYWxsb3dPdXRzaWRlQ2xpY2s6IHRydWV9KTtcblxuICAgIH07XG4gICAgLy8gdGhpcyBtYWtlcyBhbiBhbGVydCBzYXlpbmcgdGhhdCB0aGUgZW1wbG95ZWUgaGFzIGJlZW4gY3JlYXRlZFxuICAgIHRoaXMuZW1wbG95ZWVhbGVydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBzd2FsKHt0aXRsZTogXCJFbXBsb3llZSBDcmVhdGVkIVwiLCB0eXBlOiBcInN1Y2Nlc3NcIiwgY29uZmlybUJ1dHRvblRleHQ6IFwiT2tcIiwgYWxsb3dPdXRzaWRlQ2xpY2s6IHRydWV9KTtcblxuICAgIH07XG5cbiAgICB0aGlzLmFkZHRvU2hpZnRzID0gZnVuY3Rpb24oc2hpZnRzKSB7XG4gICAgICAgIHRoaXMuc2hpZnRzLnB1c2goc2hpZnRzKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5zaGlmdHMpO1xuXG4gICAgfTtcblxufSAvL2VuZCBvZiBzZXJ2aWNlXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5jb250cm9sbGVyKCdlbXB1cGRhdGVDdHJsJyxlbXB1cGRhdGVDdHJsKVxuXG5cbmZ1bmN0aW9uIGVtcHVwZGF0ZUN0cmwoJHNjb3BlLHVwZGF0ZVNlcnZpY2UsJHN0YXRlKXtcblxuXG4gIHVwZGF0ZVNlcnZpY2Uuc2hvd2VtcGxveWVlKClcbiAgLnRoZW4oZnVuY3Rpb24oZW1wKXtcbiAgICBjb25zb2xlLmxvZyhlbXApO1xuXG4gICAgJHNjb3BlLmVtcGxveWVlID0gZW1wLmRhdGE7XG4gIH0pO1xuXG5cblxuXG5cbn0vL2VuZCBvZiBjb250cm9sbGVyXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5jb250cm9sbGVyKCdmdWxsZW1wdXBkYXRlQ3RybCcsZnVsbGVtcHVwZGF0ZUN0cmwpXG5cblxuZnVuY3Rpb24gZnVsbGVtcHVwZGF0ZUN0cmwoJHNjb3BlLHVwZGF0ZVNlcnZpY2UsJHN0YXRlKXtcblxuXG5cblxufS8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLnNlcnZpY2UoJ2xvZ2luU2VydmljZScsbG9naW5TZXJ2aWNlKTtcblxuXG5mdW5jdGlvbiBsb2dpblNlcnZpY2UoJGh0dHApe1xuXG50aGlzLmdldExvZ2luID0gZnVuY3Rpb24obG9naW4pe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIlBPU1RcIixcbiAgICB1cmw6Jy9hdXRoL2xvZ2luJyxcbiAgICBkYXRhOiBsb2dpblxuICB9KTtcbn1cblxuXG5cbn0gLy9lbmQgb2Ygc2VydmljZVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uc2VydmljZSgnbWFpbnBhZ2VTZXJ2aWNlJyxtYWlucGFnZVNlcnZpY2UpO1xuXG5mdW5jdGlvbiBtYWlucGFnZVNlcnZpY2UoJGh0dHApe1xuXG50aGlzLmdldGN1cnJlbnQgPSBmdW5jdGlvbigpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIkdFVFwiLFxuICAgIHVybDogXCIvYXV0aC9jdXJyZW50XCJcbiAgfSlcbn1cblxudGhpcy5nZXRVc2VyU2l0ZXMgPSBmdW5jdGlvbih1c2VyU2l0ZUlkKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJHRVRcIixcbiAgICB1cmw6XCIvZ2V0VXNlclNpdGVzL1wiICsgdXNlclNpdGVJZFxuICB9KVxufVxuXG5cblxufS8vZW5kIG9mIHNlcnZpY2VcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLnNlcnZpY2UoJ292ZXJ2aWV3U2VydmljZScsb3ZlcnZpZXdTZXJ2aWNlKVxuXG5mdW5jdGlvbiBvdmVydmlld1NlcnZpY2UoJGh0dHApe1xuXG50aGlzLmlkTnVtVmFyID0gZnVuY3Rpb24odmFsKXtcbiAgaWYodmFsKXtcblxuICB9XG59O1xuXG5jb25zb2xlLmxvZyh0aGlzLmlkTnVtVmFyKTtcblxuLy8gdGhpcy5zaXRlVmlldyA9IHt9O1xuLy8gY29uc29sZS5sb2codGhpcy5zaXRlVmlldyk7XG5cblxudGhpcy5vdmVyVmlld1NpdGVzID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJHRVRcIixcbiAgICB1cmw6XCIvc2l0ZW92ZXJ2aWV3XCJcbiAgfSlcbn1cblxudGhpcy5zaG93RGF5cyA9IGZ1bmN0aW9uKGlkTnVtKXtcblxuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIkdFVFwiLFxuICAgIHVybDpcIi9zY2hlZHVsZURheXMvXCIgKyBpZE51bVxuICB9KVxufVxuXG50aGlzLnNob3dIb3VycyA9IGZ1bmN0aW9uKGlkTnVtKXtcbiAgLy8gY29uc29sZS5sb2coaWROdW0pO1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIkdFVFwiLFxuICAgIHVybDogXCIvc2NoZWR1bGVIb3Vycy9cIiArIGlkTnVtXG4gIH0pXG59XG5cbnRoaXMuZW1wbG95ZWVTY2hlZHVsZSA9IGZ1bmN0aW9uKHNjaGVkdWxlU2hpZnQpe1xuICAvLyBjb25zb2xlLmxvZyhzY2hlZHVsZVNoaWZ0KTtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJQT1NUXCIsXG4gICAgdXJsOlwiL2VtcGxveWVlc2NoZWR1bGVcIixcbiAgICBkYXRhOnNjaGVkdWxlU2hpZnRcbiAgfSlcbn1cblxudGhpcy5nZXRVc2VySW5mbyA9IGZ1bmN0aW9uKHVzZXJJZCl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiR0VUXCIsXG4gICAgdXJsOlwiL2dldFVzZXJJbmZvL1wiICsgdXNlcklkXG4gIH0pXG59XG5cbnRoaXMuZ2V0VXNlcklkID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJHRVRcIixcbiAgICB1cmw6XCIvYXV0aC9jdXJyZW50XCJcbiAgfSlcbn1cblxuXG59IC8vZW5kIG9mIHNlcnZpY2VcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLnNlcnZpY2UoJ3VwZGF0ZVNlcnZpY2UnLHVwZGF0ZVNlcnZpY2UpXG5cbmZ1bmN0aW9uIHVwZGF0ZVNlcnZpY2UoJGh0dHApe1xuXG4vLyB0aGlzLnNpdGVWaWV3O1xuLy9cbi8vIHRoaXMuZ2V0U2l0ZUlkID0gZnVuY3Rpb24odmFsKXtcbi8vICAgY29uc29sZS5sb2codmFsKTtcbi8vICAgcmV0dXJuIHZhbDtcbi8vIH1cbi8vXG4vLyAgIC8vIHRoaXMuc2l0ZVZpZXcgPSB2YWw7XG4vLyAgIGNvbnNvbGUubG9nKHRoaXMuc2l0ZVZpZXcpO1xuXG50aGlzLnNpdGVWaWV3ID0ge307XG5jb25zb2xlLmxvZyh0aGlzLnNpdGVWaWV3KTtcblxudGhpcy51cGRhdGVTaXRlID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJHRVRcIixcbiAgICB1cmw6Jy9zaXRlb3ZlcnZpZXcnXG4gIH0pXG59XG5cbnRoaXMuYWxsU2l0ZUluZm8gPSBmdW5jdGlvbihzaXRlSWQpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIkdFVFwiLFxuICAgIHVybDonL2dldHNpdGVhbmRob3Vycy8nICsgc2l0ZUlkXG4gIH0pXG59XG5cbnRoaXMudXBkYXRlc2l0ZSA9IGZ1bmN0aW9uKHVwZGF0ZUlkLHVwZGF0ZVNpdGUpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDogXCJQVVRcIixcbiAgICB1cmw6Jy91cGRhdGVzaXRlLycgKyB1cGRhdGVJZCxcbiAgICBkYXRhOiB1cGRhdGVTaXRlXG4gIH0pXG59XG5cbnRoaXMudXBkYXRlaG91cnMgPSBmdW5jdGlvbih1cGRhdGVJZCwgdXBkYXRlVGltZSl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOiBcIlBVVFwiLFxuICAgIHVybDonL3VwZGF0ZWhvdXJzLycgKyB1cGRhdGVJZCxcbiAgICBkYXRhOiB1cGRhdGVUaW1lXG4gIH0pXG59XG5cbnRoaXMudXBkYXRlZW1wbG95ZWUgPSBmdW5jdGlvbih1cGRhdGVJZCwgdXBkYXRlRW1wbG95ZWUpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDogXCJQVVRcIixcbiAgICB1cmw6ICcvdXBkYXRlZW1wbG95ZWUvJyArIHVwZGF0ZUlkLFxuICAgIGRhdGE6IHVwZGF0ZUVtcGxveWVlXG4gIH0pXG59XG5cbnRoaXMuc2hvd2VtcGxveWVlID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgdXJsOlwiL3ZpZXdlbXBsb3llZVwiXG4gIH0pXG59XG5cblxuXG5cbn0vL2VuZCBvZiBzZXJ2aWNlXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5jb250cm9sbGVyKCdzaWduaW5DdHJsJyxzaWduaW5DdHJsKVxuXG5mdW5jdGlvbiBzaWduaW5DdHJsKCRzY29wZSxsb2dpblNlcnZpY2UsJHN0YXRlKXtcblxuXG5cblxuJHNjb3BlLmxvZ2luID0ge1xuICB1c2VybmFtZTogJ2FAYS5jb20nLFxuICBwYXNzd29yZDogJ2EnXG59XG5cblxuJHNjb3BlLnN1Ym1pdGxvZ2luID0gZnVuY3Rpb24obG9naW4pe1xuICBsb2dpblNlcnZpY2UuZ2V0TG9naW4obG9naW4pXG4gICAgLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICAgIGlmKHJlcy5zdGF0dXMgPT09IDIwMCkgJHN0YXRlLmdvKCdtYWlucGFnZScpO1xuICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgY29uc29sZS5sb2coZXJyKVxuICAgIH0pO1xufVxuXG59Ly9lbmQgb2YgaG9tZUN0cmxcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLmFuaW1hdGlvbignLnNsaWRlLWRvd24nLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICBlbnRlcjogZnVuY3Rpb24oZWxlbWVudCwgZG9uZSkge1xuICAgICAgVHdlZW5NYXguZnJvbShlbGVtZW50LCAxLCB7b3BhY2l0eTowLCB5OjUwLCBvbkNvbXBsZXRlOmRvbmV9KVxuICAgIH0sXG4gICAgbGVhdmU6IGZ1bmN0aW9uKGVsZW1lbnQsIGRvbmUpIHtcbiAgICAgIFR3ZWVuTWF4LnRvKGVsZW1lbnQsIDEsIHtvcGFjaXR5OjAsIHk6NTAsIG9uQ29tcGxldGU6ZG9uZX0pXG4gICAgfVxuICB9XG59KTtcblxuLy8gKCcubWFpbi1jb250ZW50JywgW2Z1bmN0aW9uKCl7XG4vLyAgIHJldHVybiB7XG4vLyAgICAgZW50ZXI6IGZ1bmN0aW9uKGVsZW1lbnQsIGRvbmUpIHtcbi8vICAgICAgIFR3ZWVuTWF4LmZyb20oZWxlbWVudCwgMSwge29wYWNpdHk6MCwgeTo1MCwgb25Db21wbGV0ZTpkb25lfSlcbi8vICAgICB9LFxuLy8gICAgIGxlYXZlOiBmdW5jdGlvbihlbGVtZW50LCBkb25lKSB7XG4vLyAgICAgICBUd2Vlbk1heC50byhlbGVtZW50LCAxLCB7b3BhY2l0eTowLCB5OjUwLCBvbkNvbXBsZXRlOmRvbmV9KVxuLy8gICAgIH1cbi8vICAgfVxuLy8gfV0pXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuZGlyZWN0aXZlKCdtZW51RGlyZWN0aXZlJywgZnVuY3Rpb24oKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9zaGFyZWQvbWVudS9tZW51Lmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgICAgXG4gICAgICAgIH1cbiAgICB9XG5cbn0pIC8vZW5kIG9mIGRpcmVjdGl2ZVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpLmRpcmVjdGl2ZSgndGl0bGVEaXJlY3RpdmUnLCBmdW5jdGlvbigpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3NoYXJlZC9tZW51L3RpdGxlLmh0bWwnXG5cbiAgICAgIH1cblxufSkvL2VuZCBvZiBkaXJlY3RpdmVcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
