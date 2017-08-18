{
  /* global angular, APP_NAME */

  angular.module(APP_NAME).factory('eventsService', eventsService);

  eventsService.$inject = ['$resource', '$filter', 'entityService', 'Entities'];

  function eventsService($resource, $filter, entityService, Entities) {

    const basePath = '/api/events';

    var service = {
      api: api
    }

    return service;

    /////////////////////

    function api(id) {
      return $resource(basePath + '/:id/:action', {
        id
      }, {
        'save': {
          method: 'POST',
          transformRequest: function(data) {
            entityService.changeEntity(Entities.EVENT);
            if (data.$$error) {
              delete data.$$error;
            }
            data.$$saving = true;
            return angular.toJson(data);
          },
          transformResponse: function(data) {
            data.$$saving = false;
            return transformEventResponse(data);
          }
        },
        'count': {
          method: 'GET',
          params: {
            action: 'count'
          }
        },
        'byDate': {
          method: 'GET',
          params: {
            action: 'date'
          },
          isArray: true,
          transformResponse: transformEventsResponse
        },
        'season': {
          method: 'GET',
          url: basePath + '/season/:id',
          isArray: true,
          transformResponse: transformEventsResponse
        },
        'query': {
          method: 'GET',
          isArray: true,
          transformResponse: transformEventsResponse
        },
        'get': {
          method: 'GET',
          transformResponse: transformEventResponse
        }

      });
    }

    function transformEventResponse(data) {
      var events = angular.fromJson(data);
      setEventDay(events);
      return events;
    }

    function transformEventsResponse(data) {
      var events = angular.fromJson(data);
      setEventDays(events);
      return events;
    }

    function setEventDays(events) {
      angular.forEach(events, (ev) => {
        setEventDay(ev);
      })
    }

    function setEventDay(ev) {
      ev.fullDate = $filter('date')(ev.date, 'fullDate');
    }

  }

}
