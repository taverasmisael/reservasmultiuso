class PassMatching {
  constructor() {
    this.restrict = 'A';
    this.scope = true;
    this.require = '^ngModel';
  }

  link(scope, elem, attrs, controller) {
    let checker = () => {
      // Get the First Password
      let pass1 = controller.$modelValue

      // Get the Second Password
      let pass2 = scope.$eval(attrs.mtPasswordMatch);
      return pass1 === pass2;
    };

    scope.$watch(checker, match => {
      controller.$setValidity('unique', match);
    });
  }
}

export default PassMatching;
