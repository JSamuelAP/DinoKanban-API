# DinoKanban API 🦖

API REST para la gestión de tareas con tableros kanban.

Esta API es el backend del proyecto fullstack Dinokanban, donde también se incluye una [App web](https://github.com/JSamuelAP/DinoKanban-APP).

Entre las características de Dinokanban API:

- Registro y autenticación de usuarios
- Creación, edición y eliminación de tableros
- Creación, edición y eliminación de tareas

## Enlaces 🔗

- Respositorio: [Github](https://github.com/JSamuelAP/DinoKanban-API)
- Documentación de la API: [Postman](https://documenter.getpostman.com/view/27778436/2s9Ykq7LXn)
- Web app: [Github pages](https://JSamuelAP.github.io/DinoKanban.APP)
- Repositorio de la APP: [Github](https://github.com/JSamuelAP/DinoKanban-APP)

## Tecnologías 🧰

- [Node.js](https://nodejs.org/en) - Entorno de ejecución para javascript en el servidor
  - [Express](https://expressjs.com/) - Framework web para Node.js
  - [Express validator](https://express-validator.github.io/docs) - Middlewares para la validación de datos
  - [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - Implementación de JWT para npm
- [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) - Servicio de base de datos en la nube de MongoDB
  - [Mongoose](https://mongoosejs.com/) - ODM para MongoDB
- [Postman](https://www.postman.com/) - Cliente HTTP y documentador de API

## Qué aprendí 🧠

### Autenticación

La autenticación únicamente con un token de acceso es insegura porque el cliente lo almacena y puede ser accedido por cualquiera. Por lo tanto, implementé una estrategia más segura utilizando tokens de acceso y de refresco. El token de acceso se guarda solo en la memoria del programa, mientras que el token de refresco se almacena en cookies seguras, evitando el acceso directo del cliente. Esta doble autenticación asegura que ambos tokens sean necesarios y que la seguridad no se vea comprometida si uno de ellos se filtra. Aunque es una solución más segura, sigue teniendo algunas vulnerabilidades, y su implementación manual en la API resultó complicada. Esto me motiva a aprender en el futuro métodos más robustos y librerías que simplifiquen la autenticación.

### Testing

Utilicé Postman extensivamente no solo para probar y documentar los endpoints de mi API, sino también para automatizar el proceso de pruebas. Sus herramientas de programación y testeo me permitieron ejecutar secuencialmente todas las pruebas con un solo clic y obtener resultados rápidamente. Esta herramienta fue fundamental para optimizar y automatizar mis pruebas.

### Drag and Drop

El mayor desafío en este proyecto fue implementar la funcionalidad de arrastrar y soltar tareas. Por un lado, desarrollé un algoritmo para actualizar y guardar la posición de las tareas con cada movimiento. Por otro lado, optimicé el frontend para reaccionar rápidamente a las llamadas a la API, utilizando actualizaciones optimistas para reflejar los cambios antes de recibir la respuesta del servidor.

### Node.js y React

Estoy orgulloso del trabajo realizado. Los problemas técnicos y las pausas obligadas por mis estudios me hicieron reconsiderar abandonar el proyecto y optar por algo más sencillo. Sin embargo, superé esos momentos de duda con determinación y completé el proyecto. La experiencia adquirida con Node.js y React me reveló la complejidad de trabajar con estas tecnologías en proyectos medianos, y más aún en proyectos grandes, debido a la flexibilidad y la integración de librerías externas. Esto me ha llevado a decidir que mi próximo paso es aprender frameworks que faciliten el desarrollo y mantenimiento de proyectos, como NestJS para APIs y Next.js o Angular para aplicaciones frontend.

## Autor ✒️

- Website - [JSamuel](https://jsamuelap.github.io)
- Github - [@JSamuelAP](https://github.com/JSamuelAP)
- Frontend Mentor - [@JSamuelAP](https://www.frontendmentor.io/profile/JSamuelAP)
- LinkedIn - [@JSamuelAP](https://www.linkedin.com/in/jsamuelap)
- Twitter - [@JSamuelAP](https://www.twitter.com/yourusername)
- Email - [sp4619168@gmail.com](mailto:sp4619168@gmail.com)
