# Reservaciones Multiuso
## Una mejora al sistema de reservaciones [para los CEC](https://github.com/taverasmisael/reservasionesCEC)

Este sistema es una puerta que se abre a quienes rentan/facilitan locales y recursos (proyectores, laptops, bocinas, luces etc) para eventos de cualquier tipo. Se conectara con la DB y nos permitira crear reservaciones con dias de anticipo, el mismo dia, y consultar ya sea por nombre o por fecha quienes tienen reservaciones, al igual que incluir recursos que estaran disponibles.

Como dice el titulo este es un tipo de FORK del sistema de reservaciones que iniciamos hace unos
meses atras, pero con un mayor enfoque y mas conocimientos.

Contara con soporte local y optimizacion en las tareas.


## Aun en face BETA :disappointed:
Muy apesar de que llevamos el proyecto avanzando tan rapido como podemos, hay varios aspectos a considerar aun.
Como por ejemplo:

* Existen conflictos para cambiar el nombre de usuario, aunque no los permisos.

* El filtro de profesores no estan optimo como deberia ser, y no hay mucha refactorización de código que digamos

* El usuario admin, solamente puede cambiar su propia contraseña, aunque puede agregar otros usuarios y cambiar su informacion

Entre otras, si encuentras algun otro fallo o alguna nueva implementación que crees que pueda tener este sistema, [siente libre de contarnos](https://github.com/taverasmisael/reservasmultiuso/issues) o dejame un mensaje en [Twitter](https://twitter.com/taverasmisael).

#¿Qué puedo esperar?
* Una aplicacion en tiempo real es lo que se está construyendo aquí. Con herramientas como [firebase](http://firebase.com) y AngularJs, todas nuestras configuraciones, clientes, reservaciones, etc estarán sincronizadas en
las nubes y serán actualizadas en tiempo real en todos nuestros dispositivos (Aunque el diseño aun no se ha adaptado para ser FullResponsive).

* SelfHosted: Solo descarga y pon a correr tu servidor, y listo; tu app será tuya y solo tuya.

Y mucho más en camino
