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
