import {configuration, onRun} from './config';

import Services from './services/index';
import Controllers from './controllers/index';

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
  'mtUtilities',
  'mtCheckUserName',
  'mtExcedReservations',
  'mtPasswordMatching',
  Services,
  Controllers
])
.config(configuration)
.run(onRun);
