angular.module('elasticsearch', [])
.factory('esFactory', ['$http', '$q', function ($http, $q) {
    return function (clientOpts) {
        return {
            search: function (searchOpts) {
                var deferredAbort = $q.defer();
                var defer = $q.defer();

                $http({
                    method: 'POST',
                    url: clientOpts.host + "/" + searchOpts.index + '/_search',
                    params: {
                        size: searchOpts.size,
                        from: searchOpts.from
                    },
                    data: searchOpts.body.toJSON(),
                    timeout: deferredAbort.promise
                }).then(
                  function (body) {
                      defer.resolve(body.data);
                  },
                  function () {
                      defer.reject.apply(this, arguments);
                  }
                );

                defer.promise.abort = function () {
                    deferredAbort.resolve();
                };

                // cleanup (http://stackoverflow.com/questions/24440177/angularjs-how-to-cancel-resource-promise-when-switching-routes)
                defer.promise.finally(function() {
                        defer.promise.abort = angular.noop;
                        deferredAbort = defer = null;
                    }
                );

                return defer.promise;
            }
        };
    };
}]);
