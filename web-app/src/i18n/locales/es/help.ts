// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later
// AI-assisted translation; see ../../README.md for review and maintenance.

import type { Dictionary } from "../../catalog";

const messages: Dictionary = {
  "### Users\n\nA SILO user consists of a unique access key (username) and corresponding secret key (password). Clients must authenticate their identity by specifying both a valid access key (username) and the corresponding secret key (password) of an existing SILO user.\n\nGroups provide a simplified method for managing shared permissions among users with common access patterns and workloads.\n\nUsers inherit access permissions to data and resources through the groups they belong to.\n\nSILO uses Policy-Based Access Control (PBAC) to define the authorized actions and resources to which an authenticated user has access. Each policy describes one or more actions and conditions that outline the permissions of a user or group of users.\n\nEach user can access only those resources and operations which are explicitly granted by the built-in role. SILO denies access to any other resource or action by default.":
    "### Usuarios\n\nUn usuario SILO consta de una clave de acceso única (nombre de usuario) y la clave secreta correspondiente (contraseña). Los clientes deben autenticar su identidad especificando una clave de acceso válida (nombre de usuario) y la clave secreta correspondiente (contraseña) de un usuario SILO existente.\n\nLos grupos proporcionan un método simplificado para administrar permisos compartidos entre usuarios con patrones de acceso y cargas de trabajo comunes.\n\nLos usuarios heredan permisos de acceso a datos y recursos a través de los grupos a los que pertenecen.\n\nSILO utiliza control de acceso basado en políticas (PBAC) para definir las acciones y recursos autorizados a los que tiene acceso un usuario autenticado. Cada política describe una o más acciones y condiciones que describen los permisos de un usuario o grupo de usuarios.\n\nCada usuario puede acceder solo a aquellos recursos y operaciones que el rol integrado otorga explícitamente. SILO niega el acceso a cualquier otro recurso o acción de forma predeterminada.",
  "### IAM policies\n\nSILO uses Policy-Based Access Control (PBAC) to define the authorized actions and resources to which an authenticated user has access. Each policy describes one or more actions and conditions that outline the permissions of a user or group of users.\n\nSILO PBAC is built for compatibility with AWS IAM policy syntax, structure, and behavior. The SILO documentation makes a best-effort to cover IAM-specific behavior and functionality. Consider deferring to the IAM documentation for more complete documentation on AWS IAM-specific topics.":
    "### IAM políticas\n\nSILO utiliza control de acceso basado en políticas (PBAC) para definir las acciones y recursos autorizados a los que tiene acceso un usuario autenticado. Cada política describe una o más acciones y condiciones que describen los permisos de un usuario o grupo de usuarios.\n\nSILO PBAC está diseñado para ser compatible con la sintaxis, la estructura y el comportamiento de las políticas AWS IAM. La documentación de SILO hace todo lo posible para cubrir el comportamiento y la funcionalidad específicos de IAM-. Considere consultar la documentación IAM para obtener documentación más completa sobre AWS IAM-temas específicos.",
  "### Access keys\n\nSILO access keys are child identities of an authenticated SILO user, including externally managed identities. Each access key inherits its privileges based on the policies attached to it’s parent user or those groups in which the parent user has membership. Access Keys also support an optional inline policy which further restricts access to a subset of actions and resources available to the parent user.":
    "### Claves de acceso\n\nLas claves de acceso SILO son identidades secundarias de un usuario SILO autenticado, incluidas las identidades administradas externamente. Cada clave de acceso hereda sus privilegios según las políticas adjuntas a su usuario principal o a aquellos grupos a los que el usuario principal es miembro. Las claves de acceso también admiten una política en línea opcional que restringe aún más el acceso a un subconjunto de acciones y recursos disponibles para el usuario principal.",
  "### Event destinations\n\nSILO bucket notifications allow administrators to send notifications to supported external services on certain object or bucket events. SILO supports bucket and object-level S3 events similar to the Amazon S3 Event Notifications.":
    "### Destinos de eventos\n\nSILO Las notificaciones de depósito permiten a los administradores enviar notificaciones a servicios externos compatibles sobre ciertos objetos o eventos de depósito. SILO admite eventos S3 a nivel de depósito y de objeto similares a las notificaciones de eventos S3 de Amazon.",
  "### Inspect examples\n\nDownload object metadata or constituent parts from the drives as a ZIP archive. Enable **Encrypt** to protect the downloaded archive; save the decryption key when it is shown.\n\n- **Object metadata:** Volume/Bucket `test-bucket`, Path `test*/xl.meta`.\n- **Object parts:** Volume/Bucket `test-bucket`, Path `test*/*/part.*`.\n- **Recursive prefix:** Volume/Bucket `test-bucket`, Path `test/**`.\n\n**Caution:** Recursive inspection can be expensive. Limit the bucket and path before starting; use recursive patterns only when necessary.":
    "### Inspeccionar ejemplos\n\nDescargue metadatos de objetos o partes constituyentes de las unidades como un archivo ZIP. Habilite **Encriptar** para proteger el archivo descargado; guarde la clave de descifrado cuando se muestre.\n\n- **Metadatos del objeto:** Volumen/Depósito `test-bucket`, Ruta `test*/xl.meta`.\n- **Partes del objeto:** Volumen/Depósito `test-bucket`, Ruta `test*/*/part.*`.\n- **Prefijo recursivo:** Volumen/Depósito `test-bucket`, Ruta `test/**`.\n\n**Precaución:** La inspección recursiva puede resultar costosa. Limite el bucket y el camino antes de comenzar; Utilice patrones recursivos sólo cuando sea necesario.",
  Troubleshooting: "Solución de problemas",
  "Need more help?  Check out additional Troubleshooting options":
    "¿Necesitas más ayuda?  Consulte opciones adicionales de solución de problemas",
  "Identity and Access Management": "Gestión de identidad y acceso",
  "SILO uses Policy-Based Access Control (PBAC) to define the authorized actions and resources to which an authenticated user has access.":
    "SILO utiliza control de acceso basado en políticas (PBAC) para definir las acciones y recursos autorizados a los que tiene acceso un usuario autenticado.",
  "Policy based access control": "Control de acceso basado en políticas",
  "Learn how Policy-Based Access Control (PBAC)  is used to define the authorized actions and resources  to which an authenticated user has access":
    "Aprenda cómo se utiliza el control de acceso basado en políticas (PBAC) para definir las acciones y recursos autorizados a los que tiene acceso un usuario autenticado",
  "OpenID Connect Access Management": "OpenID Conectar Gestión de Acceso",
  "Learn more about connecting SILO to OpenID for access management.":
    "Obtenga más información sobre cómo conectar SILO a OpenID para administrar el acceso.",
  "MinIO Identity and Access Management: Part 1 - Overview And Modification of Built In Policies":
    "MinIO Gestión de acceso e identidad: Parte 1: descripción general y modificación de las políticas integradas",
  "This video introduces MinIO IAM policies, including an overview of the built-in policies, and how to create and remove a policy.":
    "Este video presenta las políticas MinIO IAM, incluida una descripción general de las políticas integradas y cómo crear y eliminar una política.",
  "MinIO Identity and Access Management: Part 4 - Lab - Setting Up Users, Groups, and Policies":
    "MinIO Gestión de acceso e identidad: Parte 4 - Práctica de laboratorio - Configuración de usuarios, grupos y políticas",
  "This Lab video demonstrates setting up identity and access management based Users, Groups and Policies. ":
    "Este vídeo de laboratorio muestra la configuración de usuarios, grupos y políticas basados en la gestión de identidad y acceso.",
  "MinIO Identity and Access Management: Part 5 - Lab - Creating A Custom Policy":
    "MinIO Gestión de acceso e identidad: Parte 5 - Laboratorio - Creación de una política personalizada",
  "This Lab video demonstrates creating custom IAM policies.":
    "Este vídeo de laboratorio muestra la creación de políticas IAM personalizadas.",
  "MinIO Identity and Access Management: Part 6 - Lab - Interfacing With OpenID and LDAP":
    "MinIO Gestión de identidad y acceso: Parte 6 - Laboratorio - Interfaz con OpenID y LDAP",
  "This Lab video demonstrates interfacing with OpenID and LDAP. ":
    "Este video de laboratorio demuestra la interfaz con OpenID y LDAP.",
  "# Bucket \n A bucket is similar to a folder or directory in a filesystem, where each bucket can hold an arbitrary number of objects.":
    "# Bucket \n Un depósito es similar a una carpeta o directorio en un sistema de archivos, donde cada depósito puede contener una cantidad arbitraria de objetos.",
  "Bucket Versioning": "Control de versiones del depósito",
  "SILO supports keeping multiple “versions” of an object in a single bucket. SILO versioning protects from unintended overwrites and deletions while providing support for “undoing” a write operation.":
    'SILO admite mantener múltiples "versiones" de un objeto en un solo depósito. SILO el control de versiones protege contra sobrescrituras y eliminaciones no deseadas y, al mismo tiempo, brinda soporte para "deshacer" una operación de escritura.',
  Buckets: "Buckets",
  "Learn about using Console to create and manage Buckets with SILO":
    "Aprenda a usar la Consola para crear y administrar depósitos con SILO",
  "Creating Buckets and Users through the MinIO Console":
    "Creación de depósitos y usuarios a través de la consola MinIO",
  "Learn how to manage your storage buckets and objects with a hands-on introduction to the MinIO Console and SDKs.":
    "Aprenda a administrar sus depósitos y objetos de almacenamiento con una introducción práctica a la consola MinIO y los SDK.",
  "Console Introduction - Add a Bucket and a User":
    "Introducción a la consola: agregar un depósito y un usuario",
  "This session shows how to create AWS S3 buckets and users with MinIO Console.":
    "Esta sesión muestra cómo crear AWS S3 depósitos y usuarios con MinIO Consola.",
  "Object Locking and Retention": "Bloqueo y retención de objetos",
  "In this video we talk about object retention, WORM (Write Once Read Many), as well as duration based and legal holds.":
    "En este video hablamos sobre la retención de objetos, WORM (Escribir una vez, leer muchas), así como sobre las retenciones legales y basadas en la duración.",
  "Object Locking and Retention Lab":
    "Laboratorio de bloqueo y retención de objetos",
  "This lab demonstrates creation and removal of both bucket and object specific retention, compliance, and legal holds. ":
    "Esta práctica de laboratorio demuestra la creación y eliminación de retenciones legales, cumplimiento y retención específicos de objetos y depósitos.",
  "Versioning and Lifecycle Management": "Gestión de versiones y ciclo de vida",
  "In this video, we will focus on versioning and lifecycle management.":
    "En este vídeo, nos centraremos en el control de versiones y la gestión del ciclo de vida.",
  Versioning: "Control de versiones",
  "Learn how Versioning gives access to the full history of an object from its creation through each update.":
    "Aprenda cómo el control de versiones brinda acceso al historial completo de un objeto desde su creación hasta cada actualización.",
  "Learn how versioning protects your data from unintended overwrites and deletions":
    "Descubra cómo el control de versiones protege sus datos contra sobrescrituras y eliminaciones no deseadas.",
  "Learn how to create and manage Buckets":
    "Aprenda a crear y administrar depósitos",
  "In this video, we will focus on versioning  and lifecycle management.":
    "En este vídeo, nos centraremos en el control de versiones y la gestión del ciclo de vida.",
  "Policy Document Structure": "Estructura del documento de política",
  "SILO policy documents use the same schema as AWS IAM Policy documents. See policy templates and allowed S3 Policy actions and condition keys in our docs.":
    "SILO los documentos de política utilizan el mismo esquema que AWS IAM los documentos de política. Consulte las plantillas de políticas y las S3 acciones de política y claves de condición permitidas en nuestros documentos.",
  "Access Keys": "Claves de acceso",
  "Access Keys support providing applications authentication credentials which inherit permissions from the “parent” user.":
    'Las claves de acceso admiten el suministro de credenciales de autenticación de aplicaciones que heredan permisos del usuario "principal".',
  "Policy Variables": "Variables de política",
  "SILO supports using policy variables for automatically substituting context from the authenticated user and/or the operation into the user’s assigned policy or policies.":
    "SILO admite el uso de variables de política para sustituir automáticamente el contexto del usuario autenticado y/o la operación en la política o políticas asignadas al usuario.",
  "Admin Policy Action Keys": "Claves de acción de la política administrativa",
  "See actions supported in defining policies for SILO admin operations. These actions are only valid for SILO deployments and are not intended for use with other S3-compatible services.":
    "Vea las acciones admitidas en la definición de políticas para las operaciones de administración de SILO. Estas acciones solo son válidas para implementaciones de SILO y no están diseñadas para usarse con otros servicios compatibles con S3.",
  "Admin Policy Condition Keys":
    "Claves de condición de política de administración",
  "See which conditions SILO supports for use with defining policies for admin actions.":
    "Vea qué condiciones admite SILO para su uso al definir políticas para acciones administrativas.",
  "Supported S3 Policy Condition Keys":
    "Compatible S3 Claves de condición de política",
  "SILO policy documents support IAM conditional statements.":
    "SILO los documentos de política respaldan IAM declaraciones condicionales.",
  "Supported S3 Policy Actions": "Apoyado S3 Acciones de política",
  "SILO policy documents support a subset of IAM S3 Action keys.":
    "SILO los documentos de política admiten un subconjunto de IAM S3 claves de acción.",
  "MinIO Identity and Access Management: Part 2 - Using IDP to Manage Users And Groups":
    "MinIO Gestión de identidades y accesos: Parte 2: uso de IDP para gestionar usuarios y grupos",
  "This video discusses Users and Groups, and how policies can be applied to them to enable specific permissions.":
    "Este video analiza Usuarios y Grupos, y cómo se les pueden aplicar políticas para habilitar permisos específicos.",
  "SILO versioning protects from unintended overwrites and deletions while providing support for “undoing” a write operation.":
    "SILO El control de versiones protege contra sobrescrituras y eliminaciones no deseadas y, al mismo tiempo, brinda soporte para “deshacer” una operación de escritura.",
  "Lifecycle Management II - Versioning and Lifecycle Management":
    "Gestión del ciclo de vida II - Control de versiones y gestión del ciclo de vida",
  "Creating a New Bucket in a Specific Region":
    "Creación de un nuevo depósito en una región específica",
  "A Bucket can be created in a specified region":
    "Se puede crear un depósito en una región específica",
  "What are Settings and Configurations?":
    "¿Qué son los ajustes y configuraciones?",
  "These configuration settings define runtime  behavior of the SILO server process,  comparable to the mc admin config command":
    "Estos ajustes definen el comportamiento del proceso servidor SILO en ejecución, de forma similar al comando mc admin config.",
  "MinIO Feature Overview: Active-Active Replication":
    "MinIO Descripción general de funciones: replicación activo-activo",
  "Learn about MinIO's object replication capabilities and how MinIO provides resilience to common storage disruption scenarios.":
    "Obtenga información sobre las capacidades de replicación de objetos de MinIO y cómo MinIO proporciona resistencia a escenarios comunes de interrupción del almacenamiento.",
  "How is failed replication handled?":
    "¿Cómo se maneja la replicación fallida?",
  "SILO queues failed replication operations and retries those operations until replication succeeds.":
    "SILO pone en cola las operaciones de replicación fallidas y vuelve a intentar esas operaciones hasta que la replicación se realice correctamente.",
  "What are Replication Workers?": "¿Qué son los trabajadores de replicación?",
  "SILO uses a replication queuing system with multiple concurrent replication workers operating on that queue.":
    "SILO utiliza un sistema de colas de replicación con múltiples trabajadores de replicación simultáneos operando en esa cola.",
  "These configuration settings define runtime behavior of the SILO server process,  comparable to the mc admin config command":
    "Estos ajustes definen el comportamiento del proceso servidor SILO en ejecución, de forma similar al comando mc admin config.",
  "Where can I see current Heal status?":
    "¿Dónde puedo ver el estado de curación actual?",
  "Check under Monitoring/Drives on the left hand  menu to see Drive and Bucket Healing status":
    "Verifique en Monitoreo/Drives en el menú de la izquierda para ver el estado de recuperación de Drive y Bucket.",
  "How is Erasure Coding used to Protect Data?":
    "¿Cómo se utiliza la codificación de borrado para proteger los datos?",
  "SILO erasure coding is a data redundancy and  availability feature that allows SILO deployments to  automatically reconstruct objects on-the-fly despite  the loss of multiple drives or nodes in the cluster.":
    "SILO la codificación de borrado es una característica de disponibilidad y redundancia de datos que permite a las implementaciones SILO reconstruir automáticamente objetos sobre la marcha a pesar de la pérdida de múltiples unidades o nodos en el clúster.",
  "Recover After Hardware failure":
    "Recuperarse después de una falla de hardware",
  "Depending on the deployment topology and  selected erasure code parity, SILO can tolerate loss  of up to half the drives or nodes in the deployment  while maintaining read access to objects.":
    "Dependiendo de la topología de implementación y la paridad del código de borrado seleccionada, SILO puede tolerar la pérdida de hasta la mitad de las unidades o nodos en la implementación mientras mantiene el acceso de lectura a los objetos.",
  "Site Failure Recovery": "Recuperación de fallas del sitio",
  "SILO can make the loss of an entire site, while  significant, a relatively minor incident. Site recovery depends on the replication option you use for the site.":
    "SILO puede hacer que la pérdida de un sitio completo, aunque sea significativa, sea un incidente relativamente menor. La recuperación del sitio depende de la opción de replicación que utilice para el sitio.",
  "Node Failure Recovery": "Recuperación de fallo de nodo",
  "If a SILO node suffers complete hardware failure, the node begins healing operations once it rejoins the  deployment.":
    "Si un nodo SILO sufre una falla completa de hardware, el nodo comienza las operaciones de reparación una vez que se reincorpora a la implementación.",
  "What is SILO Healing?": "¿Qué es la SILO Curación?",
  "Healing is SILO’s ability to restore data after some event causes data loss. Data loss can come from bit rot, drive loss, or node loss.":
    "La curación es la capacidad de SILO de restaurar datos después de que algún evento provoque la pérdida de datos. La pérdida de datos puede deberse a deterioro de bits, pérdida de unidad o pérdida de nodos.",
  "Understand SILO Healing Using mc": "Entender SILO Curación usando mc",
  "The mc admin heal command scans for objects that are damaged or corrupted and heals those objects.":
    "El comando mc admin heal busca objetos dañados o corruptos y los repara.",
  "What is Bit Rot?": "¿Qué es Bit Rot?",
  "Bit rot is data corruption that occurs without the user’s knowledge. SILO combats bit rot with hashing and erasure coding.":
    "Bit rot es una corrupción de datos que ocurre sin el conocimiento del usuario. SILO combate la descomposición de bits con codificación hash y borrado.",
  "These configuration settings define runtime behavior of the SILO server process, comparable to the mc admin config command":
    "Estos ajustes definen el comportamiento del proceso servidor SILO en ejecución, de forma similar al comando mc admin config.",
  "Overview of MinIO Erasure Coding":
    "Descripción general de MinIO Codificación de borrado",
  "Through this MinIO video you will learn about MinIO erasure coding, including erasure sets, erasure parity, and stripe size. You will also learn about how the Reed-Solomon algorithm can be optimized for storage efficiency (yielding cost savings) or data lost protection (number of servers and drives that can fail). The video also walks through the MinIO Erasure Code calculator, considerations for cluster design and the command line syntax needed to establish an erasure code deployment. ":
    "A través de este video MinIO aprenderá sobre la codificación de borrado MinIO, incluidos los conjuntos de borrado, la paridad de borrado y el tamaño de franja. También aprenderá cómo se puede optimizar el algoritmo Reed-Solomon para lograr eficiencia de almacenamiento (lo que genera ahorros de costos) o protección de pérdida de datos (cantidad de servidores y unidades que pueden fallar). El video también explica la calculadora de código de borrado MinIO, las consideraciones para el diseño del clúster y la sintaxis de la línea de comando necesaria para establecer una implementación de código de borrado.",
  "Object Scanner": "Escáner de objetos",
  "Learn more about how the scanner checks Objects for transition and expiry based on lifecycle rules":
    "Obtenga más información sobre cómo el escáner verifica la transición y el vencimiento de los objetos según las reglas del ciclo de vida.",
  "What is the Scanner?": "¿Qué es el Escáner?",
  "One of several low-priority processes SILO runs to check lifecycle management rules, bucket or site replication status, as well as object bit rot and healing":
    "Uno de varios procesos de baja prioridad SILO se ejecuta para verificar las reglas de administración del ciclo de vida, el estado de replicación del depósito o del sitio, así como la descomposición y curación de los bits del objeto.",
  "Lifecycle Management Object Scanner Considerations":
    "Consideraciones sobre el escáner de objetos de gestión del ciclo de vida",
  "SILO uses a scanner process to check objects against all configured lifecycle management rules. High IO workloads or limited system resources may delay application of lifecycle management rules":
    "SILO utiliza un proceso de escáner para verificar los objetos con todas las reglas de administración del ciclo de vida configuradas. Las cargas de trabajo elevadas IO o los recursos limitados del sistema pueden retrasar la aplicación de las reglas de gestión del ciclo de vida",
  "Lifecycle Management Lab": "Laboratorio de gestión del ciclo de vida",
  "Use the MinIO client to demonstrate expiration rules, the scanner, and transitioning objects to remote tiers.":
    "Utilice el cliente MinIO para demostrar las reglas de caducidad, el escáner y la transición de objetos a niveles remotos.",
  "What is etcd?": "¿Qué es etcd?",
  "etcd is a strongly consistent, distributed key-value  store that provides a reliable way to store data that  needs to be accessed by a distributed system or  cluster of machines.":
    "etcd es un almacén de valores clave distribuido y fuertemente consistente que proporciona una forma confiable de almacenar datos a los que debe acceder un sistema distribuido o un grupo de máquinas.",
  "What is the logger_webhook Environment Variable?":
    "¿Qué es la variable de entorno logger_webhook?",
  "The top-level configuration key for defining an  HTTP webhook target for publishing SILO logs.":
    "La clave de configuración de nivel superior para definir un destino de webhook HTTP para publicar registros SILO.",
  "Publish Server Logs to HTTP Webhook":
    "Publicar registros del servidor en HTTP Webhook",
  "You can configure a new HTTP webhook endpoint  to which SILO publishes SILO server logs using  either environment variables or by setting  runtime configuration settings.":
    "Puede configurar un nuevo HTTP punto final de webhook en el que SILO publica SILO registros del servidor utilizando variables de entorno o estableciendo ajustes de configuración de tiempo de ejecución.",
  "Monitoring Logs": "Registros de monitoreo",
  "SILO supports publishing server logs  and audit logs to an HTTP webhook.":
    "SILO admite la publicación de registros del servidor y registros de auditoría en un webhook HTTP.",
  "Monitoring with Prometheus": "Monitoreo con Prometheus",
  "Learn about the monitoring features available  in your MinIO Console and how to export to  Prometheus and get information back so you can  view it in detail.":
    "Conozca las funciones de monitoreo disponibles en su consola MinIO y cómo exportar a Prometheus y obtener información para que pueda verla en detalle.",
  "Prometheus Monitoring Lab": "Prometheus Laboratorio de Monitoreo",
  "Learn how to set up Prometheus and connect it  back to your MinIO cluster so that you can get  detailed history of what's going on in your MinIO  cluster at any given time.":
    "Aprenda cómo configurar Prometheus y conectarlo nuevamente a su clúster MinIO para que pueda obtener un historial detallado de lo que sucede en su clúster MinIO en cualquier momento.",
  "Publish Audit Logs to an HTTP webhook":
    "Publicar registros de auditoría en un webhook HTTP",
  "You can configure a new HTTP webhook endpoint  to which SILO publishes audit logs using either  environment variables or by setting runtime  configuration settings":
    "Puede configurar un nuevo punto final de webhook HTTP en el que SILO publica registros de auditoría utilizando variables de entorno o estableciendo ajustes de configuración de tiempo de ejecución.",
  "Publish Audit Logs to an External Service":
    "Publicar registros de auditoría en un servicio externo",
  "Audit logs are granular descriptions of each operation  on the SILO deployment supporting security  standards and regulations which require  detailed tracking of operations.":
    "Los registros de auditoría son descripciones granulares de cada operación en el despliegue SILO que respaldan los estándares y regulaciones de seguridad que requieren un seguimiento detallado de las operaciones.",
  "Publish Events to Kafka": "Publicar eventos en Kafka",
  "SILO supports publishing bucket notification events to a Kafka service endpoint.":
    "SILO admite la publicación de eventos de notificación de depósitos en un punto final de servicio Kafka.",
  "Kafka Service for Bucket Notifications":
    "Kafka Servicio para notificaciones de depósitos",
  "Learn about environment variables for configuring a Kafka service as a target for Bucket Nofitications.":
    "Obtenga información sobre las variables de entorno para configurar un servicio Kafka como destino para notificaciones de depósitos.",
  "Kafka Service Configuration Settings":
    "Kafka Ajustes de configuración del servicio",
  "Supported Bucket Notification Targets":
    "Objetivos de notificación de depósitos admitidos",
  "Learn which notification targets are supported by SILO.":
    "Descubra qué objetivos de notificación son compatibles con SILO.",
  "Bucket Notifications": "Notificaciones de depósito",
  "SILO bucket notifications allow administrators to send notifications to supported external services on certain object or bucket events.":
    "SILO Las notificaciones de depósito permiten a los administradores enviar notificaciones a servicios externos compatibles sobre ciertos objetos o eventos de depósito.",
  "Need more help? Check out additional Troubleshooting options":
    "¿Necesitas más ayuda? Consulte opciones adicionales de solución de problemas",
  "Site Replication Prerequisite": "Requisito previo de replicación del sitio",
  "Check that your setup meets the requirements to deploy Site Replication":
    "Verifique que su configuración cumpla con los requisitos para implementar la replicación del sitio",
  "Site replication configures multiple independent SILO deployments as a cluster of replicas called peer sites.":
    "La replicación de sitios configura múltiples implementaciones SILO independientes como un grupo de réplicas llamado sitios pares.",
  "Site Replication Overview":
    "Descripción general de la replicación del sitio",
  "See what changes are and are NOT replicated between peer sites":
    "Consulte qué cambios se replican entre sitios pares y cuáles no",
  "Site Replication Tutorial": "Tutorial de replicación de sitios",
  "Learn how to set up site replication using Console and the SILO client (mc)":
    "Aprenda cómo configurar la replicación de sitios usando la Consola y el cliente SILO (mc)",
  "Transition from SILO to Azure": "Transición de SILO a Azure",
  "See the procedure to create a new object lifecycle management rule that transition objects from a SILO bucket to a remote storage tier on the Azure storage backend.":
    "Consulte el procedimiento para crear una nueva regla de administración del ciclo de vida de objetos que realice la transición de objetos de un depósito SILO a un nivel de almacenamiento remoto en el backend de almacenamiento de Azure.",
  "Transition from SILO to GCS": "Transición de SILO a GCS",
  "See the procedure to create a new object lifecycle management rule that transitions objects from a SILO bucket to a remote storage tier on the Google Cloud Storage backend.":
    "Consulte el procedimiento para crear una nueva regla de administración del ciclo de vida de objetos que transfiera objetos de un depósito SILO a un nivel de almacenamiento remoto en el backend de Google Cloud Storage.",
  "Transition from SILO to S3": "Transición de SILO a S3",
  "See the procedure to create a new object lifecycle management rule that transitions objects from a SILO bucket to a remote storage tier on the Amazon Web Services S3 storage backend or an S3-compatible service.":
    "Consulte el procedimiento para crear una nueva regla de administración del ciclo de vida de objetos que transfiera objetos de un depósito SILO a un nivel de almacenamiento remoto en el backend de almacenamiento S3 de Amazon Web Services o un servicio compatible con S3.",
  "Transition to Remote SILO Deployment":
    "Transición a implementación remota SILO",
  "See the procedure to create a new object lifecycle management rule that transitions objects from a bucket on a primary SILO deployment to a bucket on a remote SILO deployment. ":
    "Consulte el procedimiento para crear una nueva regla de administración del ciclo de vida de objetos que transfiera objetos de un depósito en una implementación SILO principal a un depósito en una implementación SILO remota.",
  "Object Lifecycle Management": "Gestión del ciclo de vida de objetos",
  "Use SILO Object Lifecycle Management to create rules for time or date based automatic transition or expiry of objects.":
    "Utilice SILO Gestión del ciclo de vida de objetos para crear reglas para la transición o caducidad automática de objetos basada en hora o fecha.",
  "MinIO Feature Overview: Object Lifecycle Management":
    "MinIO Descripción general de funciones: gestión del ciclo de vida de objetos",
  "Learn about MinIO's object lifecycle management capabilities.":
    "Obtenga información sobre las capacidades de gestión del ciclo de vida de los objetos de MinIO.",
  "Lifecycle Management I - Tiers": "Gestión del ciclo de vida I - Niveles",
  "In this video we will cover expiration and transition of objects to an alternate tier of storage.":
    "En este video cubriremos la caducidad y la transición de objetos a un nivel alternativo de almacenamiento.",
  Tiers: "Niveles de almacenamiento",
  "See the procedure to create a new object lifecycle management rule that transitions objects from a SILO bucket to a remote storage tier on the Azure storage backend.":
    "Consulte el procedimiento para crear una nueva regla de administración del ciclo de vida de objetos que transfiera objetos de un depósito SILO a un nivel de almacenamiento remoto en el backend de almacenamiento de Azure.",
  "Console Metrics Dashboard": "Panel de métricas de la consola",
  "The SILO Console provides a point-in-time metrics dashboard by default, and also supports displaying time-series and historical data by querying a Prometheus service configured to scrape data from the SILO deployment.":
    "La consola SILO proporciona un panel de métricas de un punto en el tiempo de forma predeterminada y también admite la visualización de series temporales y datos históricos consultando un servicio Prometheus configurado para extraer datos de la implementación SILO.",
  "Available Metrics": "Métricas disponibles",
  "Learn about the different Prometheus metrics published by SILO server":
    "Conoce las diferentes métricas Prometheus publicadas por el servidor SILO",
  "Metrics and Alerts": "Métricas y Alertas",
  "For historical metrics and analytics, SILO publishes cluster and node metrics using the Prometheus Data Model.":
    "Para análisis y métricas históricas, SILO publica métricas de clústeres y nodos utilizando el modelo de datos Prometheus.",
  "Learn about the monitoring features available  in your MinIO Console.":
    "Conozca las funciones de monitoreo disponibles en su Consola MinIO.",
  "User Management": "Gestión de usuarios",
  "Each user can have one or more assigned policies that explicitly list the actions and resources to which that user has access. Users can also inherit policies from the groups in which they have membership.":
    "Cada usuario puede tener una o más políticas asignadas que enumeran explícitamente las acciones y recursos a los que ese usuario tiene acceso. Los usuarios también pueden heredar políticas de los grupos a los que son miembros.",
  "Group Management": "Gestión de grupos",
  "A group is a collection of users. Each group can have one or more assigned policies that explicitly list the actions and resources to which group members are allowed or denied access.":
    "Un grupo es una colección de usuarios. Cada grupo puede tener una o más políticas asignadas que enumeran explícitamente las acciones y recursos a los que se permite o deniega el acceso a los miembros del grupo.",
  "MinIO Identity and Access Management: Part 3 - Interfacing with OpenID and LDAP":
    "MinIO Gestión de identidad y acceso: Parte 3 - Interfaz con OpenID y LDAP",
  "This video is focused on interfacing with OpenID and LDAP to manage access to MinIO.":
    "Este vídeo se centra en la interfaz con OpenID y LDAP para gestionar el acceso a MinIO.",
  "MinIO Authentication and Authorization Using OpenID and Keycloak":
    "MinIO Autenticación y autorización mediante OpenID y Keycloak",
  "In this video you will learn how to set up an OpenID service, Keycloak, to provide authentication and authorization as part of a MinIO deployment.":
    "En este vídeo aprenderá cómo configurar un servicio OpenID, Keycloak, para proporcionar autenticación y autorización como parte de una implementación MinIO.",
  "Drive Healing": "Impulsar la curación",
  "The Drives section displays the healing status for a bucket.":
    "La sección Unidades muestra el estado de curación de un depósito.",
  "Erasure Coding": "Codificación de borrado",
  "SILO Erasure Coding is a data redundancy and availability feature that allows SILO deployments to automatically reconstruct objects on-the-fly despite the loss of multiple drives or nodes in the cluster.":
    "SILO Erasure Coding es una característica de disponibilidad y redundancia de datos que permite a las implementaciones SILO reconstruir automáticamente objetos sobre la marcha a pesar de la pérdida de múltiples unidades o nodos en el clúster.",
  "Site Healing": "Curación del sitio",
  "Any SILO deployment in the site replication configuration can resynchronize damaged replica-eligible data from the peer with the most updated (“latest”) version of that data.":
    "Cualquier implementación SILO en la configuración de replicación del sitio puede resincronizar los datos elegibles para la réplica dañados del par con la versión más actualizada (“más reciente”) de esos datos.",
  Healing: "Curación",
  "SILO Automatically Heals Corrupt or Missing Data On-the-fly":
    "SILO Repara automáticamente datos corruptos o faltantes sobre la marcha",
  "In this video, we will provide an overview of site-wide replication.":
    "En este video, brindaremos una descripción general de la replicación en todo el sitio.",
  Health: "Estado de salud",
  "The health section provides an interface for running a health diagnostic for the SILO Deployment. The report is generated on the deployment and downloaded directly to your browser.":
    "La sección de salud proporciona una interfaz para ejecutar un diagnóstico de salud para la implementación SILO. El informe se genera durante la implementación y se descarga directamente a su navegador.",
  "IDP Docs": "IDP Documentos",
  "SILO supports multiple external identity managers through OpenID Connect-Compatible Active Directory / LDAP":
    "SILO admite múltiples administradores de identidad externos a través de OpenID Active Directory compatible con Connect/LDAP",
  "Built-in SILO IDP": "Incorporado SILO IDP",
  "SILO includes a built-in IDentity Provider (IDP) that provides core identity management functionality.":
    "SILO incluye un proveedor de identidad integrado (IDP) que proporciona una funcionalidad básica de administración de identidad.",
  "Active Directory / LDAP Access Management":
    "Directorio Activo / LDAP Gestión de Acceso",
  "For identities managed by the external AD/LDAP provider, SILO uses the user’s Distinguished Name and attempts to map it against an existing policy.":
    "Para identidades administradas por el proveedor externo AD/LDAP, SILO utiliza el nombre distinguido del usuario e intenta asignarlo a una política existente.",
  "Keycloak configuration": "Keycloak configuración",
  "You can configure SILO to use Keycloak as an external IDentity Provider (IDP) for authentication of users via the OpenID Connect (OIDC) protocol.":
    "Puede configurar SILO para usar Keycloak como proveedor de identidad externo (IDP) para la autenticación de usuarios a través del protocolo OpenID Connect (OIDC).",
  "LDAP Configuration": "LDAP Configuración",
  "SILO supports configuring a single Active Directory / LDAP Connect for external management of user identities.":
    "SILO admite la configuración de un único Active Directory / LDAP Connect para la gestión externa de las identidades de los usuarios.",
  "OIDC Configuration": "OIDC Configuración",
  "SILO supports using an OpenID Connect (OIDC) compatible IDentity Provider (IDP) such as Okta, KeyCloak, Dex, Google, or Facebook for external management of user identities.":
    "SILO admite el uso de un proveedor de identidad compatible con OpenID Connect (OIDC) (IDP) como Okta, KeyCloak, Dex, Google o Facebook para la gestión externa de las identidades de los usuarios.",
  "KMS overview": "KMS descripción general",
  "MinIO's cryptographic expert shares why MinIO built KES, what it is used for and how it fits into the MinIO architecture.":
    "El experto en criptografía de MinIO comparte por qué MinIO construyó KES, para qué se utiliza y cómo encaja en la arquitectura MinIO.",
  "Learn about key management using KMS.":
    "Aprenda sobre la administración de claves usando KMS.",
  "Text snippet that will be relevant to the user will  go here  made to look nice in the helpitem size  on two-three lines":
    "El fragmento de texto que será relevante para el usuario irá aquí y se verá bien en el tamaño del elemento de ayuda en dos o tres líneas.",
  "Error logs can be filtered by node and log type, as well as search for specific text in the logs.":
    "Los registros de errores se pueden filtrar por nodo y tipo de registro, así como buscar texto específico en los registros.",
  "Audit Logs": "Registros de auditoría",
  "You can configure an HTTP webhook endpoint to which SILO publishes audit logs using either environment variables or by setting runtime configuration settings.":
    "Puede configurar un punto final de webhook HTTP en el que SILO publica registros de auditoría utilizando variables de entorno o estableciendo ajustes de configuración de tiempo de ejecución.",
  "Object Lambda": "Objeto Lambda",
  "SILO’s Object Lambda enables developers to programmatically transform objects on demand.":
    "SILO Object Lambda permite a los desarrolladores transformar objetos mediante programación bajo demanda.",
  "MinIO Event Notifications - Overview":
    "MinIO Notificaciones de eventos: descripción general",
  "Use the Event framework to see what's going on in the system using Bucket, Object, Replication and ILM events.":
    "Utilice el marco de eventos para ver qué sucede en el sistema mediante los eventos Bucket, Object, Replication y ILM.",
  "Managing Event Notifications Using MinIO MC Commands":
    "Administrar notificaciones de eventos usando los comandos MinIO MC",
  "This video provides an overview of the types of event notifications and how to set them up using MinIO's mc commands.":
    "Este video proporciona una descripción general de los tipos de notificaciones de eventos y cómo configurarlas usando los comandos mc de MinIO.",
  "MinIO Events Notifications - Setting Up Webhooks Using Python":
    "MinIO Notificaciones de eventos: configuración de webhooks con Python",
  "This video provides an overview of how to use Python and Flask to set up a Webhook on MinIO. ":
    "Este video proporciona una descripción general de cómo usar Python y Flask para configurar un Webhook en MinIO.",
  "MinIO Event Notifications - Using The MinIO Python SDK to Write Custom Webhooks":
    "MinIO Notificaciones de eventos: uso de MinIO Python SDK para escribir webhooks personalizados",
  "This video dives deeper into using the MinIO Python SDK to setup and manage notifications.":
    "Este video profundiza en el uso de MinIO Python SDK para configurar y administrar notificaciones.",
  "Object Management": "Gestión de objetos",
  "Learn about Objects and how  SILO allows you to manage them":
    "Aprende sobre los Objetos y cómo SILO te permite gestionarlos",
  "Managing Objects with the Object Browser":
    "Administrar objetos con el Explorador de objetos",
  "Learn how to use the Console Object Browser  to manage your Objects":
    "Aprenda a utilizar el Explorador de objetos de la consola para administrar sus objetos",
  "Manipulating Objects": "Manipulación de objetos",
  "A demo of Prefixes & Objects with examples of copying and deleting an object, as well as CopySource Object.":
    "Una demostración de prefijos y objetos con ejemplos de cómo copiar y eliminar un objeto, así como el objeto CopySource.",
  "Example Policy - Bucket Resource Access":
    "Ejemplo de política: acceso a recursos del depósito",
  "An example policy demonstrating authorization  limited to a named bucket":
    "Una política de ejemplo que demuestra la autorización limitada a un depósito con nombre",
  Performance: "Rendimiento",
  "The performance section provides an interface for running a performance test of the deployment.":
    "La sección de rendimiento proporciona una interfaz para ejecutar una prueba de rendimiento de la implementación.",
  Profile: "Perfil",
  "The profile section provides an interface for running system profiling of the deployment. The results can provide insight into the SILO server process running on a given node.":
    "La sección de perfil proporciona una interfaz para ejecutar la creación de perfiles del sistema de la implementación. Los resultados pueden proporcionar información sobre el proceso del servidor SILO que se ejecuta en un nodo determinado.",
  Inspect: "Inspeccionar",
  "The inspect section provides an interface for capturing the erasure-coded metadata associated to an object or objects.":
    "La sección de inspección proporciona una interfaz para capturar los metadatos codificados para borrar asociados a un objeto u objetos.",
  "Encrypt Inspect Output": "Cifrar la salida de inspección",
  "You can encrypt the output of the mc support inspect command for enhanced security when transferring the files off the deployment.":
    "Puede cifrar la salida de mc support inspect para aumentar la seguridad al transferir archivos fuera del despliegue.",
  "What is Trace?": "¿Qué es Trace?",
  "The trace section provides HTTP trace functionality for a bucket or buckets on the deployment.":
    "La sección de seguimiento proporciona la funcionalidad de seguimiento HTTP para uno o más depósitos en la implementación.",
  Users: "Usuarios",
  "What is Watch?": "¿Qué es Watch?",
  "The Watch section displays S3 events as they occur on the selected bucket.":
    "La sección Vigilar muestra S3 eventos a medida que ocurren en el depósito seleccionado.",
  "Access Managemnt": "Gestión de acceso",
  "Object Locking": "Bloqueo de objetos",
  "SILO Object Locking (“Object Retention”) enforces Write-Once Read-Many (WORM) immutability to protect versioned objects from deletion.":
    "SILO El bloqueo de objetos (“Retención de objetos”) aplica la inmutabilidad de escritura única y lectura múltiple (WORM) para proteger los objetos versionados contra la eliminación.",
  Encryption: "Cifrado",
  "SILO Server-Side Encryption (SSE) protects objects as part of write operations, allowing clients to take advantage of server processing power to secure objects at the storage layer (encryption-at-rest).":
    "SILO El cifrado del lado del servidor (SSE) protege los objetos como parte de las operaciones de escritura, lo que permite a los clientes aprovechar la potencia de procesamiento del servidor para proteger los objetos en la capa de almacenamiento (cifrado en reposo).",
  "Learn how to use Console to manage Buckets":
    "Aprenda a usar la consola para administrar depósitos",
  "Bucket Replication": "Replicación de depósito",
  "SILO server-side bucket replication is an automatic bucket-level configuration that synchronizes objects between a source and destination bucket.":
    "SILO La replicación de depósitos del lado del servidor es una configuración automática a nivel de depósito que sincroniza objetos entre un depósito de origen y un destino.",
  "This video gives an overview of how to set up and use object versioning as part of a data lifecycle management strategy.":
    "Este vídeo ofrece una descripción general de cómo configurar y utilizar el control de versiones de objetos como parte de una estrategia de gestión del ciclo de vida de los datos.",
  "Versioning Lab": "Laboratorio de versiones",
  "This demo will take you through the steps to manage versioned objects using the MinIO command line tools.":
    "Esta demostración lo guiará a través de los pasos para administrar objetos versionados usando las herramientas de línea de comandos MinIO.",
  "Bucket Replication Requirements": "Requisitos de replicación del depósito",
  "Check here to ensure you meet the prerequisites before setting up any replication configurations.":
    "Marque aquí para asegurarse de cumplir con los requisitos previos antes de establecer cualquier configuración de replicación.",
  "Bucket Replication Overview":
    "Descripción general de la replicación del depósito",
  "In this video, we will cover bucket level replication, both active-passive and active-active.":
    "En este video, cubriremos la replicación a nivel de depósito, tanto activo-pasivo como activo-activo.",
  "Replication Lab I": "Laboratorio de Replicación I",
  "Demonstrates bucket replication concepts using MinIO Client, including active-passive and active-active replication.":
    "Demuestra conceptos de replicación de depósitos utilizando MinIO Cliente, incluida la replicación activo-pasivo y activo-activo.",
  "Replication Lab II": "Laboratorio de replicación II",
  "Demonstrates site replication concepts using MinIO Client, including active-passive and active-active replication.":
    "Demuestra conceptos de replicación de sitios usando MinIO Client, incluida la replicación activo-pasiva y activo-activo.",
  "Access Management": "Gestión de acceso",
  "Logging in": "Iniciar sesión",
  "Sign in with the root credentials, an IAM user access key, or temporary STS credentials via Other Authentication Methods.":
    "Inicie sesión con las credenciales raíz, una clave de acceso de usuario IAM o credenciales STS temporales a través de Otros métodos de autenticación.",
  "Console configuration": "Configuración de la consola",
  "Configure identity providers, TLS, and session settings for the console on the server side.":
    "Configure los proveedores de identidad, TLS y los ajustes de sesión para la consola en el lado del servidor.",
  "Replication Internals": "Internos de replicación",
  "Learn details of the SILO replication process.":
    "Conozca los detalles del proceso de replicación SILO.",
  "One-way Bucket Replication": "Replicación de depósito unidireccional",
  "Guidance on configuring one-way Bucket replication using SILO Console.":
    "Orientación sobre cómo configurar la replicación de depósitos unidireccionales mediante la consola SILO.",
  "Two-way Bucket Replication": "Replicación de depósito bidireccional",
  "Guidance on configuring two-way (active-active) Bucket replication using SILO Console.":
    "Orientación sobre cómo configurar la replicación de depósitos bidireccional (activo-activo) mediante la consola SILO.",
};

export default messages;
