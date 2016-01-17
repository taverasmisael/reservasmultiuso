class HomeController {
  constructor(Reservaciones) {
    this.Reservaciones = Reservaciones;
    this.todayDate = new Date();
    this.reservaciones = {};
    this.active();
  }

  active() {
    console.log('Active Main...');
    Reservaciones.today().then((hoy)=> vm.reservaciones.today = hoy).catch((e)=>console.error(e));
    Reservaciones.getCommingSoon().then((soon)=>vm.reservaciones.commingSoon = soon).catch((e)=>console.error(e));
  }
}
HomeController.$inject = ['Reservaciones'];

export HomeController;
