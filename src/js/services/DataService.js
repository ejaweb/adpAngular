(function() {
  'use strict';

  angular
    .module(_MODULE)
    .service('DataService', DataService);

  DataService.$inject = [
    '$log',
    '$http'
  ];

  function DataService($log, $http) {
    var _self     = this;
    _self.getData = getData;
    _self.setData = setData;

    /**
     * @public  getData
     */
    function getData(url, callback) {
      var request = $http.get(url);
      request.success(success);
      request.error(error);

      function success(response) {
        callback(true, response);
      }

      function error(response) {
        callback(false, response);
      }
    }

    /**
     * @public  setData
     */
    function setData(url, data, callback) {
      var request = $http.post(url, data);
      request.success(success);
      request.error(error);

      function success(response) {
        callback(true, response);
      }

      function error(response) {
        callback(false, response);
      }
    }
  }

})();