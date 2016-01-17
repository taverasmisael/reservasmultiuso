import { configuration, onRun } from './config';

import moduleName as Services from './services/index';
import moduleName as Controllers form './controllers/index';


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
  Service
])
.config(configuration)
.run(onRun);
