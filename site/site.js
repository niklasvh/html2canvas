(function() {
  var app = angular.module('site', []);

  app.config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider.
    when('/', {
      templateUrl:'site/index.html',
      title: 'html2canvas - Screenshots with JavaScript'
    }).
    when('/screenshots.html', {
      templateUrl:'site/screenshots.html',
      title: 'Test console'
    }).
    when('/screenshots_beta.html', {
        templateUrl:'site/screenshots_beta.html',
        title: 'Test console'
    }).
    when('/examples.html', {
      templateUrl:'site/examples.html',
      title: 'Examples for html2canvas'
    }).
    when('/faq.html', {
      templateUrl:'site/faq.html',
      title: "FAQ"
    }).
    when('/documentation.html', {
      templateUrl:'site/documentation.html',
      title: 'Documentation for html2canvas'
    }).
    when('/LICENSE', {
      templateUrl:'/LICENSE'
    }).
    otherwise({
      redirectTo:'/'
    });
  });

  app.run(['$location', '$rootScope', function($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
      if (current.$route) {
        $rootScope.title = current.$route.title;
      }
    });
  }]);

})();

function Navigation($scope, $location) {
  $scope.active = function (page) {
    var currentRoute = $location.path() || 'index';
    return page === currentRoute ? 'active' : '';
  };
}
