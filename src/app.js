const _MODULE = 'adpAngular';

(function() {
  'use strict';

  // app instantiation
  angular
    .module(_MODULE, [
      'ngAnimate',
      'ngSanitize',
      'ui.router'
  ]);

  // app constants
  angular
    .module(_MODULE)
    .constant('apiConfig', {
      base     : '//www.healthcare.gov/api/',
      blog     : 'blog.json',
      glossary : 'glossary.json'
    });

  // app routing config
  angular
    .module(_MODULE)
    .config(appConfig);

  appConfig.$inject = [
    '$stateProvider',
    '$locationProvider',
    '$urlRouterProvider'
  ];

  function appConfig($stateProvider, $locationProvider, $urlRouterProvider) {
    $locationProvider.hashPrefix('!');
    $urlRouterProvider.otherwise('/blog');

    $stateProvider
      .state('blog', {
        url          : '/blog',
        templateUrl  : 'views/blog.html',
        controller   : 'MainCtrl',
        controllerAs : 'vm',
        params       : {
          title      : 'Blog',
          description: 'Read our latest posts'
        }
      })
      .state('glossary', {
        url          : '/glossary',
        templateUrl  : 'views/glossary.html',
        controller   : 'MainCtrl',
        controllerAs : 'vm',
        params       : {
          title      : 'Glossary',
          description: 'Online glossary listing'
        }
      })
      .state('contact', {
        url          : '/contact',
        templateUrl  : 'views/contact.html',
        controller   : 'MainCtrl',
        controllerAs : 'vm',
        params       : {
          title      : 'Contact',
          description: 'Contact us today'
        }
    });
  }

  // app seo config
  angular
    .module(_MODULE)
    .run(appRun);

  appRun.$inject = [
    '$rootScope',
    'DataFactory'
  ];

  function appRun($rootScope, DataFactory) {
    $rootScope.DataFactory = DataFactory;
  }

})();