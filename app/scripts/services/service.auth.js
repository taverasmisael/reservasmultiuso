import {
  autobind
}
from 'core-decorators';

const firebaseArray = new WeakMap();
const firebaseObject = new WeakMap();
const REF = new WeakMap();
const AUTH = new WeakMap();

@autobind
class Auth {
  constructor($firebaseAuth, $firebaseObject, $firebaseArray, FURL) {
    this.user = {
      profile: {}
    };
    firebaseObject.set(this, $firebaseObject);
    firebaseArray.set(this, $firebaseArray);
    REF.set(this, new Firebase(FURL + '/profile'));
    AUTH.set(this, $firebaseAuth(REF.get(this)));
    AUTH.get(this).$onAuth(authData => {
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
    };
    const USERFREE = `"${username}" Disponible`;

    let promise = new Promise((resolve, reject) => {
      firebaseArray.get(this)(REF.get(this).orderByChild('username')
          .equalTo(username)).$loaded()
        .then(data => {
          return data.length ? reject(USESREXISTS) : resolve(USERFREE);
        }).catch(e => console.error(e));
    });

    return promise;
  }

  register(user) {
    let {
      email, password
    } = user;
    let usuario = {
      email: email,
      password: password
    };
    delete user.password;
    delete user.password2;
    return AUTH.get(this).$createUser(usuario)
      .then(data => this.createProfile(data.uid, user));
  }

  login(user) {
    let {
      username, password
    } = user;

    let answer;
    const INVALIDUSERNAME = {
      name: 'INVALID_USERNAME',
      message: `The User: "${username} doesn't exist"`
    };

    return firebaseArray.get(this)(REF.get(this)
        .orderByChild('username').equalTo(username))
      .$loaded()
      .then(data => {
        if (data.length >= 1) {
          answer = AUTH.get(this).$authWithPassword({
            email: data[0].email,
            password: password
          });
        } else {
          throw INVALIDUSERNAME;
        }
        return answer;
      });
  }

  removeUser(uid) {
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
      email: this.user.profile.email,
      oldPassword: user.oldpass,
      newPassword: user.newpass
    });
  }

  isAdmin() {
    return this.user.profile && this.user.profile.isAdmin;
  }

  logout() {
    AUTH.get(this).$unauth();
  }

  signedIn() {
    return Boolean(AUTH.get(this).$getAuth());
  }
}

Auth.$inject = ['$firebaseAuth', '$firebaseObject', '$firebaseArray', 'FURL'];

export default Auth;
