(function() {
    'use strict';
    angular.module('reservacionesMulti')
        .service('Auth', Auth);

    Auth.$inject = ['$q', '$firebaseAuth', '$firebaseObject', '$firebaseArray', 'FURL'];

    function Auth($q, $firebaseAuth, $firebaseObject, $firebaseArray, FURL) {

        var ref = new Firebase(FURL),
            auth = $firebaseAuth(ref);

        var AuthService = {
            user: {
                profile: {}
            },
            createProfile: createProfile,
            updateProfile: updateProfile,
            usernameExist: usernameExist,
            register: register,
            login: login,
            loadProfiles: getAllProfiles,
            getProfile: getProfileById,
            changePassword: changePassword,
            logout: function() {
                auth.$unauth();
            },
            signedIn: function() {
                return !!AuthService.user.provider;
            }
        };

        auth.$onAuth(setUserData);
        return AuthService;


        /**
         * Funcion encargada de crear un perfil en blanco por cada nuevo usuario
         * @param  {String} uid  uid in firebaseAuthDB
         * @param  {Object} user username and email REQUIRED
         * @return {NOTHING}      Firebase Added entry
         */
        function createProfile(uid, user) {
            var profile = {
                username: user.username,
                email: user.email,
                picture: '',
                name: '',
                lastname: ''
            };
            return ref.child('profile').child(uid).set(profile);
        }

        function updateProfile (uid, user) {
          var prof = ref.child('profile').child(uid);
          prof.update({
            cellphone: user.cellphone,
            username: user.username,
            name: user.name,
            lastname: user.lastname
          });

          return $firebaseObject(prof).$loaded();
        }

        /**
         * Checar si el Nombre de usuario existe en la Base de Datos
         * @param  {string} username El nombre de usuario a buscar
         * @return {promise}          promesa con el resultado TRUE or FALSE
         */
        function usernameExist(username) {
            var d = $q.defer();
            $firebaseArray(ref.child('profile').orderByChild('username').equalTo(username)).$loaded().then(function(data) {
                d.resolve(data.length > 0);
            }, function() {
                d.reject(false);
            });

            return d.promise;
        }

        /**
         * Funcion para registrar usuarios nuevos
         * @param  {Object} user emai, password username REQUIRED
         * @return {Object}      CreateProfile()
         */
        function register(user) {
            return auth.$createUser({
                email: user.email,
                password: user.password
            }).then(function(data) {
                return AuthService.createProfile(data.uid, user);
            });
        }

        /**
         * Funcion para Logear usuarios y autenticarlos
         * @param  {Object} user email, username, password REQUIRED
         * @return {Object}      Un objeto con los datos del Usuario
         */
        function login(user) {
            return $firebaseArray(ref.child('profile').orderByChild('username')
                    .equalTo(user.username)).$loaded()
                .then(function(data) {
                  if (data.length >0) {
                    user.email = data[0].email;
                    return auth.$authWithPassword({
                        email: user.email,
                        password: user.password
                    });
                  } else {
                    throw {
                      name: 'INVALID_USERNAME',
                      message: 'The User: "'+ user.username +'" Doesn\'t exist'
                    };
                  }
                });
        }


        /**
         * Funcion para cambiar el password del Usuario
         * @param  {Object} user oldpass, newpass REQUIRED
         * @return {NOTHING}      Contraseña Cambiada con exito
         */
        function changePassword(user) {
            return auth.$changePassword({
                email: AuthService.user.profile.email,
                oldPassword: user.oldpass,
                newPassword: user.newpass
            });
        }

        function getAllProfiles () {
          return $firebaseArray(ref.child('profile')).$loaded();
        }

        function getProfileById (uid) {
          return $firebaseObject(ref.child('profile').child(uid));
        }

        /**
         * Funcion encargada de Guardar los Datos del Usuario en el servicio
         * @param {Object} authData Todos los datos para autenticar el usuario
         */
        function setUserData(authData) {
            if (authData) {
                angular.copy(authData, AuthService.user);
                var profile = $firebaseObject(ref.child('profile').child(authData.uid));
                AuthService.user.profile = profile;
            } else {
                if (AuthService && AuthService.user.profile) {
                    AuthService.user.profile.$destroy();
                    angular.copy({}, AuthService.user);
                }
            }
        }
    }
})();
