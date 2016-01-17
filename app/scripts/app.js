import {configuration, onRun} from './config';

import {default as Services} from './services/index';
import {default as Controllers} from './controllers/index';

angular.module('reservacionesMulti', [
  'ngAnimate',
  'ngAria',
  'ngMaterial',
  'md.data.table',
  'ngMdIcons',
  'ngMessages',
  'angularMoment',
  'ui.router',
  'firebase',
  'mtCheckUserName',
  'mtExcedReservations',
  'mtPasswordMatching',
  Services,
  Controllers
])
.constant('TPLDIR', 'views/')
.constant('FURL', 'https://reservasmultiuso.firebaseio.com')
.config(configuration)
.run(onRun);
