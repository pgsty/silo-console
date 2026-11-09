// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later
// AI-assisted translation; see ../../README.md for review and maintenance.

import type { Dictionary } from "../../catalog";

const messages: Dictionary = {
  "Users inherit policies from their groups. Access is denied unless explicitly granted.":
    "Les utilisateurs héritent des politiques de leurs groupes. L'accès est refusé sauf accord explicite.",
  "Policies define allowed actions and resources for users and groups.":
    "Les politiques définissent les actions et les ressources autorisées pour les utilisateurs et les groupes.",
  "IAM policies": "Politiques IAM",
  "Access keys inherit their parent user’s permissions. An inline policy can only restrict them further.":
    "Les clés d'accès héritent des autorisations de leur utilisateur parent. Une politique en ligne ne peut que les restreindre davantage.",
  "Access keys": "Clés d’accès",
  "Configure a destination, then add bucket notification rules to send S3 events to it.":
    "Configurez une destination, puis ajoutez des règles de notification de bucket pour lui envoyer des événements S3.",
  "Event destinations": "Destinations des événements",
  "SILO version": "Version SILO",
  "Raw JSON": "JSON brut",
  "Recursive inspections can be expensive. Limit the bucket and path before starting.":
    "Les inspections récursives peuvent être coûteuses. Limitez le bucket et le chemin avant de commencer.",
  "Open Help for examples, or read the":
    "Ouvrez l’aide pour voir des exemples ou consultez la",
  Tasks: "Tâches",
  "Tasks: {count} running": "Tâches : {count} en cours",
  "Close Tasks": "Fermer les tâches",
  "Object operations": "Opérations sur les objets",
  Running: "En cours",
  Finished: "Terminé",
  Queued: "En attente",
  Completed: "Terminé",
  "No running tasks": "Aucune tâche en cours",
  "No finished tasks": "Aucune tâche terminée",
  "Clear finished": "Effacer terminées",
  "ZIP download": "Téléchargement ZIP",
  "Browser handoff": "Transfert du navigateur",
  "Task progress": "Progression de la tâche",
  "Waiting for data": "En attente de données",
  "Remove task": "Supprimer la tâche",
  "Cancel task": "Annuler la tâche",
  "Retry failed": "Réessayer les échecs",
  "Open bucket/prefix": "Ouvrir le bucket/préfixe",
  "{done}/{total} completed · {failed} failed · {cancelled} cancelled":
    "{done}/{total} terminé · {failed} échoué · {cancelled} annulé",
  "{bytes} bytes received": "{bytes} octets reçus",
  "Handoff is complete; final download progress is unavailable here.":
    "Le transfert est terminé ; la progression finale du téléchargement n’est pas disponible ici.",
  "Counts represent selected targets. Progress within a folder or version cleanup is unavailable.":
    "Les décomptes représentent les cibles sélectionnées. La progression dans le nettoyage d’un dossier ou d’une version n’est pas disponible.",
  "Completed changes remain in place. In-flight requests may have reached the server; inspect before repeating them.":
    "Les modifications terminées restent en place. Les requêtes en cours peuvent avoir atteint le serveur ; inspectez avant de les répéter.",
  "Review {count} results": "Examiner {count} résultats",
  "Server outcome is unconfirmed. Inspect this object before another operation.":
    "Le résultat du serveur n'est pas confirmé. Inspectez cet objet avant une autre opération.",
  "Task failed: {name}": "Échec de la tâche : {name}",
  "Task completed: {name}": "Tâche terminée : {name}",
  "Open Tasks to inspect the results.":
    "Ouvrez les tâches pour inspecter les résultats.",
  "The request failed. Inspect the object before trying again.":
    "La requête a échoué. Inspectez l’objet avant de réessayer.",
  "Tasks are still running": "Les tâches sont toujours en cours d'exécution",
  "Stay here": "Restez ici",
  "Cancel tasks and leave": "Annuler les tâches et partir",
  "Leave page": "Quitter la page",
  "Leaving this session cancels queued and running tasks. Changes already completed on the server remain in place.":
    "Quitter cette session annule les tâches en file d'attente et en cours d'exécution. Les modifications déjà effectuées sur le serveur restent en place.",
  "Tasks will continue in this session. You can check their progress in Tasks on another page.":
    "Les tâches se poursuivront dans cette session. Vous pouvez vérifier leur progression dans Tâches sur une autre page.",
  "Delete Versions": "Supprimer les versions",
  "Cluster health": "Santé du cluster",
  "servers online": "serveurs en ligne",
  "{count} drives online": "{count} disques en ligne",
  "{count} server(s) offline": "{count} serveur(s) hors ligne",
  "{count} drive(s) offline": "{count} disque(s) hors ligne",
  "{count} drive(s) healing": "{count} disque(s) en réparation",
  "Drive {drive} is at least 95% full. The server may reject writes.":
    "Le disque {drive} est plein à au moins 95 %. Le serveur peut rejeter les écritures.",
  "Drive {drive} is at least 85% full.":
    "Le disque {drive} est plein à au moins 85 %.",
  "Configuration changes are waiting for a server restart.":
    "Les modifications de configuration attendent un redémarrage du serveur.",
  "Some server or drive health information is unavailable.":
    "Certaines informations sur l’état des serveurs ou des disques sont indisponibles.",
  "Capacity is incomplete. Only reported drive measurements are shown.":
    "La capacité est incomplète. Seules les mesures des disques signalées sont affichées.",
  "Generate health report": "Générer un rapport de santé",
  "No servers reported": "Aucun serveur signalé",
  Server: "Serveur",
  "Just started": "Vient de démarrer",
  "Hide drives for {server}": "Masquer les disques de {server}",
  "Show drives for {server}": "Afficher les disques de {server}",
  "No drive information available":
    "Aucune information sur les disques disponible",
  "Drives on {server}": "Disques sur {server}",
  "{used} / {total} used": "{used} / {total} utilisé",
  "Drive usage: {drive}": "Utilisation du disque : {drive}",
  "Refresh failed. The last received data is still shown.":
    "Échec de l'actualisation. Les dernières données reçues sont toujours affichées.",
  "Could not load deployment information. Try refreshing.":
    "Impossible de charger les informations de déploiement. Essayez de rafraîchir.",
  "Deployment statistics": "Statistiques de déploiement",
  "of {total} raw capacity": "de {total} capacité brute",
  "{available} available": "{available} disponible",
  Data: "Données",
  objects: "objets",
  Alerts: "Alertes",
  "Health information unavailable": "Informations de santé indisponibles",
  "All systems normal": "Tous les systèmes sont normaux",
  "Quick actions": "Actions rapides",
  "No quick actions available for your permissions.":
    "Aucune action rapide disponible pour vos autorisations.",
  "Read & write": "Lire et écrire",
  "Delete bucket": "Supprimer le bucket",
  "Actions for {bucket}": "Actions pour {bucket}",
  "Select {bucket}": "Sélectionnez {bucket}",
  "Object lock": "Verrouillage d'objet",
  Created: "Créé",
  "Select all visible buckets": "Sélectionnez tous les buckets visibles",
  "Bucket rows": "Lignes de buckets",
  "The bucket list could not be loaded.":
    "Impossible de charger la liste des buckets.",
  "Select one or more buckets first.":
    "Sélectionnez d’abord un ou plusieurs buckets.",
  "configure the selected buckets": "configurer les buckets sélectionnés",
  "Search buckets": "Rechercher des buckets",
  "Bucket view": "Affichage des buckets",
  Cards: "Cartes",
  "{count} buckets selected": {
    one: "{count} bucket sélectionné",
    many: "{count} buckets sélectionnés",
    other: "{count} buckets sélectionnés",
  },
  "{count} bucket selected": "{count} bucket sélectionné",
  "No buckets match “{q}”": "Aucun bucket ne correspond à « {q} »",
  "Clear filter": "Effacer le filtre",
  "Built-in · Modified": "Intégré · Modifié",
  "Actions for {name}": "Actions pour {name}",
  "Reset to default": "Valeurs par défaut",
  "Could not load policies": "Impossible de charger les politiques",
  "Refresh to try again.": "Actualisez pour réessayer.",
  "Create a policy to define permissions for users and groups.":
    "Créez une politique pour définir les autorisations pour les utilisateurs et les groupes.",
  "Could not update policy": "Impossible de mettre à jour la politique",
  "Reset policy {name} to its default definition?":
    "Réinitialiser la politique {name} à sa définition par défaut ?",
  "The built-in policy will be restored to the SILO default definition.":
    "La politique intégrée sera restaurée à la définition par défaut SILO.",
  "Loading attachment information…": "Chargement des rattachements…",
  "This policy has changed or is no longer available. Refresh the list.":
    "Cette politique a changé ou n'est plus disponible. Actualisez la liste.",
  "Attachment information is unavailable.":
    "Les informations de rattachement sont indisponibles.",
  "This policy is attached to {users} users and {groups} groups.":
    "Cette politique est attachée aux {users} utilisateurs et aux {groups} groupes.",
  "Their permissions will follow the default definition.":
    "Leurs autorisations suivront la définition par défaut.",
  "They will lose the permissions it grants.":
    "Ils perdront les autorisations qu'il accorde.",
  "Could not load policy. Refresh to try again.":
    "Impossible de charger la politique. Actualisez pour réessayer.",
  "Could not load policy": "Impossible de charger la politique",
  "Could not load users for this policy":
    "Impossible de charger les utilisateurs pour cette politique",
  "Could not load groups for this policy":
    "Impossible de charger les groupes pour cette politique",
  "Built-in policies can be overridden by saving a modified version; you can reset it later.":
    "Les politiques intégrées peuvent être remplacées en enregistrant une version modifiée ; vous pourrez le réinitialiser plus tard.",
  "Override policy": "Remplacer la politique",
  "Cancel editing": "Annuler la modification",
  "Direct policies": "Politiques directes",
  "Policies inherited through groups": "Politiques héritées des groupes",
  "Access-key count is unavailable.":
    "Le nombre de clés d'accès n'est pas disponible.",
  "Group policy information is unavailable.":
    "Les informations sur la politique de groupe ne sont pas disponibles.",
  "Also assigned directly": "Également attribué directement",
  "From groups:": "Depuis les groupes :",
  "Group policies could not be loaded.":
    "Les politiques de groupe n'ont pas pu être chargées.",
  "Group is disabled; its policies are not inherited.":
    "Le groupe est désactivé ; ses politiques ne sont pas héritées.",
  "Group status is unavailable; inherited permissions are unknown.":
    "Le statut du groupe n'est pas disponible ; les autorisations héritées sont inconnues.",
  "No inherited group policies": "Aucune politique de groupe héritée",
  "Some group policies are unavailable. Refresh to try again.":
    "Certaines politiques de groupe ne sont pas disponibles. Actualisez pour réessayer.",
  "Could not load user": "Impossible de charger l'utilisateur",
  "Could not update user status":
    "Impossible de mettre à jour le statut de l'utilisateur",
  "Edit replication": "Modifier la réplication",
  "Page not found": "Page introuvable",
  "Go to Buckets": "Accédez aux buckets",
  "Go back": "Retour",
  "Read the documentation": "Lire la documentation",
  "You do not have permission to view this page":
    "Vous n'êtes pas autorisé à afficher cette page",
  "Ask your administrator for access. This page checks the following IAM actions:":
    "Demandez l’accès à votre administrateur. Cette page vérifie les actions IAM suivantes :",
  "Required IAM actions": "Actions IAM requises",
  "Encryption is not configured": "Le cryptage n'est pas configuré",
  "Configure KES or KMS on the SILO server to manage encryption keys in Console.":
    "Configurez KES ou KMS sur le serveur SILO pour gérer les clés de chiffrement dans la console.",
  "Local identity management is unavailable":
    "La gestion des identités locales n'est pas disponible",
  "LDAP is enabled. Manage users and groups in your LDAP directory; connection settings are available on the LDAP configuration page.":
    "LDAP est activé. Gérez les utilisateurs et les groupes dans votre répertoire LDAP ; les paramètres de connexion sont disponibles sur la page de configuration LDAP.",
  "Tier creation is unavailable": "La création de niveaux n'est pas disponible",
  "This Console requires a distributed server setup to add a remote storage tier.":
    "Cette console nécessite une configuration de serveur distribué pour ajouter un niveau de stockage distant.",
  "This page is unavailable in object browser mode":
    "Cette page n'est pas disponible en mode navigateur d'objets",
  "This Console is configured for object browsing only. Ask your administrator to enable the full Console to use this page.":
    "Cette console est configurée pour la navigation d'objets uniquement. Demandez à votre administrateur d'activer la console complète pour utiliser cette page.",
  "Prometheus is configured but unreachable":
    "Prometheus est configuré mais inaccessible",
  "Check the Prometheus address, network access and authentication, then retry.":
    "Vérifiez l'adresse Prometheus, l'accès au réseau et l'authentification, puis réessayez.",
  "Advanced metrics need Prometheus":
    "Les métriques avancées nécessitent Prometheus",
  "Configure Prometheus to collect SILO metrics, then set the URL for your deployment and restart the corresponding service.":
    "Configurez Prometheus pour collecter les métriques SILO, puis définissez l’URL de votre déploiement et redémarrez le service concerné.",
  "Standalone Console": "Console autonome",
  "Console embedded in SILO": "Console intégrée dans SILO",
  "Optional standalone settings": "Paramètres autonomes facultatifs",
  "Bearer token: ": "Jeton au porteur :",
  "Or basic authentication: ": "Ou authentification de base :",
  "Embedded settings: ": "Paramètres intégrés :",
  Icons: "Icônes",
  "Create bucket": "Créer un bucket",
  "Edit {label}": "Modifier {label}",
  "Calculating…": "Calcul…",
  "The server has not finished computing usage yet.":
    "Le serveur n’a pas encore fini de calculer l’utilisation.",
  "Calculated {time}": "Calculé {time}",
  "Updated {time}": "Mise à jour {time}",
  "Permission required": "Autorisation requise",
  "Ask your administrator to grant the following IAM actions.":
    "Demandez à votre administrateur d’accorder les actions IAM suivantes.",
  "More actions": "Plus d'actions",
  "Equivalent mcli command": "Commande mcli équivalente",
  Copied: "Copié",
  "Copy failed. Select and copy the command.":
    "Échec de la copie. Sélectionnez et copiez la commande.",
  "Copy commands": "Copier les commandes",
  "Replace ALIAS with your configured mcli alias (for example, {alias}).":
    "Remplacez ALIAS par votre alias mcli configuré (par exemple, {alias}).",
  "Replace ALIAS with your configured mcli alias.":
    "Remplacez ALIAS par votre alias mcli configuré.",
  "Loading…": "Chargement…",
  "SILO primitives": "SILO primitives",
  "Shared building blocks for storage, identity and monitoring.":
    "Éléments de base partagés pour le stockage, l'identité et la surveillance.",
  "Healthy capacity": "Capacité saine",
  "Capacity warning": "Avertissement de capacité",
  "Above the 85% warning threshold": "Au dessus du seuil d'alerte de 85%",
  "Capacity critical": "Capacité critique",
  "Above the 95% critical threshold": "Au dessus du seuil critique de 95%",
  "Usage is calculated by the server.":
    "L'utilisation est calculée par le serveur.",
  "View buckets": "Afficher les buckets",
  "Status and values": "Statut et valeurs",
  "Built-in": "Intégré",
  "Freshness and actions": "Fraîcheur et actions",
  "Select an object to inspect its details.":
    "Sélectionnez un objet pour inspecter ses détails.",
  "Object details": "Détails de l'objet",
  "Demo action completed.": "Action de démonstration terminée.",
  "Select an object to download.": "Sélectionnez un objet à télécharger.",
  "Empty and unavailable states": "États vides et indisponibles",
  "No buckets yet": "Pas encore de buckets",
  "Create a bucket to start storing objects.":
    "Créez un bucket pour commencer à stocker des objets.",
  "No matching objects": "Aucun objet correspondant",
  "Try a different name or clear the search filter.":
    "Essayez un autre nom ou effacez le filtre de recherche.",
  "Metrics are unavailable": "Les métriques ne sont pas disponibles",
  "Connect a Prometheus endpoint to view monitoring metrics.":
    "Connectez un point de terminaison Prometheus pour afficher les métriques de surveillance.",
  "Loading rows": "Chargement des lignes",
  "Command preview": "Aperçu de la commande",
  "Showing the first 1 MiB. Download the object to see the full file.":
    "Affichage du premier 1 Mio. Téléchargez l’objet pour voir le fichier complet.",
  "Showing first 500 rows": "Affichage des 500 premières lignes",
  "Showing the first 100 columns. View Source or download the object to see all columns.":
    "Affichage des 100 premières colonnes. Affichez la source ou téléchargez l'objet pour voir toutes les colonnes.",
  Rendered: "Rendu",
  "Wrap lines": "Retour à la ligne",
  Row: "Ligne",
  "CSV preview content": "Contenu de l’aperçu CSV",
  "Markdown preview content": "Contenu de l'aperçu Markdown",
  "Markdown rendering is unavailable for this content. Showing the source instead.":
    "Le rendu Markdown n'est pas disponible pour ce contenu. Afficher la source à la place.",
  "Image: {alt}": "Image : {alt}",
  Image: "Image",
  Actions: "Actions",
  "Select version": "Sélectionnez la version",
  "This version is a delete marker.":
    "Cette version est un marqueur de suppression.",
  "You need s3:GetObject permission.":
    "Vous avez besoin de l'autorisation s3:GetObject.",
  "You need s3:GetObjectVersion permission.":
    "Vous avez besoin de l'autorisation s3:GetObjectVersion.",
  "Preview is not available for this file type.":
    "L'aperçu n'est pas disponible pour ce type de fichier.",
  "Object Lock is not enabled on this bucket.":
    "Le verrouillage des objets n’est pas activé sur ce bucket.",
  "You need s3:PutObjectLegalHold permission.":
    "Vous avez besoin de l'autorisation s3:PutObjectLegalHold.",
  "You need s3:PutObjectRetention permission.":
    "Vous avez besoin de l'autorisation s3:PutObjectRetention.",
  "Tags can only be changed on the current version.":
    "Les balises ne peuvent être modifiées que sur la version actuelle.",
  "Versioning is not enabled on this bucket.":
    "Le contrôle de version n'est pas activé sur ce bucket.",
  "Select one or more objects first.":
    "Sélectionnez d'abord un ou plusieurs objets.",
  "Select a single object first.": "Sélectionnez d'abord un seul objet.",
  "Select a file instead of a folder.":
    "Sélectionnez un fichier au lieu d'un dossier.",
  "Select a folder to change anonymous access.":
    "Sélectionnez un dossier pour modifier l'accès anonyme.",
  "Open the current object to use this action.":
    "Ouvrez l'objet actuel pour utiliser cette action.",
  "This action requires a distributed server.":
    "Cette action nécessite un serveur distribué.",
  "You need s3:PutObjectTagging permission.":
    "Vous avez besoin de l'autorisation s3:PutObjectTagging.",
  "You need admin:InspectData permission.":
    "Vous avez besoin de l'autorisation admin:InspectData.",
  "You need permission to view object versions.":
    "Vous avez besoin d'une autorisation pour afficher les versions d'objet.",
  "You need s3:DeleteObject permission.":
    "Vous avez besoin de l'autorisation s3:DeleteObject.",
  "You need permission to change the bucket policy.":
    "Vous avez besoin d'une autorisation pour modifier la politique du bucket.",
  "You need permission to read objects and bucket versioning.":
    "Vous avez besoin d'une autorisation pour lire les objets et la gestion des versions du bucket.",
  "You need s3:ListBucket permission.":
    "Vous avez besoin de l'autorisation s3:ListBucket.",
  "You need permission to restore this version.":
    "Vous avez besoin d'une autorisation pour restaurer cette version.",
  "You need permission to select this version.":
    "Vous avez besoin d'une autorisation pour sélectionner cette version.",
  "You need permission to delete object versions.":
    "Vous devez disposer de l’autorisation de supprimer les versions d’objets.",
  "Exit rewind mode to refresh the object list.":
    "Quittez le mode rembobinage pour actualiser la liste des objets.",
  "There are no non-current versions to delete.":
    "Aucune version non actuelle à supprimer.",
  "Invalid Endpoint": "Point de terminaison invalide",
  Broker: "Courtier",
  QOS: "QOS",
  "Client ID": "ID client",
  "Client Secret": "Secret client",
  "Redirect URI": "URI de redirection",
  "Lookup Bind DN": "Liaison de recherche DN",
  "Lookup Bind Password": "Mot de passe de liaison de recherche",
  "User DN Search Base": "Utilisateur DN Base de recherche",
  "User DN Search Filter": "Utilisateur DN Filtre de recherche",
  "Group Search Base DN": "Base de recherche de groupe DN",
  "Group Search Filter": "Filtre de recherche de groupe",
  "Sign Out": "Se déconnecter",
  "Remove transfer": "Supprimer le transfert",
  "Cancel transfer": "Annuler le transfert",
  "This download has already started. Dismiss its transfer entry to start it again.":
    "Ce téléchargement a déjà commencé. Ignorez son entrée de transfert pour le redémarrer.",
  "Track or cancel this download in your browser's download manager.":
    "Suivez ou annulez ce téléchargement dans le gestionnaire de téléchargement de votre navigateur.",
  "For selections above 5 GiB or of unknown size, MCLI is recommended. This ZIP will stream without buffering in memory.":
    "Pour les sélections supérieures à 5 Gio ou de taille inconnue, MCLI est recommandé. Ce ZIP sera diffusé sans mise en mémoire tampon.",
  "Set lifecycle": "Définir le cycle de vie",
  "Set replication": "Définir la réplication",
  "Refresh buckets": "Actualiser les buckets",
  "Close details": "Fermer les détails",
  "Copy share URL": "Copier l’URL de partage",
  "Select multiple versions": "Sélectionnez plusieurs versions",
  "Delete selected versions": "Supprimer les versions sélectionnées",
  "Delete non-current versions": "Supprimer les versions non actuelles",
  "Copy code": "Copier le code",
  "Delete group": "Supprimer le groupe",
  "Refresh list": "Actualiser la liste",
  "Copy path": "Copier le chemin",
  "Delete user": "Supprimer un utilisateur",
  "Change password": "Changer le mot de passe",
  "Copy {label}": "Copier {label}",
  "Add site": "Ajouter un site",
  "Remove site": "Supprimer le site",
  "Delete selected users": "Supprimer les utilisateurs sélectionnés",
  "View All": "Tout afficher",
  "Deployment ID:": "ID de déploiement :",
  "Request ID:": "ID de requête :",
  "Remote host:": "Hôte distant :",
  "User agent:": "Agent utilisateur :",
  "Backtrace:": "Trace d’appels :",
  "Time:": "Heure :",
  "API:": "API :",
  "Not available": "Non disponible",
  " and ": " et ",
  "'namespace' reflects current bucket/object list and 'access' reflects a journal of object operations, defaults to 'namespace'":
    "'namespace' reflète la liste actuelle des buckets/objets et 'access' reflète un journal des opérations sur les objets ; valeur par défaut : 'namespace'",
  "{compliance} lock protects Objects from write operations by all users, including the SILO root user.":
    "Le verrouillage {compliance} protège les objets contre les opérations d’écriture de tous les utilisateurs, y compris l’utilisateur root de SILO.",
  "{count} days": {
    one: "{count} jour",
    other: "{count} jours",
    many: "{count} jours",
  },
  "{count} Entities Found": "{count} Entités trouvées",
  "{count} Entity Found": "{count} Entité trouvée",
  "{count} Version": "{count} version",
  "{count} version, {size}": "{count} version, {size}",
  "{count} versions": {
    one: "{count} version",
    other: "{count} versions",
    many: "{count} versions",
  },
  "{count} Versions": {
    one: "{count} version",
    other: "{count} versions",
    many: "{count} versions",
  },
  "{count} versions, {size}": "{count} versions, {size}",
  "{custom} policy can be written to define which accounts are authorized to access this Bucket":
    "Une politique {custom} peut être définie pour préciser quels comptes sont autorisés à accéder à ce bucket",
  "{entity} not available": "{entity} non disponible",
  "{entity} will be available until:": "{entity} sera disponible jusqu’au :",
  "{excludeFolders} options will not be available if this option is enabled.":
    "Les options {excludeFolders} ne seront pas disponibles si cette option est activée.",
  "{file} - Versions": "{file} - Versions",
  "{governance} lock protects Objects from write operations by non-privileged users.":
    "Le verrouillage {governance} protège les objets contre les opérations d’écriture des utilisateurs sans privilèges.",
  "{label} copied to clipboard": "{label} copié dans le presse-papiers",
  "{minio} is a registered trademark of MinIO, Inc. {silo} is not a MinIO, Inc. product, and is not affiliated with, sponsored by, or endorsed by MinIO, Inc.":
    "{minio} est une marque déposée de MinIO, Inc. {silo} n'est pas un produit MinIO, Inc. et n'est pas affilié, sponsorisé ou approuvé par MinIO, Inc.",
  "{object} Versions": "{object} Versions",
  "{objectLocking} prevents objects from being deleted. Required to support retention and legal hold. Can only be enabled at bucket creation.":
    "{objectLocking} empêche la suppression des objets. Nécessaire pour la rétention et la conservation légale. Ne peut être activé qu’à la création du bucket.",
  "{private} policy limits access to credentialled accounts with appropriate permissions":
    "La politique {private} limite l’accès aux comptes authentifiés disposant des autorisations appropriées",
  "{provider} - Add Tier Configuration":
    "{provider} - Ajouter une configuration de niveau",
  "{public} policy anyone will be able to upload, download and delete files from this Bucket once logged in":
    "Avec la politique {public}, toute personne connectée pourra téléverser, télécharger et supprimer des fichiers de ce bucket",
  "{quota} limits the amount of data in the bucket.":
    "{quota} limite la quantité de données dans le bucket.",
  "{retention} imposes rules to prevent object deletion for a period of time. Versioning must be enabled in order to set bucket retention policies.":
    "{retention} définit des règles empêchant la suppression des objets pendant une durée donnée. Le versionnement doit être activé pour définir des politiques de rétention du bucket.",
  "{service} which is {status}": "{service} qui est {status}",
  "{silo} is an independently maintained continuation of the {minio} object storage project, carried forward by the {pigsty} community since 2026. Its {code} {incorporates} {upstream}, and the complete work remains licensed under the {agpl}.":
    "{silo} est une continuation maintenue de manière indépendante du projet de stockage objet {minio}, portée par la communauté {pigsty} depuis 2026. Son {code} {incorporates} {upstream}, et l’ensemble de l’œuvre reste sous licence {agpl}.",
  "{target} Event Destination": "Destination d’événements {target}",
  "{time} ago": "il y a {time}",
  "{type}: {name} not found.": "{type} : {name} introuvable.",
  "{versioning} allows to keep multiple versions of the same object under the same key.":
    "{versioning} permet de conserver plusieurs versions d'un même objet sous la même clé.",
  "* Warning: With Public access anyone will be able to upload, download and delete files from this Bucket *":
    "* Attention : avec l’accès public, tout le monde pourra téléverser, télécharger et supprimer des fichiers de ce bucket *",
  "# Associated Access Keys": "# Clés d'accès associées",
  "© 2026 Ruohang Feng / PGSTY and the SILO contributors.":
    "© 2026 Ruohang Feng / PGSTY et les contributeurs SILO.",
  "<Day>": "<Jour>",
  "<Month>": "<Mois>",
  "<Year>": "<Année>",
  "A bucket can only be deleted if it's empty.":
    "Un bucket ne peut être supprimé que s’il est vide.",
  "A group can have one attached IAM policy, where all users with membership in that group inherit that policy. Groups support more simplified management of user permissions on the SILO Tenant.":
    "Un groupe peut avoir une politique IAM attachée, où tous les utilisateurs membres de ce groupe héritent de cette politique. Les groupes prennent en charge une gestion plus simplifiée des autorisations des utilisateurs sur le locataire SILO.",
  "A network error occurred.": "Une erreur réseau s'est produite.",
  "A new {entity} has been created with the following details:":
    "Un nouveau {entity} a été créé avec les détails suivants :",
  "A SILO user consists of a unique access key (username) and corresponding secret key (password). Clients must authenticate their identity by specifying both a valid access key (username) and the corresponding secret key (password) of an existing SILO user.":
    "Un utilisateur SILO se compose d'une clé d'accès unique (nom d'utilisateur) et d'une clé secrète correspondante (mot de passe). Les clients doivent authentifier leur identité en spécifiant à la fois une clé d'accès valide (nom d'utilisateur) et la clé secrète correspondante (mot de passe) d'un SILO utilisateur existant.",
  "A user can be a member of multiple groups.":
    "Un utilisateur peut être membre de plusieurs groupes.",
  "About Site Replication": "À propos de la réplication de sites",
  Access: "Accès",
  "Access Audit": "Audit d'accès",
  "Access Key": "Clé d’accès",
  "Access Key and Secret Key should be same on the new site/endpoint.":
    "La clé d'accès et la clé secrète doivent être identiques sur le nouveau site/point de terminaison.",
  "Access Key Policy": "Politique de clé d'accès",
  "Access Key details - {name}": "Détails de la clé d'accès - {name}",
  "Access keys deleted successfully.": "Clés d'accès supprimées avec succès.",
  "Access Keys deleted successfully.": "Clés d'accès supprimées avec succès.",
  "Access Keys inherit the policies explicitly attached to the parent user, and the policies attached to each group in which the parent user has membership.":
    "Les clés d'accès héritent des politiques explicitement attachées à l'utilisateur parent et des politiques attachées à chaque groupe dont l'utilisateur parent est membre.",
  "Access Keys support programmatic access by applications. You cannot use a Access Key to log into the SILO Console.":
    "Les clés d'accès prennent en charge l'accès par programmation par les applications. Vous ne pouvez pas utiliser une clé d'accès pour vous connecter à la console SILO.",
  "Access Policy": "Politique d'accès",
  "Access Policy:": "Politique d'accès :",
  "Access Rule added successfully": "Règle d'accès ajoutée avec succès",
  "Access Rules": "Règles d'accès",
  "AccessKey is required": "AccessKey est requis",
  "Account Key": "Clé de compte",
  "Account Name": "Nom du compte",
  Active: "Actif",
  "Active for": "Actif pour",
  'AD/LDAP server address e.g. "myldapserver.com:636"':
    'AD/LDAP adresse du serveur, par ex. "myldapserver.com:636"',
  "Add a Row": "Ajouter une ligne",
  "Add Access Rule": "Ajouter une règle d'accès",
  "Add Anonymous Access Rule": "Ajouter une règle d'accès anonyme",
  "Add Bucket Replication Rule - {bucket}":
    "Ajouter une règle de réplication de bucket - {bucket}",
  "Add Event Destination": "Ajouter une destination d'événement",
  "Add key": "Ajouter une clé",
  "Add Lifecycle Rule": "Ajouter une règle de cycle de vie",
  "Add Members": "Ajouter des membres",
  "Add New Tag": "Ajouter une nouvelle balise",
  "Add New Tag ": "Ajouter une nouvelle balise",
  "Add new Webhook": "Ajouter un nouveau Webhook",
  "Add Replication Rule": "Ajouter une règle de réplication",
  "Add Replication Site": "Ajouter un site de réplication",
  "Add Replication Sites": "Ajouter des sites de réplication",
  "Add Sites": "Ajouter des sites",
  "Add Sites for Replication": "Ajouter des sites pour la réplication",
  "Add tag": "Ajouter une balise",
  "Add Tier": "Ajouter un niveau",
  "Add to Group": "Ajouter au groupe",
  "Add to Groups": "Ajouter aux groupes",
  "Add Users to Group": "Ajouter des utilisateurs au groupe",
  "add users to groups": "ajouter des utilisateurs à des groupes",
  "Adding groups lets you assign IAM policies to multiple users at once.":
    "L'ajout de groupes vous permet d'attribuer des politiques IAM à plusieurs utilisateurs à la fois.",
  Address: "Adresse",
  After: "Après",
  All: "Tous",
  "All Log Types": "Tous les types de journaux",
  "All Nodes": "Tous les nœuds",
  "All sites must be using the same external IDP(s) if any.":
    "Tous les sites doivent utiliser le même IDP(s) externe(s), le cas échéant.",
  "All sites must have the same deployment credentials (i.e. MINIO_ROOT_USER, MINIO_ROOT_PASSWORD).":
    "Tous les sites doivent avoir les mêmes informations d'identification de déploiement (c'est-à-dire MINIO_ROOT_USER, MINIO_ROOT_PASSWORD).",
  "All User Agents": "Tous les agents utilisateurs",
  "Amazon Resource Name": "Nom de la ressource Amazon",
  "AMQP exchange type": "AMQP type d'échange",
  "AMQP server endpoint e.g. `amqp://myuser:mypassword@localhost:5672`":
    "AMQP point de terminaison du serveur, par ex. `amqp://myuser:mypassword@localhost:5672`",
  "An error occurred": "Une erreur s'est produite",
  "An error occurred while getting the Health Report file.":
    "Une erreur s'est produite lors de l'obtention du fichier de rapport de santé.",
  "An error occurred while uploading the file.":
    "Une erreur s’est produite lors du téléversement d’un ou plusieurs fichiers.",
  "An error occurred while uploading the files.":
    "Une erreur s’est produite lors du téléversement.",
  "An unknown error occurred. Please refer to Console logs to get more information.":
    "Une erreur inconnue s'est produite. Veuillez vous référer aux journaux de la console pour obtenir plus d'informations.",
  Anonymous: "Anonyme",
  "Anonymous Access": "Accès anonyme",
  "API Name": "API Nom",
  "API Requests": "API Demandes",
  Application: "Application",
  "apply policies to Groups": "appliquer les règles aux groupes",
  April: "avril",
  "Are you sure you want to continue?": "Êtes-vous sûr de vouloir continuer ?",
  "Are you sure you want to delete Access Key {name}?":
    "Voulez-vous vraiment supprimer la clé d’accès {name} ?",
  "Are you sure you want to delete all the non-current versions for: {object}?":
    "Voulez-vous vraiment supprimer toutes les versions non actuelles de {object} ?",
  "Are you sure you want to delete bucket {bucket}?":
    "Voulez-vous vraiment supprimer le bucket {bucket} ?",
  "Are you sure you want to delete IDP {name} configuration?":
    "Voulez-vous vraiment supprimer la configuration du fournisseur d’identité {name} ?",
  "Are you sure you want to delete policy {name}?":
    "Voulez-vous vraiment supprimer la politique {name} ?",
  "Are you sure you want to delete replication rule {rule}?":
    "Voulez-vous vraiment supprimer la règle de réplication {rule} ?",
  "Are you sure you want to delete the {rule} rule?":
    "Voulez-vous vraiment supprimer la règle {rule} ?",
  "Are you sure you want to delete the Configured Endpoint {name}?":
    "Voulez-vous vraiment supprimer le point de terminaison configuré {name} ?",
  "Are you sure you want to delete the event destination ?":
    "Etes-vous sûr de vouloir supprimer la destination de l'événement ?",
  "Are you sure you want to delete the following {count} groups?":
    "Voulez-vous vraiment supprimer les {count} groupes suivants ?",
  "Are you sure you want to delete the following {count} users?":
    "Voulez-vous vraiment supprimer les {count} utilisateurs suivants ?",
  "Are you sure you want to delete the following group?":
    "Voulez-vous vraiment supprimer le groupe suivant ?",
  "Are you sure you want to delete the following user?":
    "Voulez-vous vraiment supprimer l’utilisateur suivant ?",
  "Are you sure you want to delete the selected {count} Access Keys?":
    "Voulez-vous vraiment supprimer les {count} clés d’accès sélectionnées ?",
  "Are you sure you want to delete the selected {count} objects?":
    "Voulez-vous vraiment supprimer les {count} objets sélectionnés ?",
  "Are you sure you want to delete the selected {count} versions for {object}?":
    "Voulez-vous vraiment supprimer les {count} versions sélectionnées de {object} ?",
  "Are you sure you want to delete the tag {tag} ?":
    "Etes-vous sûr de vouloir supprimer le tag {tag} ?",
  "Are you sure you want to delete the tag {tag}?":
    "Voulez-vous vraiment supprimer l’étiquette {tag} ?",
  "Are you sure you want to delete the tier {name}?":
    "Voulez-vous vraiment supprimer le niveau {name} ?",
  "Are you sure you want to delete this access rule?":
    "Voulez-vous vraiment supprimer cette règle d’accès ?",
  "Are you sure you want to delete this event?":
    "Êtes-vous sûr de vouloir supprimer cet événement ?",
  "Are you sure you want to delete:": "Êtes-vous sûr de vouloir supprimer :",
  "Are you sure you want to remove all the replication sites?.":
    "Êtes-vous sûr de vouloir supprimer tous les sites de réplication ?.",
  "Are you sure you want to remove the replication site: {name}?":
    "Êtes-vous sûr de vouloir supprimer le site de réplication : {name} ?",
  "Are you sure you want to remove the selected replication rules for bucket {bucket}?":
    "Êtes-vous sûr de vouloir supprimer les règles de réplication sélectionnées pour le bucket {bucket} ?",
  "Are you sure you want to reset the Default {name}?":
    "Êtes-vous sûr de vouloir réinitialiser la valeur par défaut {name} ?",
  "Are you sure you want to restore {object} with Version ID: {version}?":
    "Voulez-vous vraiment restaurer {object} avec l’ID de version {version} ?",
  "Are you sure you want to restore these configurations to default values?":
    "Êtes-vous sûr de vouloir restaurer ces configurations aux valeurs par défaut ?",
  "Assign Access Policies": "Attribuer des politiques d'accès",
  "Assign Custom Credentials": "Attribuer des identifiants personnalisés",
  "Assign Custom IAM Policies for Group":
    "Attribuer des politiques IAM personnalisées pour le groupe",
  "Assign groups": "Attribuer des groupes",
  "Assign Groups": "Attribuer des groupes",
  "assign policies": "attribuer des politiques",
  "assign Policies": "attribuer des politiques",
  "Assign Policies": "Attribuer des politiques",
  "Assign Policy": "Attribuer une politique",
  "Assign Users": "Attribuer des utilisateurs",
  Asynchronous: "Asynchrone",
  "Audit Kafka": "Audit Kafka",
  "Audit Webhook": "Audit Webhook",
  August: "Août",
  "Auth Token": "Jeton d'authentification",
  "Auto delete queue when set to 'on', when there are no consumers":
    "Supprime automatiquement la file lorsqu’il est défini sur 'on' et qu’il n’y a aucun consommateur",
  "Auto Deleted": "Supprimé automatiquement",
  "Available Capacity": "Capacité disponible",
  Back: "Retour",
  Backend: "Back-end",
  Bandwidth: "Bande passante",
  "Enter a non-negative bandwidth below 8 PiB/s, with at most two decimals (0 means unlimited).":
    "Saisissez une bande passante non négative inférieure à 8 PiB/s, avec au plus deux décimales (0 signifie illimité).",
  "Bitrot Scan": "Analyse Bitrot",
  Brokers: "Courtiers",
  "Browse Bucket": "Parcourir le bucket",
  Bucket: "Bucket",
  "Bucket Assignments": "Assignations de buckets",
  "Bucket Encryption configuration": "Configuration du chiffrement de bucket",
  "Bucket lifecycle (ILM) configuration":
    "Configuration du cycle de vie du bucket (ILM)",
  "Bucket Name": "Nom du bucket",
  "Bucket names can consist only of lowercase letters, numbers, dots (.), and hyphens (-).":
    "Les noms de buckets ne peuvent être composés que de lettres minuscules, de chiffres, de points (.) et de tirets (-).",
  "Bucket names must be between 3 (min) and 63 (max) characters long.":
    "Les noms de buckets doivent comporter entre 3 (min) et 63 (max) caractères.",
  "Bucket names must be unique within a partition.":
    "Les noms de buckets doivent être uniques au sein d'une partition.",
  "Bucket names must not be formatted as an IP address (for example, 192.168.5.4).":
    "Les noms de bucket ne doivent pas être formatés comme une adresse IP (par exemple, 192.168.5.4).",
  "Bucket names must not contain two adjacent periods, or a period adjacent to a hyphen.":
    "Les noms de buckets ne doivent pas contenir deux points adjacents, ni un point adjacent à un trait d'union.",
  "Bucket names must not end with the suffix -s3alias. This suffix is reserved for access point alias names.":
    "Les noms de bucket ne doivent pas se terminer par le suffixe -s3alias. Ce suffixe est réservé aux noms d'alias de point d'accès.",
  "Bucket names must not start with the prefix xn--.":
    "Les noms de buckets ne doivent pas commencer par le préfixe xn--.",
  "Bucket notification configuration":
    "Configuration des notifications du bucket",
  "bucket notifications": "notifications de bucket",
  "Bucket Object-Lock configurations": "Bucket Object-Lock configurations",
  "Bucket Policies": "Politiques du bucket",
  "Bucket Replication Configuration":
    "Configuration de la réplication du bucket",
  "Bucket Tags": "Balises de bucket",
  "bucket-default": "bucket par défaut",
  "Buckets Results": "Résultats des buckets",
  "Buckets:": "Buckets :",
  "Bypass Governance Mode": "Contourner le mode Gouvernance",
  Bytes: "Octets",
  "Calls to Trace": "Appels à tracer",
  Cancelled: "Annulé",
  "Cannot delete currently logged in user":
    "Impossible de supprimer l'utilisateur actuellement connecté",
  "Cannot delete currently logged in user {user}":
    "Impossible de supprimer l’utilisateur connecté {user}",
  "Cert Authority": "Autorité de certification",
  "Change Access Policy": "Modifier la politique d'accès",
  "Change Legal Hold rules for this File":
    "Modifier la conservation légale de ce fichier",
  "Change Password": "Changer le mot de passe",
  "Change Password for {user}": "Changer le mot de passe pour {user}",
  "Change password for: {user}": "Changer le mot de passe pour : {user}",
  "Change Retention rules for this File":
    "Modifier les règles de rétention de ce fichier",
  "Change Tags for this File": "Modifier les balises pour ce fichier",
  "Change User Password": "Modifier le mot de passe de l'utilisateur",
  "Changes to Bucket features such as":
    "Modifications apportées aux fonctionnalités du bucket telles que",
  "Choose or create a new path": "Choisir ou créer un nouveau chemin",
  "Claim from which SILO will read the policy or role to use":
    "Claim à partir duquel SILO lit la politique ou le rôle à utiliser",
  "Claim Name": "Nom du claim",
  "Claim Prefix": "Préfixe du claim",
  "Claim User Info": "Claim d’infos utilisateur",
  Clear: "Effacer",
  "Click on a user to view the full listing of associated Access Keys. All Access Keys associated with a user will be deleted along with the user.":
    "Cliquez sur un utilisateur pour afficher la liste complète des clés d'accès associées. Toutes les clés d'accès associées à un utilisateur seront supprimées avec l'utilisateur.",
  client: "client",
  "Client Auth determines the Kafka server's policy for TLS client authorization":
    "Client Auth détermine la politique du serveur Kafka pour l'autorisation client TLS",
  "Client Cert": "Certificat client",
  "Client cert for mTLS authentication":
    "Certificat client pour l'authentification mTLS",
  "Client cert for NATS mTLS auth":
    "Certificat client pour NATS authentification mTLS",
  "Client Cert Key": "Clé de certificat client",
  "Client cert key for mTLS authentication":
    "Clé de certificat client pour l'authentification mTLS",
  "Client cert key for NATS mTLS authorization":
    "Clé de certificat client pour NATS autorisation mTLS",
  "Client ID is required": "L’ID client est requis",
  "Client Key": "Clé client",
  "Client ping commands interval in s,m,h,d. Disabled by default":
    "Intervalle des commandes ping du client en s, m, h, d. Désactivé par défaut",
  "Client Secret is required": "Le secret client est requis",
  "Client Secret must be re-entered to change OpenID configurations":
    "Le secret client doit être ressaisi pour modifier les configurations OpenID",
  "client TLS cert": "client TLS certificat",
  "client TLS key": "client TLS clé",
  "ClientAuth determines the Kafka server's policy for TLS client authorization":
    "ClientAuth détermine la politique du serveur Kafka pour l'autorisation client TLS",
  "Cluster Health Report will be generated, you will be able to download the JSON File.":
    "Le rapport d’état du cluster va être généré ; vous pourrez télécharger le fichier JSON.",
  code: "Code",
  "Comma separated list of Kafka broker addresses":
    "Liste d'adresses de courtiers Kafka séparées par des virgules",
  Comment: "Commentaire",
  Comments: "Commentaires",
  Compliance: "Conformité",
  Compression: "Compression",
  "Concurrent:": "Concurrent :",
  Config: "Configuration",
  "Config Name is required": "Le nom de la configuration est requis",
  "Config URL": "URL de configuration",
  "Config URL for identity provider configuration":
    "URL de configuration du fournisseur d’identité",
  "Config URL is required": "L’URL de configuration est requise",
  "Configuration cannot be disabled / enabled in this module as LDAP environment variables are set for this SILO instance.":
    "La configuration ne peut pas être désactivée/activée dans ce module car LDAP les variables d'environnement sont définies pour cette SILO instance.",
  "Configuration cannot be disabled / enabled in this module as OpenID environment variables are set for this SILO instance.":
    "La configuration ne peut pas être désactivée/activée dans ce module car OpenID les variables d'environnement sont définies pour cette SILO instance.",
  "Configuration cannot be edited in this module as LDAP environment variables are set for this SILO instance.":
    "La configuration ne peut pas être modifiée dans ce module car les variables d'environnement LDAP sont définies pour cette instance SILO.",
  "Configuration cannot be edited in this module as OpenID environment variables are set for this SILO instance.":
    "La configuration ne peut pas être modifiée dans ce module car les variables d'environnement OpenID sont définies pour cette instance SILO.",
  "Configuration saved successfully": "Configuration enregistrée avec succès",
  "Configure a {remoteTier} to receive transitioned Objects":
    "Configurez un {remoteTier} pour recevoir les objets en transition",
  "Configure Bucket": "Configurer le bucket",
  "Configuring an external IDP enables Single-Sign On workflows, where applications authenticate against the external IDP before accessing SILO.":
    "La configuration d'un IDP externe active les workflows d'authentification unique, où les applications s'authentifient auprès du IDP externe avant d'accéder au SILO.",
  "Confirm Dialogs": "Boîtes de dialogue de confirmation",
  "connected server": "serveur connecté",
  "Connection String": "Chaîne de connexion",
  "Console Credentials": "Identifiants de la console",
  "Console LICENSE": "LICENCE de la console",
  "Console portions © Georg Mangold and contributors.":
    "Parties de la console © Georg Mangold et contributeurs.",
  "Console predecessor": "Prédécesseur de la console",
  "Copy to Clipboard": "Copier dans le Presse-papiers",
  Copyright: "Droit d'auteur",
  "Coredns Path": "Chemin Coredns",
  "Cors Allow Origin": "Origine autorisée CORS",
  "Could not process drag and drop.":
    "Impossible de traiter le glisser-déposer.",
  "CPU Info": "CPU Infos",
  "Create {idpType} configuration": "Créer une configuration {idpType}",
  "create a bucket": "créer un bucket",
  "Create a new cryptographic key in the Key Management Service server connected to SILO.":
    "Créez une nouvelle clé cryptographique sur le serveur Key Management Service connecté à SILO.",
  "create a new path": "créer un nouveau chemin",
  "create a Policy": "créer une politique",
  "Create access key": "Créer une clé d'accès",
  "Create Access Key": "Créer une clé d'accès",
  "Create Access Key for {user}": "Créer une clé d'accès pour {user}",
  "Create Access Keys": "Créer des clés d'accès",
  "Create Configuration": "Créer une configuration",
  "Create Configurations": "Créer des configurations",
  "Create Group": "Créer un groupe",
  "Create Key": "Créer une clé",
  "Create new path": "Créer un nouveau chemin",
  "Create OpenID Configuration": "Créer une configuration OpenID",
  "Create Policies": "Créer des politiques",
  "Create Policy": "Créer une politique",
  "Create Rules": "Créer des règles",
  "Create Tier": "Créer un niveau",
  "Create User": "Créer un utilisateur",
  "create users": "créer des utilisateurs",
  "Create Users": "Créer des utilisateurs",
  "Created At": "Créé à",
  "Created By": "Créé par",
  "Creation and deletion of all IAM users, groups, policies and their mappings to users or groups":
    "Création et suppression de tous les utilisateurs, groupes, politiques IAM et de leurs associations",
  "Creation and deletion of buckets and objects":
    "Création et suppression de buckets et d'objets",
  "Creation and deletion of service accounts (except those owned by the root user)":
    "Création et suppression de comptes de service (sauf ceux appartenant à l'utilisateur root)",
  "Creation of STS credentials": "Création des identifiants STS",
  Credentials: "Identifiants",
  current: "courant",
  Current: "Actuel",
  "Current Endpoint:": "Point de terminaison actuel :",
  "Current Password": "Mot de passe actuel",
  "Current Path:": "Chemin actuel :",
  "Current Policy": "Politique actuelle",
  "Current Status": "État actuel",
  "Current Status:": "État actuel :",
  "Current Tags:": "Balises actuelles :",
  "Current User Policy - edit the JSON to remove permissions for this Access Key":
    "Politique utilisateur actuelle - modifiez le JSON pour supprimer les autorisations pour cette clé d'accès",
  "Current Version": "Version actuelle",
  "CURRENT VERSION": "VERSION ACTUELLE",
  "Currently Configured Endpoints":
    "Points de terminaison actuellement configurés",
  custom: "personnalisé",
  Custom: "Personnalisé",
  Cycle: "Cycle",
  Database: "Base de données",
  Date: "Date",
  day: "jour",
  days: {
    one: "jour",
    other: "jours",
    many: "jours",
  },
  Days: "Jours",
  "DB table name to store/update events, table is auto-created":
    "Nom de la table de BD pour stocker/mettre à jour les événements (créée automatiquement)",
  December: "décembre",
  Default: "Par défaut",
  "Default Key ID:": "ID de clé par défaut :",
  "Define which actions are permitted on a specified resource.":
    "Définir quelles actions sont autorisées sur une ressource spécifiée.",
  "Delay Multiplier": "Multiplicateur de délai",
  "DELETE - Object Deleted": "DELETE - Objet supprimé",
  "Delete {name}": "Supprimer {name}",
  "Delete Access Key": "Supprimer la clé d'accès",
  "Delete Access Keys": "Supprimer les clés d'accès",
  "Delete All": "Tout supprimer",
  "Delete All Versions": "Supprimer toutes les versions",
  "Delete Anonymous Access Rule": "Supprimer la règle d'accès anonyme",
  "Delete Bucket": "Supprimer le bucket",
  "Delete Configuration": "Supprimer la configuration",
  "Delete Endpoint": "Endpoint",
  "Delete Event": "Supprimer l'événement",
  "Delete Group": "Supprimer le groupe",
  "delete Groups": "supprimer des groupes",
  "Delete Groups": "Supprimer des groupes",
  "Delete Lifecycle Rule": "Supprimer la règle de cycle de vie",
  "Delete Marker": "Marqueur de suppression",
  "Delete Non-Current versions": "Supprimer les versions non actuelles",
  "Delete Object": "Supprimer l'objet",
  "Delete Objects": "Supprimer des objets",
  "delete Policies": "supprimer les politiques",
  "Delete Policy": "Supprimer la politique",
  "Delete Replication Rule": "Supprimer la règle de réplication",
  "Delete Replication Site": "Supprimer le site de réplication",
  "Delete Selected": "Supprimer la sélection",
  "Delete Selected Files": "Supprimer les fichiers sélectionnés",
  "Delete Selected Replication Rules":
    "Supprimer les règles de réplication sélectionnées",
  "Delete Selected Versions": "Supprimer les versions sélectionnées",
  "Delete Site": "Supprimer le site",
  "Delete Tag": "Supprimer la balise",
  "Delete Tier": "Supprimer le niveau",
  "delete user": "supprimer un utilisateur",
  "Delete User": "Supprimer un utilisateur",
  "delete users": "supprimer des utilisateurs",
  "Delete Users": "Supprimer des utilisateurs",
  "Delete version": "Supprimer la version",
  "Delete Webhook": "Supprimer Webhook",
  Deleted: "Supprimé",
  DELETED: "SUPPRIMÉ",
  Deletes: "Suppressions",
  "Delivery Mode": "Mode de livraison",
  Description: "Description",
  Destination: "Destination",
  "Detailed Results:": "Résultats détaillés :",
  Disable: "Désactiver",
  "Disable LDAP": "Désactiver LDAP",
  "Disable SSL certificate verification ":
    "Désactiver la vérification du certificat SSL",
  "disable users": "désactiver les utilisateurs",
  Disabled: "Désactivé",
  "Display Name": "Nom d'affichage",
  "Display Object Versions": "Afficher les versions d'objet",
  "Display only Errors": "Afficher uniquement les erreurs",
  "Display Versions for this file": "Afficher les versions de ce fichier",
  "No object versions are available": "Aucune version d'objet n'est disponible",
  "Distributed Mode": "Mode distribué",
  "DN (Distinguished Name) for LDAP read-only service account used to perform DN and group lookups":
    "DN (nom distinctif) pour LDAP compte de service en lecture seule utilisé pour effectuer DN et des recherches de groupe",
  documentation: "documentation",
  Done: "Terminé",
  "Download all access credentials":
    "Téléchargez tous les identifiants d'accès",
  "Download all access credentials to a JSON file. NOTE: This file is not formatted for import using mc alias import. If you plan to import this alias from the file, please use the Download for Import button. ":
    "Téléchargez tous les identifiants d’accès dans un fichier JSON. REMARQUE : ce fichier n’est pas formaté pour l’importation via mc alias import. Si vous prévoyez d’importer cet alias depuis le fichier, utilisez le bouton Télécharger pour l’importation.",
  "Download as CSV": "Télécharger en tant que CSV",
  "Download as PNG": "Télécharger en tant que PNG",
  "Download credentials in a JSON file formatted for import using mc alias import. This will only include the default login credentials.":
    "Téléchargez les identifiants dans un fichier JSON formaté pour l’importation via mc alias import. Cela n’inclura que les identifiants de connexion par défaut.",
  "Download File": "Télécharger le fichier",
  "Download for import": "Télécharger pour importer",
  "Download JSON": "Télécharger JSON",
  "Download of multiple files failed.":
    "Le téléchargement de plusieurs fichiers a échoué.",
  "Download Results": "Télécharger les résultats",
  "Download Selected": "Télécharger la sélection",
  "Download selected objects as Zip. Any Deleted objects in the selection would be skipped from download.":
    "Téléchargez les objets sélectionnés au format Zip. Tous les objets supprimés de la sélection seront ignorés du téléchargement.",
  "Download this Object": "Télécharger cet objet",
  "Download this version": "Téléchargez cette version",
  "Download widget data": "Télécharger les données du widget",
  "Downloads / Uploads": "Téléchargements / Uploads",
  "Drives Partitions Info": "Partitions des disques",
  "Drives:": "Disques :",
  "DSN String": "Chaîne DSN",
  Durable: "Durable",
  Duration: "Durée",
  "During the speed test all your production traffic will be temporarily suspended.":
    "Pendant le test de vitesse, tout votre trafic de production sera temporairement suspendu.",
  "e.g. 503": "ex. : 503",
  "e.g. FunctionName2055": "ex. : FunctionName2055",
  "e.g. Method 2056": "ex. : Method 2056",
  "e.g. my-bucket/my-prefix/*": "ex. : my-bucket/my-prefix/*",
  "e.g. us-west-rack-2": "ex. : us-west-rack-2",
  "Each user can access only those resources and operations which are explicitly granted by the built-in role. SILO denies access to any other resource or action by default.":
    "Chaque utilisateur ne peut accéder qu'aux ressources et opérations explicitement accordées par le rôle intégré. SILO refuse l'accès à toute autre ressource ou action par défaut.",
  Edit: "Modifier",
  "edit a Policy": "modifier une politique",
  "Edit Anonymous Access Rule for {target}":
    "Modifier la règle d'accès anonyme pour {target}",
  "Edit Audit Webhook": "Modifier l'audit Webhook",
  "Edit Bucket Replication": "Modifier la réplication du bucket",
  "Edit Configuration": "Modifier la configuration",
  "Edit details of - {name}": "Modifier les détails de - {name}",
  "Edit Endpoint": "Modifier le point de terminaison",
  "edit Group membership": "modifier l'adhésion au groupe",
  "Edit Lifecycle Configuration": "Modifier la configuration du cycle de vie",
  "Edit Logger Webhook": "Modifier l'enregistreur Webhook",
  "Edit Members": "Modifier les membres",
  "Edit Replication Endpoint":
    "Modifier le point de terminaison de réplication",
  "Edit Tags": "Modifier les balises",
  "Edit the Default Audit Webhook": "Modifier l'audit par défaut Webhook",
  "Edit the Default Logger Webhook":
    "Modifier l'enregistreur par défaut Webhook",
  "Edit Webhook": "Modifier Webhook",
  "Effect:": "Effet :",
  "Elasticsearch index to store/update events, index is auto-created":
    "Elasticsearch index pour stocker/mettre à jour les événements, l'index est créé automatiquement",
  "Elasticsearch server's address, with optional authentication info":
    "Elasticsearch adresse du serveur, avec informations d'authentification facultatives",
  Enable: "Activer",
  "Enable audit_kafka target": "Activer la cible audit_kafka",
  "Enable Bucket Encryption": "Activer le chiffrement du bucket",
  "Enable Bucket Quota": "Activer le quota de bucket",
  "Enable LDAP": "Activer LDAP",
  "enable or disable Groups": "activer ou désactiver les groupes",
  "enable or disable users": "activer ou désactiver les utilisateurs",
  "Enable SASL (Simple Authentication and Security Layer) authentication":
    "Activer l'authentification SASL (Simple Authentication and Security Layer)",
  "Enable TLS (Transport Layer Security)":
    "Activer TLS (Sécurité de la couche de transport)",
  "enable users": "activer les utilisateurs",
  "Enable your preferred options to get filtered records.":
    "Activez vos options préférées pour obtenir des enregistrements filtrés.",
  Enabled: "Activé",
  Encrypt: "Chiffrer",
  "Encryption Key": "Clé de cryptage",
  "Encryption Type": "Type de cryptage",
  "Encryption:": "Cryptage :",
  "End Time:": "Heure de fin :",
  Endpoint: "Endpoint",
  endpoints: "Endpoint :",
  Endpoints: "Endpoints",
  "Enter '/' to apply the rule to all prefixes and objects at the bucket root. Do not include the wildcard asterisk '*' as part of the prefix *unless* it is an explicit part of the prefix name. The Console automatically appends an asterisk to the appropriate sections of the resulting IAM policy.":
    "Entrez '/' pour appliquer la règle à tous les préfixes et objets à la racine du bucket. N'incluez pas l'astérisque générique « * » dans le préfixe *sauf* s'il s'agit d'une partie explicite du nom du préfixe. La console ajoute automatiquement un astérisque aux sections appropriées de la politique IAM résultante.",
  "Enter a comment": "Saisir un commentaire",
  "Enter a description": "Saisir une description",
  "Enter a Mime Type": "Saisir un type MIME",
  "Enter a name": "Saisir un nom",
  "Enter Access Key": "Saisir la clé d'accès",
  "Enter Account Key": "Saisir la clé de compte",
  "Enter Account Name": "Saisir le nom du compte",
  "Enter Address": "Saisir l'adresse",
  "Enter allowed origin e.g. https://example.com":
    "Saisir l'origine autorisée, par ex. https://example.com",
  "Enter an Extension": "Saisir une extension",
  "Enter Auth Token": "Saisir le jeton d'authentification",
  "Enter auth_token": "Saisir auth_token",
  "Enter Brokers": "Saisir les courtiers",
  "Enter Bucket": "Saisir le bucket",
  "Enter Cert Authority": "Saisir l'autorité de certification",
  "Enter Claim Name": "Saisir le nom du claim",
  "Enter Claim Prefix": "Saisir le préfixe du claim",
  "Enter Client Cert": "Saisir le certificat client",
  "Enter Client Cert Key": "Saisir la clé de certificat client",
  "Enter Client ID": "Saisir l’ID client",
  "Enter Client Key": "Saisir la clé client",
  "Enter Client Secret": "Saisir le secret client",
  "Enter Coredns Path": "Saisir le chemin Coredns",
  "Enter custom notes if any":
    "Saisissez des notes personnalisées le cas échéant",
  "Enter Cycle": "Entrer le cycle",
  "Enter DB Name": "Saisir le nom de la BD",
  "Enter Delay": "Entrer le délai",
  "Enter Delivery Mode": "Saisir en mode de livraison",
  "Enter Destination Identifier": "Saisir l'identifiant de destination",
  "Enter Display Name": "Saisir le nom d'affichage",
  "Enter DSN String": "Saisir la chaîne DSN",
  "Enter Endpoint": "Saisir l’endpoint",
  "Enter Exchange": "Saisir l’exchange",
  "Enter Exchange Type": "Saisir le type d’exchange",
  "Enter Format": "Entrer le format",
  "Enter Host": "Saisir l'hôte",
  "Enter Index": "Entrer l'index",
  "Enter Kafka Broker": "Saisir le broker Kafka",
  "Enter Kafka Topic": "Saisir le sujet Kafka",
  "Enter Kafka Version": "Saisir la version de Kafka",
  "Enter Keep Alive Interval": "Saisir l’intervalle keep-alive",
  "Enter Key": "Saisir la clé",
  "Enter Max IO": "Saisir Max IO",
  "Enter Max Sleep Duration": "Saisir la pause maximale",
  "Enter Max Wait": "Saisir l'attente maximale",
  "Enter Name (Eg. REMOTE-TIER)": "Saisir le nom (par exemple REMOTE-TIER)",
  "Enter NATS password": "Saisir le mot de passe NATS",
  "Enter NATS Subject": "Saisir le sujet NATS",
  "Enter NATS token": "Saisir le jeton NATS",
  "Enter NATS Username": "Saisir le nom d’utilisateur NATS",
  "Enter New Tag Key": "Saisir une nouvelle clé de balise",
  "Enter New Tag Label": "Saisir une nouvelle étiquette de balise",
  "Enter nsqd_address": "Saisir nsqd_address",
  "Enter Password": "Saisir le mot de passe",
  "Enter Path Prefix": "Saisir le préfixe du chemin",
  "Enter Ping Interval": "Saisir l'intervalle de ping",
  "Enter Port": "Saisir le port",
  "Enter Prefix": "Saisir le préfixe",
  "Enter QOS": "Saisir QOS",
  "Enter Queue Dir": "Saisir rép. de file",
  "Enter Queue Directory": "Entrer dans le répertoire de file d'attente",
  "Enter Queue Limit": "Saisir la limite de file d'attente",
  "Enter Reconnect Interval": "Saisir l'intervalle de reconnexion",
  "Enter Replication Failed Workers":
    "Saisir les nœuds de calcul ayant échoué à la réplication",
  "Enter Replication Workers": "Saisir les travailleurs de réplication",
  "Enter Requests Max": "Saisir le nombre maximum de demandes",
  "Enter Routing Key": "Saisir la clé de routage",
  "Enter SASL Mechanism": "Saisir le mécanisme SASL",
  "Enter SASL Password": "Saisir le mot de passe SASL",
  "Enter SASL Username": "Saisir le nom d’utilisateur SASL",
  "Enter Secret Key": "Saisir la clé secrète",
  "Enter SSL Mode": "Saisir le mode SSL",
  "Enter Storage Class": "Saisir la classe de stockage",
  "Enter Streaming Cluster ID": "Saisir l’ID du cluster de streaming",
  "Enter Streaming in flight value":
    "Saisir le nombre max. de messages en cours",
  "Enter Table Name": "Saisir le nom de la table",
  "Enter Tag Key": "Saisir la clé de balise",
  "Enter Tag Label": "Saisir le libellé du tag",
  "Enter the new Folder Path": "Saisir le nouveau chemin du dossier",
  "Enter TLS Client Auth": "Saisir l’authentification client TLS",
  "Enter TLS Client Cert": "Saisir le certificat client TLS",
  "Enter TLS Client Key": "Saisir la clé client TLS",
  "Enter Topic": "Entrer le sujet",
  "Enter URL": "Saisir URL",
  "Enter User": "Entrer l'utilisateur",
  "Enter Username": "Saisir le nom d'utilisateur",
  Entities: "Entités",
  "Erasure Health": "État EC",
  Error: "Erreur",
  "Error - File size too large": "Erreur - Taille du fichier trop grande",
  "Error retrieving access keys":
    "Erreur lors de la récupération des clés d'accès",
  "Error:": "Erreur :",
  Errors: "Erreurs",
  Erros: "Erreurs",
  "ETAG:": "ETAG :",
  Event: "Événement",
  "Event Notifications": "Notifications d'événements",
  Exchange: "Échange",
  "Exchange Type": "Type d'échange",
  "Exclude Folders": "Exclure les dossiers",
  "exclude folders and prefixes": "exclure les dossiers et les préfixes",
  "Exclude folders and prefixes": "Exclure les dossiers et les préfixes",
  "Excluded Prefixes": "Préfixes exclus",
  "Excluded Prefixes :": "Préfixes exclus :",
  "Existing Objects": "Objets existants",
  "Expand graph": "Agrandir le graphique",
  "Expire All Versions": "Faire expirer toutes les versions",
  "Expire Delete Marker": "Expiration du marqueur de suppression",
  "Expired All Versions": "Toutes les versions expirées",
  "Expired Object Delete Marker": "Marqueur de suppression d'objet expiré",
  Expiry: "Expiration",
  "Expiry Days": "Jours d'expiration",
  Export: "Exporter",
  Extensions: "Extensions",
  'Extensions to compress e.g. ".txt", ".log" or ".csv" -  you can write one per field':
    'Extensions à compresser par ex. ".txt", ".log" ou ".csv" - vous pouvez en écrire un par champ',
  Failed: "Échec",
  Failures: "Échecs",
  False: "Faux",
  Features: "Caractéristiques",
  February: "février",
  "File Configuration": "Configuration du fichier",
  "File couldn't be loaded. Please try Download instead":
    "Le fichier n'a pas pu être chargé. Veuillez plutôt essayer de télécharger",
  "File couldn't be previewed using file extension or mime type. Please try Download instead":
    "Le fichier n'a pas pu être prévisualisé en utilisant l'extension de fichier ou le type MIME. Veuillez plutôt essayer de télécharger",
  "File download will be handled directly by the browser.":
    "Le téléchargement du fichier sera géré directement par le navigateur.",
  "Files larger than 5 GiB use a single, non-resumable browser request. Use mcli for multipart uploads.":
    "Les fichiers de plus de 5 Gio utilisent une seule requête de navigateur sans reprise. Utilisez mcli pour les téléchargements en plusieurs parties.",
  "File or Path to inspect": "Fichier ou chemin à inspecter",
  "File Preview": "Aperçu du fichier",
  "File preview couldn't be displayed, Please try Download instead.":
    "L'aperçu du fichier n'a pas pu être affiché. Veuillez plutôt essayer de télécharger.",
  "Filename should be less than 200 characters long.":
    "Le nom du fichier doit contenir moins de 200 caractères.",
  Filter: "Filtre",
  "Filter Users": "Filtrer les utilisateurs",
  "Filter:": "Filtre :",
  Filters: "Filtres",
  "Folder cannot have the same name as an existing file":
    "Le dossier ne peut pas avoir le même nom qu'un fichier existant",
  "For each write operation to the bucket, SILO checks all configured replication rules for the bucket and applies the matching rule with highest configured priority.":
    "Pour chaque opération d'écriture dans le bucket, SILO vérifie toutes les règles de réplication configurées pour le bucket et applique la règle correspondante avec la priorité configurée la plus élevée.",
  'For each write operation to this "source" bucket, SILO checks all configured replication rules and applies the matching rule with highest configured priority.':
    "Pour chaque opération d'écriture dans ce bucket « source », SILO vérifie toutes les règles de réplication configurées et applique la règle correspondante avec la priorité configurée la plus élevée.",
  "For per-object retention settings, defer to the documentation for the PUT operation used by your preferred SDK.":
    "Pour les paramètres de rétention par objet, reportez-vous à la documentation de l'opération PUT utilisée par votre SDK préféré.",
  "For SSE-S3 or SSE-KMS encryption via KMS, all sites must have access to a central KMS deployment server.":
    "Pour le chiffrement SSE-S3 ou SSE-KMS via KMS, tous les sites doivent avoir accès à un serveur de déploiement central KMS.",
  Format: "Format",
  "full attribution stack": "pile d'attribution complète",
  "Full Log Information": "Informations complètes du journal",
  "Function Name": "Nom de la fonction",
  Functions: "Fonctions",
  "GET - Object accessed": "GET - Objet accédé",
  "Get Information": "Obtenir des informations",
  "GNU Affero General Public License, version 3":
    "GNU Licence Publique Générale Affero, version 3",
  "GNU AGPL v3 full text": "GNU AGPL texte intégral v3",
  Governance: "Gouvernance",
  Group: "Groupe",
  "Group Mappings": "Mappages de groupes",
  "Group Name": "Nom du groupe",
  "Group Status:": "Statut du groupe :",
  "Groups provide a simplified method for managing shared permissions among users with common access patterns and workloads. Client’s cannot authenticate to a SILO deployment using a group as an identity.":
    "Les groupes fournissent une méthode simplifiée pour gérer les autorisations partagées entre les utilisateurs ayant des modèles d'accès et des charges de travail communs. Les clients ne peuvent pas s'authentifier auprès d'un déploiement SILO en utilisant un groupe comme identité.",
  "Groups with this Policy associated": "Groupes associés à cette politique",
  "Guide to access policy structure":
    "Guide de structure des politiques d’accès",
  hard: "stricte",
  Heal: "Réparer",
  "Health Check Duration": "Durée du bilan de santé",
  "Health Info (Preview)": "Info Santé (Aperçu)",
  "Health Report": "Bilan de santé",
  "Health Report complete": "Rapport de santé terminé",
  "Health Report file is ready to be downloaded.":
    "Le fichier du rapport de santé est prêt à être téléchargé.",
  "Health report generated successfully!":
    "Rapport de santé généré avec succès !",
  "Health Report in progress...": "Bilan de santé en cours...",
  "Health Report started. Please do not refresh page during diagnosis.":
    "Le rapport de santé a démarré. Veuillez ne pas actualiser la page pendant le diagnostic.",
  Healthy: "Sain",
  "Hide advanced Filters": "Masquer les filtres avancés",
  "Hide Bucket Naming Rules": "Masquer les règles de dénomination des buckets",
  "Hide Object Versions": "Masquer les versions d'objet",
  hour: "heure",
  hours: {
    one: "heure",
    other: "heures",
    many: "heures",
  },
  Hours: "Heures",
  "IAM conditional statements": "IAM instructions conditionnelles",
  "IAM Policy": "IAM Politique",
  Id: "ID",
  Identifier: "Identifiant",
  "Identity provider Client ID": "ID client du fournisseur d’identité",
  "Identity provider Client Secret": "Secret client du fournisseur d'identité",
  "If the Health report cannot be generated at this time, please wait a moment and try again.":
    "Si le rapport de santé ne peut pas être généré à ce moment-là, veuillez patienter un moment et réessayer.",
  "If you are looking to change MINIO_ROOT_USER credentials,":
    "Si vous souhaitez modifier les identifiants MINIO_ROOT_USER,",
  "ILM - Object Transitioned": "ILM - Objet en transition",
  "ILM Rule": "ILM Règle",
  Import: "Importer",
  "incorporates and modifies": "incorpore et modifie",
  Index: "Index",
  "Initially, only one of the sites added for replication may have data. After site-replication is successfully configured, this data is replicated to the other (initially empty) sites. Subsequently, objects may be written to any of the sites, and they will be replicated to all other sites.":
    "Initialement, un seul des sites ajoutés pour la réplication peut contenir des données. Une fois la réplication de site configurée avec succès, ces données sont répliquées sur les autres sites (initialement vides). Par la suite, les objets pourront être écrits sur n’importe lequel des sites et seront répliqués sur tous les autres sites.",
  "Inspect Decryption Key": "Inspecter la clé de déchiffrement",
  "Inspect Object": "Inspecter l'objet",
  "Inspect this file": "Inspecter ce fichier",
  Internal: "Interne",
  "Invalid bucket name": "Nom de bucket invalide",
  "Invalid Endpoint set": "Ensemble de points de terminaison non valide",
  "Invalid Name": "Nom invalide",
  January: "janvier",
  "JSON Results:": "JSON Résultats :",
  July: "juillet",
  June: "juin",
  "Just now": "À l’instant",
  "Kafka topic used for bucket notifications":
    "Kafka sujet utilisé pour les notifications de bucket",
  "Keep Alive Interval": "Intervalle keep-alive",
  "Keep-alive interval for MQTT connections in s,m,h,d":
    "Intervalle de maintien pour MQTT connexions en s, m, h, d",
  Key: "Clé",
  "Key Management Service Endpoints:":
    "Points de terminaison du service de gestion de clés :",
  "Key Name": "Nom de la clé",
  "Key name cannot contain spaces":
    "Le nom de la clé ne peut pas contenir d'espaces",
  Keys: "Clés",
  "KMS Key ID": "ID de clé KMS",
  "Last Modified": "Dernière modification",
  "Last modified:": "Dernière modification :",
  "Last Modified:": "Dernière modification :",
  "Latency Histogram": "Histogramme de latence",
  "LDAP Enabled": "LDAP Activé",
  "Learn more about {link}.": "En savoir plus sur {link}.",
  "Learn more about Access Keys": "En savoir plus sur les clés d'accès",
  "Learn more about Groups": "En savoir plus sur les groupes",
  "Learn more about LDAP Configurations":
    "En savoir plus sur LDAP Configurations",
  "Learn more about OpenID Connect Configurations":
    "En savoir plus sur les configurations de connexion OpenID",
  "Learn more about Policies": "En savoir plus sur les politiques",
  "Learn more about the Users feature":
    "En savoir plus sur la fonctionnalité Utilisateurs",
  "Learn more about TIERS": "En savoir plus sur les TIERS",
  "Legal Hold": "Conservation légale",
  "Legal Hold Status": "État de conservation légale",
  "Legal Hold:": "Mise en attente légale :",
  "licensing in full": "licence complète",
  Lifecycle: "Cycle de vie",
  "Lifecycle Configuration": "Configuration du cycle de vie",
  "Lifecycle Rules": "Règles du cycle de vie",
  Link: "Lien",
  'List of etcd endpoints e.g. "http://localhost:2379" - you can write one per field':
    'Liste des points de terminaison etcd, par ex. "http://localhost:2379" - vous pouvez en écrire un par champ',
  "List of origins allowed for CORS requests":
    "Liste des origines autorisées pour les CORS demandes",
  "List of Replicated Sites": "Liste des sites répliqués",
  "Load more": "Charger plus",
  "Load more Versions": "Charger plus de versions",
  "Load Time": "Temps de chargement",
  "Loading nodes": "Chargement des nœuds",
  "Local Buckets to replicate": "Buckets locaux à répliquer",
  Location: "Localisation",
  Locking: "Verrouillage",
  "Log Details": "Détails du journal",
  "Logger Webhook": "Enregistreur Webhook",
  "Lookup Bind DN is required": "La liaison de recherche DN est requise",
  "Lookup Bind Password is required":
    "Le mot de passe de liaison de recherche est requis",
  "Lookup Bind Password must be re-entered to change LDAP configurations":
    "Le mot de passe de liaison de recherche doit être ressaisi pour modifier les configurations LDAP",
  "Manage Groups": "Gérer les groupes",
  Mandatory: "Obligatoire",
  "Manually Configure String": "Configurer manuellement la chaîne",
  March: "Mars",
  "Max IO": "Max IO",
  "Max Sleep": "Pause max.",
  "Max Wait": "Attente maximale",
  "Maximum IO requests allowed between objects to slow down heal operation, e.g. 3":
    "Nombre maximal de requêtes d’E/S autorisées entre les objets pour ralentir la réparation, par ex. 3",
  "Maximum limit for undelivered messages, defaults to '10000'":
    "Limite maximale de messages non remis, par défaut '10000'",
  "Maximum number of concurrent requests, e.g. '1600'":
    "Nombre maximum de requêtes simultanées, par ex. '1600'",
  "Maximum sleep duration between objects to slow down heal operation, e.g. 2s":
    "Durée maximale de pause entre les objets pour ralentir la réparation, par ex. 2s",
  "Maximum wait time between operations, defaults to '15s'":
    "Temps d'attente maximum entre les opérations, par défaut '15s'",
  May: "Mai",
  "May try again or download Health report JSON File.":
    "Vous pouvez réessayer ou télécharger le fichier JSON du rapport d’état.",
  Members: "Membres",
  "Memory Info": "Informations sur la mémoire",
  Metadata: "Métadonnées",
  "Metadata Sync": "Synchronisation des métadonnées",
  Method: "Méthode",
  "Mime Types": "Types MIME",
  'Mime types e.g. "text/*", "application/json" or "application/xml" - you can write one per field':
    'Types MIME, par ex. "text/*", "application/json" ou "application/xml" - vous pouvez en écrire un par champ',
  minute: "minute",
  minutes: {
    one: "minute",
    other: "minutes",
    many: "minutes",
  },
  Minutes: "Minutes",
  Mode: "Mode",
  "Mode:": "Mode :",
  month: "mois",
  months: {
    one: "mois",
    other: "mois",
    many: "mois",
  },
  "More filter options": "Plus d'options de filtrage",
  "MQTT password": "MQTT mot de passe",
  "MQTT server endpoint e.g. `tcp://localhost:1883`":
    "MQTT point de terminaison du serveur, par ex. `tcp://localhost:1883`",
  "MQTT username": "MQTT nom d'utilisateur",
  "Multi Bucket lifecycle Assignments Results":
    "Résultats des attributions de cycle de vie multi-buckets",
  Name: "Nom",
  "Name for identity provider configuration":
    "Nom pour la configuration du fournisseur d'identité",
  "Name of the AMQP exchange": "Nom de l'échange AMQP",
  'Name of the location of the server e.g. "us-west-rack2"':
    'Nom de l’emplacement du serveur, par ex. "us-west-rack2"',
  "Name of the MQTT topic to publish": "Nom du MQTT sujet à publier",
  "Name:": "Nom :",
  'Namespace prefix to isolate tenants e.g. "customer1/"':
    'Préfixe d’espace de noms pour isoler les locataires, par ex. "customer1/"',
  "NATS password": "NATS mot de passe",
  "NATS server address e.g. '0.0.0.0:4222'":
    "NATS adresse du serveur, par ex. '0.0.0.0:4222'",
  "NATS subscription subject": "NATS sujet d'abonnement",
  "NATS token": "NATS jeton",
  "NATS username": "NATS nom d'utilisateur",
  "Network Info": "Informations réseau",
  "New {entity} Created": "Nouveau {entity} Créé",
  "New Audit Webhook": "Nouvel audit Webhook",
  "New Endpoint": "Nouveau point de terminaison",
  "New Endpoint:": "Nouveau point de terminaison :",
  "New Folder Path": "Nouveau chemin de dossier",
  "New Logger Webhook": "Nouvel enregistreur Webhook",
  "New Password": "Nouveau mot de passe",
  "New passwords don't match":
    "Les nouveaux mots de passe ne correspondent pas",
  "New Tag Key": "Nouvelle clé de balise",
  "New Tag Label": "Nouveau libellé de tag",
  Next: "Suivant",
  No: "Non",
  "No changes applied": "Aucune modification appliquée",
  "No Changes at this time": "Aucun changement pour le moment",
  "No data available": "Aucune donnée disponible",
  "No Groups Available": "Aucun groupe disponible",
  "No Policies Available": "Aucune politique disponible",
  "No query results yet": "Aucun résultat de requête pour l'instant",
  "No Results Available": "Aucun résultat disponible",
  "No Users to display": "Aucun utilisateur à afficher",
  "No Wait": "Sans attente",
  "no-expiry": "sans expiration",
  "Nodes:": "Nœuds :",
  "Non-blocking message delivery when set to 'on', default is 'off'":
    "Envoi de messages non bloquants lorsqu'il est défini sur « on », la valeur par défaut est « off »",
  "Non-Current": "Non actuel",
  "Non-current Expiration Days": "Expiration anciennes versions (j)",
  "Non-current Transition Days": "Jours de transition non courants",
  "Non-Current Version": "Version non actuelle",
  "Non-current Version Transition Storage Class":
    "Classe de stockage de transition de version non actuelle",
  None: "Aucun",
  "Not what you expected?": "Ce n'est pas ce à quoi vous vous attendiez ?",
  "Note:": "Remarque :",
  "Note: AccessKey and SecretKey values for every site is required while adding or editing peer sites":
    "Remarque : les valeurs AccessKey et SecretKey de chaque site sont requises lors de l’ajout ou de la modification de sites pairs.",
  November: "novembre",
  "NSQ server address e.g. '127.0.0.1:4150'":
    "NSQ adresse du serveur, par ex. '127.0.0.1:4150'",
  "NSQ topic": "NSQ sujet",
  "NSQD Address": "NSQD Adresse",
  "NULL VERSION": "VERSION NULLE",
  "Number of {unit} must be less than or equal to 2147483647":
    "Le nombre de {unit} doit être inférieur ou égal à 2147483647",
  "Number of {unit} to retain must be greater than zero":
    "Le nombre de {unit} à conserver doit être supérieur à zéro",
  "Number of messages to publish without waiting for ACKs":
    "Nombre de messages à publier sans attendre les ACK",
  "Number of replication workers for recently failed replicas, defaults to 4":
    "Nombre de travailleurs de réplication pour les répliques ayant récemment échoué, par défaut 4",
  "Number of replication workers, defaults to 100":
    "Nombre de travailleurs de réplication, par défaut 100",
  Object: "Objet",
  "Object Date": "Date de l'objet",
  "Object Filters": "Filtres d'objets",
  "Object Info": "Informations sur l'objet",
  "Object Locking:": "Verrouillage d'objet :",
  "Object Size": "Taille de l'objet",
  "Object Version": "Version de l'objet",
  "Objects deleted successfully.": "Objets supprimés avec succès.",
  "Objects in excluded prefixes do not replicate to any peer site or remote site.":
    "Les objets dans les préfixes exclus ne sont pas répliqués vers un site homologue ou un site distant.",
  "Objects List unavailable. Please review your WebSockets configuration and try again":
    "Liste d'objets indisponible. Veuillez vérifier votre configuration WebSockets et réessayer",
  "Objects:": "Objets :",
  "Objs/S": "Objs/S",
  October: "octobre",
  of: "de",
  "Only empty tiers can be deleted. If the tier has had objects transitioned into it, it cannot be removed.":
    "Seuls les niveaux vides peuvent être supprimés. Un niveau vers lequel des objets ont été transférés ne peut pas être supprimé.",
  "Opaque string or JWT authorization token":
    "Chaîne opaque ou JWT jeton d'autorisation",
  "Open Dialog": "Ouvrir la boîte de dialogue",
  "OpenID Configurations": "OpenID Configurations",
  "OS Info": "OS Infos",
  other: "autre",
  "Password for LDAP read-only service account used to perform DN and group lookups":
    "Mot de passe pour le compte de service LDAP en lecture seule utilisé pour effectuer des recherches DN et de groupe",
  "Password for SASL/PLAIN or SASL/SCRAM authentication":
    "Mot de passe pour l'authentification SASL/PLAIN ou SASL/SCRAM",
  "Passwords must be at least 8 characters long":
    "Les mots de passe doivent comporter au moins 8 caractères",
  Path: "Chemin",
  "Path cannot start with /": "Le chemin ne peut pas commencer par /",
  "Path copied to clipboard": "Chemin copié dans le presse-papiers",
  "Path Prefix": "Préfixe du chemin",
  "Path to certificate chain of the target NATS server":
    "Chemin d'accès à la chaîne de certificats du serveur cible NATS",
  "Path to client certificate for mTLS authorization":
    "Chemin d'accès au certificat client pour l'autorisation mTLS",
  "Path to client key for mTLS authorization":
    "Chemin d'accès à la clé client pour l'autorisation mTLS",
  "Peer Sites": "Sites pairs",
  "Perform bitrot scan on disks when checking objects during scanner":
    "Effectuer une analyse bitrot sur les disques lors de la vérification des objets pendant le scanner",
  "Performance test": "Test de performances",
  "Persist queue across broker restarts when set to 'on', default is 'off'":
    "Persistance de la file d'attente lors des redémarrages du courtier lorsqu'elle est définie sur « on », la valeur par défaut est « off »",
  "Ping Interval": "Intervalle de ping",
  "Please avoid the use of root credentials for this feature":
    "Veuillez éviter d'utiliser les informations d'identification root pour cette fonctionnalité",
  "Please configure {entity} first to use this feature.":
    "Veuillez d'abord configurer {entity} pour utiliser cette fonctionnalité.",
  "Please deploy a server in {distributedMode} to use these features.":
    "Veuillez déployer un serveur en {distributedMode} pour utiliser ces fonctionnalités.",
  "Please deploy a server in {mode} to use this feature.":
    "Veuillez déployer un serveur en {mode} pour utiliser cette fonctionnalité.",
  "N/A": "N/A",
  "Enter a positive quota below 8 PiB, with up to two decimal places. Use mcli for larger quotas.":
    "Saisissez un quota positif inférieur à 8 PiB, avec jusqu'à deux décimales. Utilisez mcli pour des quotas plus importants.",
  "The current quota is 8 PiB or larger, which the browser cannot edit exactly. Change it with mcli, enter a smaller quota, or disable it here.":
    "Le quota actuel est de 8 PiB ou plus, que le navigateur ne peut pas modifier exactement. Modifiez-le avec mcli, entrez un quota plus petit ou désactivez-le ici.",
  "Please Login via the configured external identity provider.":
    "Veuillez vous connecter via le fournisseur d'identité externe configuré.",
  "Please note": "Attention",
  "Please note that this may cause your system to not be accessible":
    "Veuillez noter que cela peut empêcher votre système d'être accessible",
  "Please refer to {link} credentials.":
    "Veuillez vous référer aux identifiants {link}.",
  "Please select / type the desired remote bucket were you want the local data to be replicated.":
    "Veuillez sélectionner/saisir le bucket distant souhaité dans lequel vous souhaitez que les données locales soient répliquées.",
  "Please select a valid duration.": "Veuillez sélectionner une durée valide.",
  "Please select Groups on which you want to apply Policies":
    "Veuillez sélectionner les groupes sur lesquels vous souhaitez appliquer les politiques",
  "Please verify that string is uppercase only and contains valid characters (numbers, dashes & underscores).":
    "Veuillez vérifier que la chaîne est uniquement en majuscules et contient des caractères valides (chiffres, tirets et traits de soulignement).",
  Policy: "Politique",
  "Policy has no statements": "La politique ne contient aucune déclaration",
  "Policy mapping": "Mappage de politiques",
  "Policy Mappings": "Mappages de politiques",
  "Policy Name": "Nom de la politique",
  "Policy name cannot be empty": "Le nom de la politique ne peut pas être vide",
  "Policy successfully updated": "Politique mise à jour avec succès",
  "Policy Summary": "Résumé de la politique",
  "Portions © 2015–2026 MinIO, Inc.": "Parties © 2015–2026 MinIO, Inc.",
  prefix: "préfixe",
  Prefix: "Préfixe",
  "Preliminar Results:": "Résultats préliminaires :",
  preview: "aperçu",
  Preview: "Aperçu",
  "Preview - {object}": "Aperçu - {object}",
  "Preview Selected File": "Aperçu du fichier sélectionné",
  "Preview this File": "Aperçu de ce fichier",
  "Preview unavailable": "Aperçu indisponible",
  Priority: "Priorité",
  private: "privé",
  Private: "Privé",
  "Process Info": "Informations sur le processus",
  public: "public",
  Public: "Publique",
  "PUT - Object Uploaded": "Téléversé",
  "Query Filters": "Filtres de requête",
  "Query Results": "Résultats de la requête",
  Queue: "File d'attente",
  "Queue Dir": "Rép. de file",
  "Queue Directory": "Répertoire de file d'attente",
  "Queue Limit": "Limite de file d'attente",
  "Quietly ignore undelivered messages when set to 'off', default is 'on'":
    "Ignorer discrètement les messages non remis lorsqu'il est défini sur « off », la valeur par défaut est « on »",
  quota: "quota",
  Quota: "Quota",
  "Quota:": "Quota :",
  "Randomized access credentials are recommended, and provided by default. You may use your own custom Access Key and Secret Key by replacing the default values. After creation of any Access Key, you will be given the opportunity to view and download the account credentials.":
    "Les identifiants d'accès aléatoires sont recommandés et fournis par défaut. Vous pouvez utiliser votre propre clé d'accès et clé secrète personnalisées en remplaçant les valeurs par défaut. Après la création d'une clé d'accès, vous aurez la possibilité d'afficher et de télécharger les informations d'identification du compte.",
  "Raw Policy": "Politique brute",
  readonly: "lecture seule",
  readwrite: "lecture-écriture",
  "Reconnect Interval": "Intervalle de reconnexion",
  "Reconnect interval for MQTT connections in s,m,h,d":
    "Intervalle de reconnexion pour MQTT connexions en s, m, h, d",
  "Redirect URI Dynamic": "URI de redirection dynamique",
  "Redis key to store/update events, key is auto-created":
    "Redis clé pour stocker/mettre à jour les événements, la clé est créée automatiquement",
  "Redis server password": "Redis mot de passe du serveur",
  "Redis server's address e.g. `localhost:6379`":
    "Adresse du serveur Redis, par ex. `localhost:6379`",
  Refresh: "Actualiser",
  "Refresh List": "Actualiser la liste",
  Region: "Région",
  "Remote Bucket Assignments": "Assignations de buckets à distance",
  "Remote Configuration": "Configuration à distance",
  "Remote Endpoint Configuration":
    "Configuration du point de terminaison distant",
  "Remote Host": "Hôte distant",
  "remote tier": "niveau distant",
  "Remove Row": "Supprimer la ligne",
  "Remove Selected Replication Rules":
    "Supprimer les règles de réplication sélectionnées",
  "Remove Selected Rules": "Supprimer les règles sélectionnées",
  "Remove the reference to the object if no versions are left":
    "Supprimez la référence à l'objet s'il ne reste aucune version",
  "Removes all the versions of the object already expired":
    "Supprime toutes les versions de l'objet déjà expirées",
  "Rename Download": "Renommer le téléchargement",
  "REPLICA - Object Replicated": "REPLICA - Objet répliqué",
  "Replicate existing objects": "Répliquer des objets existants",
  "Replicate soft deletes": "Répliquer les suppressions logiques",
  "Replicate versioned deletes": "Répliquer les suppressions de versions",
  Replication: "Réplication",
  "Replication Failed Workers": "Travailleurs ayant échoué à la réplication",
  "Replication Mode": "Mode de réplication",
  "Replication Options": "Options de réplication",
  "Replication Rules": "Règles de réplication",
  "Replication Status": "Statut de réplication",
  "Replication status for {type}: {name}.":
    "Statut de réplication pour {type} : {name}.",
  "Replication status from all Sites":
    "Statut de réplication de tous les sites",
  "Replication Workers": "Travailleurs de réplication",
  "Replication:": "Réplication :",
  "Reported Usage:": "Utilisation signalée :",
  "Request Content Length": "Longueur du contenu de la demande",
  "Request ID": "ID de requête",
  "Requests Max": "Requêtes max.",
  "Requests that took T ms or less": "Requêtes ayant pris T ms ou moins",
  Reset: "Réinitialiser",
  "Reset Configuration": "Réinitialiser la configuration",
  "Reset Default Webhook": "Réinitialiser les valeurs par défaut Webhook",
  "Resources:": "Ressources :",
  "Response Content Length": "Longueur du contenu de la réponse",
  "Response Status": "État de la réponse",
  "Response Status Code": "Code d'état de réponse",
  "Response Threshold": "Seuil de réponse",
  Restart: "Redémarrer",
  "Restore Defaults": "Valeurs par défaut",
  "Restore File Version": "Restaurer la version du fichier",
  "Restore this version": "Restaurer cette version",
  "Restrict beyond user policy":
    "Restreindre au-delà de la politique utilisateur",
  Results: "Résultats",
  Retention: "Rétention",
  "Retention Mode": "Mode de rétention",
  "Retention Policy:": "Politique de conservation :",
  "Retention Unit": "Unité de rétention",
  "Retention Validity": "Durée de rétention",
  "Retention:": "Rétention :",
  Retest: "Retester",
  "Retry Health Report": "Réessayer le rapport d'intégrité",
  Rewind: "Rembobiner",
  "Rewind - {bucket}": "Rembobinage - {bucket}",
  "Rewind Bucket": "Rembobiner le bucket",
  "Rewind to": "Rembobiner jusqu'à",
  "Role Policy": "Politique de rôle",
  rotating: "la rotation",
  "Routing Key": "Clé de routage",
  "Routing key for publishing": "Clé de routage pour la publication",
  "Rule State": "État de la règle",
  "Rule Type": "Type de règle",
  "Running {mcDu} without the {flag} flag or {df} will provide different values corresponding to the size of all {current} versions and the physical disk space occupied respectively.":
    "Exécuter {mcDu} sans l'indicateur {flag} ou {df} fournira différentes valeurs correspondant à la taille de toutes les versions {current} et à l'espace disque physique occupé respectivement.",
  "S3 lifecycle": "S3 cycle de vie",
  "SASL authentication mechanism": "Mécanisme d’authentification SASL",
  "SASL authentication mechanism, default 'PLAIN'":
    "SASL mécanisme d'authentification, par défaut 'PLAIN'",
  "SASL Mechanism": "Mécanisme SASL",
  "SASL Password": "Mot de passe SASL",
  "SASL Username": "Nom d’utilisateur SASL",
  "Save Event Destination": "Enregistrer la destination de l'événement",
  "Save Tier Configuration": "Enregistrer la configuration du niveau",
  Scanner: "Scanner",
  "SCANNER - Object has too many versions / Prefixes has too many sub-folders":
    "SCANNER - L'objet a trop de versions / Les préfixes ont trop de sous-dossiers",
  "Scanner delay multiplier, defaults to '10.0'":
    "Multiplicateur de délai du scanner, par défaut '10.0'",
  Scopes: "Portées",
  Search: "Rechercher",
  "Search Access Keys": "Rechercher les clés d'accès",
  "Search Groups": "Rechercher des groupes",
  "Search Keys with pattern": "Rechercher des clés par motif",
  "Search members": "Rechercher des membres",
  "Search Policies": "Rechercher des politiques",
  "Search target": "Cible de recherche",
  "Search Users": "Rechercher des utilisateurs",
  second: "seconde",
  seconds: {
    one: "seconde",
    other: "secondes",
    many: "secondes",
  },
  "Secret Key": "Clé secrète",
  "SecretKey is required": "SecretKey est requis",
  "Select {expiry} to delete Objects per this rule. Select {transition} to move Objects to a remote storage {tier} per this rule.":
    "Sélectionnez {expiry} pour supprimer des objets selon cette règle. Sélectionnez {transition} pour déplacer les objets vers un stockage distant {tier} selon cette règle.",
  "Select Bucket": "Sélectionnez le bucket",
  "Select from the list of displayed users to assign users to the new group at creation. These users inherit the policies assigned to the group.":
    "Sélectionnez dans la liste des utilisateurs affichés pour attribuer des utilisateurs au nouveau groupe lors de la création. Ces utilisateurs héritent des politiques attribuées au groupe.",
  "Select Groups to delete": "Sélectionnez les groupes à supprimer",
  "Select Multiple Versions": "Sélectionnez plusieurs versions",
  "Select Policy": "Sélectionnez la politique",
  "Select the desired level of access available to unauthenticated Users":
    "Sélectionnez le niveau d'accès souhaité disponible pour les utilisateurs non authentifiés",
  "Select Tier Type": "Sélectionnez le type de niveau",
  "Select to set expiry by days or newer noncurrent versions":
    "Sélectionnez pour définir l'expiration par jours ou par versions plus récentes et non actuelles",
  "Select Users to delete": "Sélectionnez les utilisateurs à supprimer",
  "Select Users to group": "Sélectionnez les utilisateurs à regrouper",
  "Select whether to apply the rule to current or non-current Object {versions}":
    "Sélectionnez s'il faut appliquer la règle à l'objet actuel ou non actuel {versions}",
  "Selected Group": "Groupe sélectionné",
  "Selected Groups": "Groupes sélectionnés",
  "Selected Object": "Objet sélectionné",
  "Selected Objects:": "Objets sélectionnés :",
  "Selected User": "Utilisateur sélectionné",
  "Selected Users": "Utilisateurs sélectionnés",
  September: "septembre",
  Series: "Série",
  server: "serveur",
  "Server Address": "Adresse du serveur",
  "Server Address is required": "L'adresse du serveur est requise",
  "Server Config": "Configuration du serveur",
  "Server Health Info": "Informations sur l'état du serveur",
  "Server Insecure": "Serveur non sécurisé",
  "Server Location": "Emplacement du serveur",
  "server-side bucket replication": "Réplication de bucket côté serveur",
  "Server, client and Console are all AGPLv3. SILO's documentation is CC BY 4.0 — {licensing}.":
    "Le serveur, le client et la console sont tous AGPLv3. La documentation de SILO est CC BY 4.0 — {licensing}.",
  Service: "Service",
  "Service Accounts": "Comptes de service",
  Services: "Services",
  Set: "Définir",
  "Set Anonymous Access to this Folder": "Définir l'accès anonyme à ce dossier",
  "Set Bucket Replication": "Définir la réplication du bucket",
  "Set Groups": "Définir des groupes",
  "Set Legal Hold": "Définir la conservation légale",
  "Set Lifecycle to multiple buckets":
    "Définir le cycle de vie sur plusieurs buckets",
  "Set Multiple Bucket Replication":
    "Définir la réplication de plusieurs buckets",
  "Set Non-current Version Transition Storage Class":
    "Définir la classe de stockage de transition de version non actuelle",
  "Set Policies": "Définir les politiques",
  "Set Retention Configuration": "Configurer la rétention",
  "Set Retention Policy": "Définir la politique de rétention",
  "Set the quality of service priority, defaults to '0'":
    "Définir la priorité de qualité de service, par défaut sur « 0 »",
  "Set to '1' for non-persistent or '2' for persistent queue":
    "Défini sur « 1 » pour une file d'attente non persistante ou « 2 » pour une file d'attente persistante",
  "Set to 'on' for exchange to be not used directly by publishers, but only when bound to other exchanges":
    "Définir sur 'on' pour que l’exchange ne soit pas utilisé directement par les éditeurs, mais uniquement lié à d’autres exchanges",
  "Set to 'on' to enable asynchronous publish":
    "Réglez sur « on » pour activer la publication asynchrone",
  "Set to 'on' to enable SASL authentication":
    "Réglez sur « on » pour activer l'authentification SASL",
  "Set to 'on' to enable TLS": "Réglez sur « on » pour activer TLS",
  "Set to 'on' to use streaming NATS server":
    "Réglez sur « on » pour utiliser le serveur de streaming NATS",
  "Setting a {quota} assigns a hard limit to a bucket beyond which SILO does not allow writes.":
    "La définition d'un {quota} attribue une limite stricte à un bucket au-delà de laquelle SILO n'autorise pas les écritures.",
  "Setting an {anonymous} policy allows clients to access the Bucket or prefix contents and perform actions consistent with the specified policy without authentication.":
    "La définition d'une politique {anonymous} permet aux clients d'accéder au contenu du bucket ou du préfixe et d'effectuer des actions cohérentes avec la politique spécifiée sans authentification.",
  Share: "Partager",
  "Share File": "Partager un fichier",
  "Share Selected File": "Partager le fichier sélectionné",
  "Share this File": "Partager ce fichier",
  "Share this version": "Partager cette version",
  "Share URL Copied to clipboard":
    "URL de partage copiée dans le presse-papiers",
  'Shared bucket DNS records, default is "/skydns"':
    'Enregistrements DNS des buckets partagés, par défaut "/skydns"',
  "Show advanced Filters": "Afficher les filtres avancés",
  "Show Current Data": "Afficher les données actuelles",
  "Show deleted objects": "Afficher les objets supprimés",
  "Show Rewind Data": "Afficher les données de rembobinage",
  "Show/Hide": "Afficher/Masquer",
  "SILO {bucketNotifications} allow administrators to send notifications to supported external services on certain object or bucket events.":
    "SILO {bucketNotifications} permettent aux administrateurs d'envoyer des notifications aux services externes pris en charge sur certains événements d'objet ou de bucket.",
  "SILO {objectLocking} enforces Write-Once Read-Many (WORM) immutability to protect versioned objects from deletion.":
    "SILO {objectLocking} applique l'immuabilité Write-Once Read-Many (WORM) pour protéger les objets versionnés contre la suppression.",
  "SILO {serverSideReplication} is an automatic bucket-level configuration that synchronizes objects between a source and destination bucket.":
    "SILO {serverSideReplication} est une configuration automatique au niveau du bucket qui synchronise les objets entre un bucket source et un bucket de destination.",
  "SILO bucket notifications allow administrators to send notifications to supported external services on certain object or bucket events. SILO supports bucket and object-level S3 events similar to the Amazon S3 Event Notifications.":
    "SILO Les notifications de bucket permettent aux administrateurs d'envoyer des notifications aux services externes pris en charge sur certains événements d'objet ou de bucket. SILO prend en charge les événements S3 au niveau du bucket et de l'objet similaires aux notifications d'événements Amazon S3.",
  "SILO derives its behavior and syntax from {s3Lifecycle} for compatibility in migrating workloads and lifecycle rules from S3 to SILO.":
    "SILO dérive son comportement et sa syntaxe de {s3Lifecycle} pour la compatibilité lors de la migration des charges de travail et des règles de cycle de vie de S3 vers SILO.",
  "SILO does not enable existing object replication by default. Objects created before replication was configured or while replication is disabled are not synchronized to the target deployment unless replication of existing objects is enabled.":
    "SILO n'active pas la réplication d'objets existants par défaut. Les objets créés avant la configuration de la réplication ou lorsque la réplication est désactivée ne sont pas synchronisés avec le déploiement cible, sauf si la réplication des objets existants est activée.",
  "SILO Health Info": "SILO Infos Santé",
  "SILO Object Lifecycle Management allows creating rules for time or date based automatic transition or expiry of objects. For object transition, SILO automatically moves the object to a configured remote storage tier.":
    "SILO La gestion du cycle de vie des objets permet de créer des règles pour la transition ou l'expiration automatique des objets en fonction de l'heure ou de la date. Pour la transition d'objet, SILO déplace automatiquement l'objet vers un niveau de stockage distant configuré.",
  "SILO or other S3-compatible storage": "SILO ou autre stockage compatible S3",
  "SILO PBAC is built for compatibility with AWS IAM policy syntax, structure, and behavior.":
    "SILO PBAC est conçu pour être compatible avec la syntaxe, la structure et le comportement des politiques AWS IAM.",
  "SILO queries the configured Active Directory / LDAP server to verify the credentials specified by the application and optionally return a list of groups in which the user has membership. SILO supports two modes (Lookup-Bind Mode and Username-Bind Mode) for performing these queries":
    "SILO interroge le serveur Active Directory / LDAP configuré pour vérifier les informations d'identification spécifiées par l'application et renvoie éventuellement une liste de groupes auxquels l'utilisateur est membre. SILO prend en charge deux modes (mode Lookup-Bind et mode Username-Bind) pour effectuer ces requêtes",
  "SILO recommends using Lookup-Bind mode as the preferred method for verifying AD/LDAP credentials. Username-Bind mode is a legacy method retained for backwards compatibility only.":
    "SILO recommande d'utiliser le mode Lookup-Bind comme méthode préférée pour vérifier les informations d'identification AD/LDAP. Le mode Username-Bind est une méthode héritée conservée uniquement à des fins de compatibilité ascendante.",
  "SILO requires versioning to support replication.":
    "SILO nécessite une gestion des versions pour prendre en charge la réplication.",
  "SILO supports automatically replicating existing objects in a bucket; this setting is enabled by default. Please note that objects created before replication was configured or while replication is disabled are not synchronized to the target deployment in case this setting is not enabled.":
    "SILO prend en charge la réplication automatique des objets existants dans un bucket ; ce paramètre est activé par défaut. Veuillez noter que les objets créés avant la configuration de la réplication ou lorsque la réplication est désactivée ne sont pas synchronisés avec le déploiement cible si ce paramètre n'est pas activé.",
  "SILO supports creating object transition lifecycle management rules, where SILO can automatically move an object to a remote storage “tier”.":
    "SILO prend en charge la création de règles de gestion du cycle de vie des transitions d'objets, où SILO peut automatiquement déplacer un objet vers un « niveau » de stockage distant.",
  "SILO supports enabling automatic {sseKms} and {sseS3} encryption of all objects written to a bucket using a specific External Key (EK) stored on the external KMS.":
    "SILO prend en charge l'activation du cryptage automatique {sseKms} et {sseS3} de tous les objets écrits dans un bucket à l'aide d'une clé externe spécifique (EK) stockée sur le KMS externe.",
  "SILO supports enabling replication of existing objects in a bucket.":
    "SILO prend en charge l'activation de la réplication d'objets existants dans un bucket.",
  "SILO supports keeping multiple {versions} of an object in a single bucket.":
    "SILO prend en charge la conservation de plusieurs {versions} d'un objet dans un seul bucket.",
  "SILO supports replicating delete operations, where SILO synchronizes deleting specific object versions and new delete markers. Delete operation replication uses the same replication process as all other replication operations.":
    "SILO prend en charge la réplication des opérations de suppression, où SILO synchronise la suppression de versions d'objet spécifiques et de nouveaux marqueurs de suppression. La réplication de l'opération de suppression utilise le même processus de réplication que toutes les autres opérations de réplication.",
  "SILO supports server-side and client-side replication of objects between source and destination buckets.":
    "SILO prend en charge la réplication d'objets côté serveur et côté client entre les buckets source et de destination.",
  "SILO supports setting both {bucketDefault} and per-object retention rules.":
    "SILO prend en charge la définition de règles de rétention {bucketDefault} et par objet.",
  "SILO supports the following Tier types:":
    "SILO prend en charge les types de niveaux suivants :",
  "SILO supports using an Active Directory or LDAP (AD/LDAP) service for external management of user identities. Configuring an external IDentity Provider (IDP) enables Single-Sign On (SSO) workflows, where applications authenticate against the external IDP before accessing SILO.":
    "SILO prend en charge l'utilisation d'un service Active Directory ou LDAP (AD/LDAP) pour la gestion externe des identités des utilisateurs. La configuration d'un fournisseur d'identité externe (IDP) active les flux de travail d'authentification unique (SSO), dans lesquels les applications s'authentifient auprès du IDP externe avant d'accéder au SILO.",
  "SILO uses buckets to organize objects. A bucket is similar to a folder or directory in a filesystem, where each bucket can hold an arbitrary number of objects.":
    "SILO utilise des buckets pour organiser les objets. Un bucket est similaire à un dossier ou un répertoire dans un système de fichiers, où chaque bucket peut contenir un nombre arbitraire d'objets.",
  "SILO uses Policy-Based Access Control (PBAC) to define the authorized actions and resources to which an authenticated user has access. Each policy describes one or more actions and conditions that outline the permissions of a user or group of users.":
    "SILO utilise le contrôle d'accès basé sur des politiques (PBAC) pour définir les actions et ressources autorisées auxquelles un utilisateur authentifié a accès. Chaque politique décrit une ou plusieurs actions et conditions qui décrivent les autorisations d'un utilisateur ou d'un groupe d'utilisateurs.",
  "SILO VERSION": "VERSION DE SILO",
  "Site Name": "Nom du site",
  "Site:": "Site :",
  Size: "Taille",
  "Size:": "Taille :",
  "Skip TLS Verification": "Ignorer la vérification TLS",
  "something went wrong": "quelque chose s'est mal passé",
  "Something went wrong.": "Quelque chose s'est mal passé.",
  "Sort by": "Trier par",
  "Specify the version of the Kafka cluster":
    "Spécifiez la version du cluster Kafka",
  "Specify the version of the Kafka cluster e.g '2.2.0'":
    "Spécifiez la version du cluster Kafka, par exemple '2.2.0'",
  "Speed Test results:": "Résultats du test de vitesse :",
  Speedtest: "Test de vitesse",
  "Speedtest in progress...": "Speedtest en cours...",
  "Staging directory for undelivered messages e.g. '/home/events'":
    "Répertoire temporaire pour les messages non remis, par ex. '/home/events'",
  "STANDARD_IA,REDUCED_REDUNDANCY etc": "STANDARD_IA,REDUCED_REDUNDANCY etc.",
  Start: "Démarrer",
  "Start Health Report": "Démarrer le rapport de santé",
  "Start Logs": "Démarrer les journaux",
  "Start Profiling": "Démarrer le profilage",
  "Start Time:": "Heure de début :",
  "Start typing to filter objects in the bucket":
    "Commencez à taper pour filtrer les objets dans le bucket",
  "Start typing to filter versions of {file}":
    "Commencez à taper pour filtrer les versions de {file}",
  "Start typing to search for a Policy":
    "Commencez à taper pour rechercher une politique",
  "Start typing to search for Groups":
    "Commencez à taper pour rechercher des groupes",
  Statements: "Déclarations",
  Status: "État",
  "Status Code": "Code d'état",
  Stop: "Arrêtez",
  "Stop Logs": "Arrêter les journaux",
  "Stop Profiling": "Arrêtez le profilage",
  Storage: "Stockage",
  "Storage Class": "Classe de stockage",
  Streaming: "Streaming",
  "Streaming async": "Streaming asynchrone",
  "Streaming Cluster ID": "Cluster de diffusion ID",
  "Streaming max publish ACKS in flight":
    "Max. d’ACK de publication en cours (streaming)",
  Subject: "Sujet",
  "Subscribe To Bucket Events": "Abonnez-vous aux événements du bucket",
  "Subscribe to Event": "Abonnez-vous à l'événement",
  Success: "Succès",
  "Successfully deleted.": "Supprimé avec succès.",
  "Successfully updated the password for the user {user}.":
    "Mise à jour réussie du mot de passe de l'utilisateur {user}.",
  "Successfully updated the password.": "Mise à jour réussie du mot de passe.",
  Suffix: "Suffixe",
  Summary: "Résumé",
  "Supported API endpoints": "Points de terminaison API pris en charge",
  Suspended: "Suspendu",
  Synced: "Synchronisé",
  Synchronous: "Synchrone",
  "System Health Info": "Informations sur l'état du système",
  Table: "Tableau",
  "Tag for: {object}": "Étiquette pour : {object}",
  "Tag Key": "Clé d'étiquette",
  "Tag Label": "Libellé du tag",
  "Tag Value": "Valeur de la balise",
  Tags: "Étiquettes",
  "Tags for: {object}": "Mots-clés pour : {object}",
  "Tags:": "Mots-clés :",
  "Target Bucket": "Bucket cible",
  "Target URL": "URL cible",
  "The bucket selected in this deployment acts as the “source” while the configured remote deployment acts as the “target”.":
    "Le bucket sélectionné dans ce déploiement fait office de « source » tandis que le déploiement distant configuré fait office de « cible ».",
  "The file must be valid and  should have valid config values":
    "Le fichier doit être valide et doit avoir des valeurs de configuration valides",
  "The file you are trying to download has a long name.":
    "Le fichier que vous essayez de télécharger porte un nom long.",
  "The following Bucket features will NOT be replicated":
    "Les fonctionnalités suivantes du bucket NE seront PAS répliquées",
  "The following changes are replicated to all other sites":
    "Les modifications suivantes sont répliquées sur tous les autres sites",
  "The following URL lets you share this object without requiring a login.":
    "L’URL suivante vous permet de partager cet objet sans nécessiter de connexion.",
  "The current version of this object is a delete marker and cannot be shared.":
    "La version actuelle de cet objet est un marqueur de suppression et ne peut pas être partagée.",
  "The selected object version could not be found. Refresh the object list and try again.":
    "La version de l'objet sélectionnée est introuvable. Actualisez la liste des objets et réessayez.",
  "This server does not expose object versions; only the current object can be shared.":
    "Ce serveur n'expose pas les versions d'objet ; seul l'objet actuel peut être partagé.",
  "The instance needs to be restarted for configuration changes to take effect.":
    "L'instance doit être redémarrée pour que les modifications de configuration prennent effet.",
  "The MinIO name is used here solely to identify the origin of the source code and to describe compatibility — {notice}.":
    "Le nom MinIO est utilisé ici uniquement pour identifier l'origine du code source et pour décrire la compatibilité — {notice}.",
  "The selected users were added to the following groups.":
    "Les utilisateurs sélectionnés ont été ajoutés aux groupes suivants.",
  "The server is restarting.": "Le serveur redémarre.",
  "The URL expires automatically at the earlier of your configured time ({time}) or the expiration of your current web session.":
    "L’URL expire automatiquement à la première échéance entre la durée configurée ({time}) et la fin de votre session web actuelle.",
  "There are no Configurations yet.": "Il n'y a pas encore de configurations.",
  "There are no endpoints yet.": "Il n'y a pas encore de points finaux.",
  "There are no Groups with this Policy associated yet.":
    "Aucun groupe n'est encore associé à cette politique.",
  "There are no Groups yet.": "Il n'y a pas encore de groupes.",
  "There are no Policies yet.": "Il n'y a pas encore de politique.",
  "There are no tags for this object": "Il n'y a aucune balise pour cet objet",
  "There are no User Access Keys yet.":
    "Il n'y a pas encore de clés d'accès utilisateur.",
  "There are no Users with this Policy associated yet.":
    "Il n'y a pas encore d'utilisateurs associés à cette politique.",
  "There are no Users yet.": "Il n'y a pas encore d'utilisateurs.",
  "There is no information with this criteria":
    "Il n'y a aucune information avec ces critères",
  "There was an error": "Il y a eu une erreur",
  "There was an error creating a Policy ":
    "Une erreur s'est produite lors de la création d'une politique",
  "There was an error creating a Policy: {details}. Please check Policy syntax.":
    "Une erreur s'est produite lors de la création d'une politique : {details}. Veuillez vérifier la syntaxe de la politique.",
  "There was an error deleting the tier":
    "Une erreur s'est produite lors de la suppression du niveau",
  "There was an error retrieving tier information":
    "Une erreur s'est produite lors de la récupération des informations sur les niveaux",
  "There was an error updating the Policy ":
    "Une erreur s'est produite lors de la mise à jour de la politique",
  "There was an error updating the Policy: {details}. Please check Policy syntax.":
    "Une erreur s'est produite lors de la mise à jour de la politique : {details}. Veuillez vérifier la syntaxe de la politique.",
  "These features are unavailable in a single-disk setup.":
    "Ces fonctionnalités ne sont pas disponibles dans une configuration à disque unique.",
  "This action is irreversible.": "Cette action est irréversible.",
  "This can cause issues on Windows Systems by trimming the file name after download.":
    "Cela peut provoquer des problèmes sur les systèmes Windows en coupant le nom du fichier après le téléchargement.",
  "This configuration cannot be deleted using this module as this was set using OpenID environment variables.":
    "Cette configuration ne peut pas être supprimée à l'aide de ce module car elle a été définie à l'aide des variables d'environnement OpenID.",
  "this Console": "cette console",
  "This feature allows multiple independent SILO sites (or clusters) that are using the same external IDentity Provider (IDP) to be configured as replicas. In this situation the set of replica sites are referred to as peer sites or just sites.":
    "Cette fonctionnalité permet à plusieurs sites SILO indépendants (ou clusters) qui utilisent le même fournisseur d'identité externe (IDP) d'être configurés en tant que répliques. Dans cette situation, l’ensemble des sites de réplication est appelé sites homologues ou simplement sites.",
  "This feature is not available for a single-disk setup.":
    "Cette fonctionnalité n'est pas disponible pour une configuration à disque unique.",
  "This feature is not available.":
    "Cette fonctionnalité n'est pas disponible.",
  "This field is required": "Ce champ est obligatoire",
  "This is a File Preview for the first {count} pages of the document, if you wish to work with the full document please download instead.":
    "Il s'agit d'un aperçu de fichier pour les premières {count} pages du document. Si vous souhaitez travailler avec le document complet, veuillez le télécharger à la place.",
  "This location is empty": "Cet emplacement est vide",
  "This location is empty, please try uploading a new file":
    "Cet objet est en cours de téléversement.",
  "This Site": "Ce site",
  "This site/cluster": "Ce site/cluster",
  "This Usage value is comparable to {command} which represents the size of all object versions that exist in the buckets.":
    "Cette valeur d'utilisation est comparable à {command} qui représente la taille de toutes les versions d'objet qui existent dans les buckets.",
  "This value is set from the {env} environment variable":
    "Cette valeur est définie à partir de la variable d'environnement {env}",
  "This value is set from the {name} environment variable":
    "Cette valeur est définie à partir de la variable d'environnement {name}",
  "This will be displayed only once. It cannot be recovered.":
    "Cette information ne sera affichée qu’une fois et ne pourra pas être récupérée.",
  "This will change your Console password. Please note your new password down, as it will be required to log into Console after this session.":
    "Cela modifiera le mot de passe de votre console. Veuillez noter votre nouveau mot de passe, car il sera nécessaire pour vous connecter à la console après cette session.",
  "This will remove the object as well as all of its versions,":
    "Cela supprimera l'objet ainsi que toutes ses versions,",
  "This will remove the objects as well as all of their versions,":
    "Cela supprimera les objets ainsi que toutes leurs versions,",
  Tier: "Tier",
  "Tier Name": "Nom du niveau",
  "Tier Types": "Types de tiers",
  "Tiers are used by the SILO Object Lifecycle Management which allows creating rules for time or date based automatic transition or expiry of objects. For object transition, SILO automatically moves the object to a configured remote storage tier.":
    "Les tiers sont utilisés par la gestion du cycle de vie des objets SILO, qui permet de créer des règles de transition ou d’expiration automatique selon la date ou la durée. Lors d’une transition, SILO déplace automatiquement l’objet vers un tier de stockage distant configuré.",
  "Time duration between scanner cycles, defaults to '1m'":
    "Durée entre les cycles du scanner, par défaut '1m'",
  "Time to Response NS": "Délai de réponse NS",
  Timestamp: "Horodatage",
  "TLS Client Auth": "TLS Authentification client",
  "TLS skip verify": "TLS ignorer la vérification",
  "TLS Skip Verify": "TLS Ignorer la vérification",
  "To allow Bucket access without credentials, use the {anonymous} setting":
    "Pour autoriser l'accès au bucket sans informations d'identification, utilisez le paramètre {anonymous}",
  "To continue please type {phrase} in the box.":
    "Pour continuer, veuillez taper {phrase} dans la case.",
  "To enable this feature you need to enable versioning on the bucket before creation":
    "Pour activer cette fonctionnalité, vous devez activer la gestion des versions sur le bucket avant la création",
  "To Tier": "Au niveau",
  "Today, {time}": "Aujourd'hui, {time}",
  "Toggle Share URL between Console and object server URL. Change default with CONSOLE_SHARE_MINIO_URL environment variable":
    "Basculer l’URL de partage entre la console et le serveur d’objets. Valeur par défaut modifiable via CONSOLE_SHARE_MINIO_URL",
  Token: "Jeton",
  "Toogle JSON": "Basculer le JSON",
  "Toogle Share URL": "Basculer l’URL de partage",
  Topic: "Sujet",
  "Trace Results": "Résultats des traces",
  "trademark notice": "avis de marque",
  Transition: "Transition",
  "Transition Days": "Jours avant transition",
  True: "Vrai",
  "Trust server TLS without verification":
    "Faire confiance au TLS du serveur sans vérification",
  'Trust server TLS without verification, defaults to "on" (verify)':
    'Faire confiance au TLS du serveur sans vérification, par défaut "on" (vérifier)',
  Type: "Type",
  "Type New Password Again": "Tapez à nouveau le nouveau mot de passe",
  "Type of Lifecycle": "Type de cycle de vie",
  "Types to profile:": "Types à profiler :",
  "Unable to download widget data":
    "Impossible de télécharger les données du widget",
  "Unable to download widget data - data not available":
    "Impossible de télécharger les données du widget - données non disponibles",
  "Under section 13 of the AGPL, the corresponding source for this running version is offered to every user who interacts with it over a network, at no charge.":
    "En vertu de l'article 13 du AGPL, la source correspondante pour cette version en cours d'exécution est offerte gratuitement à tout utilisateur qui interagit avec elle sur un réseau.",
  "Understand which {policies} and {users} are authorized to access this Bucket.":
    "Comprendre quels {policies} et {users} sont autorisés à accéder à ce Bucket.",
  "Unexpected response, download incomplete.":
    "Réponse inattendue, téléchargement incomplet.",
  Unhealthy: "Défaillant",
  "Unique descriptive string for this destination":
    "Chaîne descriptive unique pour cette destination",
  "Unique ID for NATS streaming cluster":
    "Unique ID pour NATS cluster de streaming",
  "Update Credentials - {type} / {name}":
    "Mettre à jour les informations d'identification - {type} / {name}",
  "Upload File": "Téléverser",
  "Upload Files": "Téléverser le fichier",
  "upload files to this bucket": "téléverser des fichiers dans ce bucket",
  "Upload Folder": "Téléverser le dossier",
  "Upload is restricted.": "Téléverser des fichiers",
  "Upload not allowed": "Le téléversement est restreint.",
  "upload objects to this location": "Téléversement non autorisé",
  "Upstream copyright, authorship and license notices are retained in the repository's {credits} and {notice}. See the {attribution}.":
    "Les avis de droit d'auteur, de paternité et de licence en amont sont conservés dans les {credits} et {notice} du référentiel. Voir le {attribution}.",
  "upstream MinIO code": "en amont MinIO code",
  "Usage Data Age": "Âge des données",
  "Usage:": "Utilisation :",
  "Use Original Name": "Utiliser le nom d'origine",
  "Use SASL": "Utilisez SASL",
  "Use secure medium to share this key.":
    "Utilisez un support sécurisé pour partager cette clé.",
  "Use TLS": "Utilisez TLS",
  "Used to confirm a non-idempotent action.":
    "Utilisé pour confirmer une action non idempotente.",
  "User Access Keys": "Clés d'accès utilisateur",
  "User Agent": "Agent utilisateur",
  "User Details - {user}": "Détails de l'utilisateur - {user}",
  "User DN Search Base DN is required":
    "Utilisateur DN Base de recherche DN est requis",
  "User DN Search Filter is required":
    "Utilisateur DN Le filtre de recherche est requis",
  "User Mappings": "Mappages utilisateur",
  "User Name": "Nom d'utilisateur",
  "Username for SASL/PLAIN or SASL/SCRAM authentication":
    "Nom d'utilisateur pour l'authentification SASL/PLAIN ou SASL/SCRAM",
  "Users inherit access permissions to data and resources through the groups they belong to.":
    "Les utilisateurs héritent des autorisations d'accès aux données et aux ressources via les groupes auxquels ils appartiennent.",
  "Users with this Policy associated":
    "Utilisateurs associés à cette politique",
  Validity: "Validité",
  "Validity:": "Validité :",
  Version: "Version",
  "Version ID:": "ID de version :",
  "Versioning is required to enable {objectLocking} and {retention}.":
    "Le versionnement est nécessaire pour activer {objectLocking} et {retention}.",
  "Versioning on Bucket": "Gestion des versions sur le bucket",
  "Versioning setting cannot be changed as cluster replication is enabled for this site.":
    "Le paramètre de gestion des versions ne peut pas être modifié car la réplication de cluster est activée pour ce site.",
  "Versioning Status": "État du versionnement",
  versions: {
    one: "version",
    other: "versions",
    many: "versions",
  },
  Versions: {
    one: "version",
    other: "versions",
    many: "versions",
  },
  "Versions:": "Versions :",
  View: "Voir",
  "View across sites": "Affichage sur tous les sites",
  "View Bucket Naming Rules": "Afficher les règles de dénomination des buckets",
  "View env variable Webhook": "Afficher la variable d'environnement Webhook",
  "view Objects in this bucket": "afficher les objets dans ce bucket",
  "view Policy details": "afficher les détails de la politique",
  "View Replication Status for a:": "Afficher l'état de réplication pour :",
  "view User details": "afficher les détails de l'utilisateur",
  "Visit the SILO website": "Visitez le site SILO",
  "Volume or Bucket Name": "Nom du volume ou du bucket",
  "Volume/Bucket name cannot start with /":
    "Le nom du volume/bucket ne peut pas commencer par /",
  Warning: "Avertissement",
  "Warning: One or more users selected has associated Access Keys.":
    "Attention : Un ou plusieurs utilisateurs sélectionnés ont des clés d'accès associées.",
  "Warning! The resulting file will contain server configuration information in plain text":
    "Attention ! Le fichier résultant contiendra les informations de configuration du serveur en texte brut",
  "We recommend to rename the file download":
    "Nous vous recommandons de renommer le fichier téléchargé",
  "Webhook server endpoint e.g. http://localhost:8080/silo/events":
    "Webhook point de terminaison du serveur, par ex. http://localhost:8080/silo/events",
  week: "semaine",
  weeks: {
    one: "semaine",
    other: "semaines",
    many: "semaines",
  },
  "What are Event Destinations?": "Que sont les destinations d'événements ?",
  "Would you like to encrypt {object}?": "Souhaitez-vous chiffrer {object} ?",
  "Write Policy": "Politique d’écriture",
  "Write these down, as this is the only time the secret will be displayed.":
    "Notez-les, car c'est la seule fois où le secret sera affiché.",
  writeonly: "écriture seule",
  year: "année",
  years: {
    one: "an",
    other: "ans",
    many: "ans",
  },
  Years: "Années",
  Yes: "Oui",
  "Yes, I am sure": "Oui, je suis sûr",
  "You can add a comment to this setting":
    "Vous pouvez ajouter un commentaire à ce paramètre",
  "You can add policies to the group by selecting it from the Groups view after creation. The Policy view lets you manage the assigned policies for the group.":
    "Vous pouvez ajouter des politiques au groupe en le sélectionnant dans la vue Groupes après la création. La vue Politique vous permet de gérer les politiques attribuées au groupe.",
  "You can choose to {excludePrefixes} from versioning if Object Locking is not enabled.":
    "Vous pouvez choisir de {excludePrefixes} depuis la gestion des versions si le verrouillage d'objet n'est pas activé.",
  "You can download the the Health report JSON File.":
    "Vous pouvez télécharger le fichier Rapport de santé JSON.",
  "You can increase the maximum configuration time by setting the MINIO_STS_DURATION environment variable on all your nodes.":
    "Vous pouvez augmenter le temps de configuration maximum en définissant la variable d'environnement MINIO_STS_DURATION sur tous vos nœuds.",
  "You can learn more at the {documentation}.":
    "Pour en savoir plus, consultez la {documentation}.",
  "You can learn more at the {link}.": "Pour en savoir plus, consultez {link}.",
  "You can only enable {objectLocking} when first creating a bucket.":
    "Vous ne pouvez activer {objectLocking} que lors de la première création d'un bucket.",
  "You can reset your session by logging out and logging back in to the web UI.":
    "Vous pouvez réinitialiser votre session en vous déconnectant et en vous reconnectant au Web UI.",
  "You can specify an optional JSON-formatted IAM policy to further restrict Access Key access to a subset of the actions and resources explicitly allowed for the parent user. Additional access beyond that of the parent user cannot be implemented through these policies.":
    "Vous pouvez définir une politique IAM facultative au format JSON pour limiter davantage l’accès de la clé aux actions et ressources explicitement autorisées pour l’utilisateur parent. Cette politique ne peut pas accorder de droits supplémentaires par rapport à ceux de l’utilisateur parent.",
  "You can use '*' to match any character, '.' to signify a single character or '\\' to scape an special character (E.g. mybucket-*)":
    "Vous pouvez utiliser '*' pour faire correspondre n'importe quel caractère, '.' pour signifier un seul caractère ou '\\' pour échapper un caractère spécial (par exemple mybucket-*)",
  "You can use {mcShare} as an alternative to this UI, where the session length does not limit the URL validity.":
    "Vous pouvez utiliser {mcShare} comme alternative à cette interface lorsque la durée de session ne doit pas limiter la validité de l’URL.",
  "You cannot delete the currently logged in User":
    "Vous ne pouvez pas supprimer l’utilisateur actuellement connecté",
  "You cannot enable or disable the currently logged in User":
    "Vous ne pouvez pas activer ou désactiver l'utilisateur actuellement connecté",
  "You cannot modify the optional Access Key IAM policy after saving.":
    "Vous ne pouvez pas modifier la politique facultative de clé d'accès IAM après l'enregistrement.",
  "You may only have write access on a limited set of subpaths within this path. Please carefully review your User permissions to understand the paths to which you may write.":
    "Vous ne pouvez avoir un accès en écriture que sur un ensemble limité de sous-chemins au sein de ce chemin. Veuillez examiner attentivement vos autorisations d'utilisateur pour comprendre les chemins sur lesquels vous pouvez écrire.",
  "You must apply a valid name to the bucket":
    "Vous devez appliquer un nom valide au bucket",
  "You must disable Object Locking before Versioning can be disabled":
    "Vous devez désactiver le verrouillage des objets avant que le contrôle de version puisse être désactivé",
  "You must disable Retention before Object Locking can be disabled":
    "Vous devez désactiver la rétention avant que le verrouillage des objets puisse être désactivé",
  "You need to select at least one group to assign":
    "Vous devez sélectionner au moins un groupe à attribuer",
  "You require additional permissions in order to {name}. Please ask your SILO administrator to grant you {scopes} permission in order to {name}.":
    "Vous avez besoin d'autorisations supplémentaires pour pouvoir {name}. Veuillez demander à votre administrateur SILO de vous accorder l'autorisation {scopes} afin de pouvoir effectuer le {name}.",
  "You require additional permissions in order to {name}. Please ask your SILO administrator to grant you {scopes} permissions in order to {name}.":
    "Vous avez besoin d'autorisations supplémentaires pour pouvoir {name}. Veuillez demander à votre administrateur SILO de vous accorder les autorisations {scopes} afin de pouvoir effectuer {name}.",
  "You require additional permissions in order to create a new Tier. Please ask your SILO administrator to grant you {permission} permission in order to create a Tier.":
    "Vous avez besoin d'autorisations supplémentaires pour créer un nouveau niveau. Veuillez demander à votre administrateur SILO de vous accorder l'autorisation {permission} afin de créer un niveau.",
  "File is empty": "Le fichier est vide",
  "Invalid UTF-8 or binary content": "Contenu UTF-8 ou binaire invalide",
  "Loading text preview…": "Chargement de l'aperçu du texte…",
  "Object not found or changed": "Objet introuvable ou modifié",
  "Text preview content": "Contenu de l'aperçu du texte",
  "Text preview failed": "Échec de l'aperçu du texte",
  "Text preview forbidden": "Aperçu du texte interdit",
  "The object could not be found or changed while the preview was loading.":
    "L'objet n'a pas pu être trouvé ou modifié pendant le chargement de l'aperçu.",
  "The text preview could not be loaded because of a network or server error.":
    "L'aperçu du texte n'a pas pu être chargé en raison d'une erreur réseau ou serveur.",
  "This object is not valid UTF-8 text or contains binary data. Download it to inspect the original bytes.":
    "Cet objet n'est pas un texte UTF-8 valide ou contient des données binaires. Téléchargez-le pour inspecter les octets d'origine.",
  "You do not have permission to preview this object.":
    "Vous n'êtes pas autorisé à prévisualiser cet objet.",
  Trademark: "Marque déposée",
  License: "Licence",
  "Corresponding source for this build":
    "Source correspondante pour cette version",
  "The exact corresponding source is not available for this build: {reason}. See the NOTICE for how to obtain it.":
    "La source exacte correspondante n'est pas disponible pour cette build : {reason}. Voir le NOTICE pour savoir comment l'obtenir.",
  "Source: not available for this build":
    "Source : non disponible pour cette version",
  "Items per page": "Éléments par page",
  "First page": "Première page",
  "Previous page": "Page précédente",
  "Next page": "Page suivante",
  "{count} items in total": "{count} éléments au total",
  "Page {page} · {count} on this page": "Page {page} · {count} sur cette page",
  "Sorting, filtering and select all apply to this page only.":
    "Le tri, le filtrage et la sélection s'appliquent tous à cette page uniquement.",
  "No objects match the filter": "Aucun objet ne correspond au filtre",
  "No objects on this page match the filter":
    "Aucun objet sur cette page ne correspond au filtre",
  "Showing the first {count} entries; the listing stopped at the row or time limit.":
    "Affichage des {count} premières entrées ; le listage s’est arrêté à la limite de lignes ou de temps.",
  "Start typing to filter objects on this page":
    "Commencez à taper pour filtrer les objets sur cette page",
  "Lists and tabs": "Listes et onglets",
  "Move through rows with the pointer or keyboard. Arrow keys focus tabs; Enter or Space opens them.":
    "Parcourez les lignes au pointeur ou au clavier. Les flèches ciblent les onglets ; Entrée ou Espace les ouvre.",
  "Browse and select stored objects.":
    "Parcourez et sélectionnez les objets stockés.",
  "Review stored object versions.": "Vérifiez les versions des objets stockés.",
  "Manage bucket settings.": "Gérer les paramètres du bucket.",
  "Compact section tabs": "Onglets de section compacte",
  "Storage and object usage": "Stockage et utilisation des objets",
  "Recent storage activity": "Activité de stockage récente",
  "Example buckets": "Exemples de buckets",
  "Select all objects": "Sélectionnez tous les objets",
  Select: "Sélectionner",
  Settings: "Paramètres",
  Overview: "Vue d’ensemble",
  Activity: "Activité",
  "No matching results": "Aucun résultat correspondant",
  "Try a different search or clear the filters to see all items.":
    "Essayez une autre recherche ou supprimez les filtres pour voir tous les éléments.",
  "Clear filters": "Effacer les filtres",
  "No users yet": "Aucun utilisateur pour l'instant",
  "Users authenticate with an access key and secret key, and receive permissions through policies and groups.":
    "Les utilisateurs s'authentifient avec une clé d'accès et une clé secrète, et reçoivent des autorisations via des politiques et des groupes.",
  "Create user": "Créer un utilisateur",
  "No access keys yet": "Pas encore de clés d'accès",
  "Access keys let applications connect with the permissions of your account.":
    "Les clés d'accès permettent aux applications de se connecter avec les autorisations de votre compte.",
  "Access keys let applications connect with the permissions assigned to this user.":
    "Les clés d'accès permettent aux applications de se connecter avec les autorisations attribuées à cet utilisateur.",
  "No groups assigned": "Aucun groupe attribué",
  "Add this user to a group to share its access policies.":
    "Ajoutez cet utilisateur à un groupe pour partager ses politiques d'accès.",
  "No policies assigned": "Aucune politique attribuée",
  "Policies define which actions and resources this user can access.":
    "Les politiques définissent les actions et les ressources auxquelles cet utilisateur peut accéder.",
  "No members yet": "Pas encore de membres",
  "Add users to this group so they inherit its policies.":
    "Ajoutez des utilisateurs à ce groupe afin qu'ils héritent de ses politiques.",
  "Policies attached to this group apply to all its members.":
    "Les politiques attachées à ce groupe s'appliquent à tous ses membres.",
  "No encryption keys yet": "Aucune clé de cryptage pour l'instant",
  "Create a key to encrypt objects with the configured key management service.":
    "Créez une clé pour chiffrer les objets avec le service de gestion de clés configuré.",
  "No groups yet": "Aucun groupe pour l'instant",
  "Groups let users share the same access policies.":
    "Les groupes permettent aux utilisateurs de partager les mêmes politiques d'accès.",
  "No event destinations yet": "Aucune destination d'événement pour l'instant",
  "Connect an external service to receive bucket and object notifications.":
    "Connectez un service externe pour recevoir des notifications de bucket et d'objet.",
  "No storage tiers yet": "Aucun tier configuré",
  "Connect remote storage to transition objects using lifecycle rules.":
    "Connectez un stockage distant pour y transférer des objets via des règles de cycle de vie.",
  "No event subscriptions yet":
    "Aucun abonnement à un événement pour l'instant",
  "Subscribe this bucket to send object events to an event destination.":
    "Abonnez-vous à ce bucket pour envoyer des événements d'objet à une destination d'événement.",
  "No replication rules yet": "Aucune règle de réplication pour l'instant",
  "Replicate objects from this bucket to a destination bucket.":
    "Répliquez les objets de ce bucket vers un bucket de destination.",
  "No lifecycle rules yet": "Aucune règle de cycle de vie pour l'instant",
  "Create rules to expire objects or transition them to remote storage.":
    "Créez des règles pour faire expirer les objets ou les transférer vers le stockage distant.",
  "No anonymous access rules": "Aucune règle d'accès anonyme",
  "This bucket has no prefix rules for access without credentials.":
    "Ce bucket n'a pas de règles de préfixe pour l'accès sans informations d'identification.",
  "No policies grant access": "Aucune politique n'accorde l'accès",
  "No listed policy currently grants access to this bucket.":
    "Aucune politique répertoriée n'accorde actuellement l'accès à ce bucket.",
  "No users have access": "Aucun utilisateur n'a accès",
  "No listed user currently has a policy granting access to this bucket.":
    "Aucun utilisateur répertorié ne dispose actuellement d'une politique accordant l'accès à ce bucket.",
  "View Policies": "Afficher les politiques",
  "View Users": "Afficher les utilisateurs",
  "Unable to load replication sites":
    "Impossible de charger les sites de réplication",
  "No replication sites yet": "Aucun site de réplication pour l'instant",
  "Refresh to try loading the configured sites again.":
    "Actualisez pour essayer de charger à nouveau les sites configurés.",
  "Connect independent SILO sites to replicate their data and identity configuration.":
    "Connectez des sites SILO indépendants pour répliquer leurs données et leur configuration d'identité.",
  "Waiting for logs": "En attente des journaux",
  "Logs are not running": "Les journaux ne s'exécutent pas",
  "New log entries will appear here as the server emits them.":
    "De nouvelles entrées de journal apparaîtront ici au fur et à mesure que le serveur les émettra.",
  "Choose the nodes and log types, then start logs to see server activity.":
    "Choisissez les nœuds et les types de journaux, puis démarrez les journaux pour voir l'activité du serveur.",
  "Waiting for trace events": "En attente des événements de trace",
  "Trace is not running": "Trace n'est pas en cours d'exécution",
  "Requests matching the selected calls and filters will appear here.":
    "Les demandes correspondant aux appels et filtres sélectionnés apparaîtront ici.",
  "Choose the calls and filters, then start tracing to inspect live requests.":
    "Choisissez les appels et les filtres, puis lancez le traçage pour inspecter les demandes en direct.",
  "{count} node": "{count} nœud",
  "{count} nodes": {
    one: "{count} nœud",
    other: "{count} nœuds",
    many: "{count} nœuds",
  },
  "{count} drive": "{count} disque",
  "{count} drives": {
    one: "{count} disque",
    other: "{count} disques",
    many: "{count} disques",
  },
  "Quota: {quota}": "Quota : {quota}",
  "Open bucket {name}": "Ouvrir le bucket {name}",
  "Recent buckets": "Buckets récents",
  "Read and write": "Lire et écrire",
  "Read only": "Lecture seule",
  "Write only": "Écriture seule",
  "Created {date}": "Créé {date}",
  "{count} objects": "{count} objets",
  "Bucket actions": "Actions du bucket",
  "Open menu": "Ouvrir le menu",
  "Page actions": "Actions de la page",
  "Selected actions": "Actions sélectionnées",
  "Parent paths": "Chemins parents",
  "create Groups": "créer des groupes",
  "view Group details": "afficher les détails du groupe",
  "configure event destinations": "configurer les destinations des événements",
  "update Tier credentials": "mettre à jour les identifiants du tier",
  "delete Tiers": "supprimer les niveaux",
  "manage Access Keys": "gérer les clés d'accès",
};

export default messages;
