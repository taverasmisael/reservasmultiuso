'use strict';

const USER = new WeakMap(),
      firebaseArray = new WeakMap(),
      firebaseObject = new WeakMap(),
      REF = new WeakMap(),
      AUTH = new WeakMap(),
      OLYMPUS = {
        gods: ['ZEUS', 'POSEIDON', 'HADES']
      };

class Auth {
    constructor($firebaseAuth, $firebaseObject, $firebaseArray, FURL) {
        firebaseObject.set(this, $firebaseObject);
        firebaseArray.set(this, $firebaseArray);
        REF.set(this, new Firebase(FURL + 'profile'));
        AUTH.set(this, $firebaseAuth(REF.get(this)));
        USER.set(OLYMPUS, {profile: {}});
        AUTH.get(this).$onAuth((authData)=> {
          if (authData) {
            USER.set(OLYMPUS, authData);
            let profile = this.getProfile(authData.uid);
            USER.get(OLYMPUS).profile = profile;
          } else {
            USER.set(OLYMPUS, {});
            if (USER.get(OLYMPUS).profile) {
              USER.get(OLYMPUS).profile.$destroy();
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
        return AUTH.get(this).$createUser(usuario).then((data) => this.createProfile(data.uid, user)).catch((e)=> console.error(e));
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
                 return AUTH.get(this).$authWithPassword({
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
      return AUTH.get(this).$changePassword({
        email: USER.get(OLYMPUS).profile.email,
        oldPassword: user.oldpass,
        newPassword: user.newpass
      });
    }
    isAdmin() {
        return USER.get(OLYMPUS).profile && USER.get(OLYMPUS).profile.isAdmin;
    }
    logout() {
        AUTH.get(this).$unauth();
    }
    signedIn() {
        return USER.get(OLYMPUS) ? Boolean(USER.get(OLYMPUS).provider) : false;
    }
}

Auth.$inject = ['$firebaseAuth', '$firebaseObject', '$firebaseArray', 'FURL'];

angular.module('reservacionesMulti')
      .service('Auth', Auth);

//export default Auth;
