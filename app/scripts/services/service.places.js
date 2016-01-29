import {
  autobind
}
from 'core-decorators';

const firebaseArray = new WeakMap();
const firebaseObject = new WeakMap();
const REF = new WeakMap();
const AUTH = new WeakMap();
const SEARCH = new WeakMap();

class Places {
  constructor($firebaseArray, $firebaseObject, Utilities, Auth, Search, FURL) {
    let baseref = new Firebase(FURL);
    firebaseArray.set(this, $firebaseArray);
    firebaseObject.set(this, $firebaseObject);
    REF.set(this, baseref.child('places'));
    AUTH.set(this, Auth);
    SEARCH.set(this, Search);

    this.Utilities = Utilities;
    this.places = $firebaseArray(REF.get(this));
  }

  @autobind
  all() {
    let activePlaces = firebaseArray.get(this)(REF.get(this)
      .orderByChild('status').equalTo('active'));
    return activePlaces.$loaded();
  }

  @autobind
  checkPlace(placeId, date, start, end) {
    let errMessage = {
      name: '',
      message: ''
    };
    start = this.Utilities.fixTime(date, start);
    end = this.Utilities.fixTime(date, end);

    let response = new Promise((resolve, reject) => {
      SEARCH.get(this).searchReservacionByDate(date)
        .then(reservas => {
          let reservasInPlace = reservas.filter(res => res.place === placeId);
          let filteredReservas = reservasInPlace.filter(res => {
            let answer;
            if (start.isSame(res.starts) || start.isBetween(res.starts, res.ends)) {
              errMessage.name = 'START_AT_SAME_TIME';
              errMessage.message = 'Both reservations has same or closer time';
              answer = true;
            } else if (start.isBefore(res.starts) && end.isAfter(res.starts)) {
              errMessage.name = 'ENDS_TOO_LATE';
              errMessage.message = 'Your reservation colides with other';
              answer = true;
            } else {
              answer = false;
            }

            return answer;
          });
          if (filteredReservas.length) {
            reject({
              data: filteredReservas,
              message: errMessage
            });
          } else {
            resolve({
              data: [],
              message: 'No colitions found'
            });
          }
        });
    });

    return response;
  }

  @autobind
  get(placeId) {
    return firebaseObject.get(this)(REF.get(this).child(placeId)).$loaded();
  }

  @autobind
  create(placeInfo) {
    let {
      name, lastname
    } = AUTH.get(this).user.profile;
    placeInfo.TIMESTAMP = Firebase.ServerValue.TIMESTAMP;
    placeInfo.status = 'active';
    placeInfo.creator = AUTH.get(this).user.profile.username;
    placeInfo.creatorEmail = AUTH.get(this).user.profile.email;
    placeInfo.creatorFullName = `${name} ${lastname}`;
    return this.places.$add(placeInfo);
  }

  @autobind
  edit(placeId, newInfo) {
    let place = REF.get(this).child(placeId);
    let {
      name, capacity, location
    } = newInfo;
    // Set Exacts Values for our place
    let toSave = {
      name: name,
      capacity: capacity,
      location: location
    };

    return place.update(toSave);
  }

  // Removes don't really removes only set place.status to 'disabled'
  @autobind
  remove(placeId) {
    let place = REF.get(this).child(placeId);
    return place.update({
      status: 'disabled'
    });
  }
}

Places.$inject = ['$firebaseArray', '$firebaseObject',
  'Utilities', 'Auth', 'Search', 'FURL'];

export default Places;
