// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later
// AI-assisted translation; see ../../README.md for review and maintenance.

import type { Dictionary } from "../../catalog";

const messages: Dictionary = {
  "Users inherit policies from their groups. Access is denied unless explicitly granted.":
    "Los usuarios heredan políticas de sus grupos. Se deniega el acceso a menos que se conceda explícitamente.",
  "Policies define allowed actions and resources for users and groups.":
    "Las políticas definen acciones y recursos permitidos para usuarios y grupos.",
  "IAM policies": "Políticas IAM",
  "Access keys inherit their parent user’s permissions. An inline policy can only restrict them further.":
    "Las claves de acceso heredan los permisos de sus usuarios principales. Una política en línea sólo puede restringirlos aún más.",
  "Access keys": "Claves de acceso",
  "Configure a destination, then add bucket notification rules to send S3 events to it.":
    "Configure un destino y luego agregue reglas de notificación de depósito para enviarle S3 eventos.",
  "Event destinations": "Destinos de eventos",
  "SILO version": "SILO versión",
  "Raw JSON": "Crudo JSON",
  "Recursive inspections can be expensive. Limit the bucket and path before starting.":
    "Las inspecciones recursivas pueden resultar costosas. Limite el bucket y el camino antes de comenzar.",
  "Open Help for examples, or read the":
    "Abra la Ayuda para ver ejemplos o lea el",
  Tasks: "Tareas",
  "Tasks: {count} running": "Tareas: {count} ejecutando",
  "Close Tasks": "Cerrar tareas",
  "Object operations": "Operaciones con objetos",
  Running: "Corriendo",
  Finished: "Terminado",
  Queued: "En cola",
  Completed: "Completado",
  "No running tasks": "No hay tareas en ejecución",
  "No finished tasks": "No hay tareas terminadas",
  "Clear finished": "Claro terminado",
  "ZIP download": "ZIP descargar",
  "Browser handoff": "Transferencia del navegador",
  "Task progress": "Progreso de la tarea",
  "Waiting for data": "Esperando datos",
  "Remove task": "Eliminar tarea",
  "Cancel task": "Cancelar tarea",
  "Retry failed": "Reintento fallido",
  "Open bucket/prefix": "Abrir depósito/prefijo",
  "{done}/{total} completed · {failed} failed · {cancelled} cancelled":
    "{done}/{total} completado · {failed} fallido · {cancelled} cancelado",
  "{bytes} bytes received": "{bytes} bytes recibidos",
  "Handoff is complete; final download progress is unavailable here.":
    "La transferencia está completa; El progreso de la descarga final no está disponible aquí.",
  "Counts represent selected targets. Progress within a folder or version cleanup is unavailable.":
    "Los recuentos representan objetivos seleccionados. El progreso dentro de una carpeta o limpieza de versión no está disponible.",
  "Completed changes remain in place. In-flight requests may have reached the server; inspect before repeating them.":
    "Los cambios completados permanecen vigentes. Es posible que las solicitudes en vuelo hayan llegado al servidor; Inspeccione antes de repetirlos.",
  "Review {count} results": "Revisar {count} resultados",
  "Server outcome is unconfirmed. Inspect this object before another operation.":
    "El resultado del servidor no está confirmado. Inspeccione este objeto antes de otra operación.",
  "Task failed: {name}": "Tarea fallida: {name}",
  "Task completed: {name}": "Tarea completada: {name}",
  "Open Tasks to inspect the results.":
    "Abra Tareas para inspeccionar los resultados.",
  "The request failed. Inspect the object before trying again.":
    "La solicitud falló. Inspeccione el objeto antes de volver a intentarlo.",
  "Tasks are still running": "Las tareas aún se están ejecutando",
  "Stay here": "Quédate aquí",
  "Cancel tasks and leave": "Cancelar tareas y salir",
  "Leave page": "Salir de la página",
  "Leaving this session cancels queued and running tasks. Changes already completed on the server remain in place.":
    "Al salir de esta sesión se cancelan las tareas en cola y en ejecución. Los cambios ya completados en el servidor permanecen vigentes.",
  "Tasks will continue in this session. You can check their progress in Tasks on another page.":
    "Las tareas continuarán en esta sesión. Puedes comprobar su progreso en Tareas en otra página.",
  "Delete Versions": "Eliminar versiones",
  "Cluster health": "Estado del clúster",
  "servers online": "servidores en línea",
  "{count} drives online": "{count} unidades en línea",
  "{count} server(s) offline": "{count} servidor(es) fuera de línea",
  "{count} drive(s) offline": "{count} unidades fuera de línea",
  "{count} drive(s) healing": "{count} impulso(s) de curación",
  "Drive {drive} is at least 95% full. The server may reject writes.":
    "La unidad {drive} está llena al menos en un 95%. El servidor puede rechazar escrituras.",
  "Drive {drive} is at least 85% full.":
    "La unidad {drive} está llena al menos en un 85%.",
  "Configuration changes are waiting for a server restart.":
    "Los cambios de configuración están esperando que se reinicie el servidor.",
  "Some server or drive health information is unavailable.":
    "Parte de la información sobre el estado del servidor o de la unidad no está disponible.",
  "Capacity is incomplete. Only reported drive measurements are shown.":
    "La capacidad está incompleta. Sólo se muestran las mediciones de conducción informadas.",
  "Generate health report": "Generar informe de salud",
  "No servers reported": "No se informaron servidores",
  Server: "Servidor",
  "Just started": "Recién comenzado",
  "Hide drives for {server}": "Ocultar unidades para {server}",
  "Show drives for {server}": "Mostrar unidades para {server}",
  "No drive information available": "No hay información de unidad disponible",
  "Drives on {server}": "Unidades en {server}",
  "{used} / {total} used": "{used} / {total} usado",
  "Drive usage: {drive}": "Uso de la unidad: {drive}",
  "Refresh failed. The last received data is still shown.":
    "Error al actualizar. Los últimos datos recibidos todavía se muestran.",
  "Could not load deployment information. Try refreshing.":
    "No se pudo cargar la información de implementación. Intenta refrescarte.",
  "Deployment statistics": "Estadísticas de implementación",
  "of {total} raw capacity": "de {total} capacidad bruta",
  "{available} available": "{available} disponible",
  Data: "Datos",
  objects: "objetos",
  Alerts: "Alertas",
  "Health information unavailable": "Información de salud no disponible",
  "All systems normal": "Todos los sistemas normales",
  "Quick actions": "Acciones rápidas",
  "No quick actions available for your permissions.":
    "No hay acciones rápidas disponibles para sus permisos.",
  "Read & write": "Leer y escribir",
  "Delete bucket": "Eliminar depósito",
  "Actions for {bucket}": "Acciones para {bucket}",
  "Select {bucket}": "Seleccione {bucket}",
  "Object lock": "Bloqueo de objetos",
  Created: "Creado",
  "Select all visible buckets": "Seleccionar todos los depósitos visibles",
  "Bucket rows": "Filas de cucharones",
  "The bucket list could not be loaded.":
    "No se pudo cargar la lista de deseos.",
  "Select one or more buckets first.":
    "Seleccione primero uno o más depósitos.",
  "configure the selected buckets": "configurar los depósitos seleccionados",
  "Search buckets": "Buscar depósitos",
  "Bucket view": "Vista de bucket",
  Cards: "Tarjetas",
  "{count} buckets selected": {
    one: "{count} bucket seleccionado",
    many: "{count} buckets seleccionados",
    other: "{count} buckets seleccionados",
  },
  "{count} bucket selected": "{count} depósito seleccionado",
  "No buckets match “{q}”": "Ningún depósito coincide con “{q}”",
  "Clear filter": "Borrar filtro",
  "Built-in · Modified": "Incorporado · Modificado",
  "Actions for {name}": "Acciones para {name}",
  "Reset to default": "Restablecer los valores predeterminados",
  "Could not load policies": "No se pudieron cargar las políticas",
  "Refresh to try again.": "Actualiza para volver a intentarlo.",
  "Create a policy to define permissions for users and groups.":
    "Cree una política para definir permisos para usuarios y grupos.",
  "Could not update policy": "No se pudo actualizar la política",
  "Reset policy {name} to its default definition?":
    "¿Restablecer la política {name} a su definición predeterminada?",
  "The built-in policy will be restored to the SILO default definition.":
    "La política integrada se restaurará a la definición predeterminada SILO.",
  "Loading attachment information…":
    "Cargando información del archivo adjunto...",
  "This policy has changed or is no longer available. Refresh the list.":
    "Esta política ha cambiado o ya no está disponible. Actualiza la lista.",
  "Attachment information is unavailable.":
    "La información del archivo adjunto no está disponible.",
  "This policy is attached to {users} users and {groups} groups.":
    "Esta política se adjunta a {users} usuarios y {groups} grupos.",
  "Their permissions will follow the default definition.":
    "Sus permisos seguirán la definición predeterminada.",
  "They will lose the permissions it grants.":
    "Perderán los permisos que otorga.",
  "Could not load policy. Refresh to try again.":
    "No se pudo cargar la política. Actualiza para intentarlo de nuevo.",
  "Could not load policy": "No se pudo cargar la política",
  "Could not load users for this policy":
    "No se pudieron cargar usuarios para esta política",
  "Could not load groups for this policy":
    "No se pudieron cargar grupos para esta política",
  "Built-in policies can be overridden by saving a modified version; you can reset it later.":
    "Las políticas integradas se pueden anular guardando una versión modificada; puedes restablecerlo más tarde.",
  "Override policy": "Política de anulación",
  "Cancel editing": "Cancelar edición",
  "Direct policies": "Políticas directas",
  "Policies inherited through groups": "Políticas heredadas a través de grupos",
  "Access-key count is unavailable.":
    "El recuento de claves de acceso no está disponible.",
  "Group policy information is unavailable.":
    "La información de la política de grupo no está disponible.",
  "Also assigned directly": "También asignado directamente",
  "From groups:": "De grupos:",
  "Group policies could not be loaded.":
    "No se pudieron cargar las políticas de grupo.",
  "Group is disabled; its policies are not inherited.":
    "El grupo está deshabilitado; sus políticas no se heredan.",
  "Group status is unavailable; inherited permissions are unknown.":
    "El estado del grupo no está disponible; Se desconocen los permisos heredados.",
  "No inherited group policies": "No hay políticas de grupo heredadas",
  "Some group policies are unavailable. Refresh to try again.":
    "Algunas políticas de grupo no están disponibles. Actualiza para intentarlo de nuevo.",
  "Could not load user": "No se pudo cargar el usuario",
  "Could not update user status": "No se pudo actualizar el estado del usuario",
  "Edit replication": "Editar replicación",
  "Page not found": "Página no encontrada",
  "Go to Buckets": "Ir a depósitos",
  "Go back": "Volver",
  "Read the documentation": "Leer la documentación",
  "You do not have permission to view this page":
    "No tienes permiso para ver esta página",
  "Ask your administrator for access. This page checks the following IAM actions:":
    "Solicite acceso a su administrador. Esta página verifica las siguientes IAM acciones:",
  "Required IAM actions": "Requeridas IAM acciones",
  "Encryption is not configured": "El cifrado no está configurado",
  "Configure KES or KMS on the SILO server to manage encryption keys in Console.":
    "Configure KES o KMS en el servidor SILO para administrar las claves de cifrado en la consola.",
  "Local identity management is unavailable":
    "La gestión de identidad local no está disponible",
  "LDAP is enabled. Manage users and groups in your LDAP directory; connection settings are available on the LDAP configuration page.":
    "LDAP está habilitado. Administre usuarios y grupos en su directorio LDAP; Los ajustes de conexión están disponibles en la página de configuración LDAP.",
  "Tier creation is unavailable": "La creación de niveles no está disponible",
  "This Console requires a distributed server setup to add a remote storage tier.":
    "Esta consola requiere una configuración de servidor distribuido para agregar un nivel de almacenamiento remoto.",
  "This page is unavailable in object browser mode":
    "Esta página no está disponible en el modo de explorador de objetos",
  "This Console is configured for object browsing only. Ask your administrator to enable the full Console to use this page.":
    "Esta consola está configurada solo para exploración de objetos. Pídale a su administrador que habilite la consola completa para usar esta página.",
  "Prometheus is configured but unreachable":
    "Prometheus está configurado pero es inalcanzable",
  "Check the Prometheus address, network access and authentication, then retry.":
    "Verifique la dirección Prometheus, el acceso a la red y la autenticación, luego vuelva a intentarlo.",
  "Advanced metrics need Prometheus":
    "Se necesitan métricas avanzadas Prometheus",
  "Configure Prometheus to collect SILO metrics, then set the URL for your deployment and restart the corresponding service.":
    "Configure Prometheus para recopilar métricas de SILO, luego configure URL para su implementación y reinicie el servicio correspondiente.",
  "Standalone Console": "Consola independiente",
  "Console embedded in SILO": "Consola integrada en SILO",
  "Optional standalone settings": "Configuración independiente opcional",
  "Bearer token: ": "Token al portador:",
  "Or basic authentication: ": "O autenticación básica:",
  "Embedded settings: ": "Configuración integrada:",
  Icons: "Iconos",
  "Create bucket": "Crear bucket",
  "Edit {label}": "Editar {label}",
  "Calculating…": "Calculando…",
  "The server has not finished computing usage yet.":
    "El servidor aún no ha finalizado su uso informático.",
  "Calculated {time}": "Calculado {time}",
  "Updated {time}": "Actualizado {time}",
  "Permission required": "Se requiere permiso",
  "Ask your administrator to grant the following IAM actions.":
    "Pídele a tu administrador que otorgue las siguientes IAM acciones.",
  "More actions": "Más acciones",
  "Equivalent mcli command": "Comando mcli equivalente",
  Copied: "Copiado",
  "Copy failed. Select and copy the command.":
    "Error en la copia. Seleccione y copie el comando.",
  "Copy commands": "Copiar comandos",
  "Replace ALIAS with your configured mcli alias (for example, {alias}).":
    "Reemplace ALIAS con su alias mcli configurado (por ejemplo, {alias}).",
  "Replace ALIAS with your configured mcli alias.":
    "Reemplace ALIAS con su alias mcli configurado.",
  "Loading…": "Cargando…",
  "SILO primitives": "SILO primitivas",
  "Shared building blocks for storage, identity and monitoring.":
    "Bloques de construcción compartidos para almacenamiento, identidad y monitoreo.",
  "Healthy capacity": "Capacidad saludable",
  "Capacity warning": "Aviso de capacidad",
  "Above the 85% warning threshold":
    "Por encima del umbral de advertencia del 85%",
  "Capacity critical": "Capacidad crítica",
  "Above the 95% critical threshold": "Por encima del umbral crítico del 95%",
  "Usage is calculated by the server.": "El uso lo calcula el servidor.",
  "View buckets": "Ver depósitos",
  "Status and values": "Estado y valores",
  "Built-in": "Incorporado",
  "Freshness and actions": "Frescura y acciones",
  "Select an object to inspect its details.":
    "Seleccione un objeto para inspeccionar sus detalles.",
  "Object details": "Detalles del objeto",
  "Demo action completed.": "Acción de demostración completada.",
  "Select an object to download.": "Seleccione un objeto para descargar.",
  "Empty and unavailable states": "Estados vacíos y no disponibles",
  "No buckets yet": "Aún no hay depósitos",
  "Create a bucket to start storing objects.":
    "Crea un depósito para comenzar a almacenar objetos.",
  "No matching objects": "No hay objetos coincidentes",
  "Try a different name or clear the search filter.":
    "Pruebe con un nombre diferente o borre el filtro de búsqueda.",
  "Metrics are unavailable": "Las métricas no están disponibles",
  "Connect a Prometheus endpoint to view monitoring metrics.":
    "Conecte un punto final Prometheus para ver las métricas de monitoreo.",
  "Loading rows": "Cargando filas",
  "Command preview": "Vista previa del comando",
  "Showing the first 1 MiB. Download the object to see the full file.":
    "Mostrando el primer 1 MiB. Descargue el objeto para ver el archivo completo.",
  "Showing first 500 rows": "Mostrando las primeras 500 filas",
  "Showing the first 100 columns. View Source or download the object to see all columns.":
    "Mostrando las primeras 100 columnas. Ver código fuente o descargar el objeto para ver todas las columnas.",
  Rendered: "Rendido",
  "Wrap lines": "Líneas envolventes",
  Row: "Fila",
  "CSV preview content": "CSV vista previa del contenido",
  "Markdown preview content": "Contenido de vista previa de Markdown",
  "Markdown rendering is unavailable for this content. Showing the source instead.":
    "La representación Markdown no está disponible para este contenido. Mostrando la fuente en su lugar.",
  "Image: {alt}": "Imagen: {alt}",
  Image: "Imagen",
  Actions: "Acciones",
  "Select version": "Seleccionar versión",
  "This version is a delete marker.":
    "Esta versión es un marcador de eliminación.",
  "You need s3:GetObject permission.": "Necesitas permiso s3:GetObject.",
  "You need s3:GetObjectVersion permission.":
    "Necesitas permiso s3:GetObjectVersion.",
  "Preview is not available for this file type.":
    "La vista previa no está disponible para este tipo de archivo.",
  "Object Lock is not enabled on this bucket.":
    "El bloqueo de objetos no está habilitado en este bucket.",
  "You need s3:PutObjectLegalHold permission.":
    "Necesitas permiso s3:PutObjectLegalHold.",
  "You need s3:PutObjectRetention permission.":
    "Necesitas permiso s3:PutObjectRetention.",
  "Tags can only be changed on the current version.":
    "Las etiquetas solo se pueden cambiar en la versión actual.",
  "Versioning is not enabled on this bucket.":
    "El control de versiones no está habilitado en este depósito.",
  "Select one or more objects first.": "Seleccione uno o más objetos primero.",
  "Select a single object first.": "Primero seleccione un solo objeto.",
  "Select a file instead of a folder.":
    "Seleccione un archivo en lugar de una carpeta.",
  "Select a folder to change anonymous access.":
    "Seleccione una carpeta para cambiar el acceso anónimo.",
  "Open the current object to use this action.":
    "Abra el objeto actual para utilizar esta acción.",
  "This action requires a distributed server.":
    "Esta acción requiere un servidor distribuido.",
  "You need s3:PutObjectTagging permission.":
    "Necesitas permiso s3:PutObjectTagging.",
  "You need admin:InspectData permission.":
    "Necesita administrador: permiso InspectData.",
  "You need permission to view object versions.":
    "Necesita permiso para ver las versiones de los objetos.",
  "You need s3:DeleteObject permission.": "Necesitas permiso s3:DeleteObject.",
  "You need permission to change the bucket policy.":
    "Necesita permiso para cambiar la política del depósito.",
  "You need permission to read objects and bucket versioning.":
    "Necesita permiso para leer objetos y controlar las versiones del depósito.",
  "You need s3:ListBucket permission.": "Necesitas permiso s3:ListBucket.",
  "You need permission to restore this version.":
    "Necesita permiso para restaurar esta versión.",
  "You need permission to select this version.":
    "Necesita permiso para seleccionar esta versión.",
  "You need permission to delete object versions.":
    "Necesita permiso para eliminar versiones de objetos.",
  "Exit rewind mode to refresh the object list.":
    "Salga del modo de rebobinado para actualizar la lista de objetos.",
  "There are no non-current versions to delete.":
    "No hay versiones no actuales que eliminar.",
  "Invalid Endpoint": "Punto final no válido",
  Broker: "Corredor",
  QOS: "QOS",
  "Client ID": "Cliente ID",
  "Client Secret": "Secreto del cliente",
  "Redirect URI": "Redirigir URI",
  "Lookup Bind DN": "Enlace de búsqueda DN",
  "Lookup Bind Password": "Buscar contraseña de enlace",
  "User DN Search Base": "Usuario DN Base de búsqueda",
  "User DN Search Filter": "Usuario DN Filtro de búsqueda",
  "Group Search Base DN": "Base de búsqueda grupal DN",
  "Group Search Filter": "Filtro de búsqueda grupal",
  "Sign Out": "Cerrar sesión",
  "Remove transfer": "Eliminar transferencia",
  "Cancel transfer": "Cancelar transferencia",
  "This download has already started. Dismiss its transfer entry to start it again.":
    "Esta descarga ya comenzó. Descarte su entrada de transferencia para iniciarla nuevamente.",
  "Track or cancel this download in your browser's download manager.":
    "Realice un seguimiento o cancele esta descarga en el administrador de descargas de su navegador.",
  "For selections above 5 GiB or of unknown size, MCLI is recommended. This ZIP will stream without buffering in memory.":
    "Para selecciones superiores a 5 GiB o de tamaño desconocido, se recomienda MCLI. Este ZIP se transmitirá sin almacenamiento en la memoria intermedia.",
  "Set lifecycle": "Establecer ciclo de vida",
  "Set replication": "Establecer replicación",
  "Refresh buckets": "Actualizar depósitos",
  "Close details": "Cerrar detalles",
  "Copy share URL": "Copiar compartir URL",
  "Select multiple versions": "Seleccione varias versiones",
  "Delete selected versions": "Eliminar versiones seleccionadas",
  "Delete non-current versions": "Eliminar versiones no actuales",
  "Copy code": "Copiar código",
  "Delete group": "Eliminar grupo",
  "Refresh list": "Actualizar lista",
  "Copy path": "Copiar ruta",
  "Delete user": "Eliminar usuario",
  "Change password": "Cambiar contraseña",
  "Copy {label}": "Copiar {label}",
  "Add site": "Agregar sitio",
  "Remove site": "Eliminar sitio",
  "Delete selected users": "Eliminar usuarios seleccionados",
  "View All": "Ver todo",
  "Deployment ID:": "Despliegue ID:",
  "Request ID:": "Solicitud ID:",
  "Remote host:": "Host remoto:",
  "User agent:": "Agente de usuario:",
  "Backtrace:": "Rastreo hacia atrás:",
  "Time:": "Hora:",
  "API:": "API:",
  "Not available": "No disponible",
  " and ": "y",
  "'namespace' reflects current bucket/object list and 'access' reflects a journal of object operations, defaults to 'namespace'":
    "'espacio de nombres' refleja la lista actual de depósitos/objetos y 'acceso' refleja un diario de operaciones de objetos; el valor predeterminado es 'espacio de nombres'",
  "{compliance} lock protects Objects from write operations by all users, including the SILO root user.":
    "El bloqueo {compliance} protege los objetos de las operaciones de escritura de todos los usuarios, incluido el usuario raíz de SILO.",
  "{count} days": {
    one: "{count} día",
    other: "{count} días",
    many: "{count} días",
  },
  "{count} Entities Found": "{count} Entidades encontradas",
  "{count} Entity Found": "{count} Entidad encontrada",
  "{count} Version": "{count} Versión",
  "{count} version, {size}": "{count} versión, {size}",
  "{count} versions": {
    one: "{count} versión",
    other: "{count} versiones",
    many: "{count} versiones",
  },
  "{count} Versions": {
    one: "{count} versión",
    other: "{count} versiones",
    many: "{count} versiones",
  },
  "{count} versions, {size}": "{count} versiones, {size}",
  "{custom} policy can be written to define which accounts are authorized to access this Bucket":
    "Se puede escribir una política {custom} para definir qué cuentas están autorizadas a acceder a este depósito.",
  "{entity} not available": "{entity} no disponible",
  "{entity} will be available until:":
    "{entity} estará disponible hasta:\nLas opciones",
  "{excludeFolders} options will not be available if this option is enabled.":
    "{excludeFolders} no estarán disponibles si esta opción está habilitada.",
  "{file} - Versions": "{file} - Versiones",
  "{governance} lock protects Objects from write operations by non-privileged users.":
    "El bloqueo {governance} protege los objetos de las operaciones de escritura de usuarios sin privilegios.",
  "{label} copied to clipboard": "{label} copiado al portapapeles",
  "{minio} is a registered trademark of MinIO, Inc. {silo} is not a MinIO, Inc. product, and is not affiliated with, sponsored by, or endorsed by MinIO, Inc.":
    "{minio} es una marca registrada de MinIO, Inc. {silo} no es un producto de MinIO, Inc. y no está afiliado, patrocinado ni respaldado por MinIO, Inc.",
  "{object} Versions": "{object} Versiones",
  "{objectLocking} prevents objects from being deleted. Required to support retention and legal hold. Can only be enabled at bucket creation.":
    "{objectLocking} impide eliminar objetos. Es necesario para la retención y la retención legal. Solo se puede habilitar al crear el bucket.",
  "{private} policy limits access to credentialled accounts with appropriate permissions":
    "{private} la política limita el acceso a cuentas acreditadas con los permisos adecuados",
  "{provider} - Add Tier Configuration":
    "{provider} - Agregar configuración de niveles",
  "{public} policy anyone will be able to upload, download and delete files from this Bucket once logged in":
    "Con la política {public}, cualquiera que inicie sesión podrá subir, descargar y eliminar archivos de este bucket",
  "{quota} limits the amount of data in the bucket.":
    "{quota} limita la cantidad de datos en el depósito.",
  "{retention} imposes rules to prevent object deletion for a period of time. Versioning must be enabled in order to set bucket retention policies.":
    "{retention} establece reglas que impiden eliminar objetos durante un período. El control de versiones debe estar habilitado para configurar políticas de retención del bucket.",
  "{service} which is {status}": "{service} que es {status}",
  "{silo} is an independently maintained continuation of the {minio} object storage project, carried forward by the {pigsty} community since 2026. Its {code} {incorporates} {upstream}, and the complete work remains licensed under the {agpl}.":
    "{silo} es una continuación mantenida de forma independiente del proyecto de almacenamiento de objetos {minio}, llevado a cabo por la comunidad {pigsty} desde 2026. Es {code} {incorporates} {upstream}, y el trabajo completo sigue estando bajo la licencia {agpl}.",
  "{target} Event Destination": "{target} Destino del evento",
  "{time} ago": "{time} hace",
  "{type}: {name} not found.": "{type}: {name} no encontrado.",
  "{versioning} allows to keep multiple versions of the same object under the same key.":
    "{versioning} permite mantener múltiples versiones del mismo objeto bajo la misma clave.",
  "* Warning: With Public access anyone will be able to upload, download and delete files from this Bucket *":
    "* Advertencia: con acceso público, cualquiera podrá subir, descargar y eliminar archivos de este bucket *",
  "# Associated Access Keys": "# Claves de acceso asociadas",
  "© 2026 Ruohang Feng / PGSTY and the SILO contributors.":
    "© 2026 Ruohang Feng / PGSTY y los contribuyentes SILO.",
  "<Day>": "<Day>",
  "<Month>": "<Month>",
  "<Year>": "<Year>",
  "A bucket can only be deleted if it's empty.":
    "Solo se puede eliminar un bucket si está vacío.",
  "A group can have one attached IAM policy, where all users with membership in that group inherit that policy. Groups support more simplified management of user permissions on the SILO Tenant.":
    "Un grupo puede tener una política IAM adjunta, donde todos los usuarios con membresía en ese grupo heredan esa política. Los grupos admiten una gestión más simplificada de los permisos de usuario en el inquilino SILO.",
  "A network error occurred.": "Se produjo un error de red.",
  "A new {entity} has been created with the following details:":
    "Se ha creado un nuevo {entity} con los siguientes detalles:",
  "A SILO user consists of a unique access key (username) and corresponding secret key (password). Clients must authenticate their identity by specifying both a valid access key (username) and the corresponding secret key (password) of an existing SILO user.":
    "Un usuario SILO consta de una clave de acceso única (nombre de usuario) y la clave secreta correspondiente (contraseña). Los clientes deben autenticar su identidad especificando una clave de acceso válida (nombre de usuario) y la clave secreta correspondiente (contraseña) de un usuario SILO existente.",
  "A user can be a member of multiple groups.":
    "Un usuario puede ser miembro de varios grupos.",
  "About Site Replication": "Acerca de la replicación de sitios",
  Access: "Acceso",
  "Access Audit": "Auditoría de acceso",
  "Access Key": "Clave de acceso",
  "Access Key and Secret Key should be same on the new site/endpoint.":
    "La clave de acceso y la clave secreta deben ser las mismas en el nuevo sitio/punto final.",
  "Access Key Policy": "Política de claves de acceso",
  "Access Key details - {name}": "Detalles de la clave de acceso - {name}",
  "Access keys deleted successfully.":
    "Claves de acceso eliminadas exitosamente.",
  "Access Keys deleted successfully.":
    "Claves de acceso eliminadas exitosamente.",
  "Access Keys inherit the policies explicitly attached to the parent user, and the policies attached to each group in which the parent user has membership.":
    "Las claves de acceso heredan las políticas adjuntas explícitamente al usuario principal y las políticas adjuntas a cada grupo al que el usuario principal es miembro.",
  "Access Keys support programmatic access by applications. You cannot use a Access Key to log into the SILO Console.":
    "Las claves de acceso admiten el acceso programático por parte de las aplicaciones. No puede utilizar una clave de acceso para iniciar sesión en la consola SILO.",
  "Access Policy": "Política de acceso",
  "Access Policy:": "Política de acceso:",
  "Access Rule added successfully": "Regla de acceso agregada exitosamente",
  "Access Rules": "Reglas de acceso",
  "AccessKey is required": "AccessKey es obligatorio",
  "Account Key": "Clave de cuenta",
  "Account Name": "Nombre de cuenta",
  Active: "Activo",
  "Active for": "Activo para",
  'AD/LDAP server address e.g. "myldapserver.com:636"':
    'AD/LDAP dirección del servidor, p. "myldapserver.com:636"',
  "Add a Row": "Agregar una fila",
  "Add Access Rule": "Agregar regla de acceso",
  "Add Anonymous Access Rule": "Agregar regla de acceso anónimo",
  "Add Bucket Replication Rule - {bucket}":
    "Agregar regla de replicación de depósito - {bucket}",
  "Add Event Destination": "Agregar destino del evento",
  "Add key": "Agregar clave",
  "Add Lifecycle Rule": "Agregar regla de ciclo de vida",
  "Add Members": "Agregar miembros",
  "Add New Tag": "Agregar nueva etiqueta",
  "Add New Tag ": "Agregar nueva etiqueta",
  "Add new Webhook": "Agregar nuevo Webhook",
  "Add Replication Rule": "Agregar regla de replicación",
  "Add Replication Site": "Añadir un sitio de replicación",
  "Add Replication Sites": "Añadir sitios de replicación",
  "Add Sites": "Agregar sitios",
  "Add Sites for Replication": "Añadir sitios para la replicación",
  "Add tag": "Agregar etiqueta",
  "Add Tier": "Agregar nivel",
  "Add to Group": "Agregar al grupo",
  "Add to Groups": "Agregar a grupos",
  "Add Users to Group": "Agregar usuarios al grupo",
  "add users to groups": "agregar usuarios a grupos",
  "Adding groups lets you assign IAM policies to multiple users at once.":
    "Agregar grupos le permite asignar políticas IAM a varios usuarios a la vez.",
  Address: "Dirección",
  After: "Después",
  All: "Todos",
  "All Log Types": "Todos los tipos de registros",
  "All Nodes": "Todos los nodos",
  "All sites must be using the same external IDP(s) if any.":
    "Todos los sitios deben utilizar los mismos IDP externos, si los hay.",
  "All sites must have the same deployment credentials (i.e. MINIO_ROOT_USER, MINIO_ROOT_PASSWORD).":
    "Todos los sitios deben tener las mismas credenciales de implementación (es decir, MINIO_ROOT_USER, MINIO_ROOT_PASSWORD).",
  "All User Agents": "Todos los agentes de usuario",
  "Amazon Resource Name": "Nombre del recurso de Amazon",
  "AMQP exchange type": "AMQP tipo de cambio",
  "AMQP server endpoint e.g. `amqp://myuser:mypassword@localhost:5672`":
    "AMQP punto final del servidor, p. `amqp://miusuario:micontraseña@localhost:5672`",
  "An error occurred": "Ocurrió un error",
  "An error occurred while getting the Health Report file.":
    "Se produjo un error al obtener el archivo del Informe de salud.",
  "An error occurred while uploading the file.":
    "Se produjo un error al cargar el archivo.",
  "An error occurred while uploading the files.":
    "Se produjo un error al cargar los archivos.",
  "An unknown error occurred. Please refer to Console logs to get more information.":
    "Se produjo un error desconocido. Consulte los registros de la consola para obtener más información.",
  Anonymous: "Anónimo",
  "Anonymous Access": "Acceso anónimo",
  "API Name": "API Nombre",
  "API Requests": "API Solicitudes",
  Application: "Solicitud",
  "apply policies to Groups": "aplicar políticas a Grupos",
  April: "abril",
  "Are you sure you want to continue?":
    "¿Estás seguro de que quieres continuar?",
  "Are you sure you want to delete Access Key {name}?":
    "¿Seguro que desea eliminar la clave de acceso {name}?",
  "Are you sure you want to delete all the non-current versions for: {object}?":
    "¿Seguro que desea eliminar todas las versiones no actuales de {object}?",
  "Are you sure you want to delete bucket {bucket}?":
    "¿Seguro que desea eliminar el bucket {bucket}?",
  "Are you sure you want to delete IDP {name} configuration?":
    "¿Seguro que desea eliminar la configuración del proveedor de identidad {name}?",
  "Are you sure you want to delete policy {name}?":
    "¿Seguro que desea eliminar la política {name}?",
  "Are you sure you want to delete replication rule {rule}?":
    "¿Seguro que desea eliminar la regla de replicación {rule}?",
  "Are you sure you want to delete the {rule} rule?":
    "¿Seguro que desea eliminar la regla {rule}?",
  "Are you sure you want to delete the Configured Endpoint {name}?":
    "¿Seguro que desea eliminar el punto de conexión configurado {name}?",
  "Are you sure you want to delete the event destination ?":
    "¿Está seguro de que desea eliminar el destino del evento?",
  "Are you sure you want to delete the following {count} groups?":
    "¿Seguro que desea eliminar los siguientes {count} grupos?",
  "Are you sure you want to delete the following {count} users?":
    "¿Seguro que desea eliminar los siguientes {count} usuarios?",
  "Are you sure you want to delete the following group?":
    "¿Seguro que desea eliminar el siguiente grupo?",
  "Are you sure you want to delete the following user?":
    "¿Seguro que desea eliminar el siguiente usuario?",
  "Are you sure you want to delete the selected {count} Access Keys?":
    "¿Seguro que desea eliminar las {count} claves de acceso seleccionadas?",
  "Are you sure you want to delete the selected {count} objects?":
    "¿Seguro que desea eliminar los {count} objetos seleccionados?",
  "Are you sure you want to delete the selected {count} versions for {object}?":
    "¿Seguro que desea eliminar las {count} versiones seleccionadas de {object}?",
  "Are you sure you want to delete the tag {tag} ?":
    "¿Está seguro de que desea eliminar la etiqueta {tag}?",
  "Are you sure you want to delete the tag {tag}?":
    "¿Seguro que desea eliminar la etiqueta {tag}?",
  "Are you sure you want to delete the tier {name}?":
    "¿Seguro que desea eliminar el nivel {name}?",
  "Are you sure you want to delete this access rule?":
    "¿Seguro que desea eliminar esta regla de acceso?",
  "Are you sure you want to delete this event?":
    "¿Estás seguro de que deseas eliminar este evento?",
  "Are you sure you want to delete:": "¿Está seguro de que desea eliminar:",
  "Are you sure you want to remove all the replication sites?.":
    "¿Está seguro de que desea eliminar todos los sitios de replicación?",
  "Are you sure you want to remove the replication site: {name}?":
    "¿Está seguro de que desea eliminar el sitio de replicación: {name}?",
  "Are you sure you want to remove the selected replication rules for bucket {bucket}?":
    "¿Está seguro de que desea eliminar las reglas de replicación seleccionadas para el depósito {bucket}?",
  "Are you sure you want to reset the Default {name}?":
    "¿Está seguro de que desea restablecer el valor predeterminado {name}?",
  "Are you sure you want to restore {object} with Version ID: {version}?":
    "¿Está seguro de que desea restaurar {object} con la Versión ID: {version}?",
  "Are you sure you want to restore these configurations to default values?":
    "¿Está seguro de que desea restaurar estas configuraciones a los valores predeterminados?",
  "Assign Access Policies": "Asignar políticas de acceso",
  "Assign Custom Credentials": "Asignar credenciales personalizadas",
  "Assign Custom IAM Policies for Group":
    "Asignar políticas personalizadas IAM para grupo",
  "Assign groups": "Asignar grupos",
  "Assign Groups": "Asignar grupos",
  "assign policies": "asignar políticas",
  "assign Policies": "asignar Políticas",
  "Assign Policies": "Asignar políticas",
  "Assign Policy": "Asignar política",
  "Assign Users": "Asignar usuarios",
  Asynchronous: "Asíncrono",
  "Audit Kafka": "Auditoría Kafka",
  "Audit Webhook": "Auditoría Webhook",
  August: "agosto",
  "Auth Token": "Token de autenticación",
  "Auto delete queue when set to 'on', when there are no consumers":
    "Eliminación automática de cola cuando está activado, cuando no hay consumidores",
  "Auto Deleted": "Eliminación automática",
  "Available Capacity": "Capacidad disponible",
  Back: "Volver",
  Backend: "Servidor",
  Bandwidth: "Ancho de banda",
  "Enter a non-negative bandwidth below 8 PiB/s, with at most two decimals (0 means unlimited).":
    "Ingrese un ancho de banda no negativo inferior a 8 PiB/s, con dos decimales como máximo (0 significa ilimitado).",
  "Bitrot Scan": "Escaneo Bitrot",
  Brokers: "Corredores",
  "Browse Bucket": "Explorar depósito",
  Bucket: "Bucket",
  "Bucket Assignments": "Asignaciones de depósitos",
  "Bucket Encryption configuration": "Configuración de cifrado de depósito",
  "Bucket lifecycle (ILM) configuration":
    "Configuración del ciclo de vida del depósito (ILM)",
  "Bucket Name": "Nombre del depósito",
  "Bucket names can consist only of lowercase letters, numbers, dots (.), and hyphens (-).":
    "Los nombres de los depósitos solo pueden constar de letras minúsculas, números, puntos (.) y guiones (-).",
  "Bucket names must be between 3 (min) and 63 (max) characters long.":
    "Los nombres de los depósitos deben tener entre 3 (mínimo) y 63 (máximo) caracteres.",
  "Bucket names must be unique within a partition.":
    "Los nombres de los depósitos deben ser únicos dentro de una partición.",
  "Bucket names must not be formatted as an IP address (for example, 192.168.5.4).":
    "Los nombres de los depósitos no deben tener el formato de dirección IP (por ejemplo, 192.168.5.4).",
  "Bucket names must not contain two adjacent periods, or a period adjacent to a hyphen.":
    "Los nombres de los depósitos no deben contener dos puntos adyacentes ni un punto adyacente a un guión.",
  "Bucket names must not end with the suffix -s3alias. This suffix is reserved for access point alias names.":
    "Los nombres de los depósitos no deben terminar con el sufijo -s3alias. Este sufijo está reservado para nombres de alias de puntos de acceso.",
  "Bucket names must not start with the prefix xn--.":
    "Los nombres de los depósitos no deben comenzar con el prefijo xn--.",
  "Bucket notification configuration":
    "Configuración de notificación de depósito",
  "bucket notifications": "notificaciones de depósito",
  "Bucket Object-Lock configurations": "Configuraciones de bucket Object-Lock",
  "Bucket Policies": "Políticas de depósito",
  "Bucket Replication Configuration":
    "Configuración de replicación de depósito",
  "Bucket Tags": "Etiquetas de bucket",
  "bucket-default": "depósito predeterminado",
  "Buckets Results": "Resultados de buckets",
  "Buckets:": "Buckets:",
  "Bypass Governance Mode": "Omitir el modo de gobernanza",
  Bytes: "Bytes",
  "Calls to Trace": "Llamadas para rastrear",
  Cancelled: "Cancelado",
  "Cannot delete currently logged in user":
    "No se puede eliminar el usuario actualmente conectado",
  "Cannot delete currently logged in user {user}":
    "No se puede eliminar al usuario conectado {user}",
  "Cert Authority": "Autoridad de certificación",
  "Change Access Policy": "Cambiar política de acceso",
  "Change Legal Hold rules for this File":
    "Cambiar la retención legal de este archivo",
  "Change Password": "Cambiar contraseña",
  "Change Password for {user}": "Cambiar contraseña por {user}",
  "Change password for: {user}": "Cambiar contraseña para: {user}",
  "Change Retention rules for this File":
    "Cambiar las reglas de retención de este archivo",
  "Change Tags for this File": "Cambiar etiquetas para este archivo",
  "Change User Password": "Cambiar contraseña de usuario",
  "Changes to Bucket features such as":
    "Cambios en las funciones del depósito, como",
  "Choose or create a new path": "Elige o crea una nueva ruta",
  "Claim from which SILO will read the policy or role to use":
    "Reclamo del cual SILO leerá la política o rol a utilizar",
  "Claim Name": "Nombre del reclamo",
  "Claim Prefix": "Prefijo de reclamo",
  "Claim User Info": "Reclamar información de usuario",
  Clear: "Limpiar",
  "Click on a user to view the full listing of associated Access Keys. All Access Keys associated with a user will be deleted along with the user.":
    "Haga clic en un usuario para ver la lista completa de claves de acceso asociadas. Todas las claves de acceso asociadas con un usuario se eliminarán junto con el usuario.",
  client: "cliente",
  "Client Auth determines the Kafka server's policy for TLS client authorization":
    "Client Auth determina la política del servidor Kafka para la autorización del cliente TLS",
  "Client Cert": "Certificado de cliente",
  "Client cert for mTLS authentication":
    "Certificado de cliente para autenticación mTLS",
  "Client cert for NATS mTLS auth":
    "Certificado de cliente para NATS autenticación mTLS",
  "Client Cert Key": "Clave de certificado de cliente",
  "Client cert key for mTLS authentication":
    "Clave de certificado de cliente para autenticación mTLS",
  "Client cert key for NATS mTLS authorization":
    "Clave de certificado de cliente para NATS autorización mTLS",
  "Client ID is required": "Se requiere cliente ID",
  "Client Key": "Clave de cliente",
  "Client ping commands interval in s,m,h,d. Disabled by default":
    "Intervalo de comandos de ping del cliente en s,m,h,d. Deshabilitado por defecto",
  "Client Secret is required": "Se requiere secreto de cliente",
  "Client Secret must be re-entered to change OpenID configurations":
    "Se debe volver a ingresar el secreto del cliente para cambiar las configuraciones OpenID",
  "client TLS cert": "cliente TLS certificado",
  "client TLS key": "cliente TLS clave",
  "ClientAuth determines the Kafka server's policy for TLS client authorization":
    "ClientAuth determina la política del servidor Kafka para la autorización del cliente TLS",
  "Cluster Health Report will be generated, you will be able to download the JSON File.":
    "Se generará el Informe de estado del clúster; podrá descargar el archivo JSON.",
  code: "código",
  "Comma separated list of Kafka broker addresses":
    "Lista separada por comas de Kafka direcciones de corredores",
  Comment: "Comentario",
  Comments: "Comentarios",
  Compliance: "Cumplimiento",
  Compression: "Compresión",
  "Concurrent:": "Concurrente:",
  Config: "Configuración",
  "Config Name is required": "Se requiere el nombre de configuración",
  "Config URL": "Configuración URL",
  "Config URL for identity provider configuration":
    "Config URL para la configuración del proveedor de identidad",
  "Config URL is required": "Se requiere configuración URL",
  "Configuration cannot be disabled / enabled in this module as LDAP environment variables are set for this SILO instance.":
    "La configuración no se puede desactivar/activar en este módulo ya que LDAP variables de entorno están configuradas para esta instancia SILO.",
  "Configuration cannot be disabled / enabled in this module as OpenID environment variables are set for this SILO instance.":
    "La configuración no se puede desactivar/activar en este módulo ya que OpenID variables de entorno están configuradas para esta instancia SILO.",
  "Configuration cannot be edited in this module as LDAP environment variables are set for this SILO instance.":
    "La configuración no se puede editar en este módulo ya que LDAP variables de entorno están configuradas para esta instancia SILO.",
  "Configuration cannot be edited in this module as OpenID environment variables are set for this SILO instance.":
    "La configuración no se puede editar en este módulo ya que OpenID variables de entorno están configuradas para esta instancia SILO.",
  "Configuration saved successfully": "Configuración guardada exitosamente",
  "Configure a {remoteTier} to receive transitioned Objects":
    "Configure un {remoteTier} para recibir Objetos transicionados",
  "Configure Bucket": "Configurar depósito",
  "Configuring an external IDP enables Single-Sign On workflows, where applications authenticate against the external IDP before accessing SILO.":
    "La configuración de un IDP externo habilita flujos de trabajo de inicio de sesión único, donde las aplicaciones se autentican en el IDP externo antes de acceder a SILO.",
  "Confirm Dialogs": "Confirmar cuadros de diálogo",
  "connected server": "servidor conectado",
  "Connection String": "Cadena de conexión",
  "Console Credentials": "Credenciales de consola",
  "Console LICENSE": "Consola LICENSE",
  "Console portions © Georg Mangold and contributors.":
    "Porciones de consola © Georg Mangold y colaboradores.",
  "Console predecessor": "Predecesor de la consola",
  "Copy to Clipboard": "Copiar al portapapeles",
  Copyright: "Derechos de autor",
  "Coredns Path": "Camino Coredns",
  "Cors Allow Origin": "Cors permite origen",
  "Could not process drag and drop.": "No se pudo procesar arrastrar y soltar.",
  "CPU Info": "CPU Información",
  "Create {idpType} configuration": "Crear configuración {idpType}",
  "create a bucket": "crear un depósito",
  "Create a new cryptographic key in the Key Management Service server connected to SILO.":
    "Cree una nueva clave criptográfica en el servidor del Servicio de administración de claves conectado a SILO.",
  "create a new path": "crear una nueva ruta",
  "create a Policy": "crear una política",
  "Create access key": "Crear clave de acceso",
  "Create Access Key": "Crear clave de acceso",
  "Create Access Key for {user}": "Crear clave de acceso para {user}",
  "Create Access Keys": "Crear claves de acceso",
  "Create Configuration": "Crear configuración",
  "Create Configurations": "Crear configuraciones",
  "Create Group": "Crear grupo",
  "Create Key": "Crear clave",
  "Create new path": "Crear nueva ruta",
  "Create OpenID Configuration": "Crear OpenID Configuración",
  "Create Policies": "Crear Políticas",
  "Create Policy": "Crear política",
  "Create Rules": "Crear reglas",
  "Create Tier": "Crear nivel",
  "Create User": "Crear Usuario",
  "create users": "crear usuarios",
  "Create Users": "Crear Usuarios",
  "Created At": "Creado en",
  "Created By": "Creado por",
  "Creation and deletion of all IAM users, groups, policies and their mappings to users or groups":
    "Creación y eliminación de todos los IAM usuarios, grupos, políticas y sus asignaciones a usuarios o grupos",
  "Creation and deletion of buckets and objects":
    "Creación y eliminación de depósitos y objetos.",
  "Creation and deletion of service accounts (except those owned by the root user)":
    "Creación y eliminación de cuentas de servicio (excepto aquellas propiedad del usuario root)",
  "Creation of STS credentials": "Creación de STS credenciales",
  Credentials: "Credenciales",
  current: "actual",
  Current: "Actual",
  "Current Endpoint:": "Punto final actual:",
  "Current Password": "Contraseña actual",
  "Current Path:": "Ruta actual:",
  "Current Policy": "Política actual",
  "Current Status": "Estado actual",
  "Current Status:": "Estado actual:",
  "Current Tags:": "Etiquetas actuales:",
  "Current User Policy - edit the JSON to remove permissions for this Access Key":
    "Política de usuario actual: edite el JSON para eliminar permisos para esta clave de acceso",
  "Current Version": "Versión actual",
  "CURRENT VERSION": "CURRENT VERSION",
  "Currently Configured Endpoints": "Puntos finales actualmente configurados",
  custom: "personalizado",
  Custom: "Personalizado",
  Cycle: "Ciclo",
  Database: "Base de datos",
  Date: "Fecha",
  day: "día",
  days: {
    one: "día",
    other: "días",
    many: "días",
  },
  Days: "Días",
  "DB table name to store/update events, table is auto-created":
    "DB nombre de la tabla para almacenar/actualizar eventos, la tabla se crea automáticamente",
  December: "diciembre",
  Default: "Predeterminado",
  "Default Key ID:": "Clave predeterminada ID:",
  "Define which actions are permitted on a specified resource.":
    "Defina qué acciones están permitidas en un recurso específico.",
  "Delay Multiplier": "Multiplicador de retraso",
  "DELETE - Object Deleted": "DELETE - Objeto eliminado",
  "Delete {name}": "Eliminar {name}",
  "Delete Access Key": "Eliminar clave de acceso",
  "Delete Access Keys": "Eliminar claves de acceso",
  "Delete All": "Eliminar todo",
  "Delete All Versions": "Eliminar todas las versiones",
  "Delete Anonymous Access Rule": "Eliminar regla de acceso anónimo",
  "Delete Bucket": "Eliminar depósito",
  "Delete Configuration": "Eliminar configuración",
  "Delete Endpoint": "Eliminar punto final",
  "Delete Event": "Eliminar evento",
  "Delete Group": "Eliminar grupo",
  "delete Groups": "eliminar grupos",
  "Delete Groups": "Eliminar grupos",
  "Delete Lifecycle Rule": "Eliminar regla de ciclo de vida",
  "Delete Marker": "Marcador de eliminación",
  "Delete Non-Current versions": "Eliminar versiones no actuales",
  "Delete Object": "Eliminar objeto",
  "Delete Objects": "Eliminar objetos",
  "delete Policies": "eliminar políticas",
  "Delete Policy": "Eliminar política",
  "Delete Replication Rule": "Eliminar regla de replicación",
  "Delete Replication Site": "Eliminar sitio de replicación",
  "Delete Selected": "Eliminar seleccionados",
  "Delete Selected Files": "Eliminar archivos seleccionados",
  "Delete Selected Replication Rules":
    "Eliminar reglas de replicación seleccionadas",
  "Delete Selected Versions": "Eliminar versiones seleccionadas",
  "Delete Site": "Eliminar sitio",
  "Delete Tag": "Eliminar etiqueta",
  "Delete Tier": "Eliminar nivel",
  "delete user": "eliminar usuario",
  "Delete User": "Eliminar usuario",
  "delete users": "eliminar usuarios",
  "Delete Users": "Eliminar usuarios",
  "Delete version": "Eliminar versión",
  "Delete Webhook": "Eliminar Webhook",
  Deleted: "Eliminado",
  DELETED: "DELETED",
  Deletes: "Elimina",
  "Delivery Mode": "Modo de entrega",
  Description: "Descripción",
  Destination: "Destino",
  "Detailed Results:": "Resultados detallados:",
  Disable: "Deshabilitar",
  "Disable LDAP": "Desactivar LDAP",
  "Disable SSL certificate verification ":
    "Desactivar SSL verificación de certificado",
  "disable users": "desactivar usuarios",
  Disabled: "Deshabilitado",
  "Display Name": "Nombre para mostrar",
  "Display Object Versions": "Mostrar versiones de objetos",
  "Display only Errors": "Mostrar solo errores",
  "Display Versions for this file": "Mostrar versiones para este archivo",
  "No object versions are available": "No hay versiones de objetos disponibles",
  "Distributed Mode": "Modo distribuido",
  "DN (Distinguished Name) for LDAP read-only service account used to perform DN and group lookups":
    "DN (Nombre distinguido) para LDAP cuenta de servicio de solo lectura utilizada para realizar DN y búsquedas de grupo",
  documentation: "documentación",
  Done: "Hecho",
  "Download all access credentials":
    "Descargar todas las credenciales de acceso",
  "Download all access credentials to a JSON file. NOTE: This file is not formatted for import using mc alias import. If you plan to import this alias from the file, please use the Download for Import button. ":
    "Descargue todas las credenciales de acceso en un archivo JSON. Nota: Este archivo no tiene el formato de mc alias import. Para importar este alias, use el botón «Descargar para importar».",
  "Download as CSV": "Descargar como CSV",
  "Download as PNG": "Descargar como PNG",
  "Download credentials in a JSON file formatted for import using mc alias import. This will only include the default login credentials.":
    "Descargue las credenciales en un archivo JSON compatible con mc alias import. Solo incluye las credenciales de inicio de sesión predeterminadas.",
  "Download File": "Descargar archivo",
  "Download for import": "Descargar para importar",
  "Download JSON": "Descargar JSON",
  "Download of multiple files failed.": "Falló la descarga de varios archivos.",
  "Download Results": "Descargar resultados",
  "Download Selected": "Descargar Seleccionado",
  "Download selected objects as Zip. Any Deleted objects in the selection would be skipped from download.":
    "Descarga los objetos seleccionados como Zip. Cualquier objeto eliminado en la selección se omitirá de la descarga.",
  "Download this Object": "Descargar este objeto",
  "Download this version": "Descarga esta versión",
  "Download widget data": "Descargar datos del widget",
  "Downloads / Uploads": "Descargas / Cargas",
  "Drives Partitions Info": "Información de particiones de unidades",
  "Drives:": "Unidades:",
  "DSN String": "DSN Cadena",
  Durable: "Duradero",
  Duration: "Duración",
  "During the speed test all your production traffic will be temporarily suspended.":
    "Durante la prueba de velocidad, todo el tráfico de producción se suspenderá temporalmente.",
  "e.g. 503": "p.ej. 503",
  "e.g. FunctionName2055": "p.ej. Nombre de función2055",
  "e.g. Method 2056": "p.ej. Método 2056",
  "e.g. my-bucket/my-prefix/*": "p.ej. mi-bucket/mi-prefijo/*",
  "e.g. us-west-rack-2": "p.ej. nosotros-oeste-rack-2",
  "Each user can access only those resources and operations which are explicitly granted by the built-in role. SILO denies access to any other resource or action by default.":
    "Cada usuario puede acceder solo a aquellos recursos y operaciones que la función incorporada otorga explícitamente. SILO niega el acceso a cualquier otro recurso o acción de forma predeterminada.",
  Edit: "Editar",
  "edit a Policy": "editar una política",
  "Edit Anonymous Access Rule for {target}":
    "Editar regla de acceso anónimo para {target}",
  "Edit Audit Webhook": "Editar auditoría Webhook",
  "Edit Bucket Replication": "Editar replicación de depósito",
  "Edit Configuration": "Editar configuración",
  "Edit details of - {name}": "Editar detalles de - {name}",
  "Edit Endpoint": "Editar punto final",
  "edit Group membership": "editar Membresía del grupo",
  "Edit Lifecycle Configuration": "Editar configuración del ciclo de vida",
  "Edit Logger Webhook": "Editar registrador Webhook",
  "Edit Members": "Editar miembros",
  "Edit Replication Endpoint": "Editar punto final de replicación",
  "Edit Tags": "Editar etiquetas",
  "Edit the Default Audit Webhook":
    "Editar la auditoría predeterminada Webhook",
  "Edit the Default Logger Webhook":
    "Editar el registrador predeterminado Webhook",
  "Edit Webhook": "Editar Webhook",
  "Effect:": "Efecto:",
  "Elasticsearch index to store/update events, index is auto-created":
    "Elasticsearch índice para almacenar/actualizar eventos, el índice se crea automáticamente",
  "Elasticsearch server's address, with optional authentication info":
    "Elasticsearch dirección del servidor, con información de autenticación opcional",
  Enable: "Habilitar",
  "Enable audit_kafka target": "Habilitar objetivo audit_kafka",
  "Enable Bucket Encryption": "Habilitar cifrado de depósito",
  "Enable Bucket Quota": "Habilitar cuota de depósito",
  "Enable LDAP": "Habilitar LDAP",
  "enable or disable Groups": "habilitar o deshabilitar grupos",
  "enable or disable users": "habilitar o deshabilitar usuarios",
  "Enable SASL (Simple Authentication and Security Layer) authentication":
    "Habilite la autenticación SASL (Autenticación simple y capa de seguridad)",
  "Enable TLS (Transport Layer Security)":
    "Habilitar TLS (Seguridad de la capa de transporte)",
  "enable users": "habilitar usuarios",
  "Enable your preferred options to get filtered records.":
    "Habilite sus opciones preferidas para obtener registros filtrados.",
  Enabled: "Habilitado",
  Encrypt: "Cifrar",
  "Encryption Key": "Clave de cifrado",
  "Encryption Type": "Tipo de cifrado",
  "Encryption:": "Cifrado:",
  "End Time:": "Hora de finalización:",
  Endpoint: "Punto de conexión",
  endpoints: "puntos finales",
  Endpoints: "Puntos finales",
  "Enter '/' to apply the rule to all prefixes and objects at the bucket root. Do not include the wildcard asterisk '*' as part of the prefix *unless* it is an explicit part of the prefix name. The Console automatically appends an asterisk to the appropriate sections of the resulting IAM policy.":
    "Ingrese '/' para aplicar la regla a todos los prefijos y objetos en la raíz del depósito. No incluya el asterisco comodín '*' como parte del prefijo *a menos* que sea una parte explícita del nombre del prefijo. La Consola agrega automáticamente un asterisco a las secciones apropiadas de la política IAM resultante.",
  "Enter a comment": "Introduce un comentario",
  "Enter a description": "Ingrese una descripción",
  "Enter a Mime Type": "Ingrese un tipo de Mime",
  "Enter a name": "Ingrese un nombre",
  "Enter Access Key": "Ingresar clave de acceso",
  "Enter Account Key": "Ingrese la clave de cuenta",
  "Enter Account Name": "Ingrese el nombre de la cuenta",
  "Enter Address": "Ingrese la dirección",
  "Enter allowed origin e.g. https://example.com":
    "Ingrese el origen permitido, p. https://example.com",
  "Enter an Extension": "Ingrese una extensión",
  "Enter Auth Token": "Ingrese el token de autenticación",
  "Enter auth_token": "Ingrese auth_token",
  "Enter Brokers": "Ingrese a los corredores",
  "Enter Bucket": "Ingresar al depósito",
  "Enter Cert Authority": "Ingrese la autoridad de certificación",
  "Enter Claim Name": "Ingrese el nombre del reclamo",
  "Enter Claim Prefix": "Ingrese el prefijo de reclamo",
  "Enter Client Cert": "Ingrese el certificado del cliente",
  "Enter Client Cert Key": "Ingrese la clave de certificado del cliente",
  "Enter Client ID": "Ingrese Cliente ID",
  "Enter Client Key": "Ingrese la clave del cliente",
  "Enter Client Secret": "Ingrese el secreto del cliente",
  "Enter Coredns Path": "Ingrese la ruta de Coredns",
  "Enter custom notes if any": "Ingrese notas personalizadas, si corresponde",
  "Enter Cycle": "Ingresar ciclo",
  "Enter DB Name": "Ingrese DB Nombre",
  "Enter Delay": "Ingresar retraso",
  "Enter Delivery Mode": "Ingrese al modo de entrega",
  "Enter Destination Identifier": "Ingrese el identificador de destino",
  "Enter Display Name": "Ingrese el nombre para mostrar",
  "Enter DSN String": "Ingrese DSN Cadena",
  "Enter Endpoint": "Ingresar punto final",
  "Enter Exchange": "Ingresar a Intercambio",
  "Enter Exchange Type": "Ingrese el tipo de cambio",
  "Enter Format": "Ingresar formato",
  "Enter Host": "Ingresar anfitrión",
  "Enter Index": "Ingresar índice",
  "Enter Kafka Broker": "Ingrese Kafka Agente",
  "Enter Kafka Topic": "Ingrese Kafka Tema",
  "Enter Kafka Version": "Ingrese Kafka Versión",
  "Enter Keep Alive Interval":
    "Introduzca el intervalo de mantenimiento de actividad",
  "Enter Key": "Ingresar clave",
  "Enter Max IO": "Ingrese Máximo IO",
  "Enter Max Sleep Duration": "Ingrese la duración máxima del sueño",
  "Enter Max Wait": "Ingrese la espera máxima",
  "Enter Name (Eg. REMOTE-TIER)": "Ingrese el nombre (Ej. REMOTE-TIER)",
  "Enter NATS password": "Ingrese NATS contraseña",
  "Enter NATS Subject": "Ingrese NATS Asunto",
  "Enter NATS token": "Ingrese el token NATS",
  "Enter NATS Username": "Ingrese NATS Nombre de usuario",
  "Enter New Tag Key": "Ingrese la nueva clave de etiqueta",
  "Enter New Tag Label": "Ingrese nueva etiqueta de etiqueta",
  "Enter nsqd_address": "Ingrese nsqd_address",
  "Enter Password": "Ingrese la contraseña",
  "Enter Path Prefix": "Ingrese el prefijo de ruta",
  "Enter Ping Interval": "Ingrese el intervalo de ping",
  "Enter Port": "Ingresar puerto",
  "Enter Prefix": "Ingresar prefijo",
  "Enter QOS": "Ingrese QOS",
  "Enter Queue Dir": "Ingresar directorio de cola",
  "Enter Queue Directory": "Ingresar al directorio de cola",
  "Enter Queue Limit": "Ingresar límite de cola",
  "Enter Reconnect Interval": "Ingrese el intervalo de reconexión",
  "Enter Replication Failed Workers":
    "Ingrese trabajadores fallidos en la replicación",
  "Enter Replication Workers": "Ingrese a los trabajadores de replicación",
  "Enter Requests Max": "Ingresar solicitudes máx.",
  "Enter Routing Key": "Ingresar clave de ruta",
  "Enter SASL Mechanism": "Ingrese SASL Mecanismo",
  "Enter SASL Password": "Ingrese SASL Contraseña",
  "Enter SASL Username": "Ingrese SASL Nombre de usuario",
  "Enter Secret Key": "Ingrese la clave secreta",
  "Enter SSL Mode": "Ingrese al modo SSL",
  "Enter Storage Class": "Ingresar clase de almacenamiento",
  "Enter Streaming Cluster ID": "Ingrese al grupo de transmisión ID",
  "Enter Streaming in flight value": "Ingresar Streaming en valor de vuelo",
  "Enter Table Name": "Ingrese el nombre de la tabla",
  "Enter Tag Key": "Ingresar clave de etiqueta",
  "Enter Tag Label": "Ingresar etiqueta de etiqueta",
  "Enter the new Folder Path": "Ingrese la nueva ruta de la carpeta",
  "Enter TLS Client Auth": "Ingrese TLS Autenticación del cliente",
  "Enter TLS Client Cert": "Ingrese TLS Certificado de cliente",
  "Enter TLS Client Key": "Ingrese TLS Clave de cliente",
  "Enter Topic": "Ingresar tema",
  "Enter URL": "Ingrese URL",
  "Enter User": "Ingresar Usuario",
  "Enter Username": "Ingrese el nombre de usuario",
  Entities: "Entidades",
  "Erasure Health": "Estado de codificación de borrado",
  Error: "Error",
  "Error - File size too large":
    "Error: el tamaño del archivo es demasiado grande",
  "Error retrieving access keys": "Error al recuperar claves de acceso",
  "Error:": "Error:",
  Errors: "Errores",
  Erros: "Errores",
  "ETAG:": "ETAG:",
  Event: "Evento",
  "Event Notifications": "Notificaciones de eventos",
  Exchange: "Intercambio",
  "Exchange Type": "Tipo de intercambio",
  "Exclude Folders": "Excluir carpetas",
  "exclude folders and prefixes": "excluir carpetas y prefijos",
  "Exclude folders and prefixes": "Excluir carpetas y prefijos",
  "Excluded Prefixes": "Prefijos excluidos",
  "Excluded Prefixes :": "Prefijos excluidos:",
  "Existing Objects": "Objetos existentes",
  "Expand graph": "Ampliar gráfico",
  "Expire All Versions": "Caducan todas las versiones",
  "Expire Delete Marker": "Caducar Eliminar marcador",
  "Expired All Versions": "Todas las versiones caducadas",
  "Expired Object Delete Marker": "Marcador de eliminación de objeto caducado",
  Expiry: "Caducidad",
  "Expiry Days": "Días de Caducidad",
  Export: "Exportar",
  Extensions: "Extensiones",
  'Extensions to compress e.g. ".txt", ".log" or ".csv" -  you can write one per field':
    'Extensiones para comprimir, p. ".txt", ".log" o ".csv": puedes escribir uno por campo',
  Failed: "Falló",
  Failures: "Fallos",
  False: "Falso",
  Features: "Características",
  February: "febrero",
  "File Configuration": "Configuración de archivos",
  "File couldn't be loaded. Please try Download instead":
    "No se pudo cargar el archivo. Por favor intenta descargar en su lugar",
  "File couldn't be previewed using file extension or mime type. Please try Download instead":
    "No se pudo obtener una vista previa del archivo usando la extensión de archivo o el tipo MIME. Por favor intenta descargar en su lugar",
  "File download will be handled directly by the browser.":
    "La descarga de archivos será manejada directamente por el navegador.",
  "Files larger than 5 GiB use a single, non-resumable browser request. Use mcli for multipart uploads.":
    "Los archivos de más de 5 GiB utilizan una única solicitud del navegador no reanudable. Utilice mcli para cargas de varias partes.",
  "File or Path to inspect": "Archivo o Ruta a inspeccionar",
  "File Preview": "Vista previa de archivo",
  "File preview couldn't be displayed, Please try Download instead.":
    "No se pudo mostrar la vista previa del archivo. Intente descargarlo.",
  "Filename should be less than 200 characters long.":
    "El nombre del archivo debe tener menos de 200 caracteres.",
  Filter: "Filtro",
  "Filter Users": "Filtrar usuarios",
  "Filter:": "Filtro:",
  Filters: "Filtros",
  "Folder cannot have the same name as an existing file":
    "La carpeta no puede tener el mismo nombre que un archivo existente",
  "For each write operation to the bucket, SILO checks all configured replication rules for the bucket and applies the matching rule with highest configured priority.":
    "Para cada operación de escritura en el depósito, SILO verifica todas las reglas de replicación configuradas para el depósito y aplica la regla coincidente con la prioridad configurada más alta.",
  'For each write operation to this "source" bucket, SILO checks all configured replication rules and applies the matching rule with highest configured priority.':
    'Para cada operación de escritura en este depósito "fuente", SILO verifica todas las reglas de replicación configuradas y aplica la regla coincidente con la prioridad configurada más alta.',
  "For per-object retention settings, defer to the documentation for the PUT operation used by your preferred SDK.":
    "Para la configuración de retención por objeto, consulte la documentación para la operación PUT utilizada por su SDK preferido.",
  "For SSE-S3 or SSE-KMS encryption via KMS, all sites must have access to a central KMS deployment server.":
    "Para el cifrado SSE-S3 o SSE-KMS mediante KMS, todos los sitios deben tener acceso a un servidor de implementación central KMS.",
  Format: "Formato",
  "full attribution stack": "pila de atribución completa",
  "Full Log Information": "Información de registro completa",
  "Function Name": "Nombre de la función",
  Functions: "Funciones",
  "GET - Object accessed": "GET - Objeto accedido",
  "Get Information": "Obtener información",
  "GNU Affero General Public License, version 3":
    "GNU Licencia pública general de Affero, versión 3",
  "GNU AGPL v3 full text": "GNU AGPL v3 texto completo",
  Governance: "Gobernanza",
  Group: "Grupo",
  "Group Mappings": "Asignaciones de grupo",
  "Group Name": "Nombre del grupo",
  "Group Status:": "Estado del grupo:",
  "Groups provide a simplified method for managing shared permissions among users with common access patterns and workloads. Client’s cannot authenticate to a SILO deployment using a group as an identity.":
    "Los grupos proporcionan un método simplificado para administrar permisos compartidos entre usuarios con patrones de acceso y cargas de trabajo comunes. Los clientes no pueden autenticarse en una implementación SILO utilizando un grupo como identidad.",
  "Groups with this Policy associated": "Grupos con esta Política asociada",
  "Guide to access policy structure":
    "Guía para acceder a la estructura de políticas",
  hard: "duro",
  Heal: "Sanar",
  "Health Check Duration": "Duración del control de estado",
  "Health Info (Preview)": "Información de salud (vista previa)",
  "Health Report": "Informe de salud",
  "Health Report complete": "Informe de salud completo",
  "Health Report file is ready to be downloaded.":
    "El archivo del Informe de salud está listo para descargarse.",
  "Health report generated successfully!":
    "¡Reporte de salud generado exitosamente!",
  "Health Report in progress...": "Informe de Salud en progreso...",
  "Health Report started. Please do not refresh page during diagnosis.":
    "Se inició el informe de salud. No actualice la página durante el diagnóstico.",
  Healthy: "Correcto",
  "Hide advanced Filters": "Ocultar filtros avanzados",
  "Hide Bucket Naming Rules": "Ocultar reglas de nomenclatura de depósitos",
  "Hide Object Versions": "Ocultar versiones de objetos",
  hour: "hora",
  hours: {
    one: "hora",
    other: "horas",
    many: "horas",
  },
  Hours: "Horas",
  "IAM conditional statements": "IAM declaraciones condicionales",
  "IAM Policy": "IAM Política",
  Id: "Identificación",
  Identifier: "Identificador",
  "Identity provider Client ID": "Proveedor de identidad Cliente ID",
  "Identity provider Client Secret":
    "Secreto del cliente del proveedor de identidad",
  "If the Health report cannot be generated at this time, please wait a moment and try again.":
    "Si no se puede generar el informe de salud en este momento, espere un momento y vuelva a intentarlo.",
  "If you are looking to change MINIO_ROOT_USER credentials,":
    "Si desea cambiar las credenciales MINIO_ROOT_USER,",
  "ILM - Object Transitioned": "ILM - Objeto en transición",
  "ILM Rule": "ILM Regla",
  Import: "Importar",
  "incorporates and modifies": "incorpora y modifica",
  Index: "Índice",
  "Initially, only one of the sites added for replication may have data. After site-replication is successfully configured, this data is replicated to the other (initially empty) sites. Subsequently, objects may be written to any of the sites, and they will be replicated to all other sites.":
    "Inicialmente, solo uno de los sitios agregados para replicación puede tener datos. Una vez configurada correctamente la replicación de sitios, estos datos se replican en los otros sitios (inicialmente vacíos). Posteriormente, los objetos se pueden escribir en cualquiera de los sitios y se replicarán en todos los demás sitios.",
  "Inspect Decryption Key": "Inspeccionar la clave de descifrado",
  "Inspect Object": "Inspeccionar objeto",
  "Inspect this file": "Inspeccionar este archivo",
  Internal: "Interno",
  "Invalid bucket name": "Nombre de depósito no válido",
  "Invalid Endpoint set": "Conjunto de puntos finales no válido",
  "Invalid Name": "Nombre no válido",
  January: "enero",
  "JSON Results:": "JSON Resultados:",
  July: "julio",
  June: "junio",
  "Just now": "Justo ahora",
  "Kafka topic used for bucket notifications":
    "Kafka tema utilizado para notificaciones de depósitos",
  "Keep Alive Interval": "Intervalo de mantenimiento de actividad",
  "Keep-alive interval for MQTT connections in s,m,h,d":
    "Intervalo de mantenimiento de conexión para MQTT conexiones en s,m,h,d",
  Key: "Clave",
  "Key Management Service Endpoints:":
    "Puntos finales del servicio de administración de claves:",
  "Key Name": "Nombre clave",
  "Key name cannot contain spaces":
    "El nombre de la clave no puede contener espacios",
  Keys: "Claves",
  "KMS Key ID": "KMS Tecla ID",
  "Last Modified": "Última modificación",
  "Last modified:": "Última modificación:",
  "Last Modified:": "Última modificación:",
  "Latency Histogram": "Histograma de latencia",
  "LDAP Enabled": "LDAP Habilitado",
  "Learn more about {link}.": "Obtenga más información sobre {link}.",
  "Learn more about Access Keys":
    "Obtenga más información sobre las claves de acceso",
  "Learn more about Groups": "Más información sobre Grupos",
  "Learn more about LDAP Configurations":
    "Obtenga más información sobre LDAP Configuraciones",
  "Learn more about OpenID Connect Configurations":
    "Obtenga más información sobre OpenID Configuraciones de conexión",
  "Learn more about Policies": "Obtenga más información sobre las políticas",
  "Learn more about the Users feature":
    "Obtenga más información sobre la función Usuarios",
  "Learn more about TIERS": "Más información sobre TIERS",
  "Legal Hold": "Retención legal",
  "Legal Hold Status": "Estado de retención legal",
  "Legal Hold:": "Retención Legal:",
  "licensing in full": "licencia completa",
  Lifecycle: "Ciclo de vida",
  "Lifecycle Configuration": "Configuración del ciclo de vida",
  "Lifecycle Rules": "Reglas del ciclo de vida",
  Link: "Enlace",
  'List of etcd endpoints e.g. "http://localhost:2379" - you can write one per field':
    'Lista de etcd puntos finales, p. "http://localhost:2379" - puedes escribir uno por campo',
  "List of origins allowed for CORS requests":
    "Lista de orígenes permitidos para CORS solicitudes",
  "List of Replicated Sites": "Lista de sitios replicados",
  "Load more": "Cargar más",
  "Load more Versions": "Cargar más versiones",
  "Load Time": "Tiempo de carga",
  "Loading nodes": "Cargando nodos",
  "Local Buckets to replicate": "Depósitos locales para replicar",
  Location: "Ubicación",
  Locking: "Bloqueo",
  "Log Details": "Detalles del registro",
  "Logger Webhook": "Registrador Webhook",
  "Lookup Bind DN is required": "Se requiere enlace de búsqueda DN",
  "Lookup Bind Password is required":
    "Se requiere contraseña de enlace de búsqueda",
  "Lookup Bind Password must be re-entered to change LDAP configurations":
    "Se debe volver a ingresar la contraseña de vinculación de búsqueda para cambiar las configuraciones LDAP",
  "Manage Groups": "Administrar grupos",
  Mandatory: "Obligatorio",
  "Manually Configure String": "Configurar cadena manualmente",
  March: "marzo",
  "Max IO": "Máx. IO",
  "Max Sleep": "Sueño máximo",
  "Max Wait": "Espera máxima",
  "Maximum IO requests allowed between objects to slow down heal operation, e.g. 3":
    "Máximo IO solicitudes permitidas entre objetos para ralentizar la operación de curación, p. 3",
  "Maximum limit for undelivered messages, defaults to '10000'":
    "Límite máximo de mensajes no entregados, el valor predeterminado es '10000'",
  "Maximum number of concurrent requests, e.g. '1600'":
    "Número máximo de solicitudes simultáneas, p. '1600'",
  "Maximum sleep duration between objects to slow down heal operation, e.g. 2s":
    "Duración máxima del sueño entre objetos para ralentizar la operación de curación, p. 2s",
  "Maximum wait time between operations, defaults to '15s'":
    "Tiempo máximo de espera entre operaciones, el valor predeterminado es '15 s'",
  May: "mayo",
  "May try again or download Health report JSON File.":
    "Puede intentarlo nuevamente o descargar el archivo Informe de salud JSON.",
  Members: "Miembros",
  "Memory Info": "Información de la memoria",
  Metadata: "Metadatos",
  "Metadata Sync": "Sincronización de metadatos",
  Method: "Método",
  "Mime Types": "Tipos de mimo",
  'Mime types e.g. "text/*", "application/json" or "application/xml" - you can write one per field':
    'Tipos de mimo, p. "text/*", "application/json" o "application/xml" - puedes escribir uno por campo',
  minute: "minuto",
  minutes: {
    one: "minuto",
    other: "minutos",
    many: "minutos",
  },
  Minutes: "Minutos",
  Mode: "Modo",
  "Mode:": "Modo:",
  month: "mes",
  months: {
    one: "mes",
    other: "meses",
    many: "meses",
  },
  "More filter options": "Más opciones de filtro",
  "MQTT password": "MQTT contraseña",
  "MQTT server endpoint e.g. `tcp://localhost:1883`":
    "MQTT punto final del servidor, p. `tcp://localhost:1883`",
  "MQTT username": "MQTT nombre de usuario",
  "Multi Bucket lifecycle Assignments Results":
    "Resultados de las asignaciones del ciclo de vida de varios depósitos",
  Name: "Nombre",
  "Name for identity provider configuration":
    "Nombre para la configuración del proveedor de identidad",
  "Name of the AMQP exchange": "Nombre del intercambio AMQP",
  'Name of the location of the server e.g. "us-west-rack2"':
    'Nombre de la ubicación del servidor, p. "nosotros-oeste-rack2"',
  "Name of the MQTT topic to publish": "Nombre del MQTT tema a publicar",
  "Name:": "Nombre:",
  'Namespace prefix to isolate tenants e.g. "customer1/"':
    'Prefijo de espacio de nombres para aislar a los inquilinos, p. "cliente1/"',
  "NATS password": "NATS contraseña",
  "NATS server address e.g. '0.0.0.0:4222'":
    "NATS dirección del servidor, p. '0.0.0.0:4222'",
  "NATS subscription subject": "NATS asunto de suscripción",
  "NATS token": "NATS ficha",
  "NATS username": "NATS nombre de usuario",
  "Network Info": "Información de red",
  "New {entity} Created": "Nuevo {entity} Creado",
  "New Audit Webhook": "Nueva Auditoría Webhook",
  "New Endpoint": "Nuevo punto final",
  "New Endpoint:": "Nuevo punto final:",
  "New Folder Path": "Nueva ruta de carpeta",
  "New Logger Webhook": "Nuevo registrador Webhook",
  "New Password": "Nueva Contraseña",
  "New passwords don't match": "Las nuevas contraseñas no coinciden",
  "New Tag Key": "Nueva clave de etiqueta",
  "New Tag Label": "Nueva etiqueta de etiqueta",
  Next: "Siguiente",
  No: "No",
  "No changes applied": "No se aplicaron cambios",
  "No Changes at this time": "No hay cambios en este momento",
  "No data available": "No hay datos disponibles",
  "No Groups Available": "No hay grupos disponibles",
  "No Policies Available": "No hay políticas disponibles",
  "No query results yet": "Aún no hay resultados de la consulta",
  "No Results Available": "No hay resultados disponibles",
  "No Users to display": "No hay usuarios para mostrar",
  "No Wait": "Sin espera",
  "no-expiry": "sin caducidad",
  "Nodes:": "Nodos:",
  "Non-blocking message delivery when set to 'on', default is 'off'":
    "Entrega de mensajes sin bloqueo cuando está activado, el valor predeterminado es desactivado",
  "Non-Current": "No corriente",
  "Non-current Expiration Days": "Días de Vencimiento No Corrientes",
  "Non-current Transition Days": "Días de transición no corrientes",
  "Non-Current Version": "Versión no actual",
  "Non-current Version Transition Storage Class":
    "Clase de almacenamiento de transición de versión no actual",
  None: "Ninguno",
  "Not what you expected?": "¿No es lo que esperabas?",
  "Note:": "Nota:",
  "Note: AccessKey and SecretKey values for every site is required while adding or editing peer sites":
    "Nota: Al añadir o editar sitios pares, se requieren los valores AccessKey y SecretKey de cada sitio.",
  November: "noviembre",
  "NSQ server address e.g. '127.0.0.1:4150'":
    "NSQ dirección del servidor, p. '127.0.0.1:4150'",
  "NSQ topic": "NSQ tema",
  "NSQD Address": "NSQD Dirección",
  "NULL VERSION": "NULL VERSION",
  "Number of {unit} must be less than or equal to 2147483647":
    "El número de {unit} debe ser menor o igual a 2147483647",
  "Number of {unit} to retain must be greater than zero":
    "El número de {unit} a retener debe ser mayor que cero",
  "Number of messages to publish without waiting for ACKs":
    "Número de mensajes a publicar sin esperar ACK",
  "Number of replication workers for recently failed replicas, defaults to 4":
    "Número de trabajadores de replicación para réplicas fallidas recientemente, el valor predeterminado es 4",
  "Number of replication workers, defaults to 100":
    "Número de trabajadores de replicación, el valor predeterminado es 100",
  Object: "Objeto",
  "Object Date": "Fecha del objeto",
  "Object Filters": "Filtros de objetos",
  "Object Info": "Información del objeto",
  "Object Locking:": "Bloqueo de objetos:",
  "Object Size": "Tamaño del objeto",
  "Object Version": "Versión del objeto",
  "Objects deleted successfully.": "Objetos eliminados exitosamente.",
  "Objects in excluded prefixes do not replicate to any peer site or remote site.":
    "Los objetos con prefijos excluidos no se replican en ningún sitio del mismo nivel o sitio remoto.",
  "Objects List unavailable. Please review your WebSockets configuration and try again":
    "Lista de objetos no disponible. Revise la configuración de WebSockets y vuelva a intentarlo.",
  "Objects:": "Objetos:",
  "Objs/S": "Objetos/S",
  October: "Octubre",
  of: "de",
  "Only empty tiers can be deleted. If the tier has had objects transitioned into it, it cannot be removed.":
    "Solo se pueden eliminar los niveles vacíos. Si se han transferido objetos a un nivel, no se puede eliminar.",
  "Opaque string or JWT authorization token":
    "Cadena opaca o JWT token de autorización",
  "Open Dialog": "Abrir diálogo",
  "OpenID Configurations": "OpenID Configuraciones",
  "OS Info": "OS Información",
  other: "otro",
  "Password for LDAP read-only service account used to perform DN and group lookups":
    "Contraseña para la cuenta de servicio de solo lectura LDAP utilizada para realizar búsquedas de grupo y DN",
  "Password for SASL/PLAIN or SASL/SCRAM authentication":
    "Contraseña para autenticación SASL/PLAIN o SASL/SCRAM",
  "Passwords must be at least 8 characters long":
    "Las contraseñas deben tener al menos 8 caracteres",
  Path: "Ruta",
  "Path cannot start with /": "La ruta no puede comenzar con /",
  "Path copied to clipboard": "Ruta copiada al portapapeles",
  "Path Prefix": "Prefijo de ruta",
  "Path to certificate chain of the target NATS server":
    "Ruta a la cadena de certificados del servidor NATS de destino",
  "Path to client certificate for mTLS authorization":
    "Ruta al certificado de cliente para autorización mTLS",
  "Path to client key for mTLS authorization":
    "Ruta a la clave del cliente para autorización mTLS",
  "Peer Sites": "Sitios pares",
  "Perform bitrot scan on disks when checking objects during scanner":
    "Realice un escaneo bitrot en discos al verificar objetos durante el escaneo",
  "Performance test": "Prueba de rendimiento",
  "Persist queue across broker restarts when set to 'on', default is 'off'":
    "La cola persistente entre intermediarios se reinicia cuando está configurada en 'activada', la opción predeterminada es 'desactivada'",
  "Ping Interval": "Intervalo de ping",
  "Please avoid the use of root credentials for this feature":
    "Evite el uso de credenciales de root para esta función",
  "Please configure {entity} first to use this feature.":
    "Configure {entity} primero para usar esta función.",
  "Please deploy a server in {distributedMode} to use these features.":
    "Implemente un servidor en {distributedMode} para utilizar estas funciones.",
  "Please deploy a server in {mode} to use this feature.":
    "Implemente un servidor en {mode} para utilizar esta función.",
  "N/A": "N/A",
  "Enter a positive quota below 8 PiB, with up to two decimal places. Use mcli for larger quotas.":
    "Introduzca una cuota positiva inferior a 8 PiB, con hasta dos decimales. Utilice mcli para cuotas mayores.",
  "The current quota is 8 PiB or larger, which the browser cannot edit exactly. Change it with mcli, enter a smaller quota, or disable it here.":
    "La cuota actual es de 8 PiB o más, que el navegador no puede editar exactamente. Cámbielo con mcli, ingrese una cuota menor o desactívela aquí.",
  "Please Login via the configured external identity provider.":
    "Inicie sesión a través del proveedor de identidad externo configurado.",
  "Please note": "Tenga en cuenta",
  "Please note that this may cause your system to not be accessible":
    "Tenga en cuenta que esto puede provocar que su sistema no sea accesible",
  "Please refer to {link} credentials.": "Consulte las credenciales {link}.",
  "Please select / type the desired remote bucket were you want the local data to be replicated.":
    "Seleccione/escriba el depósito remoto deseado donde desea que se repliquen los datos locales.",
  "Please select a valid duration.": "Seleccione una duración válida.",
  "Please select Groups on which you want to apply Policies":
    "Seleccione los grupos a los que desea aplicar políticas",
  "Please verify that string is uppercase only and contains valid characters (numbers, dashes & underscores).":
    "Verifique que la cadena esté solo en mayúsculas y contenga caracteres válidos (números, guiones y guiones bajos).",
  Policy: "Política",
  "Policy has no statements": "La política no tiene declaraciones",
  "Policy mapping": "Mapeo de políticas",
  "Policy Mappings": "Asignaciones de políticas",
  "Policy Name": "Nombre de la política",
  "Policy name cannot be empty":
    "El nombre de la política no puede estar vacío",
  "Policy successfully updated": "Política actualizada exitosamente",
  "Policy Summary": "Resumen de política",
  "Portions © 2015–2026 MinIO, Inc.": "Porciones © 2015–2026 MinIO, Inc.",
  prefix: "prefijo",
  Prefix: "Prefijo",
  "Preliminar Results:": "Resultados preliminares:",
  preview: "vista previa",
  Preview: "Vista previa",
  "Preview - {object}": "Vista previa - {object}",
  "Preview Selected File": "Vista previa del archivo seleccionado",
  "Preview this File": "Vista previa de este archivo",
  "Preview unavailable": "Vista previa no disponible",
  Priority: "Prioridad",
  private: "privado",
  Private: "Privado",
  "Process Info": "Información del proceso",
  public: "público",
  Public: "Público",
  "PUT - Object Uploaded": "PUT - Objeto cargado",
  "Query Filters": "Filtros de consulta",
  "Query Results": "Resultados de la consulta",
  Queue: "Cola",
  "Queue Dir": "Directorio de cola",
  "Queue Directory": "Directorio de colas",
  "Queue Limit": "Límite de cola",
  "Quietly ignore undelivered messages when set to 'off', default is 'on'":
    'Ignora silenciosamente los mensajes no entregados cuando está "desactivado", el valor predeterminado es "activado"',
  quota: "cuota",
  Quota: "Cuota",
  "Quota:": "Cuota:",
  "Randomized access credentials are recommended, and provided by default. You may use your own custom Access Key and Secret Key by replacing the default values. After creation of any Access Key, you will be given the opportunity to view and download the account credentials.":
    "Se recomiendan credenciales de acceso aleatorio, que se proporcionan de forma predeterminada. Puede utilizar su propia clave de acceso y clave secreta personalizadas reemplazando los valores predeterminados. Después de crear cualquier clave de acceso, se le dará la oportunidad de ver y descargar las credenciales de la cuenta.",
  "Raw Policy": "Política sin procesar",
  readonly: "solo lectura",
  readwrite: "leer escribir",
  "Reconnect Interval": "Intervalo de reconexión",
  "Reconnect interval for MQTT connections in s,m,h,d":
    "Intervalo de reconexión para conexiones MQTT en s,m,h,d",
  "Redirect URI Dynamic": "Redireccionamiento URI Dinámico",
  "Redis key to store/update events, key is auto-created":
    "Redis clave para almacenar/actualizar eventos, la clave se crea automáticamente",
  "Redis server password": "Redis contraseña del servidor",
  "Redis server's address e.g. `localhost:6379`":
    "Redis dirección del servidor, p. `localhost:6379`",
  Refresh: "Actualizar",
  "Refresh List": "Actualizar lista",
  Region: "Región",
  "Remote Bucket Assignments": "Asignaciones de depósitos remotos",
  "Remote Configuration": "Configuración Remota",
  "Remote Endpoint Configuration": "Configuración de punto final remoto",
  "Remote Host": "Host remoto",
  "remote tier": "nivel remoto",
  "Remove Row": "Eliminar fila",
  "Remove Selected Replication Rules":
    "Eliminar reglas de replicación seleccionadas",
  "Remove Selected Rules": "Eliminar reglas seleccionadas",
  "Remove the reference to the object if no versions are left":
    "Eliminar la referencia al objeto si no quedan versiones",
  "Removes all the versions of the object already expired":
    "Elimina todas las versiones del objeto que ya han caducado",
  "Rename Download": "Cambiar nombre Descargar",
  "REPLICA - Object Replicated": "REPLICA - Objeto replicado",
  "Replicate existing objects": "Replicar objetos existentes",
  "Replicate soft deletes": "Replicar eliminaciones lógicas",
  "Replicate versioned deletes": "Replicar eliminaciones de versiones",
  Replication: "Replicación",
  "Replication Failed Workers": "Trabajadores fallidos en la replicación",
  "Replication Mode": "Modo de replicación",
  "Replication Options": "Opciones de replicación",
  "Replication Rules": "Reglas de replicación",
  "Replication Status": "Estado de replicación",
  "Replication status for {type}: {name}.":
    "Estado de replicación para {type}: {name}.",
  "Replication status from all Sites":
    "Estado de replicación de todos los sitios",
  "Replication Workers": "Trabajadores de replicación",
  "Replication:": "Replicación:",
  "Reported Usage:": "Uso reportado:",
  "Request Content Length": "Solicitar longitud del contenido",
  "Request ID": "Solicitud ID",
  "Requests Max": "Solicitudes máx.",
  "Requests that took T ms or less": "Solicitudes que tardaron T ms o menos",
  Reset: "Restablecer",
  "Reset Configuration": "Restablecer configuración",
  "Reset Default Webhook": "Restablecer valor predeterminado Webhook",
  "Resources:": "Recursos:",
  "Response Content Length": "Longitud del contenido de la respuesta",
  "Response Status": "Estado de respuesta",
  "Response Status Code": "Código de estado de respuesta",
  "Response Threshold": "Umbral de respuesta",
  Restart: "Reiniciar",
  "Restore Defaults": "Restaurar valores predeterminados",
  "Restore File Version": "Restaurar versión del archivo",
  "Restore this version": "Restaurar esta versión",
  "Restrict beyond user policy":
    "Restringir más allá de la política de usuario",
  Results: "Resultados",
  Retention: "Retención",
  "Retention Mode": "Modo de retención",
  "Retention Policy:": "Política de retención:",
  "Retention Unit": "Unidad de retención",
  "Retention Validity": "Duración de retención",
  "Retention:": "Retención:",
  Retest: "Volver a probar",
  "Retry Health Report": "Reintentar informe de estado",
  Rewind: "Rebobinar",
  "Rewind - {bucket}": "Rebobinar - {bucket}",
  "Rewind Bucket": "Bucket de rebobinado",
  "Rewind to": "Rebobinar a",
  "Role Policy": "Política de roles",
  rotating: "girando",
  "Routing Key": "Clave de enrutamiento",
  "Routing key for publishing": "Clave de enrutamiento para publicación",
  "Rule State": "Estado de regla",
  "Rule Type": "Tipo de regla",
  "Running {mcDu} without the {flag} flag or {df} will provide different values corresponding to the size of all {current} versions and the physical disk space occupied respectively.":
    "Ejecutar {mcDu} sin el indicador {flag} o {df} proporcionará diferentes valores correspondientes al tamaño de todas las versiones {current} y el espacio en disco físico ocupado, respectivamente.",
  "S3 lifecycle": "S3 ciclo de vida",
  "SASL authentication mechanism": "SASL mecanismo de autenticación",
  "SASL authentication mechanism, default 'PLAIN'":
    "SASL mecanismo de autenticación, predeterminado 'PLAIN'",
  "SASL Mechanism": "SASL Mecanismo",
  "SASL Password": "SASL Contraseña",
  "SASL Username": "SASL Nombre de usuario",
  "Save Event Destination": "Guardar destino del evento",
  "Save Tier Configuration": "Guardar configuración de nivel",
  Scanner: "Escáner",
  "SCANNER - Object has too many versions / Prefixes has too many sub-folders":
    "SCANNER - El objeto tiene demasiadas versiones/Prefijos tiene demasiadas subcarpetas",
  "Scanner delay multiplier, defaults to '10.0'":
    "Multiplicador de retraso del escáner, el valor predeterminado es '10.0'",
  Scopes: "Alcances",
  Search: "Buscar",
  "Search Access Keys": "Buscar claves de acceso",
  "Search Groups": "Buscar grupos",
  "Search Keys with pattern": "Claves de búsqueda con patrón",
  "Search members": "Buscar miembros",
  "Search Policies": "Políticas de búsqueda",
  "Search target": "Objetivo de búsqueda",
  "Search Users": "Buscar usuarios",
  second: "segundo",
  seconds: {
    one: "segundo",
    other: "segundos",
    many: "segundos",
  },
  "Secret Key": "Clave secreta",
  "SecretKey is required": "SecretKey es obligatorio",
  "Select {expiry} to delete Objects per this rule. Select {transition} to move Objects to a remote storage {tier} per this rule.":
    "Seleccione {expiry} para eliminar objetos según esta regla. Seleccione {transition} para mover Objetos a un almacenamiento remoto {tier} según esta regla.",
  "Select Bucket": "Seleccionar depósito",
  "Select from the list of displayed users to assign users to the new group at creation. These users inherit the policies assigned to the group.":
    "Seleccione de la lista de usuarios mostrados para asignar usuarios al nuevo grupo en el momento de la creación. Estos usuarios heredan las políticas asignadas al grupo.",
  "Select Groups to delete": "Seleccionar grupos para eliminar",
  "Select Multiple Versions": "Seleccione varias versiones",
  "Select Policy": "Seleccionar política",
  "Select the desired level of access available to unauthenticated Users":
    "Seleccione el nivel deseado de acceso disponible para usuarios no autenticados",
  "Select Tier Type": "Seleccionar tipo de nivel",
  "Select to set expiry by days or newer noncurrent versions":
    "Seleccione establecer la caducidad por días o versiones más nuevas no actuales",
  "Select Users to delete": "Seleccionar usuarios para eliminar",
  "Select Users to group": "Seleccionar usuarios para agrupar",
  "Select whether to apply the rule to current or non-current Object {versions}":
    "Seleccione si desea aplicar la regla al objeto actual o no actual {versions}",
  "Selected Group": "Grupo Seleccionado",
  "Selected Groups": "Grupos seleccionados",
  "Selected Object": "Objeto seleccionado",
  "Selected Objects:": "Objetos seleccionados:",
  "Selected User": "Usuario seleccionado",
  "Selected Users": "Usuarios seleccionados",
  September: "Septiembre\nSerie",
  Series: "Series",
  server: "servidor",
  "Server Address": "Dirección del servidor",
  "Server Address is required": "Se requiere la dirección del servidor",
  "Server Config": "Configuración del servidor",
  "Server Health Info": "Información sobre el estado del servidor",
  "Server Insecure": "Servidor inseguro",
  "Server Location": "Ubicación del servidor",
  "server-side bucket replication":
    "replicación de depósitos del lado del servidor",
  "Server, client and Console are all AGPLv3. SILO's documentation is CC BY 4.0 — {licensing}.":
    "El servidor, el cliente y la consola son todos AGPLv3. La documentación de SILO es CC BY 4.0 - {licensing}.",
  Service: "Servicio",
  "Service Accounts": "Cuentas de servicio",
  Services: "Servicios",
  Set: "Conjunto",
  "Set Anonymous Access to this Folder":
    "Establecer acceso anónimo a esta carpeta",
  "Set Bucket Replication": "Establecer replicación de depósito",
  "Set Groups": "Establecer grupos",
  "Set Legal Hold": "Establecer retención legal",
  "Set Lifecycle to multiple buckets":
    "Establecer ciclo de vida en varios depósitos",
  "Set Multiple Bucket Replication":
    "Establecer replicación de depósitos múltiples",
  "Set Non-current Version Transition Storage Class":
    "Establecer clase de almacenamiento de transición de versión no actual",
  "Set Policies": "Establecer políticas",
  "Set Retention Configuration": "Configurar la retención",
  "Set Retention Policy": "Establecer política de retención",
  "Set the quality of service priority, defaults to '0'":
    "Establece la calidad de prioridad del servicio, el valor predeterminado es '0'",
  "Set to '1' for non-persistent or '2' for persistent queue":
    "Establecer en '1' para cola no persistente o '2' para cola persistente",
  "Set to 'on' for exchange to be not used directly by publishers, but only when bound to other exchanges":
    "Establezca esta opción en 'activado' para que los editores no utilicen el intercambio directamente, sino solo cuando esté vinculado a otros intercambios.",
  "Set to 'on' to enable asynchronous publish":
    "Establezca en 'activado' para habilitar la publicación asincrónica",
  "Set to 'on' to enable SASL authentication":
    "Establezca en 'activado' para habilitar la autenticación SASL",
  "Set to 'on' to enable TLS": "Establezca en 'activado' para habilitar TLS",
  "Set to 'on' to use streaming NATS server":
    "Configúrelo en 'activado' para usar el servidor de transmisión NATS",
  "Setting a {quota} assigns a hard limit to a bucket beyond which SILO does not allow writes.":
    "Establecer un {quota} asigna un límite estricto a un depósito más allá del cual SILO no permite escrituras.",
  "Setting an {anonymous} policy allows clients to access the Bucket or prefix contents and perform actions consistent with the specified policy without authentication.":
    "Establecer una política {anonymous} permite a los clientes acceder al contenido del depósito o del prefijo y realizar acciones consistentes con la política especificada sin autenticación.",
  Share: "Compartir",
  "Share File": "Compartir archivo",
  "Share Selected File": "Compartir archivo seleccionado",
  "Share this File": "Comparte este archivo",
  "Share this version": "Comparte esta versión",
  "Share URL Copied to clipboard": "Compartir URL Copiado al portapapeles",
  'Shared bucket DNS records, default is "/skydns"':
    'Registros compartidos DNS, el valor predeterminado es "/skydns"',
  "Show advanced Filters": "Mostrar filtros avanzados",
  "Show Current Data": "Mostrar datos actuales",
  "Show deleted objects": "Mostrar objetos eliminados",
  "Show Rewind Data": "Mostrar datos de rebobinado",
  "Show/Hide": "Mostrar/Ocultar",
  "SILO {bucketNotifications} allow administrators to send notifications to supported external services on certain object or bucket events.":
    "SILO {bucketNotifications} permite a los administradores enviar notificaciones a servicios externos compatibles sobre ciertos eventos de objetos o depósitos.",
  "SILO {objectLocking} enforces Write-Once Read-Many (WORM) immutability to protect versioned objects from deletion.":
    "SILO {objectLocking} aplica la inmutabilidad de escritura única y lectura múltiple (WORM) para proteger los objetos versionados contra la eliminación.",
  "SILO {serverSideReplication} is an automatic bucket-level configuration that synchronizes objects between a source and destination bucket.":
    "SILO {serverSideReplication} es una configuración automática a nivel de depósito que sincroniza objetos entre un depósito de origen y de destino.",
  "SILO bucket notifications allow administrators to send notifications to supported external services on certain object or bucket events. SILO supports bucket and object-level S3 events similar to the Amazon S3 Event Notifications.":
    "SILO Las notificaciones de depósito permiten a los administradores enviar notificaciones a servicios externos compatibles sobre ciertos objetos o eventos de depósito. SILO admite eventos S3 a nivel de depósito y de objeto similares a las notificaciones de eventos S3 de Amazon.",
  "SILO derives its behavior and syntax from {s3Lifecycle} for compatibility in migrating workloads and lifecycle rules from S3 to SILO.":
    "SILO deriva su comportamiento y sintaxis de {s3Lifecycle} para lograr compatibilidad en la migración de cargas de trabajo y reglas de ciclo de vida de S3 a SILO.",
  "SILO does not enable existing object replication by default. Objects created before replication was configured or while replication is disabled are not synchronized to the target deployment unless replication of existing objects is enabled.":
    "SILO no habilita la replicación de objetos existentes de forma predeterminada. Los objetos creados antes de configurar la replicación o mientras la replicación está deshabilitada no se sincronizan con la implementación de destino a menos que la replicación de objetos existentes esté habilitada.",
  "SILO Health Info": "SILO Información de salud",
  "SILO Object Lifecycle Management allows creating rules for time or date based automatic transition or expiry of objects. For object transition, SILO automatically moves the object to a configured remote storage tier.":
    "SILO La gestión del ciclo de vida de objetos permite crear reglas para la transición o caducidad automática de objetos basada en hora o fecha. Para la transición de objetos, SILO mueve automáticamente el objeto a un nivel de almacenamiento remoto configurado.",
  "SILO or other S3-compatible storage":
    "SILO u otro almacenamiento compatible con S3",
  "SILO PBAC is built for compatibility with AWS IAM policy syntax, structure, and behavior.":
    "SILO PBAC está diseñado para ser compatible con la sintaxis, la estructura y el comportamiento de las políticas AWS IAM.",
  "SILO queries the configured Active Directory / LDAP server to verify the credentials specified by the application and optionally return a list of groups in which the user has membership. SILO supports two modes (Lookup-Bind Mode and Username-Bind Mode) for performing these queries":
    "SILO consulta el servidor Active Directory / LDAP configurado para verificar las credenciales especificadas por la aplicación y, opcionalmente, devolver una lista de grupos a los que el usuario es miembro. SILO admite dos modos (modo de búsqueda-vinculación y modo de vinculación de nombre de usuario) para realizar estas consultas",
  "SILO recommends using Lookup-Bind mode as the preferred method for verifying AD/LDAP credentials. Username-Bind mode is a legacy method retained for backwards compatibility only.":
    "SILO recomienda utilizar el modo Lookup-Bind como método preferido para verificar las credenciales AD/LDAP. El modo Username-Bind es un método heredado que se conserva únicamente por compatibilidad con versiones anteriores.",
  "SILO requires versioning to support replication.":
    "SILO requiere control de versiones para admitir la replicación.",
  "SILO supports automatically replicating existing objects in a bucket; this setting is enabled by default. Please note that objects created before replication was configured or while replication is disabled are not synchronized to the target deployment in case this setting is not enabled.":
    "SILO admite la replicación automática de objetos existentes en un depósito; esta configuración está habilitada de forma predeterminada. Tenga en cuenta que los objetos creados antes de configurar la replicación o mientras la replicación está deshabilitada no se sincronizan con la implementación de destino en caso de que esta configuración no esté habilitada.",
  "SILO supports creating object transition lifecycle management rules, where SILO can automatically move an object to a remote storage “tier”.":
    'SILO admite la creación de reglas de gestión del ciclo de vida de transición de objetos, donde SILO puede mover automáticamente un objeto a un "nivel" de almacenamiento remoto.',
  "SILO supports enabling automatic {sseKms} and {sseS3} encryption of all objects written to a bucket using a specific External Key (EK) stored on the external KMS.":
    "SILO admite la habilitación del cifrado automático {sseKms} y {sseS3} de todos los objetos escritos en un depósito utilizando una clave externa específica (EK) almacenada en el KMS externo.",
  "SILO supports enabling replication of existing objects in a bucket.":
    "SILO admite la habilitación de la replicación de objetos existentes en un depósito.",
  "SILO supports keeping multiple {versions} of an object in a single bucket.":
    "SILO admite mantener varios {versions} de un objeto en un solo depósito.",
  "SILO supports replicating delete operations, where SILO synchronizes deleting specific object versions and new delete markers. Delete operation replication uses the same replication process as all other replication operations.":
    "SILO admite la replicación de operaciones de eliminación, donde SILO sincroniza la eliminación de versiones de objetos específicos y nuevos marcadores de eliminación. La replicación de la operación de eliminación utiliza el mismo proceso de replicación que todas las demás operaciones de replicación.",
  "SILO supports server-side and client-side replication of objects between source and destination buckets.":
    "SILO admite la replicación de objetos del lado del servidor y del lado del cliente entre los depósitos de origen y destino.",
  "SILO supports setting both {bucketDefault} and per-object retention rules.":
    "SILO admite el establecimiento de reglas de retención tanto {bucketDefault} como por objeto.",
  "SILO supports the following Tier types:":
    "SILO admite los siguientes tipos de niveles:",
  "SILO supports using an Active Directory or LDAP (AD/LDAP) service for external management of user identities. Configuring an external IDentity Provider (IDP) enables Single-Sign On (SSO) workflows, where applications authenticate against the external IDP before accessing SILO.":
    "SILO admite el uso de un servicio Active Directory o LDAP (AD/LDAP) para la gestión externa de las identidades de los usuarios. La configuración de un proveedor de identidad externo (IDP) habilita flujos de trabajo de inicio de sesión único (SSO), donde las aplicaciones se autentican en el IDP externo antes de acceder a SILO.",
  "SILO uses buckets to organize objects. A bucket is similar to a folder or directory in a filesystem, where each bucket can hold an arbitrary number of objects.":
    "SILO utiliza buckets para organizar objetos. Un depósito es similar a una carpeta o directorio en un sistema de archivos, donde cada depósito puede contener una cantidad arbitraria de objetos.",
  "SILO uses Policy-Based Access Control (PBAC) to define the authorized actions and resources to which an authenticated user has access. Each policy describes one or more actions and conditions that outline the permissions of a user or group of users.":
    "SILO utiliza control de acceso basado en políticas (PBAC) para definir las acciones y recursos autorizados a los que tiene acceso un usuario autenticado. Cada política describe una o más acciones y condiciones que describen los permisos de un usuario o grupo de usuarios.",
  "SILO VERSION": "SILO VERSION",
  "Site Name": "Nombre del sitio",
  "Site:": "Sitio:",
  Size: "Tamaño",
  "Size:": "Tamaño:",
  "Skip TLS Verification": "Saltar TLS Verificación",
  "something went wrong": "algo salió mal",
  "Something went wrong.": "Algo salió mal.",
  "Sort by": "Ordenar por",
  "Specify the version of the Kafka cluster":
    "Especifique la versión del clúster Kafka",
  "Specify the version of the Kafka cluster e.g '2.2.0'":
    "Especifique la versión del clúster Kafka, por ejemplo, '2.2.0'",
  "Speed Test results:": "Resultados de la prueba de velocidad:",
  Speedtest: "Prueba de velocidad",
  "Speedtest in progress...": "Prueba de velocidad en progreso...",
  "Staging directory for undelivered messages e.g. '/home/events'":
    "Directorio provisional para mensajes no entregados, p. '/inicio/eventos'",
  "STANDARD_IA,REDUCED_REDUNDANCY etc":
    "ESTÁNDAR_IA,REDUNDANCIA_REDUCIDA, etc.",
  Start: "Inicio",
  "Start Health Report": "Iniciar informe de salud",
  "Start Logs": "Registros de inicio",
  "Start Profiling": "Iniciar perfilado",
  "Start Time:": "Hora de inicio:",
  "Start typing to filter objects in the bucket":
    "Comience a escribir para filtrar objetos en el depósito",
  "Start typing to filter versions of {file}":
    "Comienza a escribir para filtrar versiones de {file}",
  "Start typing to search for a Policy":
    "Comience a escribir para buscar una Política",
  "Start typing to search for Groups": "Empieza a escribir para buscar Grupos",
  Statements: "Declaraciones",
  Status: "Estado",
  "Status Code": "Código de estado",
  Stop: "Parar",
  "Stop Logs": "Detener registros",
  "Stop Profiling": "Dejar de crear perfiles",
  Storage: "Almacenamiento",
  "Storage Class": "Clase de almacenamiento",
  Streaming: "Transmisión",
  "Streaming async": "Transmisión asíncrona",
  "Streaming Cluster ID": "Clúster de transmisión ID",
  "Streaming max publish ACKS in flight":
    "Transmisión máxima de publicación ACKS en vuelo",
  Subject: "Asunto",
  "Subscribe To Bucket Events": "Suscríbete a eventos de bucket",
  "Subscribe to Event": "Suscríbete al evento",
  Success: "Éxito",
  "Successfully deleted.": "Eliminado con éxito.",
  "Successfully updated the password for the user {user}.":
    "Se actualizó exitosamente la contraseña del usuario {user}.",
  "Successfully updated the password.":
    "Se actualizó exitosamente la contraseña.",
  Suffix: "Sufijo",
  Summary: "Resumen",
  "Supported API endpoints": "Soportados API puntos finales",
  Suspended: "Suspendido",
  Synced: "Sincronizado",
  Synchronous: "Sincrónico",
  "System Health Info": "Información sobre el estado del sistema",
  Table: "Mesa",
  "Tag for: {object}": "Etiqueta para: {object}",
  "Tag Key": "Clave de etiqueta",
  "Tag Label": "Etiqueta Etiqueta",
  "Tag Value": "Valor de etiqueta",
  Tags: "Etiquetas",
  "Tags for: {object}": "Etiquetas para: {object}",
  "Tags:": "Etiquetas:",
  "Target Bucket": "Bucket objetivo",
  "Target URL": "Objetivo URL",
  "The bucket selected in this deployment acts as the “source” while the configured remote deployment acts as the “target”.":
    'El depósito seleccionado en esta implementación actúa como "fuente" mientras que la implementación remota configurada actúa como "destino".',
  "The file must be valid and  should have valid config values":
    "El archivo debe ser válido y tener valores de configuración válidos",
  "The file you are trying to download has a long name.":
    "El archivo que estás intentando descargar tiene un nombre largo.",
  "The following Bucket features will NOT be replicated":
    "Las siguientes funciones del bucket no se replicarán",
  "The following changes are replicated to all other sites":
    "Los siguientes cambios se replican en todos los demás sitios",
  "The following URL lets you share this object without requiring a login.":
    "El siguiente URL le permite compartir este objeto sin necesidad de iniciar sesión.",
  "The current version of this object is a delete marker and cannot be shared.":
    "La versión actual de este objeto es un marcador de eliminación y no se puede compartir.",
  "The selected object version could not be found. Refresh the object list and try again.":
    "No se pudo encontrar la versión del objeto seleccionado. Actualice la lista de objetos e inténtelo de nuevo.",
  "This server does not expose object versions; only the current object can be shared.":
    "Este servidor no expone versiones de objetos; sólo se puede compartir el objeto actual.",
  "The instance needs to be restarted for configuration changes to take effect.":
    "Es necesario reiniciar la instancia para que los cambios de configuración surtan efecto.",
  "The MinIO name is used here solely to identify the origin of the source code and to describe compatibility — {notice}.":
    "El nombre MinIO se utiliza aquí únicamente para identificar el origen del código fuente y describir la compatibilidad: {notice}.",
  "The selected users were added to the following groups.":
    "Los usuarios seleccionados fueron agregados a los siguientes grupos.",
  "The server is restarting.": "El servidor se está reiniciando.",
  "The URL expires automatically at the earlier of your configured time ({time}) or the expiration of your current web session.":
    "El URL caduca automáticamente a la hora configurada ({time}) o al vencimiento de su sesión web actual, lo que ocurra primero.",
  "There are no Configurations yet.": "Aún no hay configuraciones.",
  "There are no endpoints yet.": "Aún no hay puntos finales.",
  "There are no Groups with this Policy associated yet.":
    "Aún no hay Grupos con esta Política asociados.",
  "There are no Groups yet.": "Aún no hay grupos.",
  "There are no Policies yet.": "Aún no hay Políticas.",
  "There are no tags for this object": "No hay etiquetas para este objeto",
  "There are no User Access Keys yet.":
    "Aún no hay claves de acceso de usuario.",
  "There are no Users with this Policy associated yet.":
    "Aún no hay Usuarios con esta Política asociada.",
  "There are no Users yet.": "Aún no hay usuarios.",
  "There is no information with this criteria":
    "No existe información con este criterio",
  "There was an error": "Hubo un error",
  "There was an error creating a Policy ":
    "Hubo un error al crear una Política",
  "There was an error creating a Policy: {details}. Please check Policy syntax.":
    "Hubo un error al crear una Política: {details}. Consulte la sintaxis de la política.",
  "There was an error deleting the tier": "Hubo un error al eliminar el nivel",
  "There was an error retrieving tier information":
    "Hubo un error al recuperar la información del nivel",
  "There was an error updating the Policy ":
    "Hubo un error al actualizar la Política",
  "There was an error updating the Policy: {details}. Please check Policy syntax.":
    "Hubo un error al actualizar la Política: {details}. Consulte la sintaxis de la política.",
  "These features are unavailable in a single-disk setup.":
    "Estas funciones no están disponibles en una configuración de disco único.",
  "This action is irreversible.": "Esta acción es irreversible.",
  "This can cause issues on Windows Systems by trimming the file name after download.":
    "Esto puede causar problemas en los sistemas Windows al recortar el nombre del archivo después de la descarga.",
  "This configuration cannot be deleted using this module as this was set using OpenID environment variables.":
    "Esta configuración no se puede eliminar usando este módulo ya que se configuró usando OpenID variables de entorno.",
  "this Console": "esta consola",
  "This feature allows multiple independent SILO sites (or clusters) that are using the same external IDentity Provider (IDP) to be configured as replicas. In this situation the set of replica sites are referred to as peer sites or just sites.":
    "Esta característica permite configurar como réplicas múltiples sitios SILO independientes (o clústeres) que utilizan el mismo proveedor de identidad externo (IDP). En esta situación, el conjunto de sitios de réplica se denomina sitios pares o simplemente sitios.",
  "This feature is not available for a single-disk setup.":
    "Esta función no está disponible para una configuración de disco único.",
  "This feature is not available.": "Esta función no está disponible.",
  "This field is required": "Este campo es obligatorio",
  "This is a File Preview for the first {count} pages of the document, if you wish to work with the full document please download instead.":
    "Esta es una vista previa del archivo para las primeras {count} páginas del documento; si desea trabajar con el documento completo, descárguelo.",
  "This location is empty": "Esta ubicación está vacía",
  "This location is empty, please try uploading a new file":
    "Esta ubicación está vacía, intente cargar un archivo nuevo",
  "This Site": "Este sitio",
  "This site/cluster": "Este sitio/clúster",
  "This Usage value is comparable to {command} which represents the size of all object versions that exist in the buckets.":
    "Este valor de uso es comparable a {command}, que representa el tamaño de todas las versiones de objetos que existen en los depósitos.",
  "This value is set from the {env} environment variable":
    "Este valor se establece a partir de la variable de entorno {env}",
  "This value is set from the {name} environment variable":
    "Este valor se establece a partir de la variable de entorno {name}",
  "This will be displayed only once. It cannot be recovered.":
    "Esta información solo se mostrará una vez y no se podrá recuperar.",
  "This will change your Console password. Please note your new password down, as it will be required to log into Console after this session.":
    "Esto cambiará la contraseña de tu consola. Anote su nueva contraseña, ya que será necesaria para iniciar sesión en la Consola después de esta sesión.",
  "This will remove the object as well as all of its versions,":
    "Esto eliminará el objeto así como todas sus versiones.",
  "This will remove the objects as well as all of their versions,":
    "Esto eliminará los objetos así como todas sus versiones,",
  Tier: "Nivel de almacenamiento",
  "Tier Name": "Nombre del nivel",
  "Tier Types": "Tipos de niveles",
  "Tiers are used by the SILO Object Lifecycle Management which allows creating rules for time or date based automatic transition or expiry of objects. For object transition, SILO automatically moves the object to a configured remote storage tier.":
    "Los niveles son utilizados por SILO Gestión del ciclo de vida de objetos, lo que permite crear reglas para la transición o caducidad automática de objetos basada en hora o fecha. Para la transición de objetos, SILO mueve automáticamente el objeto a un nivel de almacenamiento remoto configurado.",
  "Time duration between scanner cycles, defaults to '1m'":
    "Duración del tiempo entre ciclos del escáner, el valor predeterminado es '1 m'",
  "Time to Response NS": "Tiempo de respuesta NS",
  Timestamp: "Marca de tiempo",
  "TLS Client Auth": "TLS Autenticación del cliente",
  "TLS skip verify": "TLS omitir verificar",
  "TLS Skip Verify": "TLS Saltar Verificar",
  "To allow Bucket access without credentials, use the {anonymous} setting":
    "Para permitir el acceso al depósito sin credenciales, use la configuración {anonymous}",
  "To continue please type {phrase} in the box.":
    "Para continuar, escriba {phrase} en el cuadro.",
  "To enable this feature you need to enable versioning on the bucket before creation":
    "Para habilitar esta función, debe habilitar el control de versiones en el depósito antes de la creación.",
  "To Tier": "Al nivel",
  "Today, {time}": "Hoy, {time}",
  "Toggle Share URL between Console and object server URL. Change default with CONSOLE_SHARE_MINIO_URL environment variable":
    "Alternar Compartir URL entre Consola y servidor de objetos URL. Cambiar el valor predeterminado con la variable de entorno CONSOLE_SHARE_MINIO_URL",
  Token: "Ficha",
  "Toogle JSON": "Toogle JSON",
  "Toogle Share URL": "Compartir en Toogle URL",
  Topic: "Tema",
  "Trace Results": "Resultados del seguimiento",
  "trademark notice": "aviso de marca registrada",
  Transition: "Transición",
  "Transition Days": "Días de Transición",
  True: "Verdadero",
  "Trust server TLS without verification":
    "Servidor de confianza TLS sin verificación",
  'Trust server TLS without verification, defaults to "on" (verify)':
    'Servidor de confianza TLS sin verificación, el valor predeterminado es "activado" (verificar)',
  Type: "Tipo",
  "Type New Password Again": "Escriba nuevamente la nueva contraseña",
  "Type of Lifecycle": "Tipo de ciclo de vida",
  "Types to profile:": "Tipos para perfilar:",
  "Unable to download widget data":
    "No se pueden descargar los datos del widget",
  "Unable to download widget data - data not available":
    "No se pueden descargar los datos del widget: datos no disponibles",
  "Under section 13 of the AGPL, the corresponding source for this running version is offered to every user who interacts with it over a network, at no charge.":
    "Según la sección 13 del AGPL, la fuente correspondiente para esta versión en ejecución se ofrece a cada usuario que interactúa con ella a través de una red, sin costo alguno.",
  "Understand which {policies} and {users} are authorized to access this Bucket.":
    "Comprenda cuáles {policies} y {users} están autorizados a acceder a este depósito.",
  "Unexpected response, download incomplete.":
    "Respuesta inesperada, descarga incompleta.",
  Unhealthy: "Con problemas",
  "Unique descriptive string for this destination":
    "Cadena descriptiva única para este destino",
  "Unique ID for NATS streaming cluster":
    "Único ID para NATS clúster de transmisión",
  "Update Credentials - {type} / {name}":
    "Actualizar credenciales - {type} / {name}",
  "Upload File": "Subir archivo",
  "Upload Files": "Subir archivos",
  "upload files to this bucket": "subir archivos a este depósito",
  "Upload Folder": "Subir carpeta",
  "Upload is restricted.": "La carga está restringida.",
  "Upload not allowed": "Subida no permitida",
  "upload objects to this location": "subir objetos a esta ubicación",
  "Upstream copyright, authorship and license notices are retained in the repository's {credits} and {notice}. See the {attribution}.":
    "Los avisos de licencia, autoría y derechos de autor ascendentes se conservan en los {credits} y {notice} del repositorio. Ver el {attribution}.",
  "upstream MinIO code": "código ascendente MinIO",
  "Usage Data Age": "Antigüedad de los datos de uso",
  "Usage:": "Uso:",
  "Use Original Name": "Usar nombre original",
  "Use SASL": "Utilice SASL",
  "Use secure medium to share this key.":
    "Utilice un medio seguro para compartir esta clave.",
  "Use TLS": "Utilice TLS",
  "Used to confirm a non-idempotent action.":
    "Se utiliza para confirmar una acción no idempotente.",
  "User Access Keys": "Claves de acceso de usuario",
  "User Agent": "Agente de usuario",
  "User Details - {user}": "Detalles de usuario - {user}",
  "User DN Search Base DN is required":
    "Se requiere usuario DN Base de búsqueda DN",
  "User DN Search Filter is required":
    "Usuario DN Se requiere filtro de búsqueda",
  "User Mappings": "Asignaciones de usuarios",
  "User Name": "Nombre de usuario",
  "Username for SASL/PLAIN or SASL/SCRAM authentication":
    "Nombre de usuario para la autenticación SASL/PLAIN o SASL/SCRAM",
  "Users inherit access permissions to data and resources through the groups they belong to.":
    "Los usuarios heredan permisos de acceso a datos y recursos a través de los grupos a los que pertenecen.",
  "Users with this Policy associated": "Usuarios con esta Política asociada",
  Validity: "Validez",
  "Validity:": "Validez:",
  Version: "Versión",
  "Version ID:": "Versión ID:",
  "Versioning is required to enable {objectLocking} and {retention}.":
    "El control de versiones es necesario para habilitar {objectLocking} y {retention}.",
  "Versioning on Bucket": "Control de versiones en el depósito",
  "Versioning setting cannot be changed as cluster replication is enabled for this site.":
    "La configuración de versiones no se puede cambiar ya que la replicación de clúster está habilitada para este sitio.",
  "Versioning Status": "Estado de versiones",
  versions: {
    one: "versión",
    other: "versiones",
    many: "versiones",
  },
  Versions: {
    one: "versión",
    other: "versiones",
    many: "versiones",
  },
  "Versions:": "Versiones:",
  View: "Ver",
  "View across sites": "Ver en todos los sitios",
  "View Bucket Naming Rules": "Ver reglas de nomenclatura de depósitos",
  "View env variable Webhook": "Ver variable ambiental Webhook",
  "view Objects in this bucket": "ver objetos en este depósito",
  "view Policy details": "ver detalles de la política",
  "View Replication Status for a:": "Ver el estado de replicación de:",
  "view User details": "ver detalles del usuario",
  "Visit the SILO website": "Visite el sitio web SILO",
  "Volume or Bucket Name": "Nombre del volumen o depósito",
  "Volume/Bucket name cannot start with /":
    "El nombre del volumen/depósito no puede comenzar con /",
  Warning: "Advertencia",
  "Warning: One or more users selected has associated Access Keys.":
    "Advertencia: Uno o más usuarios seleccionados tienen claves de acceso asociadas.",
  "Warning! The resulting file will contain server configuration information in plain text":
    "¡Advertencia! El archivo resultante contendrá información de configuración del servidor en texto sin formato.",
  "We recommend to rename the file download":
    "Recomendamos cambiar el nombre del archivo de descarga",
  "Webhook server endpoint e.g. http://localhost:8080/silo/events":
    "Webhook punto final del servidor, p. http://localhost:8080/silo/events",
  week: "semana",
  weeks: {
    one: "semana",
    other: "semanas",
    many: "semanas",
  },
  "What are Event Destinations?": "¿Qué son los destinos de eventos?",
  "Would you like to encrypt {object}?": "¿Le gustaría cifrar {object}?",
  "Write Policy": "Política de escritura",
  "Write these down, as this is the only time the secret will be displayed.":
    "Anótelos, ya que esta es la única vez que se mostrará el secreto.",
  writeonly: "solo escritura",
  year: "año",
  years: {
    one: "año",
    other: "años",
    many: "años",
  },
  Years: "Años",
  Yes: "Sí",
  "Yes, I am sure": "Sí, estoy seguro",
  "You can add a comment to this setting":
    "Puedes agregar un comentario a esta configuración",
  "You can add policies to the group by selecting it from the Groups view after creation. The Policy view lets you manage the assigned policies for the group.":
    "Puede agregar políticas al grupo seleccionándolo en la vista Grupos después de la creación. La vista Política le permite administrar las políticas asignadas para el grupo.",
  "You can choose to {excludePrefixes} from versioning if Object Locking is not enabled.":
    "Puede elegir {excludePrefixes} del control de versiones si el bloqueo de objetos no está habilitado.",
  "You can download the the Health report JSON File.":
    "Puede descargar el archivo JSON Informe de salud.",
  "You can increase the maximum configuration time by setting the MINIO_STS_DURATION environment variable on all your nodes.":
    "Puede aumentar el tiempo máximo de configuración configurando la variable de entorno MINIO_STS_DURATION en todos sus nodos.",
  "You can learn more at the {documentation}.":
    "Puedes obtener más información en el {documentation}.",
  "You can learn more at the {link}.":
    "Puedes obtener más información en el {link}.",
  "You can only enable {objectLocking} when first creating a bucket.":
    "Solo puede habilitar {objectLocking} cuando crea un depósito por primera vez.",
  "You can reset your session by logging out and logging back in to the web UI.":
    "Puedes restablecer tu sesión cerrando sesión y volviendo a iniciar sesión en la web UI.",
  "You can specify an optional JSON-formatted IAM policy to further restrict Access Key access to a subset of the actions and resources explicitly allowed for the parent user. Additional access beyond that of the parent user cannot be implemented through these policies.":
    "Puede especificar una política opcional JSON-formateada IAM para restringir aún más el acceso a la clave de acceso a un subconjunto de las acciones y recursos explícitamente permitidos para el usuario principal. No se puede implementar acceso adicional más allá del del usuario principal a través de estas políticas.",
  "You can use '*' to match any character, '.' to signify a single character or '\\' to scape an special character (E.g. mybucket-*)":
    "Puede utilizar '*' para hacer coincidir cualquier carácter, '.' para indicar un solo carácter o '\\' para escapar de un carácter especial (por ejemplo, mybucket-*)",
  "You can use {mcShare} as an alternative to this UI, where the session length does not limit the URL validity.":
    "Puede utilizar {mcShare} como alternativa a este UI, donde la duración de la sesión no limita la validez de URL.",
  "You cannot delete the currently logged in User":
    "No se puede eliminar al usuario que tiene la sesión iniciada",
  "You cannot enable or disable the currently logged in User":
    "No puede habilitar ni deshabilitar el usuario actualmente conectado",
  "You cannot modify the optional Access Key IAM policy after saving.":
    "No puede modificar la política de clave de acceso opcional IAM después de guardar.",
  "You may only have write access on a limited set of subpaths within this path. Please carefully review your User permissions to understand the paths to which you may write.":
    "Es posible que solo tenga acceso de escritura en un conjunto limitado de subrutas dentro de esta ruta. Revise cuidadosamente sus permisos de usuario para comprender las rutas en las que puede escribir.",
  "You must apply a valid name to the bucket":
    "Debes aplicar un nombre válido al depósito",
  "You must disable Object Locking before Versioning can be disabled":
    "Debe desactivar el bloqueo de objetos antes de poder desactivar el control de versiones.",
  "You must disable Retention before Object Locking can be disabled":
    "Debe desactivar la retención antes de poder desactivar el bloqueo de objetos",
  "You need to select at least one group to assign":
    "Debes seleccionar al menos un grupo para asignar",
  "You require additional permissions in order to {name}. Please ask your SILO administrator to grant you {scopes} permission in order to {name}.":
    "Necesita permisos adicionales para {name}. Pídale a su administrador SILO que le otorgue permiso {scopes} para poder {name}.",
  "You require additional permissions in order to {name}. Please ask your SILO administrator to grant you {scopes} permissions in order to {name}.":
    "Necesita permisos adicionales para poder {name}. Pídale a su administrador SILO que le otorgue permisos {scopes} para poder {name}.",
  "You require additional permissions in order to create a new Tier. Please ask your SILO administrator to grant you {permission} permission in order to create a Tier.":
    "Necesita permisos adicionales para crear un nuevo nivel. Pídale a su administrador SILO que le otorgue permiso {permission} para crear un nivel.",
  "File is empty": "El archivo está vacío",
  "Invalid UTF-8 or binary content": "UTF-8 o contenido binario no válido",
  "Loading text preview…": "Cargando vista previa de texto…",
  "Object not found or changed": "Objeto no encontrado o modificado",
  "Text preview content": "Contenido de vista previa de texto",
  "Text preview failed": "Error en la vista previa del texto",
  "Text preview forbidden": "Prohibida la vista previa del texto",
  "The object could not be found or changed while the preview was loading.":
    "No se pudo encontrar ni cambiar el objeto mientras se cargaba la vista previa.",
  "The text preview could not be loaded because of a network or server error.":
    "No se pudo cargar la vista previa del texto debido a un error de red o del servidor.",
  "This object is not valid UTF-8 text or contains binary data. Download it to inspect the original bytes.":
    "Este objeto no es texto UTF-8 válido ni contiene datos binarios. Descárguelo para inspeccionar los bytes originales.",
  "You do not have permission to preview this object.":
    "No tienes permiso para obtener una vista previa de este objeto.",
  Trademark: "Marca registrada",
  License: "Licencia",
  "Corresponding source for this build":
    "Fuente correspondiente para esta compilación",
  "The exact corresponding source is not available for this build: {reason}. See the NOTICE for how to obtain it.":
    "La fuente correspondiente exacta no está disponible para esta compilación: {reason}. Consulte el NOTICE para saber cómo obtenerlo.",
  "Source: not available for this build":
    "Fuente: no disponible para esta compilación",
  "Items per page": "Artículos por página",
  "First page": "Primera página",
  "Previous page": "Página anterior",
  "Next page": "Página siguiente",
  "{count} items in total": "{count} artículos en total",
  "Page {page} · {count} on this page":
    "Página {page} · {count} en esta página",
  "Sorting, filtering and select all apply to this page only.":
    "Ordenar, filtrar y seleccionar todo se aplica solo a esta página.",
  "No objects match the filter": "Ningún objeto coincide con el filtro",
  "No objects on this page match the filter":
    "Ningún objeto en esta página coincide con el filtro",
  "Showing the first {count} entries; the listing stopped at the row or time limit.":
    "Mostrando las primeras {count} entradas; el listado se detuvo en la fila o límite de tiempo.",
  "Start typing to filter objects on this page":
    "Comience a escribir para filtrar objetos en esta página",
  "Lists and tabs": "Listas y pestañas",
  "Move through rows with the pointer or keyboard. Arrow keys focus tabs; Enter or Space opens them.":
    "Muévete por las filas con el puntero o el teclado. Las teclas de flecha enfocan las pestañas; Entrar o Espacio los abre.",
  "Browse and select stored objects.":
    "Explora y selecciona objetos almacenados.",
  "Review stored object versions.":
    "Revisar las versiones de objetos almacenados.",
  "Manage bucket settings.": "Administrar la configuración del depósito.",
  "Compact section tabs": "Pestañas de sección compacta",
  "Storage and object usage": "Almacenamiento y uso de objetos",
  "Recent storage activity": "Actividad de almacenamiento reciente",
  "Example buckets": "Ejemplos de depósitos",
  "Select all objects": "Seleccionar todos los objetos",
  Select: "Seleccionar",
  Settings: "Configuración",
  Overview: "Resumen",
  Activity: "Actividad",
  "No matching results": "No hay resultados coincidentes",
  "Try a different search or clear the filters to see all items.":
    "Pruebe una búsqueda diferente o borre los filtros para ver todos los elementos.",
  "Clear filters": "Borrar filtros",
  "No users yet": "Aún no hay usuarios",
  "Users authenticate with an access key and secret key, and receive permissions through policies and groups.":
    "Los usuarios se autentican con una clave de acceso y una clave secreta, y reciben permisos a través de políticas y grupos.",
  "Create user": "Crear usuario",
  "No access keys yet": "Aún no hay claves de acceso",
  "Access keys let applications connect with the permissions of your account.":
    "Las claves de acceso permiten que las aplicaciones se conecten con los permisos de su cuenta.",
  "Access keys let applications connect with the permissions assigned to this user.":
    "Las claves de acceso permiten que las aplicaciones se conecten con los permisos asignados a este usuario.",
  "No groups assigned": "No hay grupos asignados",
  "Add this user to a group to share its access policies.":
    "Agregue este usuario a un grupo para compartir sus políticas de acceso.",
  "No policies assigned": "No hay políticas asignadas",
  "Policies define which actions and resources this user can access.":
    "Las políticas definen a qué acciones y recursos puede acceder este usuario.",
  "No members yet": "Aún no hay miembros",
  "Add users to this group so they inherit its policies.":
    "Agregue usuarios a este grupo para que hereden sus políticas.",
  "Policies attached to this group apply to all its members.":
    "Las políticas adjuntas a este grupo aplican a todos sus miembros.",
  "No encryption keys yet": "Aún no hay claves de cifrado",
  "Create a key to encrypt objects with the configured key management service.":
    "Cree una clave para cifrar objetos con el servicio de administración de claves configurado.",
  "No groups yet": "Aún no hay grupos",
  "Groups let users share the same access policies.":
    "Los grupos permiten a los usuarios compartir las mismas políticas de acceso.",
  "No event destinations yet": "Aún no hay destinos de eventos",
  "Connect an external service to receive bucket and object notifications.":
    "Conecte un servicio externo para recibir notificaciones de depósitos y objetos.",
  "No storage tiers yet": "Aún no hay niveles de almacenamiento",
  "Connect remote storage to transition objects using lifecycle rules.":
    "Conecte el almacenamiento remoto a objetos de transición mediante reglas de ciclo de vida.",
  "No event subscriptions yet": "Aún no hay suscripciones a eventos",
  "Subscribe this bucket to send object events to an event destination.":
    "Suscríbase a este depósito para enviar eventos de objetos a un destino de evento.",
  "No replication rules yet": "Aún no hay reglas de replicación",
  "Replicate objects from this bucket to a destination bucket.":
    "Replica objetos de este depósito a un depósito de destino.",
  "No lifecycle rules yet": "Aún no hay reglas de ciclo de vida",
  "Create rules to expire objects or transition them to remote storage.":
    "Cree reglas para caducar objetos o realizar su transición al almacenamiento remoto.",
  "No anonymous access rules": "Sin reglas de acceso anónimo",
  "This bucket has no prefix rules for access without credentials.":
    "Este depósito no tiene reglas de prefijo para el acceso sin credenciales.",
  "No policies grant access": "Ninguna política otorga acceso",
  "No listed policy currently grants access to this bucket.":
    "Actualmente, ninguna política enumerada otorga acceso a este depósito.",
  "No users have access": "Ningún usuario tiene acceso",
  "No listed user currently has a policy granting access to this bucket.":
    "Ningún usuario incluido actualmente tiene una política que otorgue acceso a este depósito.",
  "View Policies": "Ver políticas",
  "View Users": "Ver usuarios",
  "Unable to load replication sites":
    "No se pueden cargar sitios de replicación",
  "No replication sites yet": "Aún no hay sitios de replicación",
  "Refresh to try loading the configured sites again.":
    "Actualice para intentar cargar los sitios configurados nuevamente.",
  "Connect independent SILO sites to replicate their data and identity configuration.":
    "Conecta sitios SILO independientes para replicar sus datos y configuración de identidad.",
  "Waiting for logs": "Esperando registros",
  "Logs are not running": "Los registros no se están ejecutando",
  "New log entries will appear here as the server emits them.":
    "Las nuevas entradas de registro aparecerán aquí a medida que el servidor las emita.",
  "Choose the nodes and log types, then start logs to see server activity.":
    "Elija los nodos y los tipos de registro, luego inicie los registros para ver la actividad del servidor.",
  "Waiting for trace events": "Esperando eventos de seguimiento",
  "Trace is not running": "El seguimiento no se está ejecutando",
  "Requests matching the selected calls and filters will appear here.":
    "Las solicitudes que coincidan con las llamadas y filtros seleccionados aparecerán aquí.",
  "Choose the calls and filters, then start tracing to inspect live requests.":
    "Elija las llamadas y los filtros, luego comience a rastrear para inspeccionar las solicitudes en vivo.",
  "{count} node": "{count} nodo",
  "{count} nodes": {
    one: "{count} nodo",
    other: "{count} nodos",
    many: "{count} nodos",
  },
  "{count} drive": "{count} conducir",
  "{count} drives": {
    one: "{count} unidad",
    other: "{count} unidades",
    many: "{count} unidades",
  },
  "Quota: {quota}": "Cuota: {quota}",
  "Open bucket {name}": "Abrir bucket {name}",
  "Recent buckets": "Depósitos recientes",
  "Read and write": "Leer y escribir",
  "Read only": "Sólo lectura",
  "Write only": "Solo escribir",
  "Created {date}": "Creado {date}",
  "{count} objects": "{count} objetos",
  "Bucket actions": "Acciones del depósito",
  "Open menu": "Abrir menú",
  "Page actions": "Acciones de la página",
  "Selected actions": "Acciones seleccionadas",
  "Parent paths": "Rutas principales",
  "create Groups": "crear grupos",
  "view Group details": "ver detalles del grupo",
  "configure event destinations": "configurar destinos de eventos",
  "update Tier credentials": "actualizar credenciales de nivel",
  "delete Tiers": "eliminar niveles",
  "manage Access Keys": "administrar claves de acceso",
};

export default messages;
