# TPI Bases de Datos II - Turnos médicos

Materia: Base de Datos II. Grupo 111

Integrantes:

- Zair Angel Dinahet
- Facundo Tobias Rey

API en Express con Mongoose. CRUD con baja lógica sobre tres colecciones relacionadas: `patients`, `doctors` y `appointments`.

## Requisitos

- Node.js 18 o superior
- MongoDB corriendo en `127.0.0.1:27017` (o una URI propia en `MONGODB_URI`)

## Uso

```
npm install
npm start
```

La API queda en `http://localhost:3000`. Para usar otra base (por ejemplo Atlas), definir la variable de entorno antes de correr:

```
set MONGODB_URI=mongodb+srv://usuario:clave@cluster.mongodb.net/appointments_db   (cmd)
$env:MONGODB_URI="mongodb+srv://..."                                         (PowerShell)
```

## Endpoints

Cada recurso responde a `POST /`, `GET /`, `GET /:id`, `PATCH /:id` y `DELETE /:id`.

| Método | Ruta | Qué hace |
|---|---|---|
| POST | `/patients`, `/doctors`, `/appointments` | Alta |
| GET | `/patients`, `/doctors`, `/appointments` | Lista solo documentos con `active: true` |
| GET | `/:id` | Uno solo, si sigue activo |
| PATCH | `/:id` | Actualiza los campos enviados |
| DELETE | `/:id` | Baja lógica: `active: false` y `deletedAt` |

`GET /appointments` devuelve cada turno con los datos del paciente y del médico. Un turno solo se puede crear (o reasignar) si paciente y médico existen y están activos.

Ejemplo de alta:

```
POST /patients
{
  "nationalId": "40123456",
  "firstName": "Lucia",
  "lastName": "Fernandez",
  "email": "lucia.fernandez@example.com",
  "healthInsurance": { "name": "OSDE", "memberNumber": "A-1001" },
  "address": { "street": "Belgrano 123", "city": "San Salvador de Jujuy" }
}
```

## Estructura

- `src/server.js`: conecta a MongoDB y levanta la API.
- `src/app.js`: Express y el montaje de cada módulo.
- `src/config/db.js`: conexión compartida.
- `src/common/`: baja lógica (`softDelete.js`), validación de ids y errores de negocio.
- `src/middlewares/`: ruta inexistente y manejo de errores HTTP.
- `src/modules/patients`, `doctors` y `appointments`: cada uno tiene modelo, servicio, controlador y rutas. La ruta recibe el pedido, el controlador responde y el servicio habla con MongoDB. Appointments consulta a los otros dos servicios antes de guardar una referencia.

## Decisiones de modelado

- **Embedding**: `healthInsurance` y `address` en pacientes; `schedules` en médicos (datos acotados, de un solo dueño, leídos siempre juntos).
- **Linking**: `appointments` referencia a `patientId` y `doctorId` (crecimiento ilimitado y consultas independientes).
- **Baja lógica**: campos `active` y `deletedAt` en las tres colecciones. READ filtra por `active: true`, DELETE marca `active: false`, y un plugin bloquea los borrados físicos.
