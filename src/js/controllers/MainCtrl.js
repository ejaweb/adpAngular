(function() {
  'use strict';

  angular
    .module(_MODULE)
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = [
    '$log',
    '$state',
    '$timeout',
    'apiConfig',
    'DataService',
    'DataFactory'
  ];

  function MainCtrl($log, $state, $timeout, apiConfig, DataService, DataFactory) {
    var vm = this;
    var ng = angular;

    /**
     * @public
     * @desc used for public functions inside view
     */
    vm.fn = {
      submitForm: submitForm
    };

    /**
     * @public
     * @desc used for public properties inside view
     */
    vm.prop = {
      contactOptions: [
        'Healthcare Marketplace',
        'Technical Support',
        'Website Feedback'
      ],
      isLoading : true
    };

    /**
     * @public
     * @desc used for json retrieved data for view
     */
    vm.data = {};

    /**
     * @public
     */
    function submitForm(isValid) {
      if (isValid) {
        alert('This form is valid');
      } else {
        alert('The form is invalid');
      }
    }

    /**
     * @private
     */
    function normalizeData(data) {
      if (data && data.length > 1) {
        ng.forEach(data, function(val, key) {
          if (val.url) {
            val.url = '//healthcare.gov' + val.url;
          }

          if (val.date) {
            val.date = val.date.slice(0, 10);
          }

          if (val.categories) {
            let categories = '';

            ng.forEach(val.categories, function(v,k) {
              categories += v + ', ';
            });

            val.categories = categories;

            while (val.categories.slice(-1) === ',' || val.categories.slice(-1) === ' ') {
              val.categories = val.categories.slice(0, -1);
            }
          }
        });
      }

      return data;
    }

    /**
     * @private
     */
    function getJsonData(endpoint) {
      if (apiConfig[endpoint]) {
        let url = apiConfig.base + apiConfig[endpoint];

        DataService.getData(url, function(success, data) {
          if (success) {
            vm.data = data && data[endpoint] ? data[endpoint] : data;
            vm.data = normalizeData(vm.data);
            $log.debug(vm.data);
          } else {
            $log.error(data);
          }

          // display content
          vm.prop.isLoading = false;
        });
      }
    }

    /**
     * @private
     */
    function setMeta() {
      DataFactory.setData('title', `${$state.params.title} - Healthcare.gov`);
      DataFactory.setData('description', $state.params.description);
    }

    /**
     * @private
     * @desc initializes the controller
     */
    function init() {
      $log.debug('MainCtrl -> init');
      setMeta();

      // wait half a sec for loader
      $timeout(function() {
        getJsonData($state.current.name);
      }, 500);
    }

    // initialize
    init();
  }

})();