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

angular.module('keeperApp')
.controller('requestchangeCtrl', requestchangeCtrl)


function requestchangeCtrl($scope){





}//end of controller


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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5DdHJsLmpzIiwiY29tcG9uZW50cy9jcmVhdGVzaXRlL2NyZWF0ZVNpdGVDdHJsLmpzIiwiY29tcG9uZW50cy9tYWluL21haW5wYWdlQ3RybC5qcyIsImNvbXBvbmVudHMvcmVxdWVzdF9jaGFuZ2UvcmVxdWVzdF9jaGFuZ2VDdHJsLmpzIiwiY29tcG9uZW50cy9zY2hlZHVsZS9zY2hlZHVsZUN0cmwuanMiLCJjb21wb25lbnRzL3NjaGVkdWxlL3NjaGVkdWxlX2hvdXJzQ3RybC5qcyIsImNvbXBvbmVudHMvc2lnbmluL3NpZ25pbkN0cmwuanMiLCJjb21wb25lbnRzL3VwZGF0ZV9zaXRlL2Z1bGxzaXRlQ3RybC5qcyIsImNvbXBvbmVudHMvdXBkYXRlX3NpdGUvdXBkYXRlX3NpdGVDdHJsLmpzIiwic2hhcmVkL2FuaW1hdGlvbnMvdWktdmlldy1hbmltYXRpb24uanMiLCJzaGFyZWQvbWVudS9tZW51LWRpcmVjdGl2ZS5qcyIsInNoYXJlZC9tZW51L3RpdGxlLWRpcmVjdGl2ZS5qcyIsInNoYXJlZC9zZXJ2aWNlcy9jcmVhdGVTZXJ2aWNlLmpzIiwic2hhcmVkL3NlcnZpY2VzL2VtcHVwZGF0ZUN0cmwuanMiLCJzaGFyZWQvc2VydmljZXMvZnVsbGVtcHVwZGF0ZUN0cmwuanMiLCJzaGFyZWQvc2VydmljZXMvbG9naW5TZXJ2aWNlLmpzIiwic2hhcmVkL3NlcnZpY2VzL21haW5wYWdlU2VydmljZS5qcyIsInNoYXJlZC9zZXJ2aWNlcy9vdmVydmlld1NlcnZpY2UuanMiLCJzaGFyZWQvc2VydmljZXMvdXBkYXRlU2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcsIFsndWkucm91dGVyJywndWkuYm9vdHN0cmFwJywnbmdBbmltYXRlJywnc2F0ZWxsaXplciddKVxuLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkYXV0aFByb3ZpZGVyKSB7XG5cblxuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcblxuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdzaWduaW4nLHtcbiAgICAgIHVybDonLycsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9jb21wb25lbnRzL3NpZ25pbi9zaWduaW4uaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnc2lnbmluQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnbWFpbnBhZ2UnLHtcbiAgICAgIHVybDonL21haW5wYWdlJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2NvbXBvbmVudHMvbWFpbi9tYWlucGFnZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdtYWlucGFnZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ2NyZWF0ZXNpdGUnLHtcbiAgICAgIHVybDonL2NyZWF0ZXNpdGUnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL2NyZWF0ZXNpdGUvY3JlYXRlc2l0ZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6J2NyZWF0ZVNpdGVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdjcmVhdGVzaXRlZGF5cycsIHtcbiAgICAgIHVybDogJy9kYXlzJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2NvbXBvbmVudHMvY3JlYXRlc2l0ZS9jcmVhdGVzaXRlZGF5cy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdjcmVhdGVTaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnaG91cicse1xuICAgICAgdXJsOicvaG91cnMnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL2NyZWF0ZXNpdGUvY3JlYXRlaG91cnMuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnY3JlYXRlU2l0ZUN0cmwnXG4gICAgfSlcbiAgICAvLyAuc3RhdGUoJ3VwZGF0ZWVtcGxveWVlJyx7XG4gICAgLy8gICB1cmw6Jy91cGRhdGVlbXBsb3llZScsXG4gICAgLy8gICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvdXBkYXRlX3NpdGUvdXBkYXRlX2VtcGxveWVlLmh0bWwnLFxuICAgIC8vICAgY29udHJvbGxlcjondXBkYXRlU2l0ZUN0cmwnXG4gICAgLy8gfSlcbiAgICAuc3RhdGUoJ2NyZWF0ZWVtcGxveWVlJyx7XG4gICAgICB1cmw6Jy9jcmVhdGVlbXBsb3llZScsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvY3JlYXRlc2l0ZS9jcmVhdGVfZW1wbG95ZWUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOidjcmVhdGVTaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnc2NoZWR1bGUnLHtcbiAgICAgIHVybDonL3NjaGVkdWxlc2l0ZXMnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL3NjaGVkdWxlL3NjaGVkdWxlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjonc2NoZWR1bGVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdzZWxlY3RzaGlmdCcse1xuICAgICAgdXJsOicvc2NoZWR1bGVzaGlmdHMnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL3NjaGVkdWxlL3NjaGVkdWxlc2hpZnRzLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjonc2NoZWR1bGVob3Vyc0N0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3VwZGF0ZXNpdGUnLHtcbiAgICAgIHVybDonL3VwZGF0ZXNpdGUnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL3VwZGF0ZV9zaXRlL3VwZGF0ZV9zaXRlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjondXBkYXRlU2l0ZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3VwZGF0ZWZ1bGxzaXRlJyx7XG4gICAgICB1cmw6Jy9mdWxsc2l0ZXVwZGF0ZScsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvdXBkYXRlX3NpdGUvdXBkYXRlX2Z1bGxzaXRlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjonZnVsbHNpdGVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdzaG93ZW1wbG95ZWUnLHtcbiAgICAgIHVybDonL3ZpZXdlbXBsb3llZScsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvdXBkYXRlX3NpdGUvdmlld19lbXBsb3llZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6J2VtcHVwZGF0ZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3VwZGF0ZWVtcGxveWVlJyx7XG4gICAgICB1cmw6Jy91cGRhdGVlbXBsb3llZScsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvdXBkYXRlX3NpdGUvdXBkYXRlX2VtcGxveWVlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ2Z1bGxlbXB1cGRhdGVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdyZXF1ZXN0Y2hhbmdlJyx7XG4gICAgICB1cmw6Jy9yZXF1ZXN0Y2hhbmdlJyxcbiAgICAgIHRlbXBsYXRlVXJsOidhcHAvY29tcG9uZW50cy9yZXF1ZXN0X2NoYW5nZS9yZXF1ZXN0X2NoYW5nZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6J3JlcXVlc3RjaGFuZ2VDdHJsJ1xuICAgIH0pO1xuXG5cblxuXG5cblxufSk7Ly9lbmQgb2YgYW5ndWxhciBhcHBcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLmNvbnRyb2xsZXIoJ21haW5DdHJsJyxtYWluQ3RybClcblxuZnVuY3Rpb24gbWFpbkN0cmwoJHNjb3BlKXtcblxuJHNjb3BlLnRlc3Q9XCJoZWxsb1wiXG5cblxufSAvL2VuZCBvZiBjb250cm9sbGVyXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuY29udHJvbGxlcignY3JlYXRlU2l0ZUN0cmwnLCBjcmVhdGVTaXRlQ3RybClcblxuZnVuY3Rpb24gY3JlYXRlU2l0ZUN0cmwoJHNjb3BlLCBjcmVhdGVTZXJ2aWNlLCAkc3RhdGUpIHtcbiRzY29wZS5zaG93c2hpZnRzMSA9IGZhbHNlO1xuICAgIC8vIEdvZXMgZnJvbSBjcmVhdGUgc2l0ZSB0byBjcmVhdGUgZGF5cyBhbHNvIGNyZWF0ZXMgdGhlIGZpcnN0IHBhcnQgb2YgdGhlIHNpdGVcbiAgICAkc2NvcGUubmV4dCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgY3JlYXRlU2VydmljZS5jcmVhdGVzaXRlKG5hbWUpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRzY29wZS5zaXRlSWQgPSByZXNwb25zZS5kYXRhWzBdLnNpdGVfaWQ7XG4gICAgICAgICAgICBjcmVhdGVTZXJ2aWNlLnNpdGU9JHNjb3BlLnNpdGVJZDtcbiAgICAgICAgICAgICAgJHN0YXRlLmdvKCdjcmVhdGVzaXRlZGF5cycpO1xuICAgICAgICAgIH0pO1xuXG4gICAgfVxuICAgIC8vIE9wZW5zIHN1YnZpZXcgZnJvbSBjcmVhdGUgZGF5cyBpbnRvIGNyZWF0ZSBob3Vyc1xuICAgICRzY29wZS5jcmVhdGVob3VycyA9IGZ1bmN0aW9uKGRheSkge1xuICAgICAgICBjcmVhdGVTZXJ2aWNlLmRheSA9IGRheTtcbiAgICAgICAgJHN0YXRlLmdvKCdob3VyJyk7XG4gICAgfVxuICAgIC8vIGNsZWFycyBhbGwgb2YgdGhlIGNsb2NrIGluZm9cbiAgICAkc2NvcGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJHNjb3BlLnNoaWZ0ID0gbnVsbDtcbiAgICB9O1xuICAgIC8vIGNsb2NrIHN0ZXAgaW5jcmVhc2VzXG4gICAgJHNjb3BlLmhzdGVwID0gMTtcbiAgICAkc2NvcGUubXN0ZXAgPSAxNTtcblxuICAgIC8vIGNyZWF0ZXMgdGhlIHNoaWZ0IG9iamVjdCBhbmQgdGhlbiBwdXNoZXMgaXQgaW50byB0aGUgc2VydmljZVxuICAgICRzY29wZS5nZXRNb3JlSG91cnMgPSBmdW5jdGlvbihzaGlmdCkge1xuXG5cbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBzaGlmdCkge1xuICAgICAgICAgICAgc2hpZnRbcHJvcF0gPSAobmV3IERhdGUoc2hpZnRbcHJvcF0pKS5nZXRIb3VycygpICsgJzonICsgKG5ldyBEYXRlKHNoaWZ0W3Byb3BdKSkuZ2V0TWludXRlcygpXG4gICAgICAgIH1cbiAgICAgICAgc2hpZnQuY29udHJhY3RfZGF5ID0gY3JlYXRlU2VydmljZS5kYXk7XG4gICAgICAgIHNoaWZ0LnNpdGVJZCA9IGNyZWF0ZVNlcnZpY2Uuc2l0ZTtcbiAgICAgICAgc2hpZnQuc2l0ZV9pZF9mayA9IGNyZWF0ZVNlcnZpY2Uuc2l0ZTtcblxuICAgICAgICAkc2NvcGUuYWRkdG9TaGlmdHMoc2hpZnQpO1xuICAgICAgICAgIH07XG5cblxuICAgICRzY29wZS5lbXBsb3llZUlkO1xuICAgIC8vIGNyZWF0ZXMgYW4gZW1wbG95ZWUgYW5kIHJldHVybnMgdGhhdCBpZFxuICAgICRzY29wZS5jcmVhdGVFbXBsb3llZSA9IGZ1bmN0aW9uKGVtcGxveWVlKSB7XG4gICAgICAgIGNyZWF0ZVNlcnZpY2UuY3JlYXRlZW1wbG95ZWUoZW1wbG95ZWUpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAkc2NvcGUuZW1wbG95ZWVJZCA9IHJlc3BvbnNlLmRhdGFbMF0udXNlcl9pZDtcblxuICAgICAgICB9KVxuICAgIH1cblxuICAgICRzY29wZS5hZGR0b1NoaWZ0cyA9IGZ1bmN0aW9uKHNoaWZ0KXtcbiAgICAgIGNvbnNvbGUubG9nKHNoaWZ0KTtcbiAgICAgIGNyZWF0ZVNlcnZpY2UuYWRkdG9TaGlmdHMoc2hpZnQpO1xuICAgICAgJHN0YXRlLmdvKCdjcmVhdGVzaXRlZGF5cycpO1xuICAgIH1cblxuXG4gICAgJHNjb3BlLmdldFRpbWVzPWZ1bmN0aW9uKCl7XG4gICAgICBjcmVhdGVTZXJ2aWNlLnNoaWZ0cy5mb3JFYWNoKGZ1bmN0aW9uKHZhbCl7XG4gICAgICAgIGNvbnNvbGUubG9nKHZhbCk7XG4gICAgICAgIGlmKCF2YWwpe1xuICAgICAgICAgIHZhbCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgY3JlYXRlU2VydmljZS5jcmVhdGVob3Vycyh2YWwpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHt9KTtcbiAgICAgIH1cbiAgICAgIH0pXG5cbiAgICB9XG5cblxuICAgICRzY29wZS5waWNrU2hpZnQgPSBmdW5jdGlvbih2KXtcblxuICAgIGlmKHYgPT09IDEpe1xuICAgICAgJHNjb3BlLnNob3dzaGlmdHMxID0gISRzY29wZS5zaG93c2hpZnRzMTtcbiAgICB9XG4gICAgaWYodiA9PT0gMil7XG4gICAgICAkc2NvcGUuc2hvd3NoaWZ0czIgPSAhJHNjb3BlLnNob3dzaGlmdHMyO1xuICAgIH1cbiAgICBpZih2ID09PSAzKXtcbiAgICAgICRzY29wZS5zaG93c2hpZnRzMyA9ICEkc2NvcGUuc2hvd3NoaWZ0czM7XG4gICAgfVxuICAgIGlmKHYgPT09IDQpe1xuICAgICAgJHNjb3BlLnNob3dzaGlmdHM0ID0gISRzY29wZS5zaG93c2hpZnRzNDtcbiAgICB9XG5cbiAgICB9XG5cbn0gLy9lbmQgb2YgY29udHJvbGxlclxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcignbWFpbnBhZ2VDdHJsJyxtYWlucGFnZUN0cmwpO1xuXG5mdW5jdGlvbiBtYWlucGFnZUN0cmwoJHNjb3BlLG1haW5wYWdlU2VydmljZSxvdmVydmlld1NlcnZpY2Upe1xuXG5tYWlucGFnZVNlcnZpY2UuZ2V0Y3VycmVudCgpXG4udGhlbihmdW5jdGlvbihyZXMpe1xuICB2YXIgc2l0ZVVzZXJJZCA9IHJlcy5kYXRhLnBhc3Nwb3J0LnVzZXIudXNlcl9pZDtcbiAgJHNjb3BlLnVzZXJuYW1lID0gcmVzLmRhdGEucGFzc3BvcnQudXNlcjtcbiAgbWFpbnBhZ2VTZXJ2aWNlLmdldFVzZXJTaXRlcyhzaXRlVXNlcklkKVxuICAudGhlbihmdW5jdGlvbih1c2VyU2l0ZXMpe1xuICAgICRzY29wZS51c2Vyc2l0ZXMgPSB1c2VyU2l0ZXMuZGF0YTtcbiAgY29uc29sZS5sb2codXNlclNpdGVzLmRhdGEpO1xuXG4gIH0pXG5cblxufSlcblxuXG5cblxuXG59Ly9lbmQgb2YgbWFpbnBhZ2VDdHJsXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5jb250cm9sbGVyKCdyZXF1ZXN0Y2hhbmdlQ3RybCcsIHJlcXVlc3RjaGFuZ2VDdHJsKVxuXG5cbmZ1bmN0aW9uIHJlcXVlc3RjaGFuZ2VDdHJsKCRzY29wZSl7XG5cblxuXG5cblxufS8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsIlxuYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpLmNvbnRyb2xsZXIoJ3NjaGVkdWxlQ3RybCcsIHNjaGVkdWxlQ3RybClcblxuZnVuY3Rpb24gc2NoZWR1bGVDdHJsKCRzY29wZSwgb3ZlcnZpZXdTZXJ2aWNlLCAkc3RhdGUpIHtcblxuICAgIC8vIHZhciBzaXRlQXJyYXkgPSBbXTtcblxuICAgIG92ZXJ2aWV3U2VydmljZS5vdmVyVmlld1NpdGVzKCkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKHJlcy5kYXRhKTtcbiAgICAgICAgdmFyIHNpdGVPYmogPSByZXMuZGF0YTtcbiAgICAgICAgJHNjb3BlLnNpdGVvdmVydmlldyA9IHJlcy5kYXRhO1xuICAgIH0pO1xuICAgIC8vIGZ1bmN0aW9uIHdpbGwgaGlkZSBzaXRlcyBhbmQgdGhlbiBicmluZyBpbiBzaXRlIGluZm9cbiAgICAkc2NvcGUuc2NoZWR1bGVTaGlmdCA9IGZ1bmN0aW9uKGlkTnVtKSB7XG4gICAgICBvdmVydmlld1NlcnZpY2UuaWROdW1WYXIoaWROdW0uc2l0ZV9pZCk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhpZE51bS5zaXRlX2lkKTtcbiAgICAgIG92ZXJ2aWV3U2VydmljZS5pZE51bVZhciA9IGlkTnVtLnNpdGVfaWQ7XG4gICAgICAkc3RhdGUuZ28oJ3NlbGVjdHNoaWZ0JylcbiAgICB9XG5cblxufSAvL2VuZCBvZiBjb250cm9sbGVyXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuY29udHJvbGxlcignc2NoZWR1bGVob3Vyc0N0cmwnLCBzY2hlZHVsZWhvdXJzQ3RybClcblxuZnVuY3Rpb24gc2NoZWR1bGVob3Vyc0N0cmwoJHNjb3BlLCBvdmVydmlld1NlcnZpY2UsICRzdGF0ZSkge1xuXG5cbiAgICBvdmVydmlld1NlcnZpY2Uuc2hvd0hvdXJzKG92ZXJ2aWV3U2VydmljZS5pZE51bVZhcikudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgIGNvbnNvbGUubG9nKG92ZXJ2aWV3U2VydmljZS5pZE51bVZhcik7XG4gICAgICAgICRzY29wZS5ob3VycyA9IHJlcy5kYXRhO1xuICAgICAgICAkc2NvcGUuc2hpZnRzID0gcmVzLmRhdGE7XG5cbiAgICB9KVxuXG4gICAgdmFyIHNlbGVjdGVkU2hpZnRzID0gW107XG4gICAgJHNjb3BlLmFkZFNoaWZ0TnVtID0gZnVuY3Rpb24oY29udHJhY3RJZCwgc2hpZnROdW0pIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGNvbnRyYWN0SWQsJ2NvbnRyYWN0SWQnKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKHNoaWZ0TnVtLCdzaGlmdE51bScpO1xuICAgICAgICBvdmVydmlld1NlcnZpY2UuZ2V0VXNlcklkKCkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXMsICdnZXRVc2VySWQnKTtcbiAgICAgICAgICAgIHZhciBlbXBJZCA9IHJlcy5kYXRhLnBhc3Nwb3J0LnVzZXIudXNlcl9pZDtcbiAgICAgICAgICAgIGlmIChzaGlmdE51bSkge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkU2hpZnRzLnB1c2goe3NoaWZ0X251bTogc2hpZnROdW0sIGNvbnRyYWN0X3RpbWVfZms6IGNvbnRyYWN0SWQsIHNpdGVfaWRfZms6ICRzY29wZS5zaGlmdHNbMF0uc2l0ZV9pZF9maywgdXNlcl9pZF9mazogZW1wSWR9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBzZWxlY3RlZFNoaWZ0cy5tYXAoZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWwuY29udHJhY3RfdGltZV9maztcbiAgICAgICAgICAgICAgICB9KS5pbmRleE9mKGNvbnRyYWN0SWQpO1xuXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRTaGlmdHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuXG4gICAgfVxuXG4gICAgJHNjb3BlLnN1Ym1pdEVtcFNoaWZ0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc29sZS5sb2coJ2ZpcmVkJyk7XG4gICAgICBjb25zb2xlLmxvZyhzZWxlY3RlZFNoaWZ0cyk7XG4gICAgICAgIHNlbGVjdGVkU2hpZnRzLmZvckVhY2goZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICBvdmVydmlld1NlcnZpY2UuZW1wbG95ZWVTY2hlZHVsZSh2YWwpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHt9KVxuICAgICAgICB9KVxuICAgICAgICBzZWxlY3RlZFNoaWZ0cyA9IFtdO1xuICAgIH1cblxufSAvL2VuZCBvZiBjb250cm9sbGVyXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5jb250cm9sbGVyKCdzaWduaW5DdHJsJyxzaWduaW5DdHJsKVxuXG5mdW5jdGlvbiBzaWduaW5DdHJsKCRzY29wZSxsb2dpblNlcnZpY2UsJHN0YXRlKXtcblxuXG5cblxuJHNjb3BlLmxvZ2luID0ge1xuICB1c2VybmFtZTogJ2FAYS5jb20nLFxuICBwYXNzd29yZDogJ2EnXG59XG5cblxuJHNjb3BlLnN1Ym1pdGxvZ2luID0gZnVuY3Rpb24obG9naW4pe1xuICBsb2dpblNlcnZpY2UuZ2V0TG9naW4obG9naW4pXG4gICAgLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICAgIGlmKHJlcy5zdGF0dXMgPT09IDIwMCkgJHN0YXRlLmdvKCdtYWlucGFnZScpO1xuICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgY29uc29sZS5sb2coZXJyKVxuICAgIH0pO1xufVxuXG59Ly9lbmQgb2YgaG9tZUN0cmxcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKS5jb250cm9sbGVyKCdmdWxsc2l0ZUN0cmwnLCBmdWxsc2l0ZUN0cmwpO1xuXG5mdW5jdGlvbiBmdWxsc2l0ZUN0cmwoJHNjb3BlLCB1cGRhdGVTZXJ2aWNlLCAkc3RhdGUsJGZpbHRlcikge1xuXG52YXIgc2l0ZVNlcnZpY2UgPSB1cGRhdGVTZXJ2aWNlLnNpdGVWaWV3XG5jb25zb2xlLmxvZyhzaXRlU2VydmljZSk7XG5cbiAgICB1cGRhdGVTZXJ2aWNlLmFsbFNpdGVJbmZvKCkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEpO1xuICAgICAgICAkc2NvcGUuc2l0ZXVwZGF0ZSA9IHJlcy5kYXRhLnNpdGVbMF07XG4gICAgICAgICRzY29wZS5iZWdpbnRpbWVjaGFuZ2UgPSByZXMuZGF0YS5zaXRlWzBdLmNvbnRyYWN0X2JlZ2luO1xuICAgICAgICAkc2NvcGUuZW5kdGltZWNoYW5nZSA9IHJlcy5kYXRhLnNpdGVbMF0uY29udHJhY3RfZW5kO1xuICAgICAgICAkc2NvcGUuc2l0ZXVwZGF0ZS5jb250cmFjdF9iZWdpbiA9ICRmaWx0ZXIoJ2RhdGUnKSgkc2NvcGUuYmVnaW50aW1lY2hhbmdlKTtcbiAgICAgICAgJHNjb3BlLnNpdGV1cGRhdGUuY29udHJhY3RfZW5kID0gJGZpbHRlcignZGF0ZScpKCRzY29wZS5lbmR0aW1lY2hhbmdlKTtcbiAgICAgICAgLy8gJHNjb3BlLmNoZWNrRm9yTnVsbCA9IHJlcy5kYXRhLmhvdXJzYW5kc2l0ZTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLmNoZWNrRm9yTnVsbCk7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhLmhvdXJzYW5kc2l0ZSk7XG4gICAgICAgICRzY29wZS50aW1lcyA9IHJlcy5kYXRhLmhvdXJzYW5kc2l0ZTtcbiAgICB9KTtcblxuICAgICRzY29wZS5zdWJtaXRVcGRhdGUgPSBmdW5jdGlvbihzaXRlLCB0aW1lKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHNpdGUpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aW1lKTtcbiAgICAgICAgdmFyIHNpdGVJZE51bSA9IHNpdGUuc2l0ZV9pZDtcbiAgICAgICAgdXBkYXRlU2VydmljZS51cGRhdGVzaXRlKHNpdGVJZE51bSwgc2l0ZSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge30pO1xuICAgICAgICB0aW1lLmZvckVhY2goZnVuY3Rpb24odmFsKSB7XG5cbiAgICAgICAgICAgIHZhciBzaXRlSWQgPSB2YWwuY29udHJhY3RfdGltZV9pZDtcbiAgICAgICAgICAgIHVwZGF0ZVNlcnZpY2UudXBkYXRlaG91cnMoc2l0ZUlkLCB2YWwpLnRoZW4oZnVuY3Rpb24ocmVzKSB7fSk7XG4gICAgICAgICAgICBzaXRlSWQgPSAwO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG59IC8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKS5jb250cm9sbGVyKCd1cGRhdGVTaXRlQ3RybCcsIHVwZGF0ZVNpdGVDdHJsKTtcblxuZnVuY3Rpb24gdXBkYXRlU2l0ZUN0cmwoJHNjb3BlLCB1cGRhdGVTZXJ2aWNlLCAkc3RhdGUpIHtcblxuXG5cbiAgICB1cGRhdGVTZXJ2aWNlLnVwZGF0ZVNpdGUoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICRzY29wZS51cGRhdGVzaXRlcyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIC8vIHJldHVybiB1cGRhdGVTZXJ2aWNlLnNpdGVWaWV3ID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UuZGF0YSk7XG4gICAgfSk7XG5cbiAgICAvLyAkc2NvcGUuY2hlY2tOdWxsID0gdHJ1ZTtcblxuICAgICRzY29wZS51cGRhdGVTaXRlID0gZnVuY3Rpb24oc2l0ZXZpZXcpIHtcbiAgICAgIHVwZGF0ZVNlcnZpY2UuZ2V0U2l0ZXZpZXcgPSBzaXRldmlldztcbiAgICAgIGNvbnNvbGUubG9nKHNpdGV2aWV3KTtcbiAgICAvLyAgdXBkYXRlU2VydmljZS5zaG93SG91cnMoc2l0ZXZpZXcuc2l0ZV9pZCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHVwZGF0ZVNlcnZpY2Uuc2l0ZVZpZXcpO1xuICAgICAgICAkc3RhdGUuZ28oJ3VwZGF0ZWZ1bGxzaXRlJyk7XG4gIH07XG5cbiAgICAgICAgLy8gdXBkYXRlU2VydmljZS5hbGxTaXRlSW5mbyh1cGRhdGVTZXJ2aWNlLnNpdGV2aWV3LnNpdGVfaWQpLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgIC8vICAgICAvLyBjb25zb2xlLmxvZyhyZXMuZGF0YSk7XG4gICAgICAgIC8vICAgICAkc2NvcGUuc2l0ZXVwZGF0ZSA9IHJlcy5kYXRhLnNpdGVbMF07XG4gICAgICAgIC8vICAgICAkc2NvcGUuYmVnaW50aW1lY2hhbmdlID0gcmVzLmRhdGEuc2l0ZVswXS5jb250cmFjdF9iZWdpbjtcbiAgICAgICAgLy8gICAgICRzY29wZS5lbmR0aW1lY2hhbmdlID0gcmVzLmRhdGEuc2l0ZVswXS5jb250cmFjdF9lbmQ7XG4gICAgICAgIC8vICAgICAkc2NvcGUuc2l0ZXVwZGF0ZS5jb250cmFjdF9iZWdpbiA9ICRmaWx0ZXIoJ2RhdGUnKSgkc2NvcGUuYmVnaW50aW1lY2hhbmdlKTtcbiAgICAgICAgLy8gICAgICRzY29wZS5zaXRldXBkYXRlLmNvbnRyYWN0X2VuZCA9ICRmaWx0ZXIoJ2RhdGUnKSgkc2NvcGUuZW5kdGltZWNoYW5nZSk7XG4gICAgICAgIC8vICAgICAvLyAkc2NvcGUuY2hlY2tGb3JOdWxsID0gcmVzLmRhdGEuaG91cnNhbmRzaXRlO1xuICAgICAgICAvLyAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLmNoZWNrRm9yTnVsbCk7XG4gICAgICAgIC8vICAgICAkc2NvcGUudGltZXMgPSByZXMuZGF0YS5ob3Vyc2FuZHNpdGU7XG4gICAgICAgIC8vIH0pO1xuXG5cblxuICAgIC8vICRzY29wZS5zdWJtaXRVcGRhdGUgPSBmdW5jdGlvbihzaXRlLHRpbWUpe1xuICAgIC8vICAgLy8gY29uc29sZS5sb2coc2l0ZSk7XG4gICAgLy8gICAgIC8vIGNvbnNvbGUubG9nKHRpbWUpO1xuICAgIC8vICAgdmFyIHNpdGVJZE51bSA9IHNpdGUuc2l0ZV9pZDtcbiAgICAvLyAgIHVwZGF0ZVNlcnZpY2UudXBkYXRlc2l0ZShzaXRlSWROdW0sc2l0ZSlcbiAgICAvLyAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAvLyAgIH0pO1xuICAgIC8vICAgdGltZS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCl7XG4gICAgLy9cbiAgICAvLyAgICAgdmFyIHNpdGVJZCA9IHZhbC5jb250cmFjdF90aW1lX2lkO1xuICAgIC8vICAgICB1cGRhdGVTZXJ2aWNlLnVwZGF0ZWhvdXJzKHNpdGVJZCx2YWwpXG4gICAgLy8gICAgIC50aGVuKGZ1bmN0aW9uKHJlcyl7fSk7XG4gICAgLy8gICAgIHNpdGVJZCA9MDtcbiAgICAvLyAgIH0pO1xuICAgIC8vIH07XG5cbiAgICAvLyB1cGRhdGVTZXJ2aWNlLnNob3dlbXBsb3llZSgpXG4gICAgLy8gLnRoZW4oZnVuY3Rpb24oZW1wKXtcbiAgICAvLyAgIGNvbnNvbGUubG9nKGVtcCk7XG4gICAgLy9cbiAgICAvLyAgICRzY29wZS5lbXBsb3llZSA9IGVtcC5kYXRhO1xuICAgIC8vIH0pO1xuXG4gICAgJHNjb3BlLnVwZGF0ZUVtcCA9IGZ1bmN0aW9uKGVtcCl7XG4gICAgICAkc2NvcGUuc2hvd3VwZGF0ZSA9IGZhbHNlO1xuICAgICAgJHNjb3BlLmVtcHVwZGF0ZSA9IGVtcDtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGVtcCk7XG4gICAgICAkc3RhdGUuZ28oJ3Nob3dlbXBsb3llZS51cGRhdGVlbXBsb3llZScpO1xuICAgIH07XG5cbiAgICAkc2NvcGUuc3VibWl0RW1wbG95ZWUgPSBmdW5jdGlvbihlbXBjaGFuZ2Upe1xuICAgICAgdmFyIGVtcGxveWVlSWQgPSBlbXBjaGFuZ2UudXNlcl9pZDtcbiAgICAgIHVwZGF0ZVNlcnZpY2UudXBkYXRlZW1wbG95ZWUoZW1wbG95ZWVJZCxlbXBjaGFuZ2UpXG4gICAgICAudGhlbihmdW5jdGlvbihyZXMpe30pO1xuICAgIH07XG5cblxuXG59IC8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLmFuaW1hdGlvbignLnNsaWRlLWRvd24nLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICBlbnRlcjogZnVuY3Rpb24oZWxlbWVudCwgZG9uZSkge1xuICAgICAgVHdlZW5NYXguZnJvbShlbGVtZW50LCAxLCB7b3BhY2l0eTowLCB5OjUwLCBvbkNvbXBsZXRlOmRvbmV9KVxuICAgIH0sXG4gICAgbGVhdmU6IGZ1bmN0aW9uKGVsZW1lbnQsIGRvbmUpIHtcbiAgICAgIFR3ZWVuTWF4LnRvKGVsZW1lbnQsIDEsIHtvcGFjaXR5OjAsIHk6NTAsIG9uQ29tcGxldGU6ZG9uZX0pXG4gICAgfVxuICB9XG59KTtcblxuLy8gKCcubWFpbi1jb250ZW50JywgW2Z1bmN0aW9uKCl7XG4vLyAgIHJldHVybiB7XG4vLyAgICAgZW50ZXI6IGZ1bmN0aW9uKGVsZW1lbnQsIGRvbmUpIHtcbi8vICAgICAgIFR3ZWVuTWF4LmZyb20oZWxlbWVudCwgMSwge29wYWNpdHk6MCwgeTo1MCwgb25Db21wbGV0ZTpkb25lfSlcbi8vICAgICB9LFxuLy8gICAgIGxlYXZlOiBmdW5jdGlvbihlbGVtZW50LCBkb25lKSB7XG4vLyAgICAgICBUd2Vlbk1heC50byhlbGVtZW50LCAxLCB7b3BhY2l0eTowLCB5OjUwLCBvbkNvbXBsZXRlOmRvbmV9KVxuLy8gICAgIH1cbi8vICAgfVxuLy8gfV0pXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuZGlyZWN0aXZlKCdtZW51RGlyZWN0aXZlJywgZnVuY3Rpb24oKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9zaGFyZWQvbWVudS9tZW51Lmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgICAgXG4gICAgICAgIH1cbiAgICB9XG5cbn0pIC8vZW5kIG9mIGRpcmVjdGl2ZVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpLmRpcmVjdGl2ZSgndGl0bGVEaXJlY3RpdmUnLCBmdW5jdGlvbigpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3NoYXJlZC9tZW51L3RpdGxlLmh0bWwnXG5cbiAgICAgIH1cblxufSkvL2VuZCBvZiBkaXJlY3RpdmVcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKS5zZXJ2aWNlKCdjcmVhdGVTZXJ2aWNlJywgY3JlYXRlU2VydmljZSk7XG5cbmZ1bmN0aW9uIGNyZWF0ZVNlcnZpY2UoJGh0dHAsICRxKSB7XG4gICAgLy8gdGhpcyB3aWxsIGNyZWF0ZSB0aGUgYmVnaW5uaW5nIG9mIHRoZSBzaXRlIHcvbyBkYXlzIGFuZCBob3Vyc1xuICAgIHZhciBzaXRlSWQ7XG4gICAgdGhpcy5zaGlmdHMgPSBbXTtcbiAgICB0aGlzLnNpdGU7XG4gICAgdGhpcy5kYXk7XG4gICAgdGhpcy5jcmVhdGVzaXRlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIHJldHVybiAkaHR0cCh7bWV0aG9kOiBcIlBPU1RcIiwgdXJsOiBcIi9jcmVhdGVzaXRlXCIsIGRhdGE6IG9ian0pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICBzaXRlSWQgPSByZXMuZGF0YVswXS5zaXRlX2lkO1xuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvLyB0aGlzIHdpbGwgY3JlYXRlIHRoZSByZXN0IG9mIHRoZSBzaXRlIC0tIGRheXMgYW5kIGhvdXJzXG4gICAgdGhpcy5jcmVhdGVob3VycyA9IGZ1bmN0aW9uKHNoaWZ0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHNoaWZ0KTtcbiAgICAgICAgc2hpZnQuc2l0ZV9pZCA9IHNpdGVJZDtcbiAgICAgICAgcmV0dXJuICRodHRwKHttZXRob2Q6IFwiUE9TVFwiLCB1cmw6IFwiL2NyZWF0ZWRheWFuZGhvdXJzXCIsIGRhdGE6IHNoaWZ0fSk7XG4gICAgfTtcbiAgICAvLyB0aGlzIHdpbGwgY3JlYXRlIGFuIGVtcGxveWVlXG4gICAgdmFyIGVtcGxveWVlSWQ7XG4gICAgdGhpcy5jcmVhdGVlbXBsb3llZSA9IGZ1bmN0aW9uKGVtcCkge1xuICAgICAgICByZXR1cm4gJGh0dHAoe21ldGhvZDogXCJQT1NUXCIsIHVybDogXCIvY3JlYXRlZW1wbG95ZWVcIiwgZGF0YTogZW1wfSkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgIGVtcGxveWVlSWQgPSByZXMuZGF0YVswXS51c2VyX2lkO1xuICAgICAgICAgICAgY29uc29sZS5sb2coZW1wbG95ZWVJZCk7XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gdGhpcyBtYWtlcyBhbiBhbGVydCBzYXlpbmcgdGhlIHNpdGUgaGFzIGJlZW4gY3JlYXRlZFxuICAgIHRoaXMuc2l0ZWFsZXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHN3YWwoe3RpdGxlOiBcIlNpdGUgQ3JlYXRlZCFcIiwgdHlwZTogXCJzdWNjZXNzXCIsIGNvbmZpcm1CdXR0b25UZXh0OiBcIk9rXCIsIGFsbG93T3V0c2lkZUNsaWNrOiB0cnVlfSk7XG5cbiAgICB9O1xuICAgIC8vIHRoaXMgbWFrZXMgYW4gYWxlcnQgc2F5aW5nIHRoYXQgdGhlIGVtcGxveWVlIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICB0aGlzLmVtcGxveWVlYWxlcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgc3dhbCh7dGl0bGU6IFwiRW1wbG95ZWUgQ3JlYXRlZCFcIiwgdHlwZTogXCJzdWNjZXNzXCIsIGNvbmZpcm1CdXR0b25UZXh0OiBcIk9rXCIsIGFsbG93T3V0c2lkZUNsaWNrOiB0cnVlfSk7XG5cbiAgICB9O1xuXG4gICAgdGhpcy5hZGR0b1NoaWZ0cyA9IGZ1bmN0aW9uKHNoaWZ0cykge1xuICAgICAgICB0aGlzLnNoaWZ0cy5wdXNoKHNoaWZ0cyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc2hpZnRzKTtcblxuICAgIH07XG5cbn0gLy9lbmQgb2Ygc2VydmljZVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcignZW1wdXBkYXRlQ3RybCcsZW1wdXBkYXRlQ3RybClcblxuXG5mdW5jdGlvbiBlbXB1cGRhdGVDdHJsKCRzY29wZSx1cGRhdGVTZXJ2aWNlLCRzdGF0ZSl7XG5cblxuICB1cGRhdGVTZXJ2aWNlLnNob3dlbXBsb3llZSgpXG4gIC50aGVuKGZ1bmN0aW9uKGVtcCl7XG4gICAgY29uc29sZS5sb2coZW1wKTtcblxuICAgICRzY29wZS5lbXBsb3llZSA9IGVtcC5kYXRhO1xuICB9KTtcblxuXG5cblxuXG59Ly9lbmQgb2YgY29udHJvbGxlclxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcignZnVsbGVtcHVwZGF0ZUN0cmwnLGZ1bGxlbXB1cGRhdGVDdHJsKVxuXG5cbmZ1bmN0aW9uIGZ1bGxlbXB1cGRhdGVDdHJsKCRzY29wZSx1cGRhdGVTZXJ2aWNlLCRzdGF0ZSl7XG5cblxuXG5cbn0vL2VuZCBvZiBjb250cm9sbGVyXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5zZXJ2aWNlKCdsb2dpblNlcnZpY2UnLGxvZ2luU2VydmljZSk7XG5cblxuZnVuY3Rpb24gbG9naW5TZXJ2aWNlKCRodHRwKXtcblxudGhpcy5nZXRMb2dpbiA9IGZ1bmN0aW9uKGxvZ2luKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJQT1NUXCIsXG4gICAgdXJsOicvYXV0aC9sb2dpbicsXG4gICAgZGF0YTogbG9naW5cbiAgfSk7XG59XG5cblxuXG59IC8vZW5kIG9mIHNlcnZpY2VcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLnNlcnZpY2UoJ21haW5wYWdlU2VydmljZScsbWFpbnBhZ2VTZXJ2aWNlKTtcblxuZnVuY3Rpb24gbWFpbnBhZ2VTZXJ2aWNlKCRodHRwKXtcblxudGhpcy5nZXRjdXJyZW50ID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJHRVRcIixcbiAgICB1cmw6IFwiL2F1dGgvY3VycmVudFwiXG4gIH0pXG59XG5cbnRoaXMuZ2V0VXNlclNpdGVzID0gZnVuY3Rpb24odXNlclNpdGVJZCl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiR0VUXCIsXG4gICAgdXJsOlwiL2dldFVzZXJTaXRlcy9cIiArIHVzZXJTaXRlSWRcbiAgfSlcbn1cblxuXG5cbn0vL2VuZCBvZiBzZXJ2aWNlXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5zZXJ2aWNlKCdvdmVydmlld1NlcnZpY2UnLG92ZXJ2aWV3U2VydmljZSlcblxuZnVuY3Rpb24gb3ZlcnZpZXdTZXJ2aWNlKCRodHRwKXtcblxudGhpcy5pZE51bVZhciA9IGZ1bmN0aW9uKHZhbCl7XG4gIGlmKHZhbCl7XG5cbiAgfVxufTtcblxuY29uc29sZS5sb2codGhpcy5pZE51bVZhcik7XG5cbi8vIHRoaXMuc2l0ZVZpZXcgPSB7fTtcbi8vIGNvbnNvbGUubG9nKHRoaXMuc2l0ZVZpZXcpO1xuXG5cbnRoaXMub3ZlclZpZXdTaXRlcyA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiR0VUXCIsXG4gICAgdXJsOlwiL3NpdGVvdmVydmlld1wiXG4gIH0pXG59XG5cbnRoaXMuc2hvd0RheXMgPSBmdW5jdGlvbihpZE51bSl7XG5cbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJHRVRcIixcbiAgICB1cmw6XCIvc2NoZWR1bGVEYXlzL1wiICsgaWROdW1cbiAgfSlcbn1cblxudGhpcy5zaG93SG91cnMgPSBmdW5jdGlvbihpZE51bSl7XG4gIC8vIGNvbnNvbGUubG9nKGlkTnVtKTtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJHRVRcIixcbiAgICB1cmw6IFwiL3NjaGVkdWxlSG91cnMvXCIgKyBpZE51bVxuICB9KVxufVxuXG50aGlzLmVtcGxveWVlU2NoZWR1bGUgPSBmdW5jdGlvbihzY2hlZHVsZVNoaWZ0KXtcbiAgLy8gY29uc29sZS5sb2coc2NoZWR1bGVTaGlmdCk7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiUE9TVFwiLFxuICAgIHVybDpcIi9lbXBsb3llZXNjaGVkdWxlXCIsXG4gICAgZGF0YTpzY2hlZHVsZVNoaWZ0XG4gIH0pXG59XG5cbnRoaXMuZ2V0VXNlckluZm8gPSBmdW5jdGlvbih1c2VySWQpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIkdFVFwiLFxuICAgIHVybDpcIi9nZXRVc2VySW5mby9cIiArIHVzZXJJZFxuICB9KVxufVxuXG50aGlzLmdldFVzZXJJZCA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiR0VUXCIsXG4gICAgdXJsOlwiL2F1dGgvY3VycmVudFwiXG4gIH0pXG59XG5cblxufSAvL2VuZCBvZiBzZXJ2aWNlXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5zZXJ2aWNlKCd1cGRhdGVTZXJ2aWNlJyx1cGRhdGVTZXJ2aWNlKVxuXG5mdW5jdGlvbiB1cGRhdGVTZXJ2aWNlKCRodHRwKXtcblxuLy8gdGhpcy5zaXRlVmlldztcbi8vXG4vLyB0aGlzLmdldFNpdGVJZCA9IGZ1bmN0aW9uKHZhbCl7XG4vLyAgIGNvbnNvbGUubG9nKHZhbCk7XG4vLyAgIHJldHVybiB2YWw7XG4vLyB9XG4vL1xuLy8gICAvLyB0aGlzLnNpdGVWaWV3ID0gdmFsO1xuLy8gICBjb25zb2xlLmxvZyh0aGlzLnNpdGVWaWV3KTtcblxudGhpcy5zaXRlVmlldyA9IHt9O1xuY29uc29sZS5sb2codGhpcy5zaXRlVmlldyk7XG5cbnRoaXMudXBkYXRlU2l0ZSA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiR0VUXCIsXG4gICAgdXJsOicvc2l0ZW92ZXJ2aWV3J1xuICB9KVxufVxuXG50aGlzLmFsbFNpdGVJbmZvID0gZnVuY3Rpb24oc2l0ZUlkKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJHRVRcIixcbiAgICB1cmw6Jy9nZXRzaXRlYW5kaG91cnMvJyArIHNpdGVJZFxuICB9KVxufVxuXG50aGlzLnVwZGF0ZXNpdGUgPSBmdW5jdGlvbih1cGRhdGVJZCx1cGRhdGVTaXRlKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6IFwiUFVUXCIsXG4gICAgdXJsOicvdXBkYXRlc2l0ZS8nICsgdXBkYXRlSWQsXG4gICAgZGF0YTogdXBkYXRlU2l0ZVxuICB9KVxufVxuXG50aGlzLnVwZGF0ZWhvdXJzID0gZnVuY3Rpb24odXBkYXRlSWQsIHVwZGF0ZVRpbWUpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDogXCJQVVRcIixcbiAgICB1cmw6Jy91cGRhdGVob3Vycy8nICsgdXBkYXRlSWQsXG4gICAgZGF0YTogdXBkYXRlVGltZVxuICB9KVxufVxuXG50aGlzLnVwZGF0ZWVtcGxveWVlID0gZnVuY3Rpb24odXBkYXRlSWQsIHVwZGF0ZUVtcGxveWVlKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6IFwiUFVUXCIsXG4gICAgdXJsOiAnL3VwZGF0ZWVtcGxveWVlLycgKyB1cGRhdGVJZCxcbiAgICBkYXRhOiB1cGRhdGVFbXBsb3llZVxuICB9KVxufVxuXG50aGlzLnNob3dlbXBsb3llZSA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgIHVybDpcIi92aWV3ZW1wbG95ZWVcIlxuICB9KVxufVxuXG5cblxuXG59Ly9lbmQgb2Ygc2VydmljZVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
