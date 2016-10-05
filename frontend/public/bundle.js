angular.module('keeperApp', ['ui.router','ui.bootstrap','ngAnimate'])
.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    // $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/')

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
    // .state('sitemodal',{
    //   url:'/sitemodal',
    //   templateUrl: 'app/shared/createsite/createsite.html',
    //   controller: 'complexCtrl'
    // })

})//end of angular app

angular.module('keeperApp')
.controller('mainCtrl',mainCtrl)

function mainCtrl($scope){

$scope.test="hello"


} //end of controller

angular.module('keeperApp')
.controller('employee_modalCtrl',employee_modalCtrl)


function employee_modalCtrl($scope,$uibModalInstance,createService){



  $scope.submit = function(employee){
    createService.createemployee(employee)
    .then(function(response){
    })
    $uibModalInstance.close(
      createService.employeealert()
    );
  }



$scope.cancel= function(){
  $uibModalInstance.dismiss();
}

$scope.ok=function(){
  $uibModalInstance.close('Test');
}

}

angular.module('keeperApp')
.controller('mainpageCtrl',mainpageCtrl);

function mainpageCtrl(){





}//end of mainpageCtrl

angular.module('keeperApp')
.controller('site_modalCtrl',site_modalCtrl)


function site_modalCtrl($scope,$uibModalInstance,createService){


  $scope.submit = function(site){
    createService.createsite(site)
    .then(function(response){
    })
    $uibModalInstance.close(
      createService.sitealert()
    );
  }



$scope.cancel= function(){
  $uibModalInstance.dismiss();
}

$scope.ok=function(){
  $uibModalInstance.close('Test');
}

}

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

angular.module('keeperApp')
.controller('signinCtrl',signinCtrl)

function signinCtrl($scope){

$scope.test='hello is this working';

}//end of homeCtrl

angular.module('keeperApp')
.service('createService',createService)

function createService($http,$q){

this.createsite = function(obj){
  return $http({
    method:"POST",
    url:"/createsite",
    data:obj
  })
};

this.createemployee = function(emp){
  return $http({
    method:"POST",
    url:"/createemployee",
    data:emp
  })
};


this.sitealert = function(){swal({
    title: "Site Created!",
    type: "success",
    confirmButtonText: "Ok",
    allowOutsideClick: true
  });

};

this.employeealert = function(){swal({
    title: "Employee Created!",
    type: "success",
    confirmButtonText: "Ok",
    allowOutsideClick: true
  });

};



}//end of service

angular.module('keeperApp')
.service('mainpageService',mainpageService);

