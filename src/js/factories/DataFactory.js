(function() {
  'use strict';

  angular
    .module(_MODULE)
    .factory('DataFactory', DataFactory);

  DataFactory.$inject = [
    '$log'
  ];

  function DataFactory($log) {
    var data = {};

    /**
     * @public  getData
     */
    function getData(key) {
      return data[key];
    }

    /**
     * @public  setData
     */
    function setData(key, val) {
      data[key] = val;
    }

    /**
     * @public
     * @desc public methods
     */
    var factory = {
      getData : getData,
      setData : setData
    };

    return factory;
  }

})();