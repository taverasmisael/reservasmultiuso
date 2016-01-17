class HomeController {
  constructor(Reservaciones) {
    this.Reservaciones = Reservaciones;
    this.todayDate = new Date();
    this.reservaciones = {};
    this.active();
  }

  active() {
    console.log('Active Main...');
    this.Reservaciones.today()
    .then(hoy => this.reservaciones.today = hoy)
    .catch(e => console.error(e));
    this.Reservaciones.getCommingSoon()
    .then(soon => this.reservaciones.commingSoon = soon)
    .catch(e => console.error(e));
  }
}
HomeController.$inject = ['Reservaciones'];

export default HomeController;
