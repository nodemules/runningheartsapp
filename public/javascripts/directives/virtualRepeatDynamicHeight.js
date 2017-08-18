{
  /* global angular, APP_name */

  angular.module(APP_NAME).directive('virtualRepeatDynamicHeight', virtualRepeatDynamicHeight);

  virtualRepeatDynamicHeight.$inject = ['$window', '$timeout'];

  function virtualRepeatDynamicHeight($window, $timeout) {

    var INCLUDE_SIBLINGS;

    var heights = {
      listPadding: 16
    };

    var directive = {
      restrict: 'A',
      link: linkFn,
      require: 'mdVirtualRepeatContainer',
      scope: {
        includeSiblings: '@'
      }
    };

    return directive;

    function linkFn(scope, elem, attr, mdVirtualRepeatContainer) {

      if (scope.includeSiblings) {
        INCLUDE_SIBLINGS = true;
        scope.$watch(() => getElementGroupHeight(elem.parent().siblings()), (n, o) => {
          if (n && n != o) {
            heights.siblings = n;
            setElementHeight(mdVirtualRepeatContainer, elem, heights);
          }
        });
      }

      getElementHeights(mdVirtualRepeatContainer, elem);

      setElementHeight(mdVirtualRepeatContainer, elem);

      angular.element($window).bind('resize', () => {
        getElementHeights(mdVirtualRepeatContainer, elem);
        scope.$digest();
      });
    }

    function getElementHeights(mdVirtualRepeatContainer, elem) {

      $timeout(() => {
        var appToolbar = document.getElementById('appToolbar');
        var tabsContainer = document.getElementById('rhpTabs');
        var tabsContainerChildren = $(tabsContainer).children();

        if (!appToolbar) {
          return $timeout(getElementHeights(mdVirtualRepeatContainer, elem), 100);
        }

        heights.appToolbar = $(appToolbar).outerHeight(true);

        if (appToolbar && !heights.appToolbar) {
          return $timeout(getElementHeights(mdVirtualRepeatContainer, elem), 100);
        }

        heights.tabsContainer = getElementGroupHeight(tabsContainerChildren);

        if (tabsContainerChildren.length && !heights.tabsContainer) {
          return $timeout(getElementHeights(mdVirtualRepeatContainer, elem), 100);
        }

        if (INCLUDE_SIBLINGS) {
          heights.siblings = getElementGroupHeight(elem.parent().siblings());
        }

        setElementHeight(mdVirtualRepeatContainer, elem, heights);
      });

    }

    function getElementGroupHeight(group) {
      var height = 0;
      angular.forEach(group, (el) => {
        height += $(el).outerHeight(true);
      });
      return height;
    }

    function setElementHeight(mdVirtualRepeatContainer, elem, heights) {
      var windowHeight = $window.innerHeight;
      var containerOffset = 0;
      angular.forEach(heights, (height) => {
        containerOffset += height;
      });
      var containerHeight = windowHeight - containerOffset;
      elem.css('height', `${containerHeight}px`);
      mdVirtualRepeatContainer.updateSize();
    }

  }

}
