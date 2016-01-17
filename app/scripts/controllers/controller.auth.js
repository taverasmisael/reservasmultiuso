class AuthController {
  constructor($scope, $state, Auth) {
    this.$scope = $scope;
    this.$state = $state;
    this.Auth = Auth;
    this.processStatus = '';
    this.active();
  }

  active() {
    console.log('Authoring...');
  }
  logginUser(username, password) {
    let user = {
      username: username,
      password: password
    };

    this.Auth.login(user)
      .then(()=> $state.go('home'))
      .catch((err)=> vm.proccessStatus = err.message);
  }
}
AuthController.$inject = ['$scope', '$state', 'Auth'];

export AuthController;

