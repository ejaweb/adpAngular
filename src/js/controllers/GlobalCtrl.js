(function() {
  'use strict';

  angular
    .module(_MODULE)
    .controller('GlobalCtrl', GlobalCtrl);

  GlobalCtrl.$inject = [
    '$log'
  ];

  function GlobalCtrl($log) {
    var vm = this;
    var ng = angular;

    /**
     * @public
     * @desc used for public functions inside view
     */
    vm.fn = {};

    /**
     * @public
     * @desc used for public properties inside view
     */
    vm.prop = {};

    /**
     * @public
     * @desc used for json retrieved data for view
     */
    vm.data = {};

    /**
     * @private
     * @desc initializes the controller
     */
    function init() {
      $log.debug('GlobalCtrl -> init');
    }

    // initialize
    init();
  }

})();