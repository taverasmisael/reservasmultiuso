'use strict';

const firebaseArray = new WeakMap(),
      firebaseObject = new WeakMap(),
      REF = new WeakMap(),
      AUTH = new WeakMap();

let OLYMPUS;

class Auth {
    constructor($firebaseAuth, $firebaseObject, $firebaseArray, FURL) {
        OLYMPUS = this;
        this.user = {profile: {}};
        firebaseObject.set(this, $firebaseObject);
        firebaseArray.set(this, $firebaseArray);
        REF.set(this, new Firebase(FURL + 'profile'));
        AUTH.set(OLYMPUS, $firebaseAuth(REF.get(this)));
        AUTH.get(OLYMPUS).$onAuth((authData)=> {
          if (authData) {
            this.user = authData;
            let profile = this.getProfile(authData.uid);
            this.user.profile = profile;
          } else {
            this.user = {};
            if (this.user.profile) {
              this.user.profile.$destroy();
            }
          }
        });
    }
    createProfile(uid, user) {
        return REF.get(this).child(uid).set(user);
    }
    updateProfile(newinfo) {
        return newinfo.$save();
    }
    usernameAvailable(username) {
        const USESREXISTS = {
            name: 'USERNAME_EXIST',
            message: `The User: "${username}" already exist in our DB.`
        }, _this = this;
        let promise;

        function usernameAvailablePromise(resolve, reject) {
            firebaseArray.get(_this)(REF.get(_this).orderByChild('username').equalTo(username)).$loaded()
                .then((data) => {
                    return data.length ? reject(USESREXISTS) : resolve('Usuario Disponible');
                }).catch((e)=> console.error(e));
        }

        promise = new Promise(usernameAvailablePromise);
        return promise;
    }
    register(user) {
        let { email, password } = user,
        usuario = {
            email: email,
            password: password
        };
        delete user.email;
        delete user.password;
        return AUTH.get(OLYMPUS).$createUser(usuario).then((data) => this.createProfile(data.uid, user)).catch((e)=> console.error(e));
    }
    login(user) {
        let { username, password } = user;

        const INVALIDUSERNAME = {
            name: 'INVALID_USERNAME',
            message: `The User: "${username} doesn't exist"`
        };


        return firebaseArray.get(this)(REF.get(this).orderByChild('username').equalTo(username)).$loaded()
            .then((data) => {
                if (data.length) {
                 return AUTH.get(OLYMPUS).$authWithPassword({
                      email: data[0].email,
                      password: password
                  });
                } else {
                  throw INVALIDUSERNAME;
                }
            });
    }
    removeuser(uid) {
      return firebaseObject.get(this)(REF.get(this).child(uid)).$remove();
    }
    loadProfiles() {
      return firebaseArray.get(this)(REF.get(this)).$loaded();
    }
    getProfile(uid) {
      return firebaseObject.get(this)(REF.get(this).child(uid));
    }
    changePassword(user) {
      return AUTH.get(OLYMPUS).$changePassword({
        email: this.user.profile.email,
        oldPassword: user.oldpass,
        newPassword: user.newpass
      });
    }
    isAdmin() {
        return this.user.profile && this.user.profile.isAdmin;
    }
    logout() {
        AUTH.get(OLYMPUS).$unauth();
    }
    signedIn() {
        return Boolean(AUTH.get(OLYMPUS).$getAuth());
    }
}

Auth.$inject = ['$firebaseAuth', '$firebaseObject', '$firebaseArray', 'FURL'];

angular.module('reservacionesMulti')
      .service('Auth', Auth);

//export default Auth;
