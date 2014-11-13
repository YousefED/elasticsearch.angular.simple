angular.module('elasticsearch', [])
.factory('esFactory', ['$http', '$q', function ($http, $q) {
    return function (clientOpts) {
        return {
            search: function (searchOpts) {
                var defer = $q.defer();
                $http({
                    method: 'POST',
                    url: clientOpts.host + "/" + searchOpts.index + '/_search',
                    params: {
                        size: searchOpts.size,
                        from: searchOpts.from
                    },
                    data: searchOpts.body.toJSON()
                }).then(
                  function (body) {
                      defer.resolve(body.data);
                  },
                  function () {
                      defer.reject.apply(this, arguments);
                  }
                );
                return defer.promise;
            }
        };
    };
}]);
