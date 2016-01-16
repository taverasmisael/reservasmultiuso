import Auth from './service.auth.js';
import Reservaciones from './service.reservas.js';
import Search from './service.search.js';
import Utilities from './service.utils';
import Profesor from './service.profesor';

let moduleName = 'ServicesReservaciones';

angular.module(moduleName, [])
        .service('Auth', Auth)
        .service('Reservaciones', Reservaciones)
        .service('Search', Search)
        .service('Utilities', Utilities)
        .service('Profesor', Profesor);

export default moduleName;
