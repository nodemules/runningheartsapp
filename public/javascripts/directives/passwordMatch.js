{
  /* global angular */
  angular
    .module(APP_NAME)
    .directive('passwordMatch', passwordMatch);

  passwordMatch.$inject = [];

  function passwordMatch() {
    var directive = {
      restrict: 'A',
      scope: true,
      require: 'ngModel',
      link: linkFn
    }

    return directive;

    function linkFn(scope, elem, attrs, control) {
      var checker = function() {

        //get the value of the first password
        var e1 = scope.$eval(attrs.ngModel);

        //get the value of the other password
        var e2 = scope.$eval(attrs.passwordMatch);
        return e1 && e2 && e1 === e2 && e1.length >= e2.length;
      };
      scope.$watch(checker, function(n) {

        //set the form control to valid if both
        //passwords are the same, else invalid
        control.$setValidity('passwordMatch', n || false);
      });
    }

  }

}
