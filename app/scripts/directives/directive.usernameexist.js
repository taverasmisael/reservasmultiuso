class UsernameExist {
  constructor(Auth) {
    this.restrict = 'A';
    this.scope = true;
    this.require = 'ngModel';
    this.Auth = Auth;
  }

  link(scope, elem, attrs, controller) {
    controller.$asyncValidators.mtCheckUsername = (modelValue, viewValue) => {
      let promise = new Promise((resolve, reject) => {
        if (controller.$isEmpty(modelValue)) {
          // consider empty models to be valid
          reject(false);
        }
        if (Boolean(parseInt(attrs.mtCheckUsername, 10))) {
          let username = viewValue;
          this.Auth.usernameAvailable(username)
            .then(response => {
              resolve(response);
            }).catch(err => {
              if (err.name === 'USERNAME_EXISTS') {
                reject('UserName Exists');
              }
            });
        } else {
          resolve(true);
        }

        return promise;
      });
    };
  }
}

UsernameExist.$inject = ['Auth'];

export default UsernameExist;
