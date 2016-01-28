import Auth from './service.auth';
import Reservaciones from './service.reservas';
import Search from './service.search';
import Utilities from './service.utils';
import Profesores from './service.profesor';
import Places from './service.places';

let moduleName = 'ServicesReservaciones';

angular.module(moduleName, [])
        .service('Auth', Auth)
        .service('Reservaciones', Reservaciones)
        .service('Search', Search)
        .service('Utilities', Utilities)
        .service('Profesores', Profesores)
        .service('Places', Places);

export default moduleName;
