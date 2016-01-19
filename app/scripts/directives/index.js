import {default as Services} from '../services/index';

import ExcedReservations from './directive.excedReserv';
import PassMatching from './directive.passmatching';
import UsernameExist from './directive.usernameexist';

let moduleName = 'DirectivesReservaciones';

angular.module(moduleName, [Services])
        .directive('mtExcedReservations', ['Search', Search => new ExcedReservations(Search)])
        .directive('mtPasswordMatch', () => new PassMatching())
        .directive('mtCheckUsername', () => new UsernameExist());

export default moduleName;
