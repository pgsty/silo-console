// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later
// AI-assisted translation; see ../../README.md for review and maintenance.

import type { Dictionary } from "../../catalog";

const messages: Dictionary = {
  "### Users\n\nA SILO user consists of a unique access key (username) and corresponding secret key (password). Clients must authenticate their identity by specifying both a valid access key (username) and the corresponding secret key (password) of an existing SILO user.\n\nGroups provide a simplified method for managing shared permissions among users with common access patterns and workloads.\n\nUsers inherit access permissions to data and resources through the groups they belong to.\n\nSILO uses Policy-Based Access Control (PBAC) to define the authorized actions and resources to which an authenticated user has access. Each policy describes one or more actions and conditions that outline the permissions of a user or group of users.\n\nEach user can access only those resources and operations which are explicitly granted by the built-in role. SILO denies access to any other resource or action by default.":
    "### Utilisateurs\n\nUn utilisateur SILO se compose d'une clé d'accès unique (nom d'utilisateur) et d'une clé secrète correspondante (mot de passe). Les clients doivent authentifier leur identité en spécifiant à la fois une clé d'accès valide (nom d'utilisateur) et la clé secrète correspondante (mot de passe) d'un SILO utilisateur existant.\n\nLes groupes fournissent une méthode simplifiée pour gérer les autorisations partagées entre les utilisateurs ayant des modèles d'accès et des charges de travail communs.\n\nLes utilisateurs héritent des autorisations d'accès aux données et aux ressources via les groupes auxquels ils appartiennent.\n\nSILO utilise le contrôle d'accès basé sur des politiques (PBAC) pour définir les actions et ressources autorisées auxquelles un utilisateur authentifié a accès. Chaque politique décrit une ou plusieurs actions et conditions qui décrivent les autorisations d'un utilisateur ou d'un groupe d'utilisateurs.\n\nChaque utilisateur ne peut accéder qu'aux ressources et opérations explicitement accordées par le rôle intégré. SILO refuse l'accès à toute autre ressource ou action par défaut.",
  "### IAM policies\n\nSILO uses Policy-Based Access Control (PBAC) to define the authorized actions and resources to which an authenticated user has access. Each policy describes one or more actions and conditions that outline the permissions of a user or group of users.\n\nSILO PBAC is built for compatibility with AWS IAM policy syntax, structure, and behavior. The SILO documentation makes a best-effort to cover IAM-specific behavior and functionality. Consider deferring to the IAM documentation for more complete documentation on AWS IAM-specific topics.":
    "### Politiques IAM\n\nSILO utilise le contrôle d’accès basé sur les politiques (PBAC) pour définir les actions et ressources autorisées auxquelles un utilisateur authentifié a accès. Chaque politique décrit une ou plusieurs actions et conditions définissant les privilèges d’un utilisateur ou d’un groupe d’utilisateurs.\n\nLe PBAC de SILO est conçu pour être compatible avec la syntaxe, la structure et le comportement des politiques AWS IAM. La documentation SILO s’efforce de couvrir au mieux les comportements et fonctionnalités propres à IAM. Consultez la documentation IAM pour des informations complètes sur les sujets propres à AWS IAM.",
  "### Access keys\n\nSILO access keys are child identities of an authenticated SILO user, including externally managed identities. Each access key inherits its privileges based on the policies attached to it’s parent user or those groups in which the parent user has membership. Access Keys also support an optional inline policy which further restricts access to a subset of actions and resources available to the parent user.":
    "### Clés d'accès\n\nLes clés d'accès SILO sont des identités enfants d'un utilisateur SILO authentifié, y compris les identités gérées en externe. Chaque clé d'accès hérite de ses privilèges en fonction des politiques attachées à son utilisateur parent ou aux groupes dont l'utilisateur parent est membre. Les clés d'accès prennent également en charge une politique en ligne facultative qui restreint davantage l'accès à un sous-ensemble d'actions et de ressources disponibles pour l'utilisateur parent.",
  "### Event destinations\n\nSILO bucket notifications allow administrators to send notifications to supported external services on certain object or bucket events. SILO supports bucket and object-level S3 events similar to the Amazon S3 Event Notifications.":
    "### Destinations de l'événement\n\nSILO Les notifications de bucket permettent aux administrateurs d'envoyer des notifications aux services externes pris en charge sur certains événements d'objet ou de bucket. SILO prend en charge les événements S3 au niveau du bucket et de l'objet similaires aux notifications d'événements Amazon S3.",
  "### Inspect examples\n\nDownload object metadata or constituent parts from the drives as a ZIP archive. Enable **Encrypt** to protect the downloaded archive; save the decryption key when it is shown.\n\n- **Object metadata:** Volume/Bucket `test-bucket`, Path `test*/xl.meta`.\n- **Object parts:** Volume/Bucket `test-bucket`, Path `test*/*/part.*`.\n- **Recursive prefix:** Volume/Bucket `test-bucket`, Path `test/**`.\n\n**Caution:** Recursive inspection can be expensive. Limit the bucket and path before starting; use recursive patterns only when necessary.":
    "### Exemples d’inspection\n\nTéléchargez les métadonnées d’un objet ou ses parties constitutives depuis les disques sous forme d’archive ZIP. Activez **Chiffrer** pour protéger l’archive téléchargée ; conservez la clé de déchiffrement lorsqu’elle s’affiche.\n\n- **Métadonnées d’objet :** volume/bucket `test-bucket`, chemin `test*/xl.meta`.\n- **Parties d’objet :** volume/bucket `test-bucket`, chemin `test*/*/part.*`.\n- **Préfixe récursif :** volume/bucket `test-bucket`, chemin `test/**`.\n\n**Attention :** une inspection récursive peut être coûteuse. Limitez le bucket et le chemin avant de commencer, et n’utilisez les motifs récursifs qu’en cas de besoin.",
  Troubleshooting: "Dépannage",
  "Need more help?  Check out additional Troubleshooting options":
    "Besoin d'aide supplémentaire ?  Découvrez les options de dépannage supplémentaires",
  "Identity and Access Management": "Gestion des identités et des accès",
  "SILO uses Policy-Based Access Control (PBAC) to define the authorized actions and resources to which an authenticated user has access.":
    "SILO utilise le contrôle d'accès basé sur des politiques (PBAC) pour définir les actions et ressources autorisées auxquelles un utilisateur authentifié a accès.",
  "Policy based access control": "Contrôle d'accès basé sur des règles",
  "Learn how Policy-Based Access Control (PBAC)  is used to define the authorized actions and resources  to which an authenticated user has access":
    "Découvrez comment le contrôle d'accès basé sur des politiques (PBAC) est utilisé pour définir les actions et ressources autorisées auxquelles un utilisateur authentifié a accès",
  "OpenID Connect Access Management": "Gestion des accès avec OpenID Connect",
  "Learn more about connecting SILO to OpenID for access management.":
    "En savoir plus sur la connexion de SILO à OpenID pour la gestion des accès.",
  "MinIO Identity and Access Management: Part 1 - Overview And Modification of Built In Policies":
    "MinIO Gestion des identités et des accès : Partie 1 - Présentation et modification des politiques intégrées",
  "This video introduces MinIO IAM policies, including an overview of the built-in policies, and how to create and remove a policy.":
    "Cette vidéo présente les politiques MinIO IAM, y compris un aperçu des politiques intégrées et comment créer et supprimer une politique.",
  "MinIO Identity and Access Management: Part 4 - Lab - Setting Up Users, Groups, and Policies":
    "MinIO Gestion des identités et des accès : Partie 4 – Laboratoire – Configuration des utilisateurs, des groupes et des politiques",
  "This Lab video demonstrates setting up identity and access management based Users, Groups and Policies. ":
    "Cette vidéo de laboratoire montre la configuration des utilisateurs, des groupes et des politiques basés sur la gestion des identités et des accès.",
  "MinIO Identity and Access Management: Part 5 - Lab - Creating A Custom Policy":
    "MinIO Gestion des identités et des accès : Partie 5 - Laboratoire - Création d'une politique personnalisée",
  "This Lab video demonstrates creating custom IAM policies.":
    "Cette vidéo de laboratoire montre la création de politiques IAM personnalisées.",
  "MinIO Identity and Access Management: Part 6 - Lab - Interfacing With OpenID and LDAP":
    "MinIO Gestion des identités et des accès : Partie 6 - Laboratoire - Interfaçage avec OpenID et LDAP",
  "This Lab video demonstrates interfacing with OpenID and LDAP. ":
    "Cette vidéo de laboratoire montre l'interfaçage avec OpenID et LDAP.",
  "# Bucket \n A bucket is similar to a folder or directory in a filesystem, where each bucket can hold an arbitrary number of objects.":
    "# Bucket \n Un bucket est similaire à un dossier ou un répertoire dans un système de fichiers, où chaque bucket peut contenir un nombre arbitraire d'objets.",
  "Bucket Versioning": "Gestion des versions du bucket",
  "SILO supports keeping multiple “versions” of an object in a single bucket. SILO versioning protects from unintended overwrites and deletions while providing support for “undoing” a write operation.":
    "SILO prend en charge la conservation de plusieurs « versions » d'un objet dans un seul bucket. SILO La gestion des versions protège contre les écrasements et les suppressions involontaires tout en prenant en charge « l'annulation » d'une opération d'écriture.",
  Buckets: "Buckets",
  "Learn about using Console to create and manage Buckets with SILO":
    "Découvrez comment utiliser la console pour créer et gérer des buckets avec SILO",
  "Creating Buckets and Users through the MinIO Console":
    "Création de buckets et d'utilisateurs via la console MinIO",
  "Learn how to manage your storage buckets and objects with a hands-on introduction to the MinIO Console and SDKs.":
    "Apprenez à gérer vos buckets et objets de stockage avec une introduction pratique à la console MinIO et aux SDK.",
  "Console Introduction - Add a Bucket and a User":
    "Introduction à la console - Ajouter un bucket et un utilisateur",
  "This session shows how to create AWS S3 buckets and users with MinIO Console.":
    "Cette session montre comment créer des buckets et des utilisateurs AWS S3 avec la console MinIO.",
  "Object Locking and Retention": "Verrouillage et rétention d'objets",
  "In this video we talk about object retention, WORM (Write Once Read Many), as well as duration based and legal holds.":
    "Dans cette vidéo, nous parlons de la rétention d'objet, WORM (Write Once Read Many), ainsi que des conservations légales et basées sur la durée.",
  "Object Locking and Retention Lab":
    "Laboratoire de verrouillage et de rétention d'objets",
  "This lab demonstrates creation and removal of both bucket and object specific retention, compliance, and legal holds. ":
    "Cet atelier démontre la création et la suppression de conservations, de conformité et de conservations légales spécifiques aux buckets et aux objets.",
  "Versioning and Lifecycle Management":
    "Gestion des versions et du cycle de vie",
  "In this video, we will focus on versioning and lifecycle management.":
    "Dans cette vidéo, nous nous concentrerons sur le versioning et la gestion du cycle de vie.",
  Versioning: "Gestion des versions",
  "Learn how Versioning gives access to the full history of an object from its creation through each update.":
    "Découvrez comment le Versioning donne accès à l'historique complet d'un objet depuis sa création jusqu'à chaque mise à jour.",
  "Learn how versioning protects your data from unintended overwrites and deletions":
    "Découvrez comment le contrôle de version protège vos données contre les écrasements et les suppressions involontaires",
  "Learn how to create and manage Buckets":
    "Apprenez à créer et gérer des buckets",
  "In this video, we will focus on versioning  and lifecycle management.":
    "Dans cette vidéo, nous nous concentrerons sur le versioning et la gestion du cycle de vie.",
  "Policy Document Structure": "Structure des documents de politique",
  "SILO policy documents use the same schema as AWS IAM Policy documents. See policy templates and allowed S3 Policy actions and condition keys in our docs.":
    "Les documents de politique SILO utilisent le même schéma que ceux d’AWS IAM. Consultez dans notre documentation les modèles de politique ainsi que les actions et clés de condition S3 autorisées.",
  "Access Keys": "Clés d’accès",
  "Access Keys support providing applications authentication credentials which inherit permissions from the “parent” user.":
    "Les clés d'accès prennent en charge la fourniture d'informations d'authentification d'application qui héritent des autorisations de l'utilisateur « parent ».",
  "Policy Variables": "Variables de politique",
  "SILO supports using policy variables for automatically substituting context from the authenticated user and/or the operation into the user’s assigned policy or policies.":
    "SILO prend en charge l'utilisation de variables de politique pour remplacer automatiquement le contexte de l'utilisateur authentifié et/ou l'opération dans la ou les politiques attribuées à l'utilisateur.",
  "Admin Policy Action Keys": "Clés d’action des politiques d’administration",
  "See actions supported in defining policies for SILO admin operations. These actions are only valid for SILO deployments and are not intended for use with other S3-compatible services.":
    "Voir les actions prises en charge dans la définition des politiques pour les opérations d'administration SILO. Ces actions ne sont valables que pour les déploiements SILO et ne sont pas destinées à être utilisées avec d'autres services compatibles S3.",
  "Admin Policy Condition Keys":
    "Clés de condition de la politique d'administration",
  "See which conditions SILO supports for use with defining policies for admin actions.":
    "Découvrez quelles conditions SILO prennent en charge pour une utilisation avec la définition de politiques pour les actions d'administration.",
  "Supported S3 Policy Condition Keys":
    "Clés de condition de politique S3 prises en charge",
  "SILO policy documents support IAM conditional statements.":
    "SILO les documents de politique prennent en charge les instructions conditionnelles IAM.",
  "Supported S3 Policy Actions": "Actions de politique S3 prises en charge",
  "SILO policy documents support a subset of IAM S3 Action keys.":
    "Les documents de politique SILO prennent en charge un sous-ensemble de clés d’action IAM S3.",
  "MinIO Identity and Access Management: Part 2 - Using IDP to Manage Users And Groups":
    "MinIO Gestion des identités et des accès : Partie 2 - Utilisation de IDP pour gérer les utilisateurs et les groupes",
  "This video discusses Users and Groups, and how policies can be applied to them to enable specific permissions.":
    "Cette vidéo traite des utilisateurs et des groupes et de la manière dont des politiques peuvent leur être appliquées pour activer des autorisations spécifiques.",
  "SILO versioning protects from unintended overwrites and deletions while providing support for “undoing” a write operation.":
    "SILO la gestion des versions protège contre les écrasements et les suppressions involontaires tout en prenant en charge « l'annulation » d'une opération d'écriture.",
  "Lifecycle Management II - Versioning and Lifecycle Management":
    "Gestion du cycle de vie II - Gestion des versions et du cycle de vie",
  "Creating a New Bucket in a Specific Region":
    "Création d'un nouveau bucket dans une région spécifique",
  "A Bucket can be created in a specified region":
    "Un Bucket peut être créé dans une région spécifiée",
  "What are Settings and Configurations?":
    "Que sont les paramètres et configurations ?",
  "These configuration settings define runtime  behavior of the SILO server process,  comparable to the mc admin config command":
    "Ces paramètres définissent le comportement du processus serveur SILO à l’exécution, comme la commande mc admin config.",
  "MinIO Feature Overview: Active-Active Replication":
    "MinIO Présentation des fonctionnalités : réplication active-active",
  "Learn about MinIO's object replication capabilities and how MinIO provides resilience to common storage disruption scenarios.":
    "Découvrez les capacités de réplication d'objets de MinIO et comment MinIO offre une résilience aux scénarios courants de perturbation du stockage.",
  "How is failed replication handled?":
    "Comment les échecs de réplication sont-ils gérés ?",
  "SILO queues failed replication operations and retries those operations until replication succeeds.":
    "SILO met en file d'attente les opérations de réplication ayant échoué et réessaye ces opérations jusqu'à ce que la réplication réussisse.",
  "What are Replication Workers?": "Que sont les Replication Workers ?",
  "SILO uses a replication queuing system with multiple concurrent replication workers operating on that queue.":
    "SILO utilise un système de file d'attente de réplication avec plusieurs agents de réplication simultanés fonctionnant sur cette file d'attente.",
  "These configuration settings define runtime behavior of the SILO server process,  comparable to the mc admin config command":
    "Ces paramètres définissent le comportement du processus serveur SILO à l’exécution, comme la commande mc admin config.",
  "Where can I see current Heal status?":
    "Où puis-je voir l’état actuel de la réparation ?",
  "Check under Monitoring/Drives on the left hand  menu to see Drive and Bucket Healing status":
    "Consultez Surveillance/Disques dans le menu de gauche pour voir l’état de réparation des disques et des buckets.",
  "How is Erasure Coding used to Protect Data?":
    "Comment le codage d'effacement est-il utilisé pour protéger les données ?",
  "SILO erasure coding is a data redundancy and  availability feature that allows SILO deployments to  automatically reconstruct objects on-the-fly despite  the loss of multiple drives or nodes in the cluster.":
    "SILO le codage d'effacement est une fonctionnalité de redondance et de disponibilité des données qui permet aux déploiements SILO de reconstruire automatiquement des objets à la volée malgré la perte de plusieurs disques ou nœuds dans le cluster.",
  "Recover After Hardware failure": "Récupération après une panne matérielle",
  "Depending on the deployment topology and  selected erasure code parity, SILO can tolerate loss  of up to half the drives or nodes in the deployment  while maintaining read access to objects.":
    "En fonction de la topologie de déploiement et de la parité du code d'effacement sélectionnée, SILO peut tolérer la perte jusqu'à la moitié des disques ou nœuds du déploiement tout en conservant l'accès en lecture aux objets.",
  "Site Failure Recovery": "Récupération en cas de panne de site",
  "SILO can make the loss of an entire site, while  significant, a relatively minor incident. Site recovery depends on the replication option you use for the site.":
    "SILO peut faire de la perte d'un site entier, bien qu'importante, un incident relativement mineur. La récupération du site dépend de l'option de réplication que vous utilisez pour le site.",
  "Node Failure Recovery": "Récupération en cas de panne de nœud",
  "If a SILO node suffers complete hardware failure, the node begins healing operations once it rejoins the  deployment.":
    "Si un nœud SILO subit une panne matérielle complète, il lance les opérations de réparation dès qu’il rejoint le déploiement.",
  "What is SILO Healing?": "Qu’est-ce que la réparation SILO ?",
  "Healing is SILO’s ability to restore data after some event causes data loss. Data loss can come from bit rot, drive loss, or node loss.":
    "La réparation est la capacité de SILO à restaurer les données après une perte causée par le bit rot, la perte d’un disque ou la perte d’un nœud.",
  "Understand SILO Healing Using mc": "Comprendre la réparation SILO avec mc",
  "The mc admin heal command scans for objects that are damaged or corrupted and heals those objects.":
    "La commande mc admin heal recherche les objets endommagés ou corrompus et les répare.",
  "What is Bit Rot?": "Qu'est-ce que Bit Rot ?",
  "Bit rot is data corruption that occurs without the user’s knowledge. SILO combats bit rot with hashing and erasure coding.":
    "La pourriture des bits est une corruption de données qui se produit à l'insu de l'utilisateur. SILO combat la pourriture des bits grâce au hachage et au codage d'effacement.",
  "These configuration settings define runtime behavior of the SILO server process, comparable to the mc admin config command":
    "Ces paramètres définissent le comportement du processus serveur SILO à l’exécution, comme la commande mc admin config.",
  "Overview of MinIO Erasure Coding":
    "Présentation du codage d'effacement MinIO",
  "Through this MinIO video you will learn about MinIO erasure coding, including erasure sets, erasure parity, and stripe size. You will also learn about how the Reed-Solomon algorithm can be optimized for storage efficiency (yielding cost savings) or data lost protection (number of servers and drives that can fail). The video also walks through the MinIO Erasure Code calculator, considerations for cluster design and the command line syntax needed to establish an erasure code deployment. ":
    "Grâce à cette vidéo MinIO, vous découvrirez le codage d'effacement MinIO, y compris les jeux d'effacement, la parité d'effacement et la taille des bandes. Vous découvrirez également comment l'algorithme de Reed-Solomon peut être optimisé pour l'efficacité du stockage (générant des économies) ou la protection contre la perte de données (nombre de serveurs et de disques susceptibles de tomber en panne). La vidéo présente également le calculateur de code d'effacement MinIO, les considérations relatives à la conception du cluster et la syntaxe de ligne de commande nécessaire pour établir un déploiement de code d'effacement.",
  "Object Scanner": "Scanner d'objets",
  "Learn more about how the scanner checks Objects for transition and expiry based on lifecycle rules":
    "En savoir plus sur la façon dont l'analyseur vérifie la transition et l'expiration des objets en fonction des règles de cycle de vie",
  "What is the Scanner?": "Qu'est-ce que le scanner ?",
  "One of several low-priority processes SILO runs to check lifecycle management rules, bucket or site replication status, as well as object bit rot and healing":
    "L’un des processus de basse priorité exécutés par SILO pour vérifier les règles de cycle de vie, l’état de réplication des buckets ou des sites, ainsi que le bit rot et la réparation des objets.",
  "Lifecycle Management Object Scanner Considerations":
    "Considérations relatives au scanner d'objets de gestion du cycle de vie",
  "SILO uses a scanner process to check objects against all configured lifecycle management rules. High IO workloads or limited system resources may delay application of lifecycle management rules":
    "SILO utilise un processus d'analyse pour vérifier les objets par rapport à toutes les règles de gestion du cycle de vie configurées. Des charges de travail IO élevées ou des ressources système limitées peuvent retarder l'application des règles de gestion du cycle de vie",
  "Lifecycle Management Lab": "Laboratoire de gestion du cycle de vie",
  "Use the MinIO client to demonstrate expiration rules, the scanner, and transitioning objects to remote tiers.":
    "Utilisez le client MinIO pour démontrer les règles d'expiration, le scanner et la transition des objets vers des niveaux distants.",
  "What is etcd?": "Qu'est-ce que etcd ?",
  "etcd is a strongly consistent, distributed key-value  store that provides a reliable way to store data that  needs to be accessed by a distributed system or  cluster of machines.":
    "etcd est un magasin clé-valeur distribué et fortement cohérent qui fournit un moyen fiable de stocker les données auxquelles un système distribué ou un cluster de machines doit accéder.",
  "What is the logger_webhook Environment Variable?":
    "Qu'est-ce que la variable d'environnement logger_webhook ?",
  "The top-level configuration key for defining an  HTTP webhook target for publishing SILO logs.":
    "La clé de configuration de niveau supérieur pour définir une cible de webhook HTTP pour la publication des journaux SILO.",
  "Publish Server Logs to HTTP Webhook":
    "Publier les journaux du serveur sur HTTP Webhook",
  "You can configure a new HTTP webhook endpoint  to which SILO publishes SILO server logs using  either environment variables or by setting  runtime configuration settings.":
    "Vous pouvez configurer un nouveau point de terminaison de webhook HTTP sur lequel SILO publie SILO les journaux du serveur à l'aide de variables d'environnement ou en définissant les paramètres de configuration d'exécution.",
  "Monitoring Logs": "Journaux de surveillance",
  "SILO supports publishing server logs  and audit logs to an HTTP webhook.":
    "SILO prend en charge la publication des journaux du serveur et des journaux d'audit sur un webhook HTTP.",
  "Monitoring with Prometheus": "Surveillance avec Prometheus",
  "Learn about the monitoring features available  in your MinIO Console and how to export to  Prometheus and get information back so you can  view it in detail.":
    "Découvrez les fonctionnalités de surveillance disponibles dans votre console MinIO et comment exporter vers Prometheus et récupérer des informations afin de pouvoir les visualiser en détail.",
  "Prometheus Monitoring Lab": "Prometheus Laboratoire de surveillance",
  "Learn how to set up Prometheus and connect it  back to your MinIO cluster so that you can get  detailed history of what's going on in your MinIO  cluster at any given time.":
    "Apprenez à configurer Prometheus et à le reconnecter à votre cluster MinIO afin de pouvoir obtenir un historique détaillé de ce qui se passe dans votre cluster MinIO à tout moment.",
  "Publish Audit Logs to an HTTP webhook":
    "Publier les journaux d'audit sur un webhook HTTP",
  "You can configure a new HTTP webhook endpoint  to which SILO publishes audit logs using either  environment variables or by setting runtime  configuration settings":
    "Vous pouvez configurer un nouveau point de terminaison de webhook HTTP sur lequel SILO publie les journaux d'audit à l'aide de variables d'environnement ou en définissant les paramètres de configuration d'exécution.",
  "Publish Audit Logs to an External Service":
    "Publier les journaux d'audit sur un service externe",
  "Audit logs are granular descriptions of each operation  on the SILO deployment supporting security  standards and regulations which require  detailed tracking of operations.":
    "Les journaux d'audit sont des descriptions granulaires de chaque opération sur le déploiement SILO prenant en charge les normes et réglementations de sécurité qui nécessitent un suivi détaillé des opérations.",
  "Publish Events to Kafka": "Publier les événements sur Kafka",
  "SILO supports publishing bucket notification events to a Kafka service endpoint.":
    "SILO prend en charge la publication des événements de notification de bucket sur un point de terminaison de service Kafka.",
  "Kafka Service for Bucket Notifications":
    "Kafka Service pour les notifications de bucket",
  "Learn about environment variables for configuring a Kafka service as a target for Bucket Nofitications.":
    "Découvrez les variables d'environnement pour configurer un service Kafka comme cible pour les notifications de bucket.",
  "Kafka Service Configuration Settings":
    "Kafka Paramètres de configuration du service",
  "Supported Bucket Notification Targets":
    "Cibles de notification de bucket prises en charge",
  "Learn which notification targets are supported by SILO.":
    "Découvrez quelles cibles de notification sont prises en charge par SILO.",
  "Bucket Notifications": "Notifications de bucket",
  "SILO bucket notifications allow administrators to send notifications to supported external services on certain object or bucket events.":
    "SILO Les notifications de bucket permettent aux administrateurs d'envoyer des notifications aux services externes pris en charge sur certains événements d'objet ou de bucket.",
  "Need more help? Check out additional Troubleshooting options":
    "Besoin d'aide supplémentaire ? Découvrez les options de dépannage supplémentaires",
  "Site Replication Prerequisite":
    "Condition préalable à la réplication du site",
  "Check that your setup meets the requirements to deploy Site Replication":
    "Vérifiez que votre configuration répond aux exigences pour déployer la réplication de site",
  "Site replication configures multiple independent SILO deployments as a cluster of replicas called peer sites.":
    "La réplication de site configure plusieurs déploiements SILO indépendants en tant que cluster de répliques appelés sites homologues.",
  "Site Replication Overview": "Présentation de la réplication de sites",
  "See what changes are and are NOT replicated between peer sites":
    "Découvrez quels changements sont ou NE sont PAS répliqués entre les sites pairs",
  "Site Replication Tutorial": "Tutoriel de réplication de sites",
  "Learn how to set up site replication using Console and the SILO client (mc)":
    "Apprenez à configurer la réplication de site à l'aide de la console et du client SILO (mc)",
  "Transition from SILO to Azure": "Transition de SILO vers Azure",
  "See the procedure to create a new object lifecycle management rule that transition objects from a SILO bucket to a remote storage tier on the Azure storage backend.":
    "Consultez la procédure pour créer une nouvelle règle de gestion du cycle de vie des objets qui fait la transition des objets d'un bucket SILO vers un niveau de stockage distant sur le backend de stockage Azure.",
  "Transition from SILO to GCS": "Transition du SILO au GCS",
  "See the procedure to create a new object lifecycle management rule that transitions objects from a SILO bucket to a remote storage tier on the Google Cloud Storage backend.":
    "Consultez la procédure pour créer une nouvelle règle de gestion du cycle de vie des objets qui fait la transition des objets d'un bucket SILO vers un niveau de stockage distant sur le backend de Google Cloud Storage.",
  "Transition from SILO to S3": "Transition de SILO à S3",
  "See the procedure to create a new object lifecycle management rule that transitions objects from a SILO bucket to a remote storage tier on the Amazon Web Services S3 storage backend or an S3-compatible service.":
    "Consultez la procédure pour créer une nouvelle règle de gestion du cycle de vie des objets qui fait la transition des objets d'un bucket SILO vers un niveau de stockage distant sur le backend de stockage Amazon Web Services S3 ou un service compatible S3.",
  "Transition to Remote SILO Deployment":
    "Transition vers le déploiement à distance SILO",
  "See the procedure to create a new object lifecycle management rule that transitions objects from a bucket on a primary SILO deployment to a bucket on a remote SILO deployment. ":
    "Consultez la procédure pour créer une nouvelle règle de gestion du cycle de vie des objets qui fait la transition des objets d'un bucket sur un déploiement SILO principal vers un bucket sur un déploiement SILO distant.",
  "Object Lifecycle Management": "Gestion du cycle de vie des objets",
  "Use SILO Object Lifecycle Management to create rules for time or date based automatic transition or expiry of objects.":
    "Utilisez SILO Gestion du cycle de vie des objets pour créer des règles pour la transition ou l'expiration automatique des objets en fonction de l'heure ou de la date.",
  "MinIO Feature Overview: Object Lifecycle Management":
    "MinIO Présentation des fonctionnalités : gestion du cycle de vie des objets",
  "Learn about MinIO's object lifecycle management capabilities.":
    "Découvrez les capacités de gestion du cycle de vie des objets de MinIO.",
  "Lifecycle Management I - Tiers": "Gestion du cycle de vie I - Niveaux",
  "In this video we will cover expiration and transition of objects to an alternate tier of storage.":
    "Dans cette vidéo, nous couvrirons l'expiration et la transition des objets vers un autre niveau de stockage.",
  Tiers: "Tiers",
  "See the procedure to create a new object lifecycle management rule that transitions objects from a SILO bucket to a remote storage tier on the Azure storage backend.":
    "Consultez la procédure pour créer une nouvelle règle de gestion du cycle de vie des objets qui fait la transition des objets d'un bucket SILO vers un niveau de stockage distant sur le backend de stockage Azure.",
  "Console Metrics Dashboard": "Tableau de bord des métriques de la console",
  "The SILO Console provides a point-in-time metrics dashboard by default, and also supports displaying time-series and historical data by querying a Prometheus service configured to scrape data from the SILO deployment.":
    "La console SILO fournit par défaut un tableau de bord de métriques ponctuelles et prend également en charge l'affichage de séries chronologiques et de données historiques en interrogeant un service Prometheus configuré pour extraire les données du déploiement SILO.",
  "Available Metrics": "Métriques disponibles",
  "Learn about the different Prometheus metrics published by SILO server":
    "Découvrez les différentes métriques Prometheus publiées par le serveur SILO",
  "Metrics and Alerts": "Métriques et alertes",
  "For historical metrics and analytics, SILO publishes cluster and node metrics using the Prometheus Data Model.":
    "Pour les métriques et analyses historiques, SILO publie les métriques de cluster et de nœud à l'aide du modèle de données Prometheus.",
  "Learn about the monitoring features available  in your MinIO Console.":
    "Découvrez les fonctionnalités de surveillance disponibles dans votre console MinIO.",
  "User Management": "Gestion des utilisateurs",
  "Each user can have one or more assigned policies that explicitly list the actions and resources to which that user has access. Users can also inherit policies from the groups in which they have membership.":
    "Chaque utilisateur peut se voir attribuer une ou plusieurs politiques qui répertorient explicitement les actions et les ressources auxquelles cet utilisateur a accès. Les utilisateurs peuvent également hériter des politiques des groupes dont ils sont membres.",
  "Group Management": "Gestion du groupe",
  "A group is a collection of users. Each group can have one or more assigned policies that explicitly list the actions and resources to which group members are allowed or denied access.":
    "Un groupe est un ensemble d'utilisateurs. Chaque groupe peut se voir attribuer une ou plusieurs politiques qui répertorient explicitement les actions et les ressources auxquelles les membres du groupe sont autorisés ou refusés à accéder.",
  "MinIO Identity and Access Management: Part 3 - Interfacing with OpenID and LDAP":
    "MinIO Gestion des identités et des accès : Partie 3 - Interfaçage avec OpenID et LDAP",
  "This video is focused on interfacing with OpenID and LDAP to manage access to MinIO.":
    "Cette vidéo se concentre sur l'interface avec OpenID et LDAP pour gérer l'accès à MinIO.",
  "MinIO Authentication and Authorization Using OpenID and Keycloak":
    "MinIO Authentification et autorisation à l'aide de OpenID et Keycloak",
  "In this video you will learn how to set up an OpenID service, Keycloak, to provide authentication and authorization as part of a MinIO deployment.":
    "Dans cette vidéo, vous apprendrez comment configurer un service OpenID, Keycloak, pour fournir une authentification et une autorisation dans le cadre d'un déploiement MinIO.",
  "Drive Healing": "Réparation des disques",
  "The Drives section displays the healing status for a bucket.":
    "La section Disques affiche l’état de réparation d’un bucket.",
  "Erasure Coding": "Codage d'effacement",
  "SILO Erasure Coding is a data redundancy and availability feature that allows SILO deployments to automatically reconstruct objects on-the-fly despite the loss of multiple drives or nodes in the cluster.":
    "SILO Erasure Coding est une fonctionnalité de redondance et de disponibilité des données qui permet aux déploiements SILO de reconstruire automatiquement des objets à la volée malgré la perte de plusieurs disques ou nœuds dans le cluster.",
  "Site Healing": "Réparation de site",
  "Any SILO deployment in the site replication configuration can resynchronize damaged replica-eligible data from the peer with the most updated (“latest”) version of that data.":
    "Tout déploiement SILO dans la configuration de réplication de site peut resynchroniser les données endommagées éligibles à la réplique du homologue avec la version la plus mise à jour (« la plus récente ») de ces données.",
  Healing: "Réparation",
  "SILO Automatically Heals Corrupt or Missing Data On-the-fly":
    "SILO Répare automatiquement les données corrompues ou manquantes à la volée",
  "In this video, we will provide an overview of site-wide replication.":
    "Dans cette vidéo, nous fournirons un aperçu de la réplication à l'échelle du site.",
  Health: "Santé",
  "The health section provides an interface for running a health diagnostic for the SILO Deployment. The report is generated on the deployment and downloaded directly to your browser.":
    "La section santé fournit une interface permettant d'exécuter un diagnostic de santé pour le déploiement SILO. Le rapport est généré sur le déploiement et téléchargé directement sur votre navigateur.",
  "IDP Docs": "Documentation IDP",
  "SILO supports multiple external identity managers through OpenID Connect-Compatible Active Directory / LDAP":
    "Vous pouvez configurer SILO pour fournir la gestion des identités et des accès via OpenID Connect et Active Directory / LDAP.",
  "Built-in SILO IDP": "IDP SILO intégré",
  "SILO includes a built-in IDentity Provider (IDP) that provides core identity management functionality.":
    "SILO inclut un fournisseur d'identité intégré (IDP) qui fournit une fonctionnalité de base de gestion des identités.",
  "Active Directory / LDAP Access Management":
    "Active Directory / LDAP Gestion des accès",
  "For identities managed by the external AD/LDAP provider, SILO uses the user’s Distinguished Name and attempts to map it against an existing policy.":
    "Pour les identités gérées par le fournisseur externe AD/LDAP, SILO utilise le nom distinctif de l'utilisateur et tente de le mapper à une politique existante.",
  "Keycloak configuration": "Configuration de Keycloak",
  "You can configure SILO to use Keycloak as an external IDentity Provider (IDP) for authentication of users via the OpenID Connect (OIDC) protocol.":
    "Vous pouvez configurer SILO pour utiliser Keycloak comme fournisseur d'identité externe (IDP) pour l'authentification des utilisateurs via le protocole OpenID Connect (OIDC).",
  "LDAP Configuration": "Configuration LDAP",
  "SILO supports configuring a single Active Directory / LDAP Connect for external management of user identities.":
    "SILO prend en charge la configuration d'un seul Active Directory / LDAP Connect pour la gestion externe des identités des utilisateurs.",
  "OIDC Configuration": "Configuration OIDC",
  "SILO supports using an OpenID Connect (OIDC) compatible IDentity Provider (IDP) such as Okta, KeyCloak, Dex, Google, or Facebook for external management of user identities.":
    "SILO prend en charge l'utilisation d'un fournisseur d'identité compatible OpenID Connect (OIDC) (IDP) tel que Okta, KeyCloak, Dex, Google ou Facebook pour la gestion externe des identités des utilisateurs.",
  "KMS overview": "Présentation de KMS",
  "MinIO's cryptographic expert shares why MinIO built KES, what it is used for and how it fits into the MinIO architecture.":
    "L’expert en cryptographie de MinIO explique pourquoi MinIO a conçu KES, à quoi il sert et comment il s’intègre dans l’architecture MinIO.",
  "Learn about key management using KMS.":
    "Découvrez la gestion des clés à l'aide de KMS.",
  "Text snippet that will be relevant to the user will  go here  made to look nice in the helpitem size  on two-three lines":
    "L'extrait de texte qui sera pertinent pour l'utilisateur sera ici conçu pour être joli dans la taille de l'élément d'aide sur deux ou trois lignes",
  "Error logs can be filtered by node and log type, as well as search for specific text in the logs.":
    "Les journaux d'erreurs peuvent être filtrés par nœud et par type de journal, ainsi que rechercher du texte spécifique dans les journaux.",
  "Audit Logs": "Journaux d’audit",
  "You can configure an HTTP webhook endpoint to which SILO publishes audit logs using either environment variables or by setting runtime configuration settings.":
    "Vous pouvez configurer un point de terminaison de webhook HTTP sur lequel SILO publie les journaux d'audit à l'aide de variables d'environnement ou en définissant les paramètres de configuration d'exécution.",
  "Object Lambda": "Object Lambda",
  "SILO’s Object Lambda enables developers to programmatically transform objects on demand.":
    "L’Object Lambda de SILO permet aux développeurs de transformer des objets à la demande par programmation.",
  "MinIO Event Notifications - Overview":
    "MinIO Notifications d'événements - Présentation",
  "Use the Event framework to see what's going on in the system using Bucket, Object, Replication and ILM events.":
    "Utilisez le cadre d'événements pour voir ce qui se passe dans le système à l'aide des événements Bucket, Object, Replication et ILM.",
  "Managing Event Notifications Using MinIO MC Commands":
    "Gestion des notifications d'événements à l'aide des commandes MinIO MC",
  "This video provides an overview of the types of event notifications and how to set them up using MinIO's mc commands.":
    "Cette vidéo donne un aperçu des types de notifications d'événements et comment les configurer à l'aide des commandes mc de MinIO.",
  "MinIO Events Notifications - Setting Up Webhooks Using Python":
    "MinIO Notifications d'événements - Configuration de webhooks à l'aide de Python",
  "This video provides an overview of how to use Python and Flask to set up a Webhook on MinIO. ":
    "Cette vidéo donne un aperçu de la façon d'utiliser Python et Flask pour configurer un Webhook sur MinIO.",
  "MinIO Event Notifications - Using The MinIO Python SDK to Write Custom Webhooks":
    "MinIO Notifications d'événements - Utilisation du MinIO Python SDK pour écrire des webhooks personnalisés",
  "This video dives deeper into using the MinIO Python SDK to setup and manage notifications.":
    "Cette vidéo approfondit l'utilisation du MinIO Python SDK pour configurer et gérer les notifications.",
  "Object Management": "Gestion des objets",
  "Learn about Objects and how  SILO allows you to manage them":
    "Découvrez les objets et comment SILO vous permet de les gérer",
  "Managing Objects with the Object Browser":
    "Gestion des objets avec le navigateur d'objets",
  "Learn how to use the Console Object Browser  to manage your Objects":
    "Apprenez à utiliser le navigateur d'objets de la console pour gérer vos objets",
  "Manipulating Objects": "Manipulation d'objets",
  "A demo of Prefixes & Objects with examples of copying and deleting an object, as well as CopySource Object.":
    "Une démo de Préfixes et Objets avec des exemples de copie et de suppression d'un objet, ainsi que de l'Objet CopySource.",
  "Example Policy - Bucket Resource Access":
    "Exemple de politique – Accès aux ressources du bucket",
  "An example policy demonstrating authorization  limited to a named bucket":
    "Un exemple de politique démontrant une autorisation limitée à un bucket nommé",
  Performance: "Performances",
  "The performance section provides an interface for running a performance test of the deployment.":
    "La section performances fournit une interface pour exécuter un test de performances du déploiement.",
  Profile: "Profil",
  "The profile section provides an interface for running system profiling of the deployment. The results can provide insight into the SILO server process running on a given node.":
    "La section profil fournit une interface pour exécuter le profilage du système du déploiement. Les résultats peuvent donner un aperçu du processus serveur SILO exécuté sur un nœud donné.",
  Inspect: "Inspecter",
  "The inspect section provides an interface for capturing the erasure-coded metadata associated to an object or objects.":
    "La section inspect fournit une interface pour capturer les métadonnées codées par effacement associées à un ou plusieurs objets.",
  "Encrypt Inspect Output": "Chiffrer les résultats d’inspection",
  "You can encrypt the output of the mc support inspect command for enhanced security when transferring the files off the deployment.":
    "Vous pouvez chiffrer la sortie de mc support inspect pour renforcer la sécurité lors du transfert des fichiers hors du déploiement.",
  "What is Trace?": "Qu'est-ce que Trace ?",
  "The trace section provides HTTP trace functionality for a bucket or buckets on the deployment.":
    "La section trace fournit HTTP une fonctionnalité de trace pour un ou plusieurs buckets sur le déploiement.",
  Users: "Utilisateurs",
  "What is Watch?": "Qu'est-ce que Watch ?",
  "The Watch section displays S3 events as they occur on the selected bucket.":
    "La section Watch affiche S3 les événements au fur et à mesure qu'ils se produisent sur le bucket sélectionné.",
  "Access Managemnt": "Gestion des accès",
  "Object Locking": "Verrouillage des objets",
  "SILO Object Locking (“Object Retention”) enforces Write-Once Read-Many (WORM) immutability to protect versioned objects from deletion.":
    "SILO Le verrouillage d'objet (« Rétention d'objet ») applique l'immuabilité en écriture unique et en lecture multiple (WORM) pour protéger les objets versionnés contre la suppression.",
  Encryption: "Chiffrement",
  "SILO Server-Side Encryption (SSE) protects objects as part of write operations, allowing clients to take advantage of server processing power to secure objects at the storage layer (encryption-at-rest).":
    "SILO Le chiffrement côté serveur (SSE) protège les objets dans le cadre des opérations d'écriture, permettant aux clients de profiter de la puissance de traitement du serveur pour sécuriser les objets au niveau de la couche de stockage (chiffrement au repos).",
  "Learn how to use Console to manage Buckets":
    "Apprenez à utiliser la console pour gérer les buckets",
  "Bucket Replication": "Réplication de bucket",
  "SILO server-side bucket replication is an automatic bucket-level configuration that synchronizes objects between a source and destination bucket.":
    "SILO La réplication de bucket côté serveur est une configuration automatique au niveau du bucket qui synchronise les objets entre un bucket source et un bucket de destination.",
  "This video gives an overview of how to set up and use object versioning as part of a data lifecycle management strategy.":
    "Cette vidéo donne un aperçu de la façon de configurer et d'utiliser le versioning d'objet dans le cadre d'une stratégie de gestion du cycle de vie des données.",
  "Versioning Lab": "Laboratoire de gestion des versions",
  "This demo will take you through the steps to manage versioned objects using the MinIO command line tools.":
    "Cette démo vous guidera à travers les étapes de gestion des objets versionnés à l'aide des outils de ligne de commande MinIO.",
  "Bucket Replication Requirements": "Exigences de réplication de bucket",
  "Check here to ensure you meet the prerequisites before setting up any replication configurations.":
    "Cochez ici pour vous assurer que vous remplissez les conditions préalables avant de configurer des configurations de réplication.",
  "Bucket Replication Overview": "Présentation de la réplication de bucket",
  "In this video, we will cover bucket level replication, both active-passive and active-active.":
    "Dans cette vidéo, nous couvrirons la réplication au niveau du bucket, à la fois active-passive et active-active.",
  "Replication Lab I": "Laboratoire de réplication I",
  "Demonstrates bucket replication concepts using MinIO Client, including active-passive and active-active replication.":
    "Présente les concepts de réplication de bucket à l'aide du client MinIO, y compris la réplication active-passive et active-active.",
  "Replication Lab II": "Laboratoire de réplication II",
  "Demonstrates site replication concepts using MinIO Client, including active-passive and active-active replication.":
    "Présente les concepts de réplication de site à l'aide de MinIO Client, y compris la réplication active-passive et active-active.",
  "Access Management": "Gestion des accès",
  "Logging in": "Connexion",
  "Sign in with the root credentials, an IAM user access key, or temporary STS credentials via Other Authentication Methods.":
    "Connectez-vous avec les informations d'identification racine, une clé d'accès utilisateur IAM ou des informations d'identification temporaires STS via d'autres méthodes d'authentification.",
  "Console configuration": "Configuration de la console",
  "Configure identity providers, TLS, and session settings for the console on the server side.":
    "Configurez les fournisseurs d'identité, TLS et les paramètres de session pour la console côté serveur.",
  "Replication Internals": "Composants internes de réplication",
  "Learn details of the SILO replication process.":
    "Découvrez les détails du processus de réplication SILO.",
  "One-way Bucket Replication": "Réplication de bucket unidirectionnelle",
  "Guidance on configuring one-way Bucket replication using SILO Console.":
    "Conseils sur la configuration de la réplication unidirectionnelle du bucket à l'aide de la console SILO.",
  "Two-way Bucket Replication": "Réplication de bucket bidirectionnelle",
  "Guidance on configuring two-way (active-active) Bucket replication using SILO Console.":
    "Conseils sur la configuration de la réplication de bucket bidirectionnelle (active-active) à l'aide de la console SILO.",
};

export default messages;