function mainpageService(){




}//end of service

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5DdHJsLmpzIiwic2hhcmVkL2NyZWF0ZV9lbXBsb3llZS9lbXBsb3llZV9tb2RhbF9jdHJsLmpzIiwiY29tcG9uZW50cy9tYWluL21haW5wYWdlQ3RybC5qcyIsInNoYXJlZC9jcmVhdGVzaXRlL3NpdGUtbW9kYWxDdHJsLmpzIiwic2hhcmVkL21lbnUvbWVudS1kaXJlY3RpdmUuanMiLCJjb21wb25lbnRzL3NpZ25pbi9zaWduaW5DdHJsLmpzIiwic2hhcmVkL3NlcnZpY2VzL2NyZWF0ZVNlcnZpY2UuanMiLCJzaGFyZWQvc2VydmljZXMvbWFpbnBhZ2VTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnLCBbJ3VpLnJvdXRlcicsJ3VpLmJvb3RzdHJhcCcsJ25nQW5pbWF0ZSddKVxuLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuXG4gICAgLy8gJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKVxuXG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAuc3RhdGUoJ3NpZ25pbicse1xuICAgICAgdXJsOicvJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2NvbXBvbmVudHMvc2lnbmluL3NpZ25pbi5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdzaWduaW5DdHJsJ1xuICAgIH0pXG5cbiAgICAuc3RhdGUoJ21haW5wYWdlJyx7XG4gICAgICB1cmw6Jy9tYWlucGFnZScsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9jb21wb25lbnRzL21haW4vbWFpbnBhZ2UuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnbWFpbnBhZ2VDdHJsJ1xuICAgIH0pXG4gICAgLy8gLnN0YXRlKCdzaXRlbW9kYWwnLHtcbiAgICAvLyAgIHVybDonL3NpdGVtb2RhbCcsXG4gICAgLy8gICB0ZW1wbGF0ZVVybDogJ2FwcC9zaGFyZWQvY3JlYXRlc2l0ZS9jcmVhdGVzaXRlLmh0bWwnLFxuICAgIC8vICAgY29udHJvbGxlcjogJ2NvbXBsZXhDdHJsJ1xuICAgIC8vIH0pXG5cbn0pLy9lbmQgb2YgYW5ndWxhciBhcHBcbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLmNvbnRyb2xsZXIoJ21haW5DdHJsJyxtYWluQ3RybClcblxuZnVuY3Rpb24gbWFpbkN0cmwoJHNjb3BlKXtcblxuJHNjb3BlLnRlc3Q9XCJoZWxsb1wiXG5cblxufSAvL2VuZCBvZiBjb250cm9sbGVyXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5jb250cm9sbGVyKCdlbXBsb3llZV9tb2RhbEN0cmwnLGVtcGxveWVlX21vZGFsQ3RybClcblxuXG5mdW5jdGlvbiBlbXBsb3llZV9tb2RhbEN0cmwoJHNjb3BlLCR1aWJNb2RhbEluc3RhbmNlLGNyZWF0ZVNlcnZpY2Upe1xuXG5cblxuICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oZW1wbG95ZWUpe1xuICAgIGNyZWF0ZVNlcnZpY2UuY3JlYXRlZW1wbG95ZWUoZW1wbG95ZWUpXG4gICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgIH0pXG4gICAgJHVpYk1vZGFsSW5zdGFuY2UuY2xvc2UoXG4gICAgICBjcmVhdGVTZXJ2aWNlLmVtcGxveWVlYWxlcnQoKVxuICAgICk7XG4gIH1cblxuXG5cbiRzY29wZS5jYW5jZWw9IGZ1bmN0aW9uKCl7XG4gICR1aWJNb2RhbEluc3RhbmNlLmRpc21pc3MoKTtcbn1cblxuJHNjb3BlLm9rPWZ1bmN0aW9uKCl7XG4gICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKCdUZXN0Jyk7XG59XG5cbn1cbiIsImFuZ3VsYXIubW9kdWxlKCdrZWVwZXJBcHAnKVxuLmNvbnRyb2xsZXIoJ21haW5wYWdlQ3RybCcsbWFpbnBhZ2VDdHJsKTtcblxuZnVuY3Rpb24gbWFpbnBhZ2VDdHJsKCl7XG5cblxuXG5cblxufS8vZW5kIG9mIG1haW5wYWdlQ3RybFxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcignc2l0ZV9tb2RhbEN0cmwnLHNpdGVfbW9kYWxDdHJsKVxuXG5cbmZ1bmN0aW9uIHNpdGVfbW9kYWxDdHJsKCRzY29wZSwkdWliTW9kYWxJbnN0YW5jZSxjcmVhdGVTZXJ2aWNlKXtcblxuXG4gICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbihzaXRlKXtcbiAgICBjcmVhdGVTZXJ2aWNlLmNyZWF0ZXNpdGUoc2l0ZSlcbiAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgfSlcbiAgICAkdWliTW9kYWxJbnN0YW5jZS5jbG9zZShcbiAgICAgIGNyZWF0ZVNlcnZpY2Uuc2l0ZWFsZXJ0KClcbiAgICApO1xuICB9XG5cblxuXG4kc2NvcGUuY2FuY2VsPSBmdW5jdGlvbigpe1xuICAkdWliTW9kYWxJbnN0YW5jZS5kaXNtaXNzKCk7XG59XG5cbiRzY29wZS5vaz1mdW5jdGlvbigpe1xuICAkdWliTW9kYWxJbnN0YW5jZS5jbG9zZSgnVGVzdCcpO1xufVxuXG59XG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJykuZGlyZWN0aXZlKCdtZW51RGlyZWN0aXZlJywgZnVuY3Rpb24oKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9zaGFyZWQvbWVudS9tZW51Lmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUsICR1aWJNb2RhbCkge1xuICAgICAgICAgICAgLy8gb3BlbnMgY3JlYXRlIHNpdGUgbW9kYWxcbiAgICAgICAgICAgICRzY29wZS5zaXRlb3BlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJHVpYk1vZGFsLm9wZW4oe1xuICAgICAgICAgICAgICAgICAgICBzaXplOiAnbWQnLCB0ZW1wbGF0ZVVybDogJ2FwcC9zaGFyZWQvY3JlYXRlc2l0ZS9jcmVhdGVzaXRlbW9kYWwuaHRtbCcsIGNvbnRyb2xsZXI6ICdzaXRlX21vZGFsQ3RybCcsXG4gICAgICAgICAgICAgICAgICAgIC8vIHdpbmRvd1RlbXBsYXRlVXJsOidhcHAvc2hhcmVkL2NyZWF0ZXNpdGUvY3JlYXRlc2l0ZW1vZGFsLmh0bWwnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyBvcGVucyBjcmVhdGUgZW1wbG95ZWUgbW9kYWxcbiAgICAgICAgICAgICRzY29wZS5lbXBsb3llZW9wZW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICR1aWJNb2RhbC5vcGVuKHtzaXplOiAnbWQnLCB0ZW1wbGF0ZVVybDogJ2FwcC9zaGFyZWQvY3JlYXRlX2VtcGxveWVlL2VtcGxveWVlX21vZGFsLmh0bWwnLCBjb250cm9sbGVyOiAnZW1wbG95ZWVfbW9kYWxDdHJsJ30pXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG59KS8vZW5kIG9mIGRpcmVjdGl2ZVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uY29udHJvbGxlcignc2lnbmluQ3RybCcsc2lnbmluQ3RybClcblxuZnVuY3Rpb24gc2lnbmluQ3RybCgkc2NvcGUpe1xuXG4kc2NvcGUudGVzdD0naGVsbG8gaXMgdGhpcyB3b3JraW5nJztcblxufS8vZW5kIG9mIGhvbWVDdHJsXG4iLCJhbmd1bGFyLm1vZHVsZSgna2VlcGVyQXBwJylcbi5zZXJ2aWNlKCdjcmVhdGVTZXJ2aWNlJyxjcmVhdGVTZXJ2aWNlKVxuXG5mdW5jdGlvbiBjcmVhdGVTZXJ2aWNlKCRodHRwLCRxKXtcblxudGhpcy5jcmVhdGVzaXRlID0gZnVuY3Rpb24ob2JqKXtcbiAgcmV0dXJuICRodHRwKHtcbiAgICBtZXRob2Q6XCJQT1NUXCIsXG4gICAgdXJsOlwiL2NyZWF0ZXNpdGVcIixcbiAgICBkYXRhOm9ialxuICB9KVxufTtcblxudGhpcy5jcmVhdGVlbXBsb3llZSA9IGZ1bmN0aW9uKGVtcCl7XG4gIHJldHVybiAkaHR0cCh7XG4gICAgbWV0aG9kOlwiUE9TVFwiLFxuICAgIHVybDpcIi9jcmVhdGVlbXBsb3llZVwiLFxuICAgIGRhdGE6ZW1wXG4gIH0pXG59O1xuXG5cbnRoaXMuc2l0ZWFsZXJ0ID0gZnVuY3Rpb24oKXtzd2FsKHtcbiAgICB0aXRsZTogXCJTaXRlIENyZWF0ZWQhXCIsXG4gICAgdHlwZTogXCJzdWNjZXNzXCIsXG4gICAgY29uZmlybUJ1dHRvblRleHQ6IFwiT2tcIixcbiAgICBhbGxvd091dHNpZGVDbGljazogdHJ1ZVxuICB9KTtcblxufTtcblxudGhpcy5lbXBsb3llZWFsZXJ0ID0gZnVuY3Rpb24oKXtzd2FsKHtcbiAgICB0aXRsZTogXCJFbXBsb3llZSBDcmVhdGVkIVwiLFxuICAgIHR5cGU6IFwic3VjY2Vzc1wiLFxuICAgIGNvbmZpcm1CdXR0b25UZXh0OiBcIk9rXCIsXG4gICAgYWxsb3dPdXRzaWRlQ2xpY2s6IHRydWVcbiAgfSk7XG5cbn07XG5cblxuXG59Ly9lbmQgb2Ygc2VydmljZVxuIiwiYW5ndWxhci5tb2R1bGUoJ2tlZXBlckFwcCcpXG4uc2VydmljZSgnbWFpbnBhZ2VTZXJ2aWNlJyxtYWlucGFnZVNlcnZpY2UpO1xuXG5mdW5jdGlvbiBtYWlucGFnZVNlcnZpY2UoKXtcblxuXG5cblxufS8vZW5kIG9mIHNlcnZpY2VcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
