import Auth from './service.auth';
import Reservaciones from './service.reservas';
import Search from './service.search';
import Utilities from './service.utils';
import Profesores from './service.profesor';

let moduleName = 'ServicesReservaciones';

angular.module(moduleName, [])
        .service('Auth', Auth)
        .service('Reservaciones', Reservaciones)
        .service('Search', Search)
        .service('Utilities', Utilities)
        .service('Profesores', Profesores);

export default moduleName;
