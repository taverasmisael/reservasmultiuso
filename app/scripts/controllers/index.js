import AdminController from './controller.admin';
import AuthController from './controller.auth';
import DialogController from './controller.dialog';
import HelpController from './controller.help';
import HomeController from './controller.home';
import NavbarController from './controller.navbar';
import SearchController from './controller.search';
import SidebarController from './controller.sidebar';
import UsersController from './controller.users';
import PlacesController from './controller.places';
import ProfesorsController from './controller.profesor';

let moduleName = 'ControllersReservaciones';

angular.module(moduleName, [])
  .controller('AdminController', AdminController)
  .controller('AuthController', AuthController)
  .controller('DialogController', DialogController)
  .controller('HelpController', HelpController)
  .controller('HomeController', HomeController)
  .controller('NavbarController', NavbarController)
  .controller('SearchController', SearchController)
  .controller('SidebarController', SidebarController)
  .controller('UsersController', UsersController)
  .controller('PlacesController', PlacesController)
  .controller('ProfesorsController', ProfesorsController);

export default moduleName;
