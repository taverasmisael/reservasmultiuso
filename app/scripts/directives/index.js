import ExcedReservations from './directive.excedReserv';
import PassMatching from './directive.passmatching';
import UsernameExist from './directive.usernameexist';

let moduleName = 'DirectivesReservaciones';

angular.module(moduleName, [])
        .directive('mtExcedReservations', ['Search', Search => new ExcedReservations(Search)])
        .directive('mtPasswordMatch', () => new PassMatching())
        .directive('mtCheckUsername', ['Auth', Auth => new UsernameExist(Auth)]);

export default moduleName;
