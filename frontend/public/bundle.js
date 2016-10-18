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
      templateUrl:'app/components/update_employee/view_employee.html',
      controller:'empupdateCtrl'
    })
    .state('updateemployee',{
      url:'/updateemployee',
      templateUrl:'app/components/update_employee/update_employee.html',
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
          $state.go('mainpage');
          swal("Employee Created!","","success")

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
      $state.go('mainpage');
      swal("Site and hours created!","","success");
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

<<<<<<< HEAD
angular.module('keeperApp')
.controller('requestchangeCtrl', requestchangeCtrl)


function requestchangeCtrl($scope){





}//end of controller

=======
>>>>>>> cf6f57c3fd540cb5627d9b54c68377eb7876a2ea

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
      console.log(idNum.site_id);
      // overviewService.idNumVar(idNum.site_id);
      // console.log(idNum.site_id);
      overviewService.setSiteId(idNum.site_id);
      $state.go('selectshift')
    }


} //end of controller

angular.module('keeperApp').controller('schedulehoursCtrl', schedulehoursCtrl)

function schedulehoursCtrl($scope, overviewService, $state) {

var selectedShiftId = overviewService.getSiteId()
console.log(selectedShiftId);
    overviewService.showHours(selectedShiftId).then(function(res) {
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
        selectedShifts.forEach(function(val) {
            overviewService.employeeSchedule(val).then(function(response) {})
        })
        selectedShifts = [];
        swal("Shift Scheduled!"," ", "success")
        $state.go('mainpage')
    }

} //end of controller

angular.module('keeperApp')
<<<<<<< HEAD
=======
.controller('requestchangeCtrl', requestchangeCtrl)


function requestchangeCtrl($scope){





}//end of controller

angular.module('keeperApp')
>>>>>>> cf6f57c3fd540cb5627d9b54c68377eb7876a2ea
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
.controller('empupdateCtrl',empupdateCtrl)


function empupdateCtrl($scope,updateService,$state){


  updateService.showemployee()
  .then(function(emp){
    console.log(emp);

    $scope.employee = emp.data;
  });

  $scope.updateEmp = function(data){
    updateService.setEmpId(data);
    $state.go('updateemployee');
  };





}//end of controller

angular.module('keeperApp')
.controller('fullempupdateCtrl',fullempupdateCtrl)


function fullempupdateCtrl($scope,updateService,$state){

var getEmpId = updateService.getEmpId();

console.log(getEmpId);

$scope.empupdate = getEmpId;

$scope.submitEmployee = function(data){
updateService.updateemployee(data)
.then(function(response){});
<<<<<<< HEAD

=======
$state.go('mainpage');
swal("Employee updated!","","success");
>>>>>>> cf6f57c3fd540cb5627d9b54c68377eb7876a2ea
}





}//end of controller

angular.module('keeperApp').controller('fullsiteCtrl', fullsiteCtrl);

function fullsiteCtrl($scope, updateService, $state,$filter) {

// var siteService = updateService.siteView
// console.log(siteService);

var selectedSiteId = updateService.getSiteId()


    updateService.allSiteInfo(selectedSiteId).then(function(res) {
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
        $state.go('mainpage');
        swal("Site and hours updated!","","success");
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
        console.log(siteview);
      updateService.selectedSiteId = siteview.site_id;
      updateService.setSiteId(siteview.site_id);

    //  updateService.showHours(siteview.site_id);
        // console.log(updateService.siteView);
        $state.go('updatefullsite');
  };

      

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

var selectedShiftId ={};

if(localStorage.getItem("selectedShiftId")){
selectedShiftId = JSON.parse(localStorage.getItem("selectedShiftId"));
}
this.getSiteId = function(){
  return selectedShiftId;
}
this.setSiteId = function(data){
  selectedShiftId = data;
  localStorage.setItem("selectedShiftId",JSON.stringify(selectedShiftId));
}

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

var selectedSiteId ={};


if(localStorage.getItem("selectedSiteId")){
selectedSiteId = JSON.parse(localStorage.getItem("selectedSiteId"));
}
this.getSiteId = function(){
  return selectedSiteId;
}
this.setSiteId = function(data){
  selectedSiteId = data;
  localStorage.setItem("selectedSiteId",JSON.stringify(selectedSiteId));
}


var selectedEmpId ={};


if(localStorage.getItem("selectedEmpId")){
selectedEmpId = JSON.parse(localStorage.getItem("selectedEmpId"));
}
this.getEmpId = function(){
  return selectedEmpId;
}
this.setEmpId = function(data){
  selectedEmpId = data;
  localStorage.setItem("selectedEmpId",JSON.stringify(selectedEmpId));
}

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

<<<<<<< HEAD
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5DdHJsLmpzIiwiY29tcG9uZW50cy9jcmVhdGVzaXRlL2NyZWF0ZVNpdGVDdHJsLmpzIiwiY29tcG9uZW50cy9tYWluL21haW5wYWdlQ3RybC5qcyIsImNvbXBvbmVudHMvcmVxdWVzdF9jaGFuZ2UvcmVxdWVzdF9jaGFuZ2VDdHJsLmpzIiwiY29tcG9uZW50cy9zY2hlZHVsZS9zY2hlZHVsZUN0cmwuanMiLCJjb21wb25lbnRzL3NjaGVkdWxlL3NjaGVkdWxlX2hvdXJzQ3RybC5qcyIsImNvbXBvbmVudHMvc2lnbmluL3NpZ25pbkN0cmwuanMiLCJjb21wb25lbnRzL3VwZGF0ZV9lbXBsb3llZS9lbXB1cGRhdGVDdHJsLmpzIiwiY29tcG9uZW50cy91cGRhdGVfZW1wbG95ZWUvZnVsbGVtcHVwZGF0ZUN0cmwuanMiLCJjb21wb25lbnRzL3VwZGF0ZV9zaXRlL2Z1bGxzaXRlQ3RybC5qcyIsImNvbXBvbmVudHMvdXBkYXRlX3NpdGUvdXBkYXRlX3NpdGVDdHJsLmpzIiwic2hhcmVkL2FuaW1hdGlvbnMvdWktdmlldy1hbmltYXRpb24uanMiLCJzaGFyZWQvbWVudS9tZW51LWRpcmVjdGl2ZS5qcyIsInNoYXJlZC9tZW51L3RpdGxlLWRpcmVjdGl2ZS5qcyIsInNoYXJlZC9zZXJ2aWNlcy9jcmVhdGVTZXJ2aWNlLmpzIiwic2hhcmVkL3NlcnZpY2VzL2xvZ2luU2VydmljZS5qcyIsInNoYXJlZC9zZXJ2aWNlcy9tYWlucGFnZVNlcnZpY2UuanMiLCJzaGFyZWQvc2VydmljZXMvb3ZlcnZpZXdTZXJ2aWNlLmpzIiwic2hhcmVkL3NlcnZpY2VzL3VwZGF0ZVNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcsIFsndWkucm91dGVyJywndWkuYm9vdHN0cmFwJywnbmdBbmltYXRlJywnc2F0ZWxsaXplciddKVxuLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkYXV0aFByb3ZpZGVyKSB7XG5cblxuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcblxuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdzaWduaW4nLHtcbiAgICAgIHVybDonLycsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9jb21wb25lbnRzL3NpZ25pbi9zaWduaW4uaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnc2lnbmluQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnbWFpbnBhZ2UnLHtcbiAgICAgIHVybDonL21haW5wYWdlJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2NvbXBvbmVudHMvbWFpbi9tYWlucGFnZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdtYWlucGFnZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ2NyZWF0ZXNpdGUnLHtcbiAgICAgIHVybDonL2NyZWF0ZXNpdGUnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL2NyZWF0ZXNpdGUvY3JlYXRlc2l0ZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6J2NyZWF0ZVNpdGVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdjcmVhdGVzaXRlZGF5cycsIHtcbiAgICAgIHVybDogJy9kYXlzJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2NvbXBvbmVudHMvY3JlYXRlc2l0ZS9jcmVhdGVzaXRlZGF5cy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdjcmVhdGVTaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnaG91cicse1xuICAgICAgdXJsOicvaG91cnMnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL2NyZWF0ZXNpdGUvY3JlYXRlaG91cnMuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnY3JlYXRlU2l0ZUN0cmwnXG4gICAgfSlcbiAgICAvLyAuc3RhdGUoJ3VwZGF0ZWVtcGxveWVlJyx7XG4gICAgLy8gICB1cmw6Jy91cGRhdGVlbXBsb3llZScsXG4gICAgLy8gICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvdXBkYXRlX3NpdGUvdXBkYXRlX2VtcGxveWVlLmh0bWwnLFxuICAgIC8vICAgY29udHJvbGxlcjondXBkYXRlU2l0ZUN0cmwnXG4gICAgLy8gfSlcbiAgICAuc3RhdGUoJ2NyZWF0ZWVtcGxveWVlJyx7XG4gICAgICB1cmw6Jy9jcmVhdGVlbXBsb3llZScsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvY3JlYXRlc2l0ZS9jcmVhdGVfZW1wbG95ZWUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOidjcmVhdGVTaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnc2NoZWR1bGUnLHtcbiAgICAgIHVybDonL3NjaGVkdWxlc2l0ZXMnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL3NjaGVkdWxlL3NjaGVkdWxlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjonc2NoZWR1bGVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdzZWxlY3RzaGlmdCcse1xuICAgICAgdXJsOicvc2NoZWR1bGVzaGlmdHMnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL3NjaGVkdWxlL3NjaGVkdWxlc2hpZnRzLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjonc2NoZWR1bGVob3Vyc0N0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3VwZGF0ZXNpdGUnLHtcbiAgICAgIHVybDonL3VwZGF0ZXNpdGUnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL3VwZGF0ZV9zaXRlL3VwZGF0ZV9zaXRlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjondXBkYXRlU2l0ZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3VwZGF0ZWZ1bGxzaXRlJyx7XG4gICAgICB1cmw6Jy9mdWxsc2l0ZXVwZGF0ZScsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvdXBkYXRlX3NpdGUvdXBkYXRlX2Z1bGxzaXRlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjonZnVsbHNpdGVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdzaG93ZW1wbG95ZWUnLHtcbiAgICAgIHVybDonL3ZpZXdlbXBsb3llZScsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvdXBkYXRlX2VtcGxveWVlL3ZpZXdfZW1wbG95ZWUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOidlbXB1cGRhdGVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCd1cGRhdGVlbXBsb3llZScse1xuICAgICAgdXJsOicvdXBkYXRlZW1wbG95ZWUnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL3VwZGF0ZV9lbXBsb3llZS91cGRhdGVfZW1wbG95ZWUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnZnVsbGVtcHVwZGF0ZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3JlcXVlc3RjaGFuZ2UnLHtcbiAgICAgIHVybDonL3JlcXVlc3RjaGFuZ2UnLFxuICAgICAgdGVtcGxhdGVVcmw6J2FwcC9jb21wb25lbnRzL3JlcXVlc3RfY2hhbmdlL3JlcXVlc3RfY2hhbmdlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjoncmVxdWVzdGNoYW5nZUN0cmwnXG4gICAgfSk7XG5cblxuXG5cblxuXG59KTsvL2VuZCBvZiBhbmd1bGFyIGFwcFxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcignbWFpbkN0cmwnLG1haW5DdHJsKVxuXG5mdW5jdGlvbiBtYWluQ3RybCgkc2NvcGUpe1xuXG4kc2NvcGUudGVzdD1cImhlbGxvXCJcblxuXG59IC8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKS5jb250cm9sbGVyKCdjcmVhdGVTaXRlQ3RybCcsIGNyZWF0ZVNpdGVDdHJsKVxuXG5mdW5jdGlvbiBjcmVhdGVTaXRlQ3RybCgkc2NvcGUsIGNyZWF0ZVNlcnZpY2UsICRzdGF0ZSkge1xuJHNjb3BlLnNob3dzaGlmdHMxID0gZmFsc2U7XG4gICAgLy8gR29lcyBmcm9tIGNyZWF0ZSBzaXRlIHRvIGNyZWF0ZSBkYXlzIGFsc28gY3JlYXRlcyB0aGUgZmlyc3QgcGFydCBvZiB0aGUgc2l0ZVxuICAgICRzY29wZS5uZXh0ID0gZnVuY3Rpb24obmFtZSkge1xuICAgICAgICBjcmVhdGVTZXJ2aWNlLmNyZWF0ZXNpdGUobmFtZSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgJHNjb3BlLnNpdGVJZCA9IHJlc3BvbnNlLmRhdGFbMF0uc2l0ZV9pZDtcbiAgICAgICAgICAgIGNyZWF0ZVNlcnZpY2Uuc2l0ZT0kc2NvcGUuc2l0ZUlkO1xuICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2NyZWF0ZXNpdGVkYXlzJyk7XG4gICAgICAgICAgfSk7XG5cbiAgICB9XG4gICAgLy8gT3BlbnMgc3VidmlldyBmcm9tIGNyZWF0ZSBkYXlzIGludG8gY3JlYXRlIGhvdXJzXG4gICAgJHNjb3BlLmNyZWF0ZWhvdXJzID0gZnVuY3Rpb24oZGF5KSB7XG4gICAgICAgIGNyZWF0ZVNlcnZpY2UuZGF5ID0gZGF5O1xuICAgICAgICAkc3RhdGUuZ28oJ2hvdXInKTtcbiAgICB9XG4gICAgLy8gY2xlYXJzIGFsbCBvZiB0aGUgY2xvY2sgaW5mb1xuICAgICRzY29wZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkc2NvcGUuc2hpZnQgPSBudWxsO1xuICAgIH07XG4gICAgLy8gY2xvY2sgc3RlcCBpbmNyZWFzZXNcbiAgICAkc2NvcGUuaHN0ZXAgPSAxO1xuICAgICRzY29wZS5tc3RlcCA9IDE1O1xuXG4gICAgLy8gY3JlYXRlcyB0aGUgc2hpZnQgb2JqZWN0IGFuZCB0aGVuIHB1c2hlcyBpdCBpbnRvIHRoZSBzZXJ2aWNlXG4gICAgJHNjb3BlLmdldE1vcmVIb3VycyA9IGZ1bmN0aW9uKHNoaWZ0KSB7XG5cblxuICAgICAgICBmb3IgKHZhciBwcm9wIGluIHNoaWZ0KSB7XG4gICAgICAgICAgICBzaGlmdFtwcm9wXSA9IChuZXcgRGF0ZShzaGlmdFtwcm9wXSkpLmdldEhvdXJzKCkgKyAnOicgKyAobmV3IERhdGUoc2hpZnRbcHJvcF0pKS5nZXRNaW51dGVzKClcbiAgICAgICAgfVxuICAgICAgICBzaGlmdC5jb250cmFjdF9kYXkgPSBjcmVhdGVTZXJ2aWNlLmRheTtcbiAgICAgICAgc2hpZnQuc2l0ZUlkID0gY3JlYXRlU2VydmljZS5zaXRlO1xuICAgICAgICBzaGlmdC5zaXRlX2lkX2ZrID0gY3JlYXRlU2VydmljZS5zaXRlO1xuXG4gICAgICAgICRzY29wZS5hZGR0b1NoaWZ0cyhzaGlmdCk7XG4gICAgICAgICAgfTtcblxuXG4gICAgJHNjb3BlLmVtcGxveWVlSWQ7XG4gICAgLy8gY3JlYXRlcyBhbiBlbXBsb3llZSBhbmQgcmV0dXJucyB0aGF0IGlkXG4gICAgJHNjb3BlLmNyZWF0ZUVtcGxveWVlID0gZnVuY3Rpb24oZW1wbG95ZWUpIHtcbiAgICAgICAgY3JlYXRlU2VydmljZS5jcmVhdGVlbXBsb3llZShlbXBsb3llZSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICRzY29wZS5lbXBsb3llZUlkID0gcmVzcG9uc2UuZGF0YVswXS51c2VyX2lkO1xuXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgJHNjb3BlLmFkZHRvU2hpZnRzID0gZnVuY3Rpb24oc2hpZnQpe1xuICAgICAgY29uc29sZS5sb2coc2hpZnQpO1xuICAgICAgY3JlYXRlU2VydmljZS5hZGR0b1NoaWZ0cyhzaGlmdCk7XG4gICAgICAkc3RhdGUuZ28oJ2NyZWF0ZXNpdGVkYXlzJyk7XG4gICAgfVxuXG5cbiAgICAkc2NvcGUuZ2V0VGltZXM9ZnVuY3Rpb24oKXtcbiAgICAgIGNyZWF0ZVNlcnZpY2Uuc2hpZnRzLmZvckVhY2goZnVuY3Rpb24odmFsKXtcbiAgICAgICAgY29uc29sZS5sb2codmFsKTtcbiAgICAgICAgaWYoIXZhbCl7XG4gICAgICAgICAgdmFsID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICBjcmVhdGVTZXJ2aWNlLmNyZWF0ZWhvdXJzKHZhbCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge30pO1xuICAgICAgfVxuICAgICAgfSlcblxuICAgIH1cblxuXG4gICAgJHNjb3BlLnBpY2tTaGlmdCA9IGZ1bmN0aW9uKHYpe1xuXG4gICAgaWYodiA9PT0gMSl7XG4gICAgICAkc2NvcGUuc2hvd3NoaWZ0czEgPSAhJHNjb3BlLnNob3dzaGlmdHMxO1xuICAgIH1cbiAgICBpZih2ID09PSAyKXtcbiAgICAgICRzY29wZS5zaG93c2hpZnRzMiA9ICEkc2NvcGUuc2hvd3NoaWZ0czI7XG4gICAgfVxuICAgIGlmKHYgPT09IDMpe1xuICAgICAgJHNjb3BlLnNob3dzaGlmdHMzID0gISRzY29wZS5zaG93c2hpZnRzMztcbiAgICB9XG4gICAgaWYodiA9PT0gNCl7XG4gICAgICAkc2NvcGUuc2hvd3NoaWZ0czQgPSAhJHNjb3BlLnNob3dzaGlmdHM0O1xuICAgIH1cblxuICAgIH1cblxufSAvL2VuZCBvZiBjb250cm9sbGVyXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5jb250cm9sbGVyKCdtYWlucGFnZUN0cmwnLG1haW5wYWdlQ3RybCk7XG5cbmZ1bmN0aW9uIG1haW5wYWdlQ3RybCgkc2NvcGUsbWFpbnBhZ2VTZXJ2aWNlLG92ZXJ2aWV3U2VydmljZSl7XG5cbm1haW5wYWdlU2VydmljZS5nZXRjdXJyZW50KClcbi50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gIHZhciBzaXRlVXNlcklkID0gcmVzLmRhdGEucGFzc3BvcnQudXNlci51c2VyX2lkO1xuICAkc2NvcGUudXNlcm5hbWUgPSByZXMuZGF0YS5wYXNzcG9ydC51c2VyO1xuICBtYWlucGFnZVNlcnZpY2UuZ2V0VXNlclNpdGVzKHNpdGVVc2VySWQpXG4gIC50aGVuKGZ1bmN0aW9uKHVzZXJTaXRlcyl7XG4gICAgJHNjb3BlLnVzZXJzaXRlcyA9IHVzZXJTaXRlcy5kYXRhO1xuICBjb25zb2xlLmxvZyh1c2VyU2l0ZXMuZGF0YSk7XG5cbiAgfSlcblxuXG59KVxuXG5cblxuXG5cbn0vL2VuZCBvZiBtYWlucGFnZUN0cmxcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLmNvbnRyb2xsZXIoJ3JlcXVlc3RjaGFuZ2VDdHJsJywgcmVxdWVzdGNoYW5nZUN0cmwpXG5cblxuZnVuY3Rpb24gcmVxdWVzdGNoYW5nZUN0cmwoJHNjb3BlKXtcblxuXG5cblxuXG59Ly9lbmQgb2YgY29udHJvbGxlclxuIiwiXG5hbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuY29udHJvbGxlcignc2NoZWR1bGVDdHJsJywgc2NoZWR1bGVDdHJsKVxuXG5mdW5jdGlvbiBzY2hlZHVsZUN0cmwoJHNjb3BlLCBvdmVydmlld1NlcnZpY2UsICRzdGF0ZSkge1xuXG4gICAgLy8gdmFyIHNpdGVBcnJheSA9IFtdO1xuXG4gICAgb3ZlcnZpZXdTZXJ2aWNlLm92ZXJWaWV3U2l0ZXMoKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgLy8gY29uc29sZS5sb2cocmVzLmRhdGEpO1xuICAgICAgICB2YXIgc2l0ZU9iaiA9IHJlcy5kYXRhO1xuICAgICAgICAkc2NvcGUuc2l0ZW92ZXJ2aWV3ID0gcmVzLmRhdGE7XG4gICAgfSk7XG4gICAgLy8gZnVuY3Rpb24gd2lsbCBoaWRlIHNpdGVzIGFuZCB0aGVuIGJyaW5nIGluIHNpdGUgaW5mb1xuICAgICRzY29wZS5zY2hlZHVsZVNoaWZ0ID0gZnVuY3Rpb24oaWROdW0pIHtcbiAgICAgIGNvbnNvbGUubG9nKGlkTnVtLnNpdGVfaWQpO1xuICAgICAgLy8gb3ZlcnZpZXdTZXJ2aWNlLmlkTnVtVmFyKGlkTnVtLnNpdGVfaWQpO1xuICAgICAgLy8gY29uc29sZS5sb2coaWROdW0uc2l0ZV9pZCk7XG4gICAgICBvdmVydmlld1NlcnZpY2Uuc2V0U2l0ZUlkKGlkTnVtLnNpdGVfaWQpO1xuICAgICAgJHN0YXRlLmdvKCdzZWxlY3RzaGlmdCcpXG4gICAgfVxuXG5cbn0gLy9lbmQgb2YgY29udHJvbGxlclxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpLmNvbnRyb2xsZXIoJ3NjaGVkdWxlaG91cnNDdHJsJywgc2NoZWR1bGVob3Vyc0N0cmwpXG5cbmZ1bmN0aW9uIHNjaGVkdWxlaG91cnNDdHJsKCRzY29wZSwgb3ZlcnZpZXdTZXJ2aWNlLCAkc3RhdGUpIHtcblxudmFyIHNlbGVjdGVkU2hpZnRJZCA9IG92ZXJ2aWV3U2VydmljZS5nZXRTaXRlSWQoKVxuY29uc29sZS5sb2coc2VsZWN0ZWRTaGlmdElkKTtcbiAgICBvdmVydmlld1NlcnZpY2Uuc2hvd0hvdXJzKHNlbGVjdGVkU2hpZnRJZCkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgJHNjb3BlLmhvdXJzID0gcmVzLmRhdGE7XG4gICAgICAgICRzY29wZS5zaGlmdHMgPSByZXMuZGF0YTtcblxuICAgIH0pXG5cbiAgICB2YXIgc2VsZWN0ZWRTaGlmdHMgPSBbXTtcbiAgICAkc2NvcGUuYWRkU2hpZnROdW0gPSBmdW5jdGlvbihjb250cmFjdElkLCBzaGlmdE51bSkge1xuICAgICAgLy8gY29uc29sZS5sb2coY29udHJhY3RJZCwnY29udHJhY3RJZCcpO1xuICAgICAgLy8gY29uc29sZS5sb2coc2hpZnROdW0sJ3NoaWZ0TnVtJyk7XG4gICAgICAgIG92ZXJ2aWV3U2VydmljZS5nZXRVc2VySWQoKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcywgJ2dldFVzZXJJZCcpO1xuICAgICAgICAgICAgdmFyIGVtcElkID0gcmVzLmRhdGEucGFzc3BvcnQudXNlci51c2VyX2lkO1xuICAgICAgICAgICAgaWYgKHNoaWZ0TnVtKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRTaGlmdHMucHVzaCh7c2hpZnRfbnVtOiBzaGlmdE51bSwgY29udHJhY3RfdGltZV9mazogY29udHJhY3RJZCwgc2l0ZV9pZF9mazogJHNjb3BlLnNoaWZ0c1swXS5zaXRlX2lkX2ZrLCB1c2VyX2lkX2ZrOiBlbXBJZH0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHNlbGVjdGVkU2hpZnRzLm1hcChmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbC5jb250cmFjdF90aW1lX2ZrO1xuICAgICAgICAgICAgICAgIH0pLmluZGV4T2YoY29udHJhY3RJZCk7XG5cbiAgICAgICAgICAgICAgICBzZWxlY3RlZFNoaWZ0cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG5cbiAgICB9XG5cbiAgICAkc2NvcGUuc3VibWl0RW1wU2hpZnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICBjb25zb2xlLmxvZygnZmlyZWQnKTtcbiAgICAgIGNvbnNvbGUubG9nKHNlbGVjdGVkU2hpZnRzKTtcbiAgICAgICAgc2VsZWN0ZWRTaGlmdHMuZm9yRWFjaChmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgIG92ZXJ2aWV3U2VydmljZS5lbXBsb3llZVNjaGVkdWxlKHZhbCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge30pXG4gICAgICAgIH0pXG4gICAgICAgIHNlbGVjdGVkU2hpZnRzID0gW107XG4gICAgfVxuXG59IC8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLmNvbnRyb2xsZXIoJ3NpZ25pbkN0cmwnLHNpZ25pbkN0cmwpXG5cbmZ1bmN0aW9uIHNpZ25pbkN0cmwoJHNjb3BlLGxvZ2luU2VydmljZSwkc3RhdGUpe1xuXG5cblxuXG4kc2NvcGUubG9naW4gPSB7XG4gIHVzZXJuYW1lOiAnYUBhLmNvbScsXG4gIHBhc3N3b3JkOiAnYSdcbn1cblxuXG4kc2NvcGUuc3VibWl0bG9naW4gPSBmdW5jdGlvbihsb2dpbil7XG4gIGxvZ2luU2VydmljZS5nZXRMb2dpbihsb2dpbilcbiAgICAudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgaWYocmVzLnN0YXR1cyA9PT0gMjAwKSAkc3RhdGUuZ28oJ21haW5wYWdlJyk7XG4gICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpXG4gICAgfSk7XG59XG5cbn0vL2VuZCBvZiBob21lQ3RybFxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcignZW1wdXBkYXRlQ3RybCcsZW1wdXBkYXRlQ3RybClcblxuXG5mdW5jdGlvbiBlbXB1cGRhdGVDdHJsKCRzY29wZSx1cGRhdGVTZXJ2aWNlLCRzdGF0ZSl7XG5cblxuICB1cGRhdGVTZXJ2aWNlLnNob3dlbXBsb3llZSgpXG4gIC50aGVuKGZ1bmN0aW9uKGVtcCl7XG4gICAgY29uc29sZS5sb2coZW1wKTtcblxuICAgICRzY29wZS5lbXBsb3llZSA9IGVtcC5kYXRhO1xuICB9KTtcblxuICAkc2NvcGUudXBkYXRlRW1wID0gZnVuY3Rpb24oZGF0YSl7XG4gICAgdXBkYXRlU2VydmljZS5zZXRFbXBJZChkYXRhKTtcbiAgICAkc3RhdGUuZ28oJ3VwZGF0ZWVtcGxveWVlJyk7XG4gIH07XG5cblxuXG5cblxufS8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLmNvbnRyb2xsZXIoJ2Z1bGxlbXB1cGRhdGVDdHJsJyxmdWxsZW1wdXBkYXRlQ3RybClcblxuXG5mdW5jdGlvbiBmdWxsZW1wdXBkYXRlQ3RybCgkc2NvcGUsdXBkYXRlU2VydmljZSwkc3RhdGUpe1xuXG52YXIgZ2V0RW1wSWQgPSB1cGRhdGVTZXJ2aWNlLmdldEVtcElkKCk7XG5cbmNvbnNvbGUubG9nKGdldEVtcElkKTtcblxuJHNjb3BlLmVtcHVwZGF0ZSA9IGdldEVtcElkO1xuXG4kc2NvcGUuc3VibWl0RW1wbG95ZWUgPSBmdW5jdGlvbihkYXRhKXtcbnVwZGF0ZVNlcnZpY2UudXBkYXRlZW1wbG95ZWUoZGF0YSlcbi50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXt9KTtcblxufVxuXG5cblxuXG5cbn0vL2VuZCBvZiBjb250cm9sbGVyXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuY29udHJvbGxlcignZnVsbHNpdGVDdHJsJywgZnVsbHNpdGVDdHJsKTtcblxuZnVuY3Rpb24gZnVsbHNpdGVDdHJsKCRzY29wZSwgdXBkYXRlU2VydmljZSwgJHN0YXRlLCRmaWx0ZXIpIHtcblxuLy8gdmFyIHNpdGVTZXJ2aWNlID0gdXBkYXRlU2VydmljZS5zaXRlVmlld1xuLy8gY29uc29sZS5sb2coc2l0ZVNlcnZpY2UpO1xuXG52YXIgc2VsZWN0ZWRTaXRlSWQgPSB1cGRhdGVTZXJ2aWNlLmdldFNpdGVJZCgpXG5cblxuICAgIHVwZGF0ZVNlcnZpY2UuYWxsU2l0ZUluZm8oc2VsZWN0ZWRTaXRlSWQpLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhKTtcbiAgICAgICAgJHNjb3BlLnNpdGV1cGRhdGUgPSByZXMuZGF0YS5zaXRlWzBdO1xuICAgICAgICAkc2NvcGUuYmVnaW50aW1lY2hhbmdlID0gcmVzLmRhdGEuc2l0ZVswXS5jb250cmFjdF9iZWdpbjtcbiAgICAgICAgJHNjb3BlLmVuZHRpbWVjaGFuZ2UgPSByZXMuZGF0YS5zaXRlWzBdLmNvbnRyYWN0X2VuZDtcbiAgICAgICAgJHNjb3BlLnNpdGV1cGRhdGUuY29udHJhY3RfYmVnaW4gPSAkZmlsdGVyKCdkYXRlJykoJHNjb3BlLmJlZ2ludGltZWNoYW5nZSk7XG4gICAgICAgICRzY29wZS5zaXRldXBkYXRlLmNvbnRyYWN0X2VuZCA9ICRmaWx0ZXIoJ2RhdGUnKSgkc2NvcGUuZW5kdGltZWNoYW5nZSk7XG4gICAgICAgIC8vICRzY29wZS5jaGVja0Zvck51bGwgPSByZXMuZGF0YS5ob3Vyc2FuZHNpdGU7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS5jaGVja0Zvck51bGwpO1xuICAgICAgICBjb25zb2xlLmxvZyhyZXMuZGF0YS5ob3Vyc2FuZHNpdGUpO1xuICAgICAgICAkc2NvcGUudGltZXMgPSByZXMuZGF0YS5ob3Vyc2FuZHNpdGU7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuc3VibWl0VXBkYXRlID0gZnVuY3Rpb24oc2l0ZSwgdGltZSkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhzaXRlKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2codGltZSk7XG4gICAgICAgIHZhciBzaXRlSWROdW0gPSBzaXRlLnNpdGVfaWQ7XG4gICAgICAgIHVwZGF0ZVNlcnZpY2UudXBkYXRlc2l0ZShzaXRlSWROdW0sIHNpdGUpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHt9KTtcbiAgICAgICAgdGltZS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCkge1xuXG4gICAgICAgICAgICB2YXIgc2l0ZUlkID0gdmFsLmNvbnRyYWN0X3RpbWVfaWQ7XG4gICAgICAgICAgICB1cGRhdGVTZXJ2aWNlLnVwZGF0ZWhvdXJzKHNpdGVJZCwgdmFsKS50aGVuKGZ1bmN0aW9uKHJlcykge30pO1xuICAgICAgICAgICAgc2l0ZUlkID0gMDtcbiAgICAgICAgfSk7XG4gICAgfTtcblxufSAvL2VuZCBvZiBjb250cm9sbGVyXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuY29udHJvbGxlcigndXBkYXRlU2l0ZUN0cmwnLCB1cGRhdGVTaXRlQ3RybCk7XG5cbmZ1bmN0aW9uIHVwZGF0ZVNpdGVDdHJsKCRzY29wZSwgdXBkYXRlU2VydmljZSwgJHN0YXRlKSB7XG5cblxuXG4gICAgdXBkYXRlU2VydmljZS51cGRhdGVTaXRlKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAkc2NvcGUudXBkYXRlc2l0ZXMgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAvLyByZXR1cm4gdXBkYXRlU2VydmljZS5zaXRlVmlldyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlLmRhdGEpO1xuICAgIH0pO1xuXG4gICAgLy8gJHNjb3BlLmNoZWNrTnVsbCA9IHRydWU7XG5cbiAgICAkc2NvcGUudXBkYXRlU2l0ZSA9IGZ1bmN0aW9uKHNpdGV2aWV3KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHNpdGV2aWV3KTtcbiAgICAgIHVwZGF0ZVNlcnZpY2Uuc2VsZWN0ZWRTaXRlSWQgPSBzaXRldmlldy5zaXRlX2lkO1xuICAgICAgdXBkYXRlU2VydmljZS5zZXRTaXRlSWQoc2l0ZXZpZXcuc2l0ZV9pZCk7XG5cbiAgICAvLyAgdXBkYXRlU2VydmljZS5zaG93SG91cnMoc2l0ZXZpZXcuc2l0ZV9pZCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHVwZGF0ZVNlcnZpY2Uuc2l0ZVZpZXcpO1xuICAgICAgICAkc3RhdGUuZ28oJ3VwZGF0ZWZ1bGxzaXRlJyk7XG4gIH07XG5cbiAgICAgICAgLy8gdXBkYXRlU2VydmljZS5hbGxTaXRlSW5mbyh1cGRhdGVTZXJ2aWNlLnNpdGV2aWV3LnNpdGVfaWQpLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgIC8vICAgICAvLyBjb25zb2xlLmxvZyhyZXMuZGF0YSk7XG4gICAgICAgIC8vICAgICAkc2NvcGUuc2l0ZXVwZGF0ZSA9IHJlcy5kYXRhLnNpdGVbMF07XG4gICAgICAgIC8vICAgICAkc2NvcGUuYmVnaW50aW1lY2hhbmdlID0gcmVzLmRhdGEuc2l0ZVswXS5jb250cmFjdF9iZWdpbjtcbiAgICAgICAgLy8gICAgICRzY29wZS5lbmR0aW1lY2hhbmdlID0gcmVzLmRhdGEuc2l0ZVswXS5jb250cmFjdF9lbmQ7XG4gICAgICAgIC8vICAgICAkc2NvcGUuc2l0ZXVwZGF0ZS5jb250cmFjdF9iZWdpbiA9ICRmaWx0ZXIoJ2RhdGUnKSgkc2NvcGUuYmVnaW50aW1lY2hhbmdlKTtcbiAgICAgICAgLy8gICAgICRzY29wZS5zaXRldXBkYXRlLmNvbnRyYWN0X2VuZCA9ICRmaWx0ZXIoJ2RhdGUnKSgkc2NvcGUuZW5kdGltZWNoYW5nZSk7XG4gICAgICAgIC8vICAgICAvLyAkc2NvcGUuY2hlY2tGb3JOdWxsID0gcmVzLmRhdGEuaG91cnNhbmRzaXRlO1xuICAgICAgICAvLyAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLmNoZWNrRm9yTnVsbCk7XG4gICAgICAgIC8vICAgICAkc2NvcGUudGltZXMgPSByZXMuZGF0YS5ob3Vyc2FuZHNpdGU7XG4gICAgICAgIC8vIH0pO1xuXG5cblxuICAgIC8vICRzY29wZS5zdWJtaXRVcGRhdGUgPSBmdW5jdGlvbihzaXRlLHRpbWUpe1xuICAgIC8vICAgLy8gY29uc29sZS5sb2coc2l0ZSk7XG4gICAgLy8gICAgIC8vIGNvbnNvbGUubG9nKHRpbWUpO1xuICAgIC8vICAgdmFyIHNpdGVJZE51bSA9IHNpdGUuc2l0ZV9pZDtcbiAgICAvLyAgIHVwZGF0ZVNlcnZpY2UudXBkYXRlc2l0ZShzaXRlSWROdW0sc2l0ZSlcbiAgICAvLyAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAvLyAgIH0pO1xuICAgIC8vICAgdGltZS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCl7XG4gICAgLy9cbiAgICAvLyAgICAgdmFyIHNpdGVJZCA9IHZhbC5jb250cmFjdF90aW1lX2lkO1xuICAgIC8vICAgICB1cGRhdGVTZXJ2aWNlLnVwZGF0ZWhvdXJzKHNpdGVJZCx2YWwpXG4gICAgLy8gICAgIC50aGVuKGZ1bmN0aW9uKHJlcyl7fSk7XG4gICAgLy8gICAgIHNpdGVJZCA9MDtcbiAgICAvLyAgIH0pO1xuICAgIC8vIH07XG5cbiAgICAvLyB1cGRhdGVTZXJ2aWNlLnNob3dlbXBsb3llZSgpXG4gICAgLy8gLnRoZW4oZnVuY3Rpb24oZW1wKXtcbiAgICAvLyAgIGNvbnNvbGUubG9nKGVtcCk7XG4gICAgLy9cbiAgICAvLyAgICRzY29wZS5lbXBsb3llZSA9IGVtcC5kYXRhO1xuICAgIC8vIH0pO1xuXG4gICAgJHNjb3BlLnVwZGF0ZUVtcCA9IGZ1bmN0aW9uKGVtcCl7XG4gICAgICAkc2NvcGUuc2hvd3VwZGF0ZSA9IGZhbHNlO1xuICAgICAgJHNjb3BlLmVtcHVwZGF0ZSA9IGVtcDtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGVtcCk7XG4gICAgICAkc3RhdGUuZ28oJ3Nob3dlbXBsb3llZS51cGRhdGVlbXBsb3llZScpO1xuICAgIH07XG5cbiAgICAkc2NvcGUuc3VibWl0RW1wbG95ZWUgPSBmdW5jdGlvbihlbXBjaGFuZ2Upe1xuICAgICAgdmFyIGVtcGxveWVlSWQgPSBlbXBjaGFuZ2UudXNlcl9pZDtcbiAgICAgIHVwZGF0ZVNlcnZpY2UudXBkYXRlZW1wbG95ZWUoZW1wbG95ZWVJZCxlbXBjaGFuZ2UpXG4gICAgICAudGhlbihmdW5jdGlvbihyZXMpe30pO1xuICAgIH07XG5cblxuXG59IC8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLmFuaW1hdGlvbignLnNsaWRlLWRvd24nLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICBlbnRlcjogZnVuY3Rpb24oZWxlbWVudCwgZG9uZSkge1xuICAgICAgVHdlZW5NYXguZnJvbShlbGVtZW50LCAxLCB7b3BhY2l0eTowLCB5OjUwLCBvbkNvbXBsZXRlOmRvbmV9KVxuICAgIH0sXG4gICAgbGVhdmU6IGZ1bmN0aW9uKGVsZW1lbnQsIGRvbmUpIHtcbiAgICAgIFR3ZWVuTWF4LnRvKGVsZW1lbnQsIDEsIHtvcGFjaXR5OjAsIHk6NTAsIG9uQ29tcGxldGU6ZG9uZX0pXG4gICAgfVxuICB9XG59KTtcblxuLy8gKCcubWFpbi1jb250ZW50JywgW2Z1bmN0aW9uKCl7XG4vLyAgIHJldHVybiB7XG4vLyAgICAgZW50ZXI6IGZ1bmN0aW9uKGVsZW1lbnQsIGRvbmUpIHtcbi8vICAgICAgIFR3ZWVuTWF4LmZyb20oZWxlbWVudCwgMSwge29wYWNpdHk6MCwgeTo1MCwgb25Db21wbGV0ZTpkb25lfSlcbi8vICAgICB9LFxuLy8gICAgIGxlYXZlOiBmdW5jdGlvbihlbGVtZW50LCBkb25lKSB7XG4vLyAgICAgICBUd2Vlbk1heC50byhlbGVtZW50LCAxLCB7b3BhY2l0eTowLCB5OjUwLCBvbkNvbXBsZXRlOmRvbmV9KVxuLy8gICAgIH1cbi8vICAgfVxuLy8gfV0pXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuZGlyZWN0aXZlKCdtZW51RGlyZWN0aXZlJywgZnVuY3Rpb24oKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9zaGFyZWQvbWVudS9tZW51Lmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgICAgXG4gICAgICAgIH1cbiAgICB9XG5cbn0pIC8vZW5kIG9mIGRpcmVjdGl2ZVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpLmRpcmVjdGl2ZSgndGl0bGVEaXJlY3RpdmUnLCBmdW5jdGlvbigpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3NoYXJlZC9tZW51L3RpdGxlLmh0bWwnXG5cbiAgICAgIH1cblxufSkvL2VuZCBvZiBkaXJlY3RpdmVcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKS5zZXJ2aWNlKCdjcmVhdGVTZXJ2aWNlJywgY3JlYXRlU2VydmljZSk7XG5cbmZ1bmN0aW9uIGNyZWF0ZVNlcnZpY2UoJGh0dHAsICRxKSB7XG4gICAgLy8gdGhpcyB3aWxsIGNyZWF0ZSB0aGUgYmVnaW5uaW5nIG9mIHRoZSBzaXRlIHcvbyBkYXlzIGFuZCBob3Vyc1xuICAgIHZhciBzaXRlSWQ7XG4gICAgdGhpcy5zaGlmdHMgPSBbXTtcbiAgICB0aGlzLnNpdGU7XG4gICAgdGhpcy5kYXk7XG4gICAgdGhpcy5jcmVhdGVzaXRlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIHJldHVybiAkaHR0cCh7bWV0aG9kOiBcIlBPU1RcIiwgdXJsOiBcIi9jcmVhdGVzaXRlXCIsIGRhdGE6IG9ian0pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICBzaXRlSWQgPSByZXMuZGF0YVswXS5zaXRlX2lkO1xuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvLyB0aGlzIHdpbGwgY3JlYXRlIHRoZSByZXN0IG9mIHRoZSBzaXRlIC0tIGRheXMgYW5kIGhvdXJzXG4gICAgdGhpcy5jcmVhdGVob3VycyA9IGZ1bmN0aW9uKHNoaWZ0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHNoaWZ0KTtcbiAgICAgICAgc2hpZnQuc2l0ZV9pZCA9IHNpdGVJZDtcbiAgICAgICAgcmV0dXJuICRodHRwKHttZXRob2Q6IFwiUE9TVFwiLCB1cmw6IFwiL2NyZWF0ZWRheWFuZGhvdXJzXCIsIGRhdGE6IHNoaWZ0fSk7XG4gICAgfTtcbiAgICAvLyB0aGlzIHdpbGwgY3JlYXRlIGFuIGVtcGxveWVlXG4gICAgdmFyIGVtcGxveWVlSWQ7XG4gICAgdGhpcy5jcmVhdGVlbXBsb3llZSA9IGZ1bmN0aW9uKGVtcCkge1xuICAgICAgICByZXR1cm4gJGh0dHAoe21ldGhvZDogXCJQT1NUXCIsIHVybDogXCIvY3JlYXRlZW1wbG95ZWVcIiwgZGF0YTogZW1wfSkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgIGVtcGxveWVlSWQgPSByZXMuZGF0YVswXS51c2VyX2lkO1xuICAgICAgICAgICAgY29uc29sZS5sb2coZW1wbG95ZWVJZCk7XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gdGhpcyBtYWtlcyBhbiBhbGVydCBzYXlpbmcgdGhlIHNpdGUgaGFzIGJlZW4gY3JlYXRlZFxuICAgIHRoaXMuc2l0ZWFsZXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHN3YWwoe3RpdGxlOiBcIlNpdGUgQ3JlYXRlZCFcIiwgdHlwZTogXCJzdWNjZXNzXCIsIGNvbmZpcm1CdXR0b25UZXh0OiBcIk9rXCIsIGFsbG93T3V0c2lkZUNsaWNrOiB0cnVlfSk7XG5cbiAgICB9O1xuICAgIC8vIHRoaXMgbWFrZXMgYW4gYWxlcnQgc2F5aW5nIHRoYXQgdGhlIGVtcGxveWVlIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICB0aGlzLmVtcGxveWVlYWxlcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgc3dhbCh7dGl0bGU6IFwiRW1wbG95ZWUgQ3JlYXRlZCFcIiwgdHlwZTogXCJzdWNjZXNzXCIsIGNvbmZpcm1CdXR0b25UZXh0OiBcIk9rXCIsIGFsbG93T3V0c2lkZUNsaWNrOiB0cnVlfSk7XG5cbiAgICB9O1xuXG4gICAgdGhpcy5hZGR0b1NoaWZ0cyA9IGZ1bmN0aW9uKHNoaWZ0cykge1xuICAgICAgICB0aGlzLnNoaWZ0cy5wdXNoKHNoaWZ0cyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc2hpZnRzKTtcblxuICAgIH07XG5cbn0gLy9lbmQgb2Ygc2VydmljZVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uc2VydmljZSgnbG9naW5TZXJ2aWNlJyxsb2dpblNlcnZpY2UpO1xuXG5cbmZ1bmN0aW9uIGxvZ2luU2VydmljZSgkaHR0cCl7XG5cbnRoaXMuZ2V0TG9naW4gPSBmdW5jdGlvbihsb2dpbil7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiUE9TVFwiLFxuICAgIHVybDonL2F1dGgvbG9naW4nLFxuICAgIGRhdGE6IGxvZ2luXG4gIH0pO1xufVxuXG5cblxufSAvL2VuZCBvZiBzZXJ2aWNlXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5zZXJ2aWNlKCdtYWlucGFnZVNlcnZpY2UnLG1haW5wYWdlU2VydmljZSk7XG5cbmZ1bmN0aW9uIG1haW5wYWdlU2VydmljZSgkaHR0cCl7XG5cbnRoaXMuZ2V0Y3VycmVudCA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiR0VUXCIsXG4gICAgdXJsOiBcIi9hdXRoL2N1cnJlbnRcIlxuICB9KVxufVxuXG50aGlzLmdldFVzZXJTaXRlcyA9IGZ1bmN0aW9uKHVzZXJTaXRlSWQpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIkdFVFwiLFxuICAgIHVybDpcIi9nZXRVc2VyU2l0ZXMvXCIgKyB1c2VyU2l0ZUlkXG4gIH0pXG59XG5cblxuXG59Ly9lbmQgb2Ygc2VydmljZVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uc2VydmljZSgnb3ZlcnZpZXdTZXJ2aWNlJyxvdmVydmlld1NlcnZpY2UpXG5cbmZ1bmN0aW9uIG92ZXJ2aWV3U2VydmljZSgkaHR0cCl7XG5cbnZhciBzZWxlY3RlZFNoaWZ0SWQgPXt9O1xuXG5pZihsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNlbGVjdGVkU2hpZnRJZFwiKSl7XG5zZWxlY3RlZFNoaWZ0SWQgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2VsZWN0ZWRTaGlmdElkXCIpKTtcbn1cbnRoaXMuZ2V0U2l0ZUlkID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuIHNlbGVjdGVkU2hpZnRJZDtcbn1cbnRoaXMuc2V0U2l0ZUlkID0gZnVuY3Rpb24oZGF0YSl7XG4gIHNlbGVjdGVkU2hpZnRJZCA9IGRhdGE7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwic2VsZWN0ZWRTaGlmdElkXCIsSlNPTi5zdHJpbmdpZnkoc2VsZWN0ZWRTaGlmdElkKSk7XG59XG5cbmNvbnNvbGUubG9nKHRoaXMuaWROdW1WYXIpO1xuXG4vLyB0aGlzLnNpdGVWaWV3ID0ge307XG4vLyBjb25zb2xlLmxvZyh0aGlzLnNpdGVWaWV3KTtcblxuXG50aGlzLm92ZXJWaWV3U2l0ZXMgPSBmdW5jdGlvbigpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIkdFVFwiLFxuICAgIHVybDpcIi9zaXRlb3ZlcnZpZXdcIlxuICB9KVxufVxuXG50aGlzLnNob3dEYXlzID0gZnVuY3Rpb24oaWROdW0pe1xuXG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiR0VUXCIsXG4gICAgdXJsOlwiL3NjaGVkdWxlRGF5cy9cIiArIGlkTnVtXG4gIH0pXG59XG5cbnRoaXMuc2hvd0hvdXJzID0gZnVuY3Rpb24oaWROdW0pe1xuICAvLyBjb25zb2xlLmxvZyhpZE51bSk7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiR0VUXCIsXG4gICAgdXJsOiBcIi9zY2hlZHVsZUhvdXJzL1wiICsgaWROdW1cbiAgfSlcbn1cblxudGhpcy5lbXBsb3llZVNjaGVkdWxlID0gZnVuY3Rpb24oc2NoZWR1bGVTaGlmdCl7XG4gIC8vIGNvbnNvbGUubG9nKHNjaGVkdWxlU2hpZnQpO1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIlBPU1RcIixcbiAgICB1cmw6XCIvZW1wbG95ZWVzY2hlZHVsZVwiLFxuICAgIGRhdGE6c2NoZWR1bGVTaGlmdFxuICB9KVxufVxuXG50aGlzLmdldFVzZXJJbmZvID0gZnVuY3Rpb24odXNlcklkKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJHRVRcIixcbiAgICB1cmw6XCIvZ2V0VXNlckluZm8vXCIgKyB1c2VySWRcbiAgfSlcbn1cblxudGhpcy5nZXRVc2VySWQgPSBmdW5jdGlvbigpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIkdFVFwiLFxuICAgIHVybDpcIi9hdXRoL2N1cnJlbnRcIlxuICB9KVxufVxuXG5cbn0gLy9lbmQgb2Ygc2VydmljZVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uc2VydmljZSgndXBkYXRlU2VydmljZScsdXBkYXRlU2VydmljZSlcblxuZnVuY3Rpb24gdXBkYXRlU2VydmljZSgkaHR0cCl7XG5cbnZhciBzZWxlY3RlZFNpdGVJZCA9e307XG5cblxuaWYobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzZWxlY3RlZFNpdGVJZFwiKSl7XG5zZWxlY3RlZFNpdGVJZCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzZWxlY3RlZFNpdGVJZFwiKSk7XG59XG50aGlzLmdldFNpdGVJZCA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiBzZWxlY3RlZFNpdGVJZDtcbn1cbnRoaXMuc2V0U2l0ZUlkID0gZnVuY3Rpb24oZGF0YSl7XG4gIHNlbGVjdGVkU2l0ZUlkID0gZGF0YTtcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzZWxlY3RlZFNpdGVJZFwiLEpTT04uc3RyaW5naWZ5KHNlbGVjdGVkU2l0ZUlkKSk7XG59XG5cblxudmFyIHNlbGVjdGVkRW1wSWQgPXt9O1xuXG5cbmlmKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2VsZWN0ZWRFbXBJZFwiKSl7XG5zZWxlY3RlZEVtcElkID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNlbGVjdGVkRW1wSWRcIikpO1xufVxudGhpcy5nZXRFbXBJZCA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiBzZWxlY3RlZEVtcElkO1xufVxudGhpcy5zZXRFbXBJZCA9IGZ1bmN0aW9uKGRhdGEpe1xuICBzZWxlY3RlZEVtcElkID0gZGF0YTtcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzZWxlY3RlZEVtcElkXCIsSlNPTi5zdHJpbmdpZnkoc2VsZWN0ZWRFbXBJZCkpO1xufVxuXG50aGlzLnNpdGVWaWV3ID0ge307XG5jb25zb2xlLmxvZyh0aGlzLnNpdGVWaWV3KTtcblxudGhpcy51cGRhdGVTaXRlID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJHRVRcIixcbiAgICB1cmw6Jy9zaXRlb3ZlcnZpZXcnXG4gIH0pXG59XG5cbnRoaXMuYWxsU2l0ZUluZm8gPSBmdW5jdGlvbihzaXRlSWQpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIkdFVFwiLFxuICAgIHVybDonL2dldHNpdGVhbmRob3Vycy8nICsgc2l0ZUlkXG4gIH0pXG59XG5cbnRoaXMudXBkYXRlc2l0ZSA9IGZ1bmN0aW9uKHVwZGF0ZUlkLHVwZGF0ZVNpdGUpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDogXCJQVVRcIixcbiAgICB1cmw6Jy91cGRhdGVzaXRlLycgKyB1cGRhdGVJZCxcbiAgICBkYXRhOiB1cGRhdGVTaXRlXG4gIH0pXG59XG5cbnRoaXMudXBkYXRlaG91cnMgPSBmdW5jdGlvbih1cGRhdGVJZCwgdXBkYXRlVGltZSl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOiBcIlBVVFwiLFxuICAgIHVybDonL3VwZGF0ZWhvdXJzLycgKyB1cGRhdGVJZCxcbiAgICBkYXRhOiB1cGRhdGVUaW1lXG4gIH0pXG59XG5cbnRoaXMudXBkYXRlZW1wbG95ZWUgPSBmdW5jdGlvbih1cGRhdGVJZCwgdXBkYXRlRW1wbG95ZWUpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDogXCJQVVRcIixcbiAgICB1cmw6ICcvdXBkYXRlZW1wbG95ZWUvJyArIHVwZGF0ZUlkLFxuICAgIGRhdGE6IHVwZGF0ZUVtcGxveWVlXG4gIH0pXG59XG5cbnRoaXMuc2hvd2VtcGxveWVlID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgdXJsOlwiL3ZpZXdlbXBsb3llZVwiXG4gIH0pXG59XG5cblxuXG5cbn0vL2VuZCBvZiBzZXJ2aWNlXG4iXX0=
=======
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5DdHJsLmpzIiwiY29tcG9uZW50cy9jcmVhdGVzaXRlL2NyZWF0ZVNpdGVDdHJsLmpzIiwiY29tcG9uZW50cy9tYWluL21haW5wYWdlQ3RybC5qcyIsImNvbXBvbmVudHMvc2NoZWR1bGUvc2NoZWR1bGVDdHJsLmpzIiwiY29tcG9uZW50cy9zY2hlZHVsZS9zY2hlZHVsZV9ob3Vyc0N0cmwuanMiLCJjb21wb25lbnRzL3JlcXVlc3RfY2hhbmdlL3JlcXVlc3RfY2hhbmdlQ3RybC5qcyIsImNvbXBvbmVudHMvc2lnbmluL3NpZ25pbkN0cmwuanMiLCJjb21wb25lbnRzL3VwZGF0ZV9lbXBsb3llZS9lbXB1cGRhdGVDdHJsLmpzIiwiY29tcG9uZW50cy91cGRhdGVfZW1wbG95ZWUvZnVsbGVtcHVwZGF0ZUN0cmwuanMiLCJjb21wb25lbnRzL3VwZGF0ZV9zaXRlL2Z1bGxzaXRlQ3RybC5qcyIsImNvbXBvbmVudHMvdXBkYXRlX3NpdGUvdXBkYXRlX3NpdGVDdHJsLmpzIiwic2hhcmVkL2FuaW1hdGlvbnMvdWktdmlldy1hbmltYXRpb24uanMiLCJzaGFyZWQvbWVudS9tZW51LWRpcmVjdGl2ZS5qcyIsInNoYXJlZC9tZW51L3RpdGxlLWRpcmVjdGl2ZS5qcyIsInNoYXJlZC9zZXJ2aWNlcy9jcmVhdGVTZXJ2aWNlLmpzIiwic2hhcmVkL3NlcnZpY2VzL2xvZ2luU2VydmljZS5qcyIsInNoYXJlZC9zZXJ2aWNlcy9tYWlucGFnZVNlcnZpY2UuanMiLCJzaGFyZWQvc2VydmljZXMvb3ZlcnZpZXdTZXJ2aWNlLmpzIiwic2hhcmVkL3NlcnZpY2VzL3VwZGF0ZVNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJywgWyd1aS5yb3V0ZXInLCd1aS5ib290c3RyYXAnLCduZ0FuaW1hdGUnLCdzYXRlbGxpemVyJ10pXG4uY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRhdXRoUHJvdmlkZXIpIHtcblxuXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuXG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAuc3RhdGUoJ3NpZ25pbicse1xuICAgICAgdXJsOicvJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2NvbXBvbmVudHMvc2lnbmluL3NpZ25pbi5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdzaWduaW5DdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdtYWlucGFnZScse1xuICAgICAgdXJsOicvbWFpbnBhZ2UnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvY29tcG9uZW50cy9tYWluL21haW5wYWdlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ21haW5wYWdlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnY3JlYXRlc2l0ZScse1xuICAgICAgdXJsOicvY3JlYXRlc2l0ZScsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvY3JlYXRlc2l0ZS9jcmVhdGVzaXRlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjonY3JlYXRlU2l0ZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ2NyZWF0ZXNpdGVkYXlzJywge1xuICAgICAgdXJsOiAnL2RheXMnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvY29tcG9uZW50cy9jcmVhdGVzaXRlL2NyZWF0ZXNpdGVkYXlzLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ2NyZWF0ZVNpdGVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdob3VyJyx7XG4gICAgICB1cmw6Jy9ob3VycycsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvY3JlYXRlc2l0ZS9jcmVhdGVob3Vycy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdjcmVhdGVTaXRlQ3RybCdcbiAgICB9KVxuICAgIC8vIC5zdGF0ZSgndXBkYXRlZW1wbG95ZWUnLHtcbiAgICAvLyAgIHVybDonL3VwZGF0ZWVtcGxveWVlJyxcbiAgICAvLyAgIHRlbXBsYXRlVXJsOidhcHAvY29tcG9uZW50cy91cGRhdGVfc2l0ZS91cGRhdGVfZW1wbG95ZWUuaHRtbCcsXG4gICAgLy8gICBjb250cm9sbGVyOid1cGRhdGVTaXRlQ3RybCdcbiAgICAvLyB9KVxuICAgIC5zdGF0ZSgnY3JlYXRlZW1wbG95ZWUnLHtcbiAgICAgIHVybDonL2NyZWF0ZWVtcGxveWVlJyxcbiAgICAgIHRlbXBsYXRlVXJsOidhcHAvY29tcG9uZW50cy9jcmVhdGVzaXRlL2NyZWF0ZV9lbXBsb3llZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6J2NyZWF0ZVNpdGVDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdzY2hlZHVsZScse1xuICAgICAgdXJsOicvc2NoZWR1bGVzaXRlcycsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvc2NoZWR1bGUvc2NoZWR1bGUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOidzY2hlZHVsZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3NlbGVjdHNoaWZ0Jyx7XG4gICAgICB1cmw6Jy9zY2hlZHVsZXNoaWZ0cycsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvc2NoZWR1bGUvc2NoZWR1bGVzaGlmdHMuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOidzY2hlZHVsZWhvdXJzQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgndXBkYXRlc2l0ZScse1xuICAgICAgdXJsOicvdXBkYXRlc2l0ZScsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvdXBkYXRlX3NpdGUvdXBkYXRlX3NpdGUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOid1cGRhdGVTaXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgndXBkYXRlZnVsbHNpdGUnLHtcbiAgICAgIHVybDonL2Z1bGxzaXRldXBkYXRlJyxcbiAgICAgIHRlbXBsYXRlVXJsOidhcHAvY29tcG9uZW50cy91cGRhdGVfc2l0ZS91cGRhdGVfZnVsbHNpdGUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOidmdWxsc2l0ZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3Nob3dlbXBsb3llZScse1xuICAgICAgdXJsOicvdmlld2VtcGxveWVlJyxcbiAgICAgIHRlbXBsYXRlVXJsOidhcHAvY29tcG9uZW50cy91cGRhdGVfZW1wbG95ZWUvdmlld19lbXBsb3llZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6J2VtcHVwZGF0ZUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3VwZGF0ZWVtcGxveWVlJyx7XG4gICAgICB1cmw6Jy91cGRhdGVlbXBsb3llZScsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvdXBkYXRlX2VtcGxveWVlL3VwZGF0ZV9lbXBsb3llZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdmdWxsZW1wdXBkYXRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgncmVxdWVzdGNoYW5nZScse1xuICAgICAgdXJsOicvcmVxdWVzdGNoYW5nZScsXG4gICAgICB0ZW1wbGF0ZVVybDonYXBwL2NvbXBvbmVudHMvcmVxdWVzdF9jaGFuZ2UvcmVxdWVzdF9jaGFuZ2UuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOidyZXF1ZXN0Y2hhbmdlQ3RybCdcbiAgICB9KTtcblxuXG5cblxuXG5cbn0pOy8vZW5kIG9mIGFuZ3VsYXIgYXBwXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5jb250cm9sbGVyKCdtYWluQ3RybCcsbWFpbkN0cmwpXG5cbmZ1bmN0aW9uIG1haW5DdHJsKCRzY29wZSl7XG5cbiRzY29wZS50ZXN0PVwiaGVsbG9cIlxuXG5cbn0gLy9lbmQgb2YgY29udHJvbGxlclxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpLmNvbnRyb2xsZXIoJ2NyZWF0ZVNpdGVDdHJsJywgY3JlYXRlU2l0ZUN0cmwpXG5cbmZ1bmN0aW9uIGNyZWF0ZVNpdGVDdHJsKCRzY29wZSwgY3JlYXRlU2VydmljZSwgJHN0YXRlKSB7XG4kc2NvcGUuc2hvd3NoaWZ0czEgPSBmYWxzZTtcbiAgICAvLyBHb2VzIGZyb20gY3JlYXRlIHNpdGUgdG8gY3JlYXRlIGRheXMgYWxzbyBjcmVhdGVzIHRoZSBmaXJzdCBwYXJ0IG9mIHRoZSBzaXRlXG4gICAgJHNjb3BlLm5leHQgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIGNyZWF0ZVNlcnZpY2UuY3JlYXRlc2l0ZShuYW1lKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkc2NvcGUuc2l0ZUlkID0gcmVzcG9uc2UuZGF0YVswXS5zaXRlX2lkO1xuICAgICAgICAgICAgY3JlYXRlU2VydmljZS5zaXRlPSRzY29wZS5zaXRlSWQ7XG4gICAgICAgICAgICAgICRzdGF0ZS5nbygnY3JlYXRlc2l0ZWRheXMnKTtcbiAgICAgICAgICB9KTtcblxuICAgIH1cbiAgICAvLyBPcGVucyBzdWJ2aWV3IGZyb20gY3JlYXRlIGRheXMgaW50byBjcmVhdGUgaG91cnNcbiAgICAkc2NvcGUuY3JlYXRlaG91cnMgPSBmdW5jdGlvbihkYXkpIHtcbiAgICAgICAgY3JlYXRlU2VydmljZS5kYXkgPSBkYXk7XG4gICAgICAgICRzdGF0ZS5nbygnaG91cicpO1xuICAgIH1cbiAgICAvLyBjbGVhcnMgYWxsIG9mIHRoZSBjbG9jayBpbmZvXG4gICAgJHNjb3BlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRzY29wZS5zaGlmdCA9IG51bGw7XG4gICAgfTtcbiAgICAvLyBjbG9jayBzdGVwIGluY3JlYXNlc1xuICAgICRzY29wZS5oc3RlcCA9IDE7XG4gICAgJHNjb3BlLm1zdGVwID0gMTU7XG5cbiAgICAvLyBjcmVhdGVzIHRoZSBzaGlmdCBvYmplY3QgYW5kIHRoZW4gcHVzaGVzIGl0IGludG8gdGhlIHNlcnZpY2VcbiAgICAkc2NvcGUuZ2V0TW9yZUhvdXJzID0gZnVuY3Rpb24oc2hpZnQpIHtcblxuXG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gc2hpZnQpIHtcbiAgICAgICAgICAgIHNoaWZ0W3Byb3BdID0gKG5ldyBEYXRlKHNoaWZ0W3Byb3BdKSkuZ2V0SG91cnMoKSArICc6JyArIChuZXcgRGF0ZShzaGlmdFtwcm9wXSkpLmdldE1pbnV0ZXMoKVxuICAgICAgICB9XG4gICAgICAgIHNoaWZ0LmNvbnRyYWN0X2RheSA9IGNyZWF0ZVNlcnZpY2UuZGF5O1xuICAgICAgICBzaGlmdC5zaXRlSWQgPSBjcmVhdGVTZXJ2aWNlLnNpdGU7XG4gICAgICAgIHNoaWZ0LnNpdGVfaWRfZmsgPSBjcmVhdGVTZXJ2aWNlLnNpdGU7XG5cbiAgICAgICAgJHNjb3BlLmFkZHRvU2hpZnRzKHNoaWZ0KTtcbiAgICAgICAgICB9O1xuXG5cbiAgICAkc2NvcGUuZW1wbG95ZWVJZDtcbiAgICAvLyBjcmVhdGVzIGFuIGVtcGxveWVlIGFuZCByZXR1cm5zIHRoYXQgaWRcbiAgICAkc2NvcGUuY3JlYXRlRW1wbG95ZWUgPSBmdW5jdGlvbihlbXBsb3llZSkge1xuICAgICAgICBjcmVhdGVTZXJ2aWNlLmNyZWF0ZWVtcGxveWVlKGVtcGxveWVlKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgJHNjb3BlLmVtcGxveWVlSWQgPSByZXNwb25zZS5kYXRhWzBdLnVzZXJfaWQ7XG4gICAgICAgICAgJHN0YXRlLmdvKCdtYWlucGFnZScpO1xuICAgICAgICAgIHN3YWwoXCJFbXBsb3llZSBDcmVhdGVkIVwiLFwiXCIsXCJzdWNjZXNzXCIpXG5cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAkc2NvcGUuYWRkdG9TaGlmdHMgPSBmdW5jdGlvbihzaGlmdCl7XG4gICAgICBjb25zb2xlLmxvZyhzaGlmdCk7XG4gICAgICBjcmVhdGVTZXJ2aWNlLmFkZHRvU2hpZnRzKHNoaWZ0KTtcbiAgICAgICRzdGF0ZS5nbygnY3JlYXRlc2l0ZWRheXMnKTtcbiAgICB9XG5cblxuICAgICRzY29wZS5nZXRUaW1lcz1mdW5jdGlvbigpe1xuICAgICAgY3JlYXRlU2VydmljZS5zaGlmdHMuZm9yRWFjaChmdW5jdGlvbih2YWwpe1xuICAgICAgICBjb25zb2xlLmxvZyh2YWwpO1xuICAgICAgICBpZighdmFsKXtcbiAgICAgICAgICB2YWwgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgIGNyZWF0ZVNlcnZpY2UuY3JlYXRlaG91cnModmFsKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7fSk7XG4gICAgICB9XG4gICAgICB9KVxuICAgICAgJHN0YXRlLmdvKCdtYWlucGFnZScpO1xuICAgICAgc3dhbChcIlNpdGUgYW5kIGhvdXJzIGNyZWF0ZWQhXCIsXCJcIixcInN1Y2Nlc3NcIik7XG4gICAgfVxuXG5cbiAgICAkc2NvcGUucGlja1NoaWZ0ID0gZnVuY3Rpb24odil7XG5cbiAgICBpZih2ID09PSAxKXtcbiAgICAgICRzY29wZS5zaG93c2hpZnRzMSA9ICEkc2NvcGUuc2hvd3NoaWZ0czE7XG4gICAgfVxuICAgIGlmKHYgPT09IDIpe1xuICAgICAgJHNjb3BlLnNob3dzaGlmdHMyID0gISRzY29wZS5zaG93c2hpZnRzMjtcbiAgICB9XG4gICAgaWYodiA9PT0gMyl7XG4gICAgICAkc2NvcGUuc2hvd3NoaWZ0czMgPSAhJHNjb3BlLnNob3dzaGlmdHMzO1xuICAgIH1cbiAgICBpZih2ID09PSA0KXtcbiAgICAgICRzY29wZS5zaG93c2hpZnRzNCA9ICEkc2NvcGUuc2hvd3NoaWZ0czQ7XG4gICAgfVxuXG4gICAgfVxuXG59IC8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLmNvbnRyb2xsZXIoJ21haW5wYWdlQ3RybCcsbWFpbnBhZ2VDdHJsKTtcblxuZnVuY3Rpb24gbWFpbnBhZ2VDdHJsKCRzY29wZSxtYWlucGFnZVNlcnZpY2Usb3ZlcnZpZXdTZXJ2aWNlKXtcblxubWFpbnBhZ2VTZXJ2aWNlLmdldGN1cnJlbnQoKVxuLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgdmFyIHNpdGVVc2VySWQgPSByZXMuZGF0YS5wYXNzcG9ydC51c2VyLnVzZXJfaWQ7XG4gICRzY29wZS51c2VybmFtZSA9IHJlcy5kYXRhLnBhc3Nwb3J0LnVzZXI7XG4gIG1haW5wYWdlU2VydmljZS5nZXRVc2VyU2l0ZXMoc2l0ZVVzZXJJZClcbiAgLnRoZW4oZnVuY3Rpb24odXNlclNpdGVzKXtcbiAgICAkc2NvcGUudXNlcnNpdGVzID0gdXNlclNpdGVzLmRhdGE7XG4gIGNvbnNvbGUubG9nKHVzZXJTaXRlcy5kYXRhKTtcblxuICB9KVxuXG5cbn0pXG5cblxuXG5cblxufS8vZW5kIG9mIG1haW5wYWdlQ3RybFxuIiwiXG5hbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuY29udHJvbGxlcignc2NoZWR1bGVDdHJsJywgc2NoZWR1bGVDdHJsKVxuXG5mdW5jdGlvbiBzY2hlZHVsZUN0cmwoJHNjb3BlLCBvdmVydmlld1NlcnZpY2UsICRzdGF0ZSkge1xuXG4gICAgLy8gdmFyIHNpdGVBcnJheSA9IFtdO1xuXG4gICAgb3ZlcnZpZXdTZXJ2aWNlLm92ZXJWaWV3U2l0ZXMoKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgLy8gY29uc29sZS5sb2cocmVzLmRhdGEpO1xuICAgICAgICB2YXIgc2l0ZU9iaiA9IHJlcy5kYXRhO1xuICAgICAgICAkc2NvcGUuc2l0ZW92ZXJ2aWV3ID0gcmVzLmRhdGE7XG4gICAgfSk7XG4gICAgLy8gZnVuY3Rpb24gd2lsbCBoaWRlIHNpdGVzIGFuZCB0aGVuIGJyaW5nIGluIHNpdGUgaW5mb1xuICAgICRzY29wZS5zY2hlZHVsZVNoaWZ0ID0gZnVuY3Rpb24oaWROdW0pIHtcbiAgICAgIGNvbnNvbGUubG9nKGlkTnVtLnNpdGVfaWQpO1xuICAgICAgLy8gb3ZlcnZpZXdTZXJ2aWNlLmlkTnVtVmFyKGlkTnVtLnNpdGVfaWQpO1xuICAgICAgLy8gY29uc29sZS5sb2coaWROdW0uc2l0ZV9pZCk7XG4gICAgICBvdmVydmlld1NlcnZpY2Uuc2V0U2l0ZUlkKGlkTnVtLnNpdGVfaWQpO1xuICAgICAgJHN0YXRlLmdvKCdzZWxlY3RzaGlmdCcpXG4gICAgfVxuXG5cbn0gLy9lbmQgb2YgY29udHJvbGxlclxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpLmNvbnRyb2xsZXIoJ3NjaGVkdWxlaG91cnNDdHJsJywgc2NoZWR1bGVob3Vyc0N0cmwpXG5cbmZ1bmN0aW9uIHNjaGVkdWxlaG91cnNDdHJsKCRzY29wZSwgb3ZlcnZpZXdTZXJ2aWNlLCAkc3RhdGUpIHtcblxudmFyIHNlbGVjdGVkU2hpZnRJZCA9IG92ZXJ2aWV3U2VydmljZS5nZXRTaXRlSWQoKVxuY29uc29sZS5sb2coc2VsZWN0ZWRTaGlmdElkKTtcbiAgICBvdmVydmlld1NlcnZpY2Uuc2hvd0hvdXJzKHNlbGVjdGVkU2hpZnRJZCkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgJHNjb3BlLmhvdXJzID0gcmVzLmRhdGE7XG4gICAgICAgICRzY29wZS5zaGlmdHMgPSByZXMuZGF0YTtcblxuICAgIH0pXG5cbiAgICB2YXIgc2VsZWN0ZWRTaGlmdHMgPSBbXTtcbiAgICAkc2NvcGUuYWRkU2hpZnROdW0gPSBmdW5jdGlvbihjb250cmFjdElkLCBzaGlmdE51bSkge1xuICAgICAgLy8gY29uc29sZS5sb2coY29udHJhY3RJZCwnY29udHJhY3RJZCcpO1xuICAgICAgLy8gY29uc29sZS5sb2coc2hpZnROdW0sJ3NoaWZ0TnVtJyk7XG4gICAgICAgIG92ZXJ2aWV3U2VydmljZS5nZXRVc2VySWQoKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcywgJ2dldFVzZXJJZCcpO1xuICAgICAgICAgICAgdmFyIGVtcElkID0gcmVzLmRhdGEucGFzc3BvcnQudXNlci51c2VyX2lkO1xuICAgICAgICAgICAgaWYgKHNoaWZ0TnVtKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRTaGlmdHMucHVzaCh7c2hpZnRfbnVtOiBzaGlmdE51bSwgY29udHJhY3RfdGltZV9mazogY29udHJhY3RJZCwgc2l0ZV9pZF9mazogJHNjb3BlLnNoaWZ0c1swXS5zaXRlX2lkX2ZrLCB1c2VyX2lkX2ZrOiBlbXBJZH0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHNlbGVjdGVkU2hpZnRzLm1hcChmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbC5jb250cmFjdF90aW1lX2ZrO1xuICAgICAgICAgICAgICAgIH0pLmluZGV4T2YoY29udHJhY3RJZCk7XG5cbiAgICAgICAgICAgICAgICBzZWxlY3RlZFNoaWZ0cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG5cbiAgICB9XG5cbiAgICAkc2NvcGUuc3VibWl0RW1wU2hpZnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbGVjdGVkU2hpZnRzLmZvckVhY2goZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICBvdmVydmlld1NlcnZpY2UuZW1wbG95ZWVTY2hlZHVsZSh2YWwpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHt9KVxuICAgICAgICB9KVxuICAgICAgICBzZWxlY3RlZFNoaWZ0cyA9IFtdO1xuICAgICAgICBzd2FsKFwiU2hpZnQgU2NoZWR1bGVkIVwiLFwiIFwiLCBcInN1Y2Nlc3NcIilcbiAgICAgICAgJHN0YXRlLmdvKCdtYWlucGFnZScpXG4gICAgfVxuXG59IC8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLmNvbnRyb2xsZXIoJ3JlcXVlc3RjaGFuZ2VDdHJsJywgcmVxdWVzdGNoYW5nZUN0cmwpXG5cblxuZnVuY3Rpb24gcmVxdWVzdGNoYW5nZUN0cmwoJHNjb3BlKXtcblxuXG5cblxuXG59Ly9lbmQgb2YgY29udHJvbGxlclxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcignc2lnbmluQ3RybCcsc2lnbmluQ3RybClcblxuZnVuY3Rpb24gc2lnbmluQ3RybCgkc2NvcGUsbG9naW5TZXJ2aWNlLCRzdGF0ZSl7XG5cblxuXG5cbiRzY29wZS5sb2dpbiA9IHtcbiAgdXNlcm5hbWU6ICdhQGEuY29tJyxcbiAgcGFzc3dvcmQ6ICdhJ1xufVxuXG5cbiRzY29wZS5zdWJtaXRsb2dpbiA9IGZ1bmN0aW9uKGxvZ2luKXtcbiAgbG9naW5TZXJ2aWNlLmdldExvZ2luKGxvZ2luKVxuICAgIC50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgICBpZihyZXMuc3RhdHVzID09PSAyMDApICRzdGF0ZS5nbygnbWFpbnBhZ2UnKTtcbiAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycilcbiAgICB9KTtcbn1cblxufS8vZW5kIG9mIGhvbWVDdHJsXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5jb250cm9sbGVyKCdlbXB1cGRhdGVDdHJsJyxlbXB1cGRhdGVDdHJsKVxuXG5cbmZ1bmN0aW9uIGVtcHVwZGF0ZUN0cmwoJHNjb3BlLHVwZGF0ZVNlcnZpY2UsJHN0YXRlKXtcblxuXG4gIHVwZGF0ZVNlcnZpY2Uuc2hvd2VtcGxveWVlKClcbiAgLnRoZW4oZnVuY3Rpb24oZW1wKXtcbiAgICBjb25zb2xlLmxvZyhlbXApO1xuXG4gICAgJHNjb3BlLmVtcGxveWVlID0gZW1wLmRhdGE7XG4gIH0pO1xuXG4gICRzY29wZS51cGRhdGVFbXAgPSBmdW5jdGlvbihkYXRhKXtcbiAgICB1cGRhdGVTZXJ2aWNlLnNldEVtcElkKGRhdGEpO1xuICAgICRzdGF0ZS5nbygndXBkYXRlZW1wbG95ZWUnKTtcbiAgfTtcblxuXG5cblxuXG59Ly9lbmQgb2YgY29udHJvbGxlclxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcignZnVsbGVtcHVwZGF0ZUN0cmwnLGZ1bGxlbXB1cGRhdGVDdHJsKVxuXG5cbmZ1bmN0aW9uIGZ1bGxlbXB1cGRhdGVDdHJsKCRzY29wZSx1cGRhdGVTZXJ2aWNlLCRzdGF0ZSl7XG5cbnZhciBnZXRFbXBJZCA9IHVwZGF0ZVNlcnZpY2UuZ2V0RW1wSWQoKTtcblxuY29uc29sZS5sb2coZ2V0RW1wSWQpO1xuXG4kc2NvcGUuZW1wdXBkYXRlID0gZ2V0RW1wSWQ7XG5cbiRzY29wZS5zdWJtaXRFbXBsb3llZSA9IGZ1bmN0aW9uKGRhdGEpe1xudXBkYXRlU2VydmljZS51cGRhdGVlbXBsb3llZShkYXRhKVxuLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe30pO1xuJHN0YXRlLmdvKCdtYWlucGFnZScpO1xuc3dhbChcIkVtcGxveWVlIHVwZGF0ZWQhXCIsXCJcIixcInN1Y2Nlc3NcIik7XG59XG5cblxuXG5cblxufS8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKS5jb250cm9sbGVyKCdmdWxsc2l0ZUN0cmwnLCBmdWxsc2l0ZUN0cmwpO1xuXG5mdW5jdGlvbiBmdWxsc2l0ZUN0cmwoJHNjb3BlLCB1cGRhdGVTZXJ2aWNlLCAkc3RhdGUsJGZpbHRlcikge1xuXG4vLyB2YXIgc2l0ZVNlcnZpY2UgPSB1cGRhdGVTZXJ2aWNlLnNpdGVWaWV3XG4vLyBjb25zb2xlLmxvZyhzaXRlU2VydmljZSk7XG5cbnZhciBzZWxlY3RlZFNpdGVJZCA9IHVwZGF0ZVNlcnZpY2UuZ2V0U2l0ZUlkKClcblxuXG4gICAgdXBkYXRlU2VydmljZS5hbGxTaXRlSW5mbyhzZWxlY3RlZFNpdGVJZCkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEpO1xuICAgICAgICAkc2NvcGUuc2l0ZXVwZGF0ZSA9IHJlcy5kYXRhLnNpdGVbMF07XG4gICAgICAgICRzY29wZS5iZWdpbnRpbWVjaGFuZ2UgPSByZXMuZGF0YS5zaXRlWzBdLmNvbnRyYWN0X2JlZ2luO1xuICAgICAgICAkc2NvcGUuZW5kdGltZWNoYW5nZSA9IHJlcy5kYXRhLnNpdGVbMF0uY29udHJhY3RfZW5kO1xuICAgICAgICAkc2NvcGUuc2l0ZXVwZGF0ZS5jb250cmFjdF9iZWdpbiA9ICRmaWx0ZXIoJ2RhdGUnKSgkc2NvcGUuYmVnaW50aW1lY2hhbmdlKTtcbiAgICAgICAgJHNjb3BlLnNpdGV1cGRhdGUuY29udHJhY3RfZW5kID0gJGZpbHRlcignZGF0ZScpKCRzY29wZS5lbmR0aW1lY2hhbmdlKTtcbiAgICAgICAgLy8gJHNjb3BlLmNoZWNrRm9yTnVsbCA9IHJlcy5kYXRhLmhvdXJzYW5kc2l0ZTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLmNoZWNrRm9yTnVsbCk7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhLmhvdXJzYW5kc2l0ZSk7XG4gICAgICAgICRzY29wZS50aW1lcyA9IHJlcy5kYXRhLmhvdXJzYW5kc2l0ZTtcbiAgICB9KTtcblxuICAgICRzY29wZS5zdWJtaXRVcGRhdGUgPSBmdW5jdGlvbihzaXRlLCB0aW1lKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHNpdGUpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aW1lKTtcbiAgICAgICAgdmFyIHNpdGVJZE51bSA9IHNpdGUuc2l0ZV9pZDtcbiAgICAgICAgdXBkYXRlU2VydmljZS51cGRhdGVzaXRlKHNpdGVJZE51bSwgc2l0ZSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge30pO1xuICAgICAgICB0aW1lLmZvckVhY2goZnVuY3Rpb24odmFsKSB7XG5cbiAgICAgICAgICAgIHZhciBzaXRlSWQgPSB2YWwuY29udHJhY3RfdGltZV9pZDtcbiAgICAgICAgICAgIHVwZGF0ZVNlcnZpY2UudXBkYXRlaG91cnMoc2l0ZUlkLCB2YWwpLnRoZW4oZnVuY3Rpb24ocmVzKSB7fSk7XG4gICAgICAgICAgICBzaXRlSWQgPSAwO1xuICAgICAgICB9KTtcbiAgICAgICAgJHN0YXRlLmdvKCdtYWlucGFnZScpO1xuICAgICAgICBzd2FsKFwiU2l0ZSBhbmQgaG91cnMgdXBkYXRlZCFcIixcIlwiLFwic3VjY2Vzc1wiKTtcbiAgICB9O1xuXG59IC8vZW5kIG9mIGNvbnRyb2xsZXJcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKS5jb250cm9sbGVyKCd1cGRhdGVTaXRlQ3RybCcsIHVwZGF0ZVNpdGVDdHJsKTtcblxuZnVuY3Rpb24gdXBkYXRlU2l0ZUN0cmwoJHNjb3BlLCB1cGRhdGVTZXJ2aWNlLCAkc3RhdGUpIHtcblxuXG5cbiAgICB1cGRhdGVTZXJ2aWNlLnVwZGF0ZVNpdGUoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICRzY29wZS51cGRhdGVzaXRlcyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIC8vIHJldHVybiB1cGRhdGVTZXJ2aWNlLnNpdGVWaWV3ID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UuZGF0YSk7XG4gICAgfSk7XG5cbiAgICAvLyAkc2NvcGUuY2hlY2tOdWxsID0gdHJ1ZTtcblxuICAgICRzY29wZS51cGRhdGVTaXRlID0gZnVuY3Rpb24oc2l0ZXZpZXcpIHtcbiAgICAgICAgY29uc29sZS5sb2coc2l0ZXZpZXcpO1xuICAgICAgdXBkYXRlU2VydmljZS5zZWxlY3RlZFNpdGVJZCA9IHNpdGV2aWV3LnNpdGVfaWQ7XG4gICAgICB1cGRhdGVTZXJ2aWNlLnNldFNpdGVJZChzaXRldmlldy5zaXRlX2lkKTtcblxuICAgIC8vICB1cGRhdGVTZXJ2aWNlLnNob3dIb3VycyhzaXRldmlldy5zaXRlX2lkKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2codXBkYXRlU2VydmljZS5zaXRlVmlldyk7XG4gICAgICAgICRzdGF0ZS5nbygndXBkYXRlZnVsbHNpdGUnKTtcbiAgfTtcblxuICAgICAgXG5cbiAgICAkc2NvcGUudXBkYXRlRW1wID0gZnVuY3Rpb24oZW1wKXtcbiAgICAgICRzY29wZS5zaG93dXBkYXRlID0gZmFsc2U7XG4gICAgICAkc2NvcGUuZW1wdXBkYXRlID0gZW1wO1xuICAgICAgLy8gY29uc29sZS5sb2coZW1wKTtcbiAgICAgICRzdGF0ZS5nbygnc2hvd2VtcGxveWVlLnVwZGF0ZWVtcGxveWVlJyk7XG4gICAgfTtcblxuICAgICRzY29wZS5zdWJtaXRFbXBsb3llZSA9IGZ1bmN0aW9uKGVtcGNoYW5nZSl7XG4gICAgICB2YXIgZW1wbG95ZWVJZCA9IGVtcGNoYW5nZS51c2VyX2lkO1xuICAgICAgdXBkYXRlU2VydmljZS51cGRhdGVlbXBsb3llZShlbXBsb3llZUlkLGVtcGNoYW5nZSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJlcyl7fSk7XG4gICAgfTtcblxuXG5cbn0gLy9lbmQgb2YgY29udHJvbGxlclxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uYW5pbWF0aW9uKCcuc2xpZGUtZG93bicsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIGVudGVyOiBmdW5jdGlvbihlbGVtZW50LCBkb25lKSB7XG4gICAgICBUd2Vlbk1heC5mcm9tKGVsZW1lbnQsIDEsIHtvcGFjaXR5OjAsIHk6NTAsIG9uQ29tcGxldGU6ZG9uZX0pXG4gICAgfSxcbiAgICBsZWF2ZTogZnVuY3Rpb24oZWxlbWVudCwgZG9uZSkge1xuICAgICAgVHdlZW5NYXgudG8oZWxlbWVudCwgMSwge29wYWNpdHk6MCwgeTo1MCwgb25Db21wbGV0ZTpkb25lfSlcbiAgICB9XG4gIH1cbn0pO1xuXG4vLyAoJy5tYWluLWNvbnRlbnQnLCBbZnVuY3Rpb24oKXtcbi8vICAgcmV0dXJuIHtcbi8vICAgICBlbnRlcjogZnVuY3Rpb24oZWxlbWVudCwgZG9uZSkge1xuLy8gICAgICAgVHdlZW5NYXguZnJvbShlbGVtZW50LCAxLCB7b3BhY2l0eTowLCB5OjUwLCBvbkNvbXBsZXRlOmRvbmV9KVxuLy8gICAgIH0sXG4vLyAgICAgbGVhdmU6IGZ1bmN0aW9uKGVsZW1lbnQsIGRvbmUpIHtcbi8vICAgICAgIFR3ZWVuTWF4LnRvKGVsZW1lbnQsIDEsIHtvcGFjaXR5OjAsIHk6NTAsIG9uQ29tcGxldGU6ZG9uZX0pXG4vLyAgICAgfVxuLy8gICB9XG4vLyB9XSlcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKS5kaXJlY3RpdmUoJ21lbnVEaXJlY3RpdmUnLCBmdW5jdGlvbigpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3NoYXJlZC9tZW51L21lbnUuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgICBcbiAgICAgICAgfVxuICAgIH1cblxufSkgLy9lbmQgb2YgZGlyZWN0aXZlXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuZGlyZWN0aXZlKCd0aXRsZURpcmVjdGl2ZScsIGZ1bmN0aW9uKCkge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvc2hhcmVkL21lbnUvdGl0bGUuaHRtbCdcblxuICAgICAgfVxuXG59KS8vZW5kIG9mIGRpcmVjdGl2ZVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpLnNlcnZpY2UoJ2NyZWF0ZVNlcnZpY2UnLCBjcmVhdGVTZXJ2aWNlKTtcblxuZnVuY3Rpb24gY3JlYXRlU2VydmljZSgkaHR0cCwgJHEpIHtcbiAgICAvLyB0aGlzIHdpbGwgY3JlYXRlIHRoZSBiZWdpbm5pbmcgb2YgdGhlIHNpdGUgdy9vIGRheXMgYW5kIGhvdXJzXG4gICAgdmFyIHNpdGVJZDtcbiAgICB0aGlzLnNoaWZ0cyA9IFtdO1xuICAgIHRoaXMuc2l0ZTtcbiAgICB0aGlzLmRheTtcbiAgICB0aGlzLmNyZWF0ZXNpdGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgcmV0dXJuICRodHRwKHttZXRob2Q6IFwiUE9TVFwiLCB1cmw6IFwiL2NyZWF0ZXNpdGVcIiwgZGF0YTogb2JqfSkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgIHNpdGVJZCA9IHJlcy5kYXRhWzBdLnNpdGVfaWQ7XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8vIHRoaXMgd2lsbCBjcmVhdGUgdGhlIHJlc3Qgb2YgdGhlIHNpdGUgLS0gZGF5cyBhbmQgaG91cnNcbiAgICB0aGlzLmNyZWF0ZWhvdXJzID0gZnVuY3Rpb24oc2hpZnQpIHtcbiAgICAgICAgY29uc29sZS5sb2coc2hpZnQpO1xuICAgICAgICBzaGlmdC5zaXRlX2lkID0gc2l0ZUlkO1xuICAgICAgICByZXR1cm4gJGh0dHAoe21ldGhvZDogXCJQT1NUXCIsIHVybDogXCIvY3JlYXRlZGF5YW5kaG91cnNcIiwgZGF0YTogc2hpZnR9KTtcbiAgICB9O1xuICAgIC8vIHRoaXMgd2lsbCBjcmVhdGUgYW4gZW1wbG95ZWVcbiAgICB2YXIgZW1wbG95ZWVJZDtcbiAgICB0aGlzLmNyZWF0ZWVtcGxveWVlID0gZnVuY3Rpb24oZW1wKSB7XG4gICAgICAgIHJldHVybiAkaHR0cCh7bWV0aG9kOiBcIlBPU1RcIiwgdXJsOiBcIi9jcmVhdGVlbXBsb3llZVwiLCBkYXRhOiBlbXB9KS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgZW1wbG95ZWVJZCA9IHJlcy5kYXRhWzBdLnVzZXJfaWQ7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlbXBsb3llZUlkKTtcbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyB0aGlzIG1ha2VzIGFuIGFsZXJ0IHNheWluZyB0aGUgc2l0ZSBoYXMgYmVlbiBjcmVhdGVkXG4gICAgdGhpcy5zaXRlYWxlcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgc3dhbCh7dGl0bGU6IFwiU2l0ZSBDcmVhdGVkIVwiLCB0eXBlOiBcInN1Y2Nlc3NcIiwgY29uZmlybUJ1dHRvblRleHQ6IFwiT2tcIiwgYWxsb3dPdXRzaWRlQ2xpY2s6IHRydWV9KTtcblxuICAgIH07XG4gICAgLy8gdGhpcyBtYWtlcyBhbiBhbGVydCBzYXlpbmcgdGhhdCB0aGUgZW1wbG95ZWUgaGFzIGJlZW4gY3JlYXRlZFxuICAgIHRoaXMuZW1wbG95ZWVhbGVydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBzd2FsKHt0aXRsZTogXCJFbXBsb3llZSBDcmVhdGVkIVwiLCB0eXBlOiBcInN1Y2Nlc3NcIiwgY29uZmlybUJ1dHRvblRleHQ6IFwiT2tcIiwgYWxsb3dPdXRzaWRlQ2xpY2s6IHRydWV9KTtcblxuICAgIH07XG5cbiAgICB0aGlzLmFkZHRvU2hpZnRzID0gZnVuY3Rpb24oc2hpZnRzKSB7XG4gICAgICAgIHRoaXMuc2hpZnRzLnB1c2goc2hpZnRzKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5zaGlmdHMpO1xuXG4gICAgfTtcblxufSAvL2VuZCBvZiBzZXJ2aWNlXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5zZXJ2aWNlKCdsb2dpblNlcnZpY2UnLGxvZ2luU2VydmljZSk7XG5cblxuZnVuY3Rpb24gbG9naW5TZXJ2aWNlKCRodHRwKXtcblxudGhpcy5nZXRMb2dpbiA9IGZ1bmN0aW9uKGxvZ2luKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJQT1NUXCIsXG4gICAgdXJsOicvYXV0aC9sb2dpbicsXG4gICAgZGF0YTogbG9naW5cbiAgfSk7XG59XG5cblxuXG59IC8vZW5kIG9mIHNlcnZpY2VcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLnNlcnZpY2UoJ21haW5wYWdlU2VydmljZScsbWFpbnBhZ2VTZXJ2aWNlKTtcblxuZnVuY3Rpb24gbWFpbnBhZ2VTZXJ2aWNlKCRodHRwKXtcblxudGhpcy5nZXRjdXJyZW50ID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJHRVRcIixcbiAgICB1cmw6IFwiL2F1dGgvY3VycmVudFwiXG4gIH0pXG59XG5cbnRoaXMuZ2V0VXNlclNpdGVzID0gZnVuY3Rpb24odXNlclNpdGVJZCl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiR0VUXCIsXG4gICAgdXJsOlwiL2dldFVzZXJTaXRlcy9cIiArIHVzZXJTaXRlSWRcbiAgfSlcbn1cblxuXG5cbn0vL2VuZCBvZiBzZXJ2aWNlXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5zZXJ2aWNlKCdvdmVydmlld1NlcnZpY2UnLG92ZXJ2aWV3U2VydmljZSlcblxuZnVuY3Rpb24gb3ZlcnZpZXdTZXJ2aWNlKCRodHRwKXtcblxudmFyIHNlbGVjdGVkU2hpZnRJZCA9e307XG5cbmlmKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2VsZWN0ZWRTaGlmdElkXCIpKXtcbnNlbGVjdGVkU2hpZnRJZCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzZWxlY3RlZFNoaWZ0SWRcIikpO1xufVxudGhpcy5nZXRTaXRlSWQgPSBmdW5jdGlvbigpe1xuICByZXR1cm4gc2VsZWN0ZWRTaGlmdElkO1xufVxudGhpcy5zZXRTaXRlSWQgPSBmdW5jdGlvbihkYXRhKXtcbiAgc2VsZWN0ZWRTaGlmdElkID0gZGF0YTtcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzZWxlY3RlZFNoaWZ0SWRcIixKU09OLnN0cmluZ2lmeShzZWxlY3RlZFNoaWZ0SWQpKTtcbn1cblxuY29uc29sZS5sb2codGhpcy5pZE51bVZhcik7XG5cbi8vIHRoaXMuc2l0ZVZpZXcgPSB7fTtcbi8vIGNvbnNvbGUubG9nKHRoaXMuc2l0ZVZpZXcpO1xuXG5cbnRoaXMub3ZlclZpZXdTaXRlcyA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiR0VUXCIsXG4gICAgdXJsOlwiL3NpdGVvdmVydmlld1wiXG4gIH0pXG59XG5cbnRoaXMuc2hvd0RheXMgPSBmdW5jdGlvbihpZE51bSl7XG5cbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJHRVRcIixcbiAgICB1cmw6XCIvc2NoZWR1bGVEYXlzL1wiICsgaWROdW1cbiAgfSlcbn1cblxudGhpcy5zaG93SG91cnMgPSBmdW5jdGlvbihpZE51bSl7XG4gIC8vIGNvbnNvbGUubG9nKGlkTnVtKTtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJHRVRcIixcbiAgICB1cmw6IFwiL3NjaGVkdWxlSG91cnMvXCIgKyBpZE51bVxuICB9KVxufVxuXG50aGlzLmVtcGxveWVlU2NoZWR1bGUgPSBmdW5jdGlvbihzY2hlZHVsZVNoaWZ0KXtcbiAgLy8gY29uc29sZS5sb2coc2NoZWR1bGVTaGlmdCk7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiUE9TVFwiLFxuICAgIHVybDpcIi9lbXBsb3llZXNjaGVkdWxlXCIsXG4gICAgZGF0YTpzY2hlZHVsZVNoaWZ0XG4gIH0pXG59XG5cbnRoaXMuZ2V0VXNlckluZm8gPSBmdW5jdGlvbih1c2VySWQpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIkdFVFwiLFxuICAgIHVybDpcIi9nZXRVc2VySW5mby9cIiArIHVzZXJJZFxuICB9KVxufVxuXG50aGlzLmdldFVzZXJJZCA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiR0VUXCIsXG4gICAgdXJsOlwiL2F1dGgvY3VycmVudFwiXG4gIH0pXG59XG5cblxufSAvL2VuZCBvZiBzZXJ2aWNlXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5zZXJ2aWNlKCd1cGRhdGVTZXJ2aWNlJyx1cGRhdGVTZXJ2aWNlKVxuXG5mdW5jdGlvbiB1cGRhdGVTZXJ2aWNlKCRodHRwKXtcblxudmFyIHNlbGVjdGVkU2l0ZUlkID17fTtcblxuXG5pZihsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNlbGVjdGVkU2l0ZUlkXCIpKXtcbnNlbGVjdGVkU2l0ZUlkID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNlbGVjdGVkU2l0ZUlkXCIpKTtcbn1cbnRoaXMuZ2V0U2l0ZUlkID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuIHNlbGVjdGVkU2l0ZUlkO1xufVxudGhpcy5zZXRTaXRlSWQgPSBmdW5jdGlvbihkYXRhKXtcbiAgc2VsZWN0ZWRTaXRlSWQgPSBkYXRhO1xuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInNlbGVjdGVkU2l0ZUlkXCIsSlNPTi5zdHJpbmdpZnkoc2VsZWN0ZWRTaXRlSWQpKTtcbn1cblxuXG52YXIgc2VsZWN0ZWRFbXBJZCA9e307XG5cblxuaWYobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzZWxlY3RlZEVtcElkXCIpKXtcbnNlbGVjdGVkRW1wSWQgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2VsZWN0ZWRFbXBJZFwiKSk7XG59XG50aGlzLmdldEVtcElkID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuIHNlbGVjdGVkRW1wSWQ7XG59XG50aGlzLnNldEVtcElkID0gZnVuY3Rpb24oZGF0YSl7XG4gIHNlbGVjdGVkRW1wSWQgPSBkYXRhO1xuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInNlbGVjdGVkRW1wSWRcIixKU09OLnN0cmluZ2lmeShzZWxlY3RlZEVtcElkKSk7XG59XG5cbnRoaXMuc2l0ZVZpZXcgPSB7fTtcbmNvbnNvbGUubG9nKHRoaXMuc2l0ZVZpZXcpO1xuXG50aGlzLnVwZGF0ZVNpdGUgPSBmdW5jdGlvbigpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDpcIkdFVFwiLFxuICAgIHVybDonL3NpdGVvdmVydmlldydcbiAgfSlcbn1cblxudGhpcy5hbGxTaXRlSW5mbyA9IGZ1bmN0aW9uKHNpdGVJZCl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiR0VUXCIsXG4gICAgdXJsOicvZ2V0c2l0ZWFuZGhvdXJzLycgKyBzaXRlSWRcbiAgfSlcbn1cblxudGhpcy51cGRhdGVzaXRlID0gZnVuY3Rpb24odXBkYXRlSWQsdXBkYXRlU2l0ZSl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOiBcIlBVVFwiLFxuICAgIHVybDonL3VwZGF0ZXNpdGUvJyArIHVwZGF0ZUlkLFxuICAgIGRhdGE6IHVwZGF0ZVNpdGVcbiAgfSlcbn1cblxudGhpcy51cGRhdGVob3VycyA9IGZ1bmN0aW9uKHVwZGF0ZUlkLCB1cGRhdGVUaW1lKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6IFwiUFVUXCIsXG4gICAgdXJsOicvdXBkYXRlaG91cnMvJyArIHVwZGF0ZUlkLFxuICAgIGRhdGE6IHVwZGF0ZVRpbWVcbiAgfSlcbn1cblxudGhpcy51cGRhdGVlbXBsb3llZSA9IGZ1bmN0aW9uKHVwZGF0ZUlkLCB1cGRhdGVFbXBsb3llZSl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOiBcIlBVVFwiLFxuICAgIHVybDogJy91cGRhdGVlbXBsb3llZS8nICsgdXBkYXRlSWQsXG4gICAgZGF0YTogdXBkYXRlRW1wbG95ZWVcbiAgfSlcbn1cblxudGhpcy5zaG93ZW1wbG95ZWUgPSBmdW5jdGlvbigpe1xuICByZXR1cm4gJGh0dHAoe1xuICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICB1cmw6XCIvdmlld2VtcGxveWVlXCJcbiAgfSlcbn1cblxuXG5cblxufS8vZW5kIG9mIHNlcnZpY2VcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
>>>>>>> cf6f57c3fd540cb5627d9b54c68377eb7876a2ea
