angular.module('site', [])
  .config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider.
    when('/', {
      templateUrl:'site/index.html',
      activetab: 'index'
    }).
    when('/screenshots.html', {
      templateUrl:'site/screenshots.html'
    }).
    when('/documentation.html', {
      templateUrl:'site/documentation.html'
    }).
    when('/LICENSE', {
      templateUrl:'/LICENSE'
    }).
    otherwise({
      redirectTo:'/'
    });
  });

function Navigation($scope, $location) {
  console.log(arguments, $location);
  $scope.active = function (page) {
    var currentRoute = $location.path() || 'index';
    return page === currentRoute ? 'active' : '';
  };
}
