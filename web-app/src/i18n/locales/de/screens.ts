// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later
// AI-assisted translation; see ../../README.md for review and maintenance.

import type { Dictionary } from "../../catalog";

const messages: Dictionary = {
  "Users inherit policies from their groups. Access is denied unless explicitly granted.":
    "Benutzer erben Richtlinien von ihren Gruppen. Der Zugriff wird verweigert, sofern er nicht ausdrücklich gewährt wird.",
  "Policies define allowed actions and resources for users and groups.":
    "Richtlinien definieren zulässige Aktionen und Ressourcen für Benutzer und Gruppen.",
  "IAM policies": "IAM-Richtlinien",
  "Access keys inherit their parent user’s permissions. An inline policy can only restrict them further.":
    "Zugriffsschlüssel erben die Berechtigungen ihres übergeordneten Benutzers. Eine Inline-Richtlinie kann sie nur weiter einschränken.",
  "Access keys": "Zugriffsschlüssel",
  "Configure a destination, then add bucket notification rules to send S3 events to it.":
    "Konfigurieren Sie ein Ziel und fügen Sie dann Bucket-Benachrichtigungsregeln hinzu, um S3-Ereignisse dorthin zu senden.",
  "Event destinations": "Ereignisziele",
  "SILO version": "SILO-Version",
  "Raw JSON": "Roh-JSON",
  "Recursive inspections can be expensive. Limit the bucket and path before starting.":
    "Rekursive Prüfungen können ressourcenintensiv sein. Begrenzen Sie vorab Bucket und Pfad.",
  "Open Help for examples, or read the":
    "Öffnen Sie die Hilfe für Beispiele oder lesen Sie die",
  Tasks: "Aufgaben",
  "Tasks: {count} running": "Aufgaben: {count} aktiv",
  "Close Tasks": "Aufgaben schließen",
  "Object operations": "Objektoperationen",
  Running: "Aktiv",
  Finished: "Fertig",
  Queued: "Wartend",
  Completed: "Abgeschlossen",
  "No running tasks": "Keine laufenden Aufgaben",
  "No finished tasks": "Keine erledigten Aufgaben",
  "Clear finished": "Erledigte löschen",
  "ZIP download": "ZIP-Download",
  "Browser handoff": "Browser-Übergabe",
  "Task progress": "Aufgabenfortschritt",
  "Waiting for data": "Warten auf Daten",
  "Remove task": "Aufgabe entfernen",
  "Cancel task": "Aufgabe abbrechen",
  "Retry failed": "Wiederholung fehlgeschlagen",
  "Open bucket/prefix": "Bucket/Präfix öffnen",
  "{done}/{total} completed · {failed} failed · {cancelled} cancelled":
    "{done}/{total} abgeschlossen · {failed} fehlgeschlagen · {cancelled} abgebrochen",
  "{bytes} bytes received": "{bytes} Bytes empfangen",
  "Handoff is complete; final download progress is unavailable here.":
    "Die Übergabe ist abgeschlossen; der endgültige Download-Fortschritt ist hier nicht verfügbar.",
  "Counts represent selected targets. Progress within a folder or version cleanup is unavailable.":
    "Die Zählungen repräsentieren ausgewählte Ziele. Der Fortschritt einer Ordner- oder Versionsbereinigung ist nicht verfügbar.",
  "Completed changes remain in place. In-flight requests may have reached the server; inspect before repeating them.":
    "Abgeschlossene Änderungen bleiben bestehen. Laufende Anfragen haben den Server möglicherweise erreicht; prüfen Sie diese vor einer Wiederholung.",
  "Review {count} results": "{count} Ergebnisse prüfen",
  "Server outcome is unconfirmed. Inspect this object before another operation.":
    "Serverergebnis ist unbestätigt. Untersuchen Sie dieses Objekt vor einem weiteren Vorgang.",
  "Task failed: {name}": "Aufgabe fehlgeschlagen: {name}",
  "Task completed: {name}": "Aufgabe erledigt: {name}",
  "Open Tasks to inspect the results.":
    "Öffnen Sie Aufgaben, um die Ergebnisse zu überprüfen.",
  "The request failed. Inspect the object before trying again.":
    "Die Anfrage ist fehlgeschlagen. Untersuchen Sie das Objekt, bevor Sie es erneut versuchen.",
  "Tasks are still running": "Aufgaben werden noch ausgeführt",
  "Stay here": "Hier bleiben",
  "Cancel tasks and leave": "Aufgaben abbrechen und verlassen",
  "Leave page": "Seite verlassen",
  "Leaving this session cancels queued and running tasks. Changes already completed on the server remain in place.":
    "Durch das Verlassen dieser Sitzung werden in der Warteschlange befindliche und laufende Aufgaben abgebrochen. Bereits auf dem Server durchgeführte Änderungen bleiben erhalten.",
  "Tasks will continue in this session. You can check their progress in Tasks on another page.":
    "Aufgaben werden in dieser Sitzung fortgesetzt. Sie können ihren Fortschritt unter „Aufgaben“ auf einer anderen Seite überprüfen.",
  "Delete Versions": "Versionen löschen",
  "Cluster health": "Clusterzustand",
  "servers online": "Server online",
  "{count} drives online": "{count} Laufwerke online",
  "{count} server(s) offline": "{count} Server offline",
  "{count} drive(s) offline": "{count} Laufwerk(e) offline",
  "{count} drive(s) healing": "{count} Laufwerk(e) in Reparatur",
  "Drive {drive} is at least 95% full. The server may reject writes.":
    "Laufwerk {drive} ist zu mindestens 95 % voll. Der Server lehnt möglicherweise Schreibvorgänge ab.",
  "Drive {drive} is at least 85% full.":
    "Laufwerk {drive} ist zu mindestens 85 % voll.",
  "Configuration changes are waiting for a server restart.":
    "Konfigurationsänderungen warten auf einen Serverneustart.",
  "Some server or drive health information is unavailable.":
    "Einige Informationen zum Server- oder Laufwerkszustand sind nicht verfügbar.",
  "Capacity is incomplete. Only reported drive measurements are shown.":
    "Kapazität ist unvollständig. Es werden nur gemeldete Laufwerksmessungen angezeigt.",
  "Generate health report": "Diagnosebericht erstellen",
  "No servers reported": "Keine Server gemeldet",
  Server: "Server",
  "Just started": "Gerade erst angefangen",
  "Hide drives for {server}": "Laufwerke ausblenden für {server}",
  "Show drives for {server}": "Laufwerke für {server} anzeigen",
  "No drive information available": "Keine Laufwerksinformationen verfügbar",
  "Drives on {server}": "Laufwerke auf {server}",
  "{used} / {total} used": "{used} / {total} verwendet",
  "Drive usage: {drive}": "Laufwerksnutzung: {drive}",
  "Refresh failed. The last received data is still shown.":
    "Aktualisierung fehlgeschlagen. Die zuletzt empfangenen Daten werden weiterhin angezeigt.",
  "Could not load deployment information. Try refreshing.":
    "Bereitstellungsinformationen konnten nicht geladen werden. Bitte aktualisieren.",
  "Deployment statistics": "Bereitstellungsstatistik",
  "of {total} raw capacity": "von {total} Rohkapazität",
  "{available} available": "{available} verfügbar",
  Data: "Daten",
  objects: "Objekte",
  Alerts: "Warnungen",
  "Health information unavailable": "Systemzustandsdaten nicht verfügbar",
  "All systems normal": "Alle Systeme normal",
  "Quick actions": "Schnelle Aktionen",
  "No quick actions available for your permissions.":
    "Für Ihre Berechtigungen sind keine Schnellaktionen verfügbar.",
  "Read & write": "Lesen und schreiben",
  "Delete bucket": "Bucket löschen",
  "Actions for {bucket}": "Aktionen für {bucket}",
  "Select {bucket}": "{bucket} auswählen",
  "Object lock": "Objektsperre",
  Created: "Erstellt",
  "Select all visible buckets": "Alle sichtbaren Buckets auswählen",
  "Bucket rows": "Bucket-Zeilen",
  "The bucket list could not be loaded.":
    "Die Bucket-Liste konnte nicht geladen werden.",
  "Select one or more buckets first.":
    "Zuerst mindestens einen Bucket auswählen.",
  "configure the selected buckets": "die ausgewählten Buckets zu konfigurieren",
  "Search buckets": "Buckets durchsuchen",
  "Bucket view": "Bucket-Ansicht",
  Cards: "Kacheln",
  "{count} buckets selected": {
    one: "{count} Bucket ausgewählt",
    other: "{count} Buckets ausgewählt",
  },
  "{count} bucket selected": "{count} Bucket ausgewählt",
  "No buckets match “{q}”": "Keine Buckets passen zu „{q}“",
  "Clear filter": "Filter löschen",
  "Built-in · Modified": "Eingebaut · Modifiziert",
  "Actions for {name}": "Aktionen für {name}",
  "Reset to default": "Auf Standard zurücksetzen",
  "Could not load policies": "Richtlinien konnten nicht geladen werden",
  "Refresh to try again.": "Aktualisieren Sie, um es erneut zu versuchen.",
  "Create a policy to define permissions for users and groups.":
    "Erstellen Sie eine Richtlinie, um Berechtigungen für Benutzer und Gruppen zu definieren.",
  "Could not update policy": "Richtlinie konnte nicht aktualisiert werden",
  "Reset policy {name} to its default definition?":
    "Richtlinie {name} auf ihre Standarddefinition zurücksetzen?",
  "The built-in policy will be restored to the SILO default definition.":
    "Die integrierte Richtlinie wird auf die SILO-Standarddefinition zurückgesetzt.",
  "Loading attachment information…": "Zuweisungsinformationen werden geladen…",
  "This policy has changed or is no longer available. Refresh the list.":
    "Diese Richtlinie wurde geändert oder ist nicht mehr verfügbar. Aktualisieren Sie die Liste.",
  "Attachment information is unavailable.":
    "Zuweisungsinformationen sind nicht verfügbar.",
  "This policy is attached to {users} users and {groups} groups.":
    "Diese Richtlinie gilt für {users} Benutzer und {groups} Gruppen.",
  "Their permissions will follow the default definition.":
    "Ihre Berechtigungen folgen der Standarddefinition.",
  "They will lose the permissions it grants.":
    "Sie verlieren die gewährten Berechtigungen.",
  "Could not load policy. Refresh to try again.":
    "Richtlinie konnte nicht geladen werden. Aktualisieren Sie, um es erneut zu versuchen.",
  "Could not load policy": "Richtlinie konnte nicht geladen werden",
  "Could not load users for this policy":
    "Benutzer für diese Richtlinie konnten nicht geladen werden",
  "Could not load groups for this policy":
    "Gruppen für diese Richtlinie konnten nicht geladen werden",
  "Built-in policies can be overridden by saving a modified version; you can reset it later.":
    "Integrierte Richtlinien können durch Speichern einer geänderten Version überschrieben werden; Sie können es später zurücksetzen.",
  "Override policy": "Richtlinie überschreiben",
  "Cancel editing": "Bearbeitung abbrechen",
  "Direct policies": "Direkte Richtlinien",
  "Policies inherited through groups":
    "Richtlinien, die über Gruppen geerbt werden",
  "Access-key count is unavailable.":
    "Die Anzahl der Zugriffsschlüssel ist nicht verfügbar.",
  "Group policy information is unavailable.":
    "Gruppenrichtlinieninformationen sind nicht verfügbar.",
  "Also assigned directly": "Auch direkt zugeordnet",
  "From groups:": "Aus Gruppen:",
  "Group policies could not be loaded.":
    "Gruppenrichtlinien konnten nicht geladen werden.",
  "Group is disabled; its policies are not inherited.":
    "Gruppe ist deaktiviert; ihre Richtlinien werden nicht vererbt.",
  "Group status is unavailable; inherited permissions are unknown.":
    "Gruppenstatus ist nicht verfügbar; vererbte Berechtigungen sind unbekannt.",
  "No inherited group policies": "Keine geerbten Gruppenrichtlinien",
  "Some group policies are unavailable. Refresh to try again.":
    "Einige Gruppenrichtlinien sind nicht verfügbar. Aktualisieren Sie, um es erneut zu versuchen.",
  "Could not load user": "Benutzer konnte nicht geladen werden",
  "Could not update user status":
    "Der Benutzerstatus konnte nicht aktualisiert werden",
  "Edit replication": "Replikation bearbeiten",
  "Page not found": "Seite nicht gefunden",
  "Go to Buckets": "Zu den Buckets",
  "Go back": "Zurück",
  "Read the documentation": "Lesen Sie die Dokumentation",
  "You do not have permission to view this page":
    "Sie haben keine Berechtigung, diese Seite anzuzeigen",
  "Ask your administrator for access. This page checks the following IAM actions:":
    "Bitten Sie Ihren Administrator um Zugriff. Diese Seite prüft die folgenden IAM-Aktionen:",
  "Required IAM actions": "Erforderliche IAM-Aktionen",
  "Encryption is not configured": "Die Verschlüsselung ist nicht konfiguriert",
  "Configure KES or KMS on the SILO server to manage encryption keys in Console.":
    "Konfigurieren Sie KES oder KMS auf dem SILO-Server, um Verschlüsselungsschlüssel in der Konsole zu verwalten.",
  "Local identity management is unavailable":
    "Die lokale Identitätsverwaltung ist nicht verfügbar",
  "LDAP is enabled. Manage users and groups in your LDAP directory; connection settings are available on the LDAP configuration page.":
    "LDAP ist aktiviert. Verwalten Sie Benutzer und Gruppen in Ihrem LDAP-Verzeichnis; Verbindungseinstellungen sind auf der Konfigurationsseite LDAP verfügbar.",
  "Tier creation is unavailable": "Speicherebenen-Erstellung nicht verfügbar",
  "This Console requires a distributed server setup to add a remote storage tier.":
    "Diese Konsole erfordert ein verteiltes Server-Setup, um eine Remote-Speicherebene hinzuzufügen.",
  "This page is unavailable in object browser mode":
    "Diese Seite ist im Objektbrowsermodus nicht verfügbar",
  "This Console is configured for object browsing only. Ask your administrator to enable the full Console to use this page.":
    "Diese Konsole ist nur für das Durchsuchen von Objekten konfiguriert. Bitten Sie Ihren Administrator, die vollständige Konsole für die Nutzung dieser Seite zu aktivieren.",
  "Prometheus is configured but unreachable":
    "Prometheus ist konfiguriert, aber nicht erreichbar",
  "Check the Prometheus address, network access and authentication, then retry.":
    "Überprüfen Sie die Prometheus-Adresse, den Netzwerkzugriff und die Authentifizierung und versuchen Sie es dann erneut.",
  "Advanced metrics need Prometheus":
    "Erweiterte Metriken benötigen Prometheus",
  "Configure Prometheus to collect SILO metrics, then set the URL for your deployment and restart the corresponding service.":
    "Konfigurieren Sie Prometheus zum Sammeln von SILO-Metriken, legen Sie dann die URL für Ihre Bereitstellung fest und starten Sie den entsprechenden Dienst neu.",
  "Standalone Console": "Eigenständige Konsole",
  "Console embedded in SILO": "Konsole eingebettet in SILO",
  "Optional standalone settings": "Optionale Standalone-Einstellungen",
  "Bearer token: ": "Bearer-Token: ",
  "Or basic authentication: ": "Oder Basisauthentifizierung: ",
  "Embedded settings: ": "Eingebettete Einstellungen: ",
  Icons: "Symbole",
  "Create bucket": "Bucket erstellen",
  "Edit {label}": "{label} bearbeiten",
  "Calculating…": "Wird berechnet…",
  "The server has not finished computing usage yet.":
    "Der Server berechnet die Speichernutzung noch.",
  "Calculated {time}": "Berechnet {time}",
  "Updated {time}": "Aktualisiert {time}",
  "Permission required": "Erlaubnis erforderlich",
  "Ask your administrator to grant the following IAM actions.":
    "Bitten Sie Ihren Administrator, die folgenden IAM-Aktionen zu gewähren.",
  "More actions": "Weitere Aktionen",
  "Equivalent mcli command": "Äquivalenter mcli-Befehl",
  Copied: "Kopiert",
  "Copy failed. Select and copy the command.":
    "Kopieren fehlgeschlagen. Wählen Sie den Befehl aus und kopieren Sie ihn.",
  "Copy commands": "Befehle kopieren",
  "Replace ALIAS with your configured mcli alias (for example, {alias}).":
    "Ersetzen Sie ALIAS durch Ihren konfigurierten mcli-Alias (z. B. {alias}).",
  "Replace ALIAS with your configured mcli alias.":
    "Ersetzen Sie ALIAS durch Ihren konfigurierten mcli-Alias.",
  "Loading…": "Laden…",
  "SILO primitives": "SILO-Grundelemente",
  "Shared building blocks for storage, identity and monitoring.":
    "Gemeinsame Bausteine für Speicherung, Identität und Überwachung.",
  "Healthy capacity": "Kapazität im Normalbereich",
  "Capacity warning": "Kapazitätswarnung",
  "Above the 85% warning threshold": "Über der 85 %-Warnschwelle",
  "Capacity critical": "Kapazitätskritisch",
  "Above the 95% critical threshold":
    "Über dem kritischen Schwellenwert von 95 %",
  "Usage is calculated by the server.":
    "Die Nutzung wird vom Server berechnet.",
  "View buckets": "Buckets anzeigen",
  "Status and values": "Status und Werte",
  "Built-in": "Eingebaut",
  "Freshness and actions": "Aktualität und Aktionen",
  "Select an object to inspect its details.":
    "Wählen Sie ein Objekt aus, um seine Details zu überprüfen.",
  "Object details": "Objektdetails",
  "Demo action completed.": "Demo-Aktion abgeschlossen.",
  "Select an object to download.":
    "Wählen Sie ein Objekt zum Herunterladen aus.",
  "Empty and unavailable states": "Status „Leer“ und „Nicht verfügbar“.",
  "No buckets yet": "Noch keine Buckets",
  "Create a bucket to start storing objects.":
    "Erstellen Sie einen Bucket, um mit der Speicherung von Objekten zu beginnen.",
  "No matching objects": "Keine passenden Objekte",
  "Try a different name or clear the search filter.":
    "Versuchen Sie es mit einem anderen Namen oder löschen Sie den Suchfilter.",
  "Metrics are unavailable": "Metriken sind nicht verfügbar",
  "Connect a Prometheus endpoint to view monitoring metrics.":
    "Verbinden Sie einen Prometheus-Endpunkt, um Überwachungsmetriken anzuzeigen.",
  "Loading rows": "Zeilen werden geladen",
  "Command preview": "Befehlsvorschau",
  "Showing the first 1 MiB. Download the object to see the full file.":
    "Zeigt die ersten 1 MiB an. Laden Sie das Objekt herunter, um die vollständige Datei anzuzeigen.",
  "Showing first 500 rows": "Zeigt die ersten 500 Zeilen",
  "Showing the first 100 columns. View Source or download the object to see all columns.":
    "Zeigt die ersten 100 Spalten. Öffnen Sie den Quelltext oder laden Sie das Objekt herunter, um alle Spalten anzuzeigen.",
  Rendered: "Gerendert",
  "Wrap lines": "Zeilen umbrechen",
  Row: "Zeile",
  "CSV preview content": "CSV-Vorschauinhalt",
  "Markdown preview content": "Markdown-Vorschauinhalt",
  "Markdown rendering is unavailable for this content. Showing the source instead.":
    "Markdown-Rendering ist für diesen Inhalt nicht verfügbar. Stattdessen wird die Quelle angezeigt.",
  "Image: {alt}": "Bild: {alt}",
  Image: "Bild",
  Actions: "Aktionen",
  "Select version": "Version auswählen",
  "This version is a delete marker.": "Diese Version ist eine Löschmarkierung.",
  "You need s3:GetObject permission.":
    "Sie benötigen die Erlaubnis s3:GetObject.",
  "You need s3:GetObjectVersion permission.":
    "Sie benötigen die Erlaubnis s3:GetObjectVersion.",
  "Preview is not available for this file type.":
    "Die Vorschau ist für diesen Dateityp nicht verfügbar.",
  "Object Lock is not enabled on this bucket.":
    "Für diesen Bucket ist die Objektsperre nicht aktiviert.",
  "You need s3:PutObjectLegalHold permission.":
    "Sie benötigen die Erlaubnis s3:PutObjectLegalHold.",
  "You need s3:PutObjectRetention permission.":
    "Sie benötigen die Erlaubnis s3:PutObjectRetention.",
  "Tags can only be changed on the current version.":
    "Tags können nur in der aktuellen Version geändert werden.",
  "Versioning is not enabled on this bucket.":
    "Die Versionierung ist für diesen Bucket nicht aktiviert.",
  "Select one or more objects first.":
    "Wählen Sie zunächst ein oder mehrere Objekte aus.",
  "Select a single object first.":
    "Wählen Sie zuerst ein einzelnes Objekt aus.",
  "Select a file instead of a folder.":
    "Wählen Sie eine Datei anstelle eines Ordners.",
  "Select a folder to change anonymous access.":
    "Wählen Sie einen Ordner aus, um den anonymen Zugriff zu ändern.",
  "Open the current object to use this action.":
    "Öffnen Sie das aktuelle Objekt, um diese Aktion zu verwenden.",
  "This action requires a distributed server.":
    "Diese Aktion erfordert einen verteilten Server.",
  "You need s3:PutObjectTagging permission.":
    "Sie benötigen die Erlaubnis s3:PutObjectTagging.",
  "You need admin:InspectData permission.":
    "Sie benötigen die Berechtigung admin:InspectData.",
  "You need permission to view object versions.":
    "Sie benötigen die Berechtigung, Objektversionen anzuzeigen.",
  "You need s3:DeleteObject permission.":
    "Sie benötigen die Erlaubnis s3:DeleteObject.",
  "You need permission to change the bucket policy.":
    "Sie benötigen die Berechtigung, die Bucket-Richtlinie zu ändern.",
  "You need permission to read objects and bucket versioning.":
    "Sie benötigen die Berechtigung zum Lesen von Objekten und zur Bucket-Versionierung.",
  "You need s3:ListBucket permission.":
    "Sie benötigen die Erlaubnis s3:ListBucket.",
  "You need permission to restore this version.":
    "Sie benötigen die Erlaubnis, diese Version wiederherzustellen.",
  "You need permission to select this version.":
    "Sie benötigen die Berechtigung, diese Version auszuwählen.",
  "You need permission to delete object versions.":
    "Sie benötigen die Berechtigung zum Löschen von Objektversionen.",
  "Exit rewind mode to refresh the object list.":
    "Verlassen Sie den Rückspulmodus, um die Objektliste zu aktualisieren.",
  "There are no non-current versions to delete.":
    "Es sind keine nicht aktuellen Versionen zum Löschen vorhanden.",
  "Invalid Endpoint": "Ungültiger Endpunkt",
  Broker: "Broker",
  QOS: "QOS",
  "Client ID": "Client-ID",
  "Client Secret": "Client-Geheimnis",
  "Redirect URI": "Weiterleitungs-URI",
  "Lookup Bind DN": "Lookup Bind DN",
  "Lookup Bind Password": "Lookup-Bind-Passwort",
  "User DN Search Base": "Benutzer-DN-Suchbasis",
  "User DN Search Filter": "Benutzer-DN-Suchfilter",
  "Group Search Base DN": "Gruppensuchbasis-DN",
  "Group Search Filter": "Gruppensuchfilter",
  "Sign Out": "Abmelden",
  "Remove transfer": "Übertragung entfernen",
  "Cancel transfer": "Übertragung abbrechen",
  "This download has already started. Dismiss its transfer entry to start it again.":
    "Dieser Download hat bereits begonnen. Verwerfen Sie den Übertragungseintrag, um ihn erneut zu starten.",
  "Track or cancel this download in your browser's download manager.":
    "Verfolgen oder brechen Sie diesen Download im Download-Manager Ihres Browsers ab.",
  "For selections above 5 GiB or of unknown size, MCLI is recommended. This ZIP will stream without buffering in memory.":
    "Für Auswahlen über 5 GiB oder unbekannter Größe wird MCLI empfohlen. Dieses ZIP wird ohne Pufferung im Speicher gestreamt.",
  "Set lifecycle": "Lebenszyklus festlegen",
  "Set replication": "Replikation festlegen",
  "Refresh buckets": "Buckets aktualisieren",
  "Close details": "Details schließen",
  "Copy share URL": "Freigabe-URL kopieren",
  "Select multiple versions": "Mehrere Versionen auswählen",
  "Delete selected versions": "Ausgewählte Versionen löschen",
  "Delete non-current versions": "Nicht aktuelle Versionen löschen",
  "Copy code": "Code kopieren",
  "Delete group": "Gruppe löschen",
  "Refresh list": "Liste aktualisieren",
  "Copy path": "Pfad kopieren",
  "Delete user": "Benutzer löschen",
  "Change password": "Passwort ändern",
  "Copy {label}": "{label} kopieren",
  "Add site": "Standort hinzufügen",
  "Remove site": "Standort entfernen",
  "Delete selected users": "Ausgewählte Benutzer löschen",
  "View All": "Alle anzeigen",
  "Deployment ID:": "Bereitstellungs-ID:",
  "Request ID:": "Anfrage-ID:",
  "Remote host:": "Remote-Host:",
  "User agent:": "Benutzeragent:",
  "Backtrace:": "Rückverfolgung:",
  "Time:": "Zeit:",
  "API:": "API:",
  "Not available": "Nicht verfügbar",
  " and ": " und ",
  "'namespace' reflects current bucket/object list and 'access' reflects a journal of object operations, defaults to 'namespace'":
    "'namespace' spiegelt die aktuelle Bucket-/Objektliste wider und 'access' ein Journal der Objektoperationen (Standard: 'namespace')",
  "{compliance} lock protects Objects from write operations by all users, including the SILO root user.":
    "Die Sperre {compliance} schützt Objekte vor Schreibzugriffen aller Benutzer, einschließlich des SILO-Root-Benutzers.",
  "{count} days": {
    one: "{count} Tag",
    other: "{count} Tage",
  },
  "{count} Entities Found": "{count} Entitäten gefunden",
  "{count} Entity Found": "{count} Entität gefunden",
  "{count} Version": "{count} Version",
  "{count} version, {size}": "{count} Version, {size}",
  "{count} versions": {
    one: "{count} Version",
    other: "{count} Versionen",
  },
  "{count} Versions": {
    one: "{count} Version",
    other: "{count} Versionen",
  },
  "{count} versions, {size}": "{count} Versionen, {size}",
  "{custom} policy can be written to define which accounts are authorized to access this Bucket":
    "Eine {custom}-Richtlinie kann erstellt werden, um festzulegen, welche Konten auf diesen Bucket zugreifen dürfen",
  "{entity} not available": "{entity} nicht verfügbar",
  "{entity} will be available until:": "{entity} ist verfügbar bis:",
  "{excludeFolders} options will not be available if this option is enabled.":
    "{excludeFolders} Optionen sind nicht verfügbar, wenn diese Option aktiviert ist.",
  "{file} - Versions": "{file} - Versionen",
  "{governance} lock protects Objects from write operations by non-privileged users.":
    "Die Sperre {governance} schützt Objekte vor Schreibzugriffen nicht privilegierter Benutzer.",
  "{label} copied to clipboard": "{label} in die Zwischenablage kopiert",
  "{minio} is a registered trademark of MinIO, Inc. {silo} is not a MinIO, Inc. product, and is not affiliated with, sponsored by, or endorsed by MinIO, Inc.":
    "{minio} ist eine eingetragene Marke von MinIO, Inc. {silo} ist kein Produkt von MinIO, Inc. und ist nicht mit MinIO, Inc. verbunden, wird von diesem gesponsert oder unterstützt.",
  "{object} Versions": "{object} Versionen",
  "{objectLocking} prevents objects from being deleted. Required to support retention and legal hold. Can only be enabled at bucket creation.":
    "{objectLocking} verhindert das Löschen von Objekten. Erforderlich für Aufbewahrung und rechtliche Aufbewahrung. Kann nur beim Erstellen des Buckets aktiviert werden.",
  "{private} policy limits access to credentialled accounts with appropriate permissions":
    "{private} beschränkt den Zugriff auf angemeldete Konten mit entsprechenden Berechtigungen",
  "{provider} - Add Tier Configuration":
    "{provider} – Ebenenkonfiguration hinzufügen",
  "{public} policy anyone will be able to upload, download and delete files from this Bucket once logged in":
    "Mit der Richtlinie {public} kann jeder angemeldete Benutzer Dateien in diesem Bucket hochladen, herunterladen und löschen",
  "{quota} limits the amount of data in the bucket.":
    "{quota} begrenzt die Datenmenge im Bucket.",
  "{retention} imposes rules to prevent object deletion for a period of time. Versioning must be enabled in order to set bucket retention policies.":
    "{retention} legt Regeln fest, die das Löschen von Objekten für einen bestimmten Zeitraum verhindern. Für Aufbewahrungsrichtlinien des Buckets muss die Versionierung aktiviert sein.",
  "{service} which is {status}": "{service} ({status})",
  "{silo} is an independently maintained continuation of the {minio} object storage project, carried forward by the {pigsty} community since 2026. Its {code} {incorporates} {upstream}, and the complete work remains licensed under the {agpl}.":
    "{silo} ist eine unabhängig gepflegte Fortsetzung des {minio}-Objektspeicherprojekts, die seit 2026 von der {pigsty}-Community weitergeführt wird. Sein {code} {incorporates} {upstream}, und das gesamte Werk bleibt unter der {agpl} lizenziert.",
  "{target} Event Destination": "Ereignisziel {target}",
  "{time} ago": "vor {time}",
  "{type}: {name} not found.": "{type}: {name} nicht gefunden.",
  "{versioning} allows to keep multiple versions of the same object under the same key.":
    "{versioning} ermöglicht es, mehrere Versionen desselben Objekts unter demselben Schlüssel zu behalten.",
  "* Warning: With Public access anyone will be able to upload, download and delete files from this Bucket *":
    "* Warnung: Bei öffentlichem Zugriff kann jeder Dateien in diesem Bucket hochladen, herunterladen und löschen *",
  "# Associated Access Keys": "# Zugehörige Zugriffsschlüssel",
  "© 2026 Ruohang Feng / PGSTY and the SILO contributors.":
    "© 2026 Ruohang Feng / PGSTY und die SILO-Mitwirkenden.",
  "<Day>": "<Tag>",
  "<Month>": "<Monat>",
  "<Year>": "<Jahr>",
  "A bucket can only be deleted if it's empty.":
    "Ein Bucket kann nur gelöscht werden, wenn er leer ist.",
  "A group can have one attached IAM policy, where all users with membership in that group inherit that policy. Groups support more simplified management of user permissions on the SILO Tenant.":
    "Einer Gruppe kann eine IAM-Richtlinie zugewiesen werden, die an alle Mitglieder dieser Gruppe vererbt wird. Gruppen vereinfachen die Verwaltung von Benutzerberechtigungen im SILO-Mandanten.",
  "A network error occurred.": "Ein Netzwerkfehler ist aufgetreten.",
  "A new {entity} has been created with the following details:":
    "Neu erstellt ({entity}) mit folgenden Details:",
  "A SILO user consists of a unique access key (username) and corresponding secret key (password). Clients must authenticate their identity by specifying both a valid access key (username) and the corresponding secret key (password) of an existing SILO user.":
    "Ein SILO-Benutzer besteht aus einem eindeutigen Zugangsschlüssel (Benutzername) und einem entsprechenden geheimen Schlüssel (Passwort). Clients müssen ihre Identität authentifizieren, indem sie sowohl einen gültigen Zugriffsschlüssel (Benutzername) als auch den entsprechenden geheimen Schlüssel (Passwort) eines vorhandenen SILO-Benutzers angeben.",
  "A user can be a member of multiple groups.":
    "Ein Benutzer kann Mitglied mehrerer Gruppen sein.",
  "About Site Replication": "Über die Standortreplikation",
  Access: "Zugriff",
  "Access Audit": "Zugriffsprüfung",
  "Access Key": "Zugriffsschlüssel",
  "Access Key and Secret Key should be same on the new site/endpoint.":
    "Zugriffsschlüssel und geheimer Schlüssel sollten auf der neuen Site/dem neuen Endpunkt identisch sein.",
  "Access Key Policy": "Zugriffsschlüsselrichtlinie",
  "Access Key details - {name}": "Zugangsschlüsseldetails – {name}",
  "Access keys deleted successfully.":
    "Zugriffsschlüssel erfolgreich gelöscht.",
  "Access Keys deleted successfully.":
    "Zugriffsschlüssel erfolgreich gelöscht.",
  "Access Keys inherit the policies explicitly attached to the parent user, and the policies attached to each group in which the parent user has membership.":
    "Zugriffsschlüssel erben die Richtlinien, die explizit dem übergeordneten Benutzer zugeordnet sind, sowie die Richtlinien, die jeder Gruppe zugeordnet sind, in der der übergeordnete Benutzer Mitglied ist.",
  "Access Keys support programmatic access by applications. You cannot use a Access Key to log into the SILO Console.":
    "Zugriffsschlüssel unterstützen den programmgesteuerten Zugriff durch Anwendungen. Sie können keinen Zugriffsschlüssel verwenden, um sich bei der SILO-Konsole anzumelden.",
  "Access Policy": "Zugriffsrichtlinie",
  "Access Policy:": "Zugriffsrichtlinie:",
  "Access Rule added successfully": "Zugriffsregel erfolgreich hinzugefügt",
  "Access Rules": "Zugriffsregeln",
  "AccessKey is required": "AccessKey ist erforderlich",
  "Account Key": "Kontoschlüssel",
  "Account Name": "Kontoname",
  Active: "Aktiv",
  "Active for": "Aktiv für",
  'AD/LDAP server address e.g. "myldapserver.com:636"':
    'AD/LDAP-Serveradresse, z. B. "myldapserver.com:636"',
  "Add a Row": "Zeile hinzufügen",
  "Add Access Rule": "Zugriffsregel hinzufügen",
  "Add Anonymous Access Rule": "Anonyme Zugriffsregel hinzufügen",
  "Add Bucket Replication Rule - {bucket}":
    "Bucket-Replikationsregel hinzufügen – {bucket}",
  "Add Event Destination": "Ereignisziel hinzufügen",
  "Add key": "Schlüssel hinzufügen",
  "Add Lifecycle Rule": "Lebenszyklusregel hinzufügen",
  "Add Members": "Mitglieder hinzufügen",
  "Add New Tag": "Neues Tag hinzufügen",
  "Add New Tag ": "Neues Tag hinzufügen",
  "Add new Webhook": "Neuen Webhook hinzufügen",
  "Add Replication Rule": "Replikationsregel hinzufügen",
  "Add Replication Site": "Replikationsstandort hinzufügen",
  "Add Replication Sites": "Replikationsstandorte hinzufügen",
  "Add Sites": "Standorte hinzufügen",
  "Add Sites for Replication": "Standorte für die Replikation hinzufügen",
  "Add tag": "Tag hinzufügen",
  "Add Tier": "Tier hinzufügen",
  "Add to Group": "Zur Gruppe hinzufügen",
  "Add to Groups": "Zu Gruppen hinzufügen",
  "Add Users to Group": "Benutzer zur Gruppe hinzufügen",
  "add users to groups": "Benutzer zu Gruppen hinzufügen",
  "Adding groups lets you assign IAM policies to multiple users at once.":
    "Mit Gruppen können Sie IAM-Richtlinien mehreren Benutzern gleichzeitig zuweisen.",
  Address: "Adresse",
  After: "Nachher",
  All: "Alle",
  "All Log Types": "Alle Protokolltypen",
  "All Nodes": "Alle Knoten",
  "All sites must be using the same external IDP(s) if any.":
    "Alle Standorte müssen ggf. dieselben externen IDPs verwenden.",
  "All sites must have the same deployment credentials (i.e. MINIO_ROOT_USER, MINIO_ROOT_PASSWORD).":
    "Alle Standorte müssen dieselben Zugangsdaten für die Bereitstellung verwenden (d. h. MINIO_ROOT_USER, MINIO_ROOT_PASSWORD).",
  "All User Agents": "Alle Benutzeragenten",
  "Amazon Resource Name": "Amazon-Ressourcenname",
  "AMQP exchange type": "AMQP-Exchange-Typ",
  "AMQP server endpoint e.g. `amqp://myuser:mypassword@localhost:5672`":
    "AMQP-Server-Endpunkt, z. B. `amqp://myuser:mypassword@localhost:5672`",
  "An error occurred": "Es ist ein Fehler aufgetreten",
  "An error occurred while getting the Health Report file.":
    "Beim Abrufen des Diagnoseberichts ist ein Fehler aufgetreten.",
  "An error occurred while uploading the file.":
    "Beim Hochladen der Datei ist ein Fehler aufgetreten.",
  "An error occurred while uploading the files.":
    "Beim Hochladen der Dateien ist ein Fehler aufgetreten.",
  "An unknown error occurred. Please refer to Console logs to get more information.":
    "Ein unbekannter Fehler ist aufgetreten. Weitere Informationen finden Sie in den Konsolenprotokollen.",
  Anonymous: "Anonym",
  "Anonymous Access": "Anonymer Zugriff",
  "API Name": "API-Name",
  "API Requests": "API-Anfragen",
  Application: "Anwendung",
  "apply policies to Groups": "Richtlinien auf Gruppen anwenden",
  April: "April",
  "Are you sure you want to continue?":
    "Sind Sie sicher, dass Sie fortfahren möchten?",
  "Are you sure you want to delete Access Key {name}?":
    "Möchten Sie den Zugriffsschlüssel {name} wirklich löschen?",
  "Are you sure you want to delete all the non-current versions for: {object}?":
    "Möchten Sie alle nicht aktuellen Versionen von {object} wirklich löschen?",
  "Are you sure you want to delete bucket {bucket}?":
    "Möchten Sie den Bucket {bucket} wirklich löschen?",
  "Are you sure you want to delete IDP {name} configuration?":
    "Möchten Sie die Konfiguration des Identitätsanbieters {name} wirklich löschen?",
  "Are you sure you want to delete policy {name}?":
    "Möchten Sie die Richtlinie {name} wirklich löschen?",
  "Are you sure you want to delete replication rule {rule}?":
    "Möchten Sie die Replikationsregel {rule} wirklich löschen?",
  "Are you sure you want to delete the {rule} rule?":
    "Möchten Sie die Regel {rule} wirklich löschen?",
  "Are you sure you want to delete the Configured Endpoint {name}?":
    "Möchten Sie den konfigurierten Endpunkt {name} wirklich löschen?",
  "Are you sure you want to delete the event destination ?":
    "Sind Sie sicher, dass Sie das Ereignisziel löschen möchten?",
  "Are you sure you want to delete the following {count} groups?":
    "Möchten Sie die folgenden {count} Gruppen wirklich löschen?",
  "Are you sure you want to delete the following {count} users?":
    "Möchten Sie die folgenden {count} Benutzer wirklich löschen?",
  "Are you sure you want to delete the following group?":
    "Möchten Sie die folgende Gruppe wirklich löschen?",
  "Are you sure you want to delete the following user?":
    "Möchten Sie den folgenden Benutzer wirklich löschen?",
  "Are you sure you want to delete the selected {count} Access Keys?":
    "Möchten Sie die {count} ausgewählten Zugriffsschlüssel wirklich löschen?",
  "Are you sure you want to delete the selected {count} objects?":
    "Möchten Sie die {count} ausgewählten Objekte wirklich löschen?",
  "Are you sure you want to delete the selected {count} versions for {object}?":
    "Möchten Sie die {count} ausgewählten Versionen von {object} wirklich löschen?",
  "Are you sure you want to delete the tag {tag} ?":
    "Sind Sie sicher, dass Sie das Tag {tag} löschen möchten?",
  "Are you sure you want to delete the tag {tag}?":
    "Möchten Sie das Tag {tag} wirklich löschen?",
  "Are you sure you want to delete the tier {name}?":
    "Möchten Sie die Speicherklasse {name} wirklich löschen?",
  "Are you sure you want to delete this access rule?":
    "Möchten Sie diese Zugriffsregel wirklich löschen?",
  "Are you sure you want to delete this event?":
    "Sind Sie sicher, dass Sie dieses Ereignis löschen möchten?",
  "Are you sure you want to delete:":
    "Sind Sie sicher, dass Sie Folgendes löschen möchten:",
  "Are you sure you want to remove all the replication sites?.":
    "Möchten Sie wirklich alle Replikationsstandorte entfernen?",
  "Are you sure you want to remove the replication site: {name}?":
    "Möchten Sie den Replikationsstandort {name} wirklich entfernen?",
  "Are you sure you want to remove the selected replication rules for bucket {bucket}?":
    "Sind Sie sicher, dass Sie die ausgewählten Replikationsregeln für Bucket {bucket} entfernen möchten?",
  "Are you sure you want to reset the Default {name}?":
    "Sind Sie sicher, dass Sie die Standardeinstellung {name} zurücksetzen möchten?",
  "Are you sure you want to restore {object} with Version ID: {version}?":
    "Möchten Sie {object} mit Versions-ID {version} wirklich wiederherstellen?",
  "Are you sure you want to restore these configurations to default values?":
    "Sind Sie sicher, dass Sie diese Konfigurationen auf die Standardwerte zurücksetzen möchten?",
  "Assign Access Policies": "Zugriffsrichtlinien zuweisen",
  "Assign Custom Credentials": "Eigene Zugangsdaten zuweisen",
  "Assign Custom IAM Policies for Group": "IAM-Richtlinien für Gruppe zuweisen",
  "Assign groups": "Gruppen zuweisen",
  "Assign Groups": "Gruppen zuweisen",
  "assign policies": "Richtlinien zuweisen",
  "assign Policies": "Richtlinien zuweisen",
  "Assign Policies": "Richtlinien zuweisen",
  "Assign Policy": "Richtlinie zuweisen",
  "Assign Users": "Benutzer zuweisen",
  Asynchronous: "Asynchron",
  "Audit Kafka": "Audit-Kafka",
  "Audit Webhook": "Audit-Webhook",
  August: "August",
  "Auth Token": "Authentifizierungstoken",
  "Auto delete queue when set to 'on', when there are no consumers":
    "Warteschlange ohne Consumer automatisch löschen, wenn auf 'on' gesetzt",
  "Auto Deleted": "Automatisch gelöscht",
  "Available Capacity": "Verfügbare Kapazität",
  Back: "Zurück",
  Backend: "Backend",
  Bandwidth: "Bandbreite",
  "Enter a non-negative bandwidth below 8 PiB/s, with at most two decimals (0 means unlimited).":
    "Geben Sie eine nicht negative Bandbreite unter 8 PiB/s mit höchstens zwei Dezimalstellen ein (0 bedeutet unbegrenzt).",
  "Bitrot Scan": "Bitrot-Scan",
  Brokers: "Broker",
  "Browse Bucket": "Bucket durchsuchen",
  Bucket: "Bucket",
  "Bucket Assignments": "Bucket-Zuweisungen",
  "Bucket Encryption configuration": "Konfiguration der Bucket-Verschlüsselung",
  "Bucket lifecycle (ILM) configuration":
    "Konfiguration des Bucket-Lebenszyklus (ILM)",
  "Bucket Name": "Bucket-Name",
  "Bucket names can consist only of lowercase letters, numbers, dots (.), and hyphens (-).":
    "Bucket-Namen dürfen nur aus Kleinbuchstaben, Zahlen, Punkten (.) und Bindestrichen (-) bestehen.",
  "Bucket names must be between 3 (min) and 63 (max) characters long.":
    "Bucket-Namen müssen zwischen 3 (Min.) und 63 (Max.) Zeichen lang sein.",
  "Bucket names must be unique within a partition.":
    "Bucket-Namen müssen innerhalb einer Partition eindeutig sein.",
  "Bucket names must not be formatted as an IP address (for example, 192.168.5.4).":
    "Bucket-Namen dürfen nicht als IP-Adresse formatiert sein (z. B. 192.168.5.4).",
  "Bucket names must not contain two adjacent periods, or a period adjacent to a hyphen.":
    "Bucket-Namen dürfen keine zwei benachbarten Punkte oder einen Punkt neben einem Bindestrich enthalten.",
  "Bucket names must not end with the suffix -s3alias. This suffix is reserved for access point alias names.":
    "Bucket-Namen dürfen nicht mit dem Suffix -s3alias enden. Dieses Suffix ist für Access-Point-Aliasnamen reserviert.",
  "Bucket names must not start with the prefix xn--.":
    "Bucket-Namen dürfen nicht mit dem Präfix xn-- beginnen.",
  "Bucket notification configuration": "Bucket-Benachrichtigungskonfiguration",
  "bucket notifications": "Bucket-Benachrichtigungen",
  "Bucket Object-Lock configurations": "Bucket-Object-Lock-Konfigurationen",
  "Bucket Policies": "Bucket-Richtlinien",
  "Bucket Replication Configuration": "Bucket-Replikationskonfiguration",
  "Bucket Tags": "Bucket-Tags",
  "bucket-default": "Bucket-Standard",
  "Buckets Results": "Buckets-Ergebnisse",
  "Buckets:": "Buckets:",
  "Bypass Governance Mode": "Governance-Modus umgehen",
  Bytes: "Bytes",
  "Calls to Trace": "Zu verfolgende Aufrufe",
  Cancelled: "Abgebrochen",
  "Cannot delete currently logged in user":
    "Der aktuell angemeldete Benutzer kann nicht gelöscht werden",
  "Cannot delete currently logged in user {user}":
    "Der angemeldete Benutzer {user} kann nicht gelöscht werden",
  "Cert Authority": "Zertifizierungsstelle",
  "Change Access Policy": "Zugriffsrichtlinie ändern",
  "Change Legal Hold rules for this File":
    "Rechtliche Aufbewahrung dieser Datei ändern",
  "Change Password": "Passwort ändern",
  "Change Password for {user}": "Passwort für {user} ändern",
  "Change password for: {user}": "Passwort ändern für: {user}",
  "Change Retention rules for this File":
    "Aufbewahrungsregeln dieser Datei ändern",
  "Change Tags for this File": "Tags für diese Datei ändern",
  "Change User Password": "Benutzerpasswort ändern",
  "Changes to Bucket features such as": "Änderungen an Bucket-Funktionen wie",
  "Choose or create a new path": "Wählen oder erstellen Sie einen neuen Pfad",
  "Claim from which SILO will read the policy or role to use":
    "OIDC-Claim, aus dem SILO die zu verwendende Richtlinie oder Rolle liest",
  "Claim Name": "Claim-Name",
  "Claim Prefix": "Claim-Präfix",
  "Claim User Info": "UserInfo-Claim abrufen",
  Clear: "Leeren",
  "Click on a user to view the full listing of associated Access Keys. All Access Keys associated with a user will be deleted along with the user.":
    "Klicken Sie auf einen Benutzer, um die vollständige Liste der zugehörigen Zugriffsschlüssel anzuzeigen. Alle einem Benutzer zugeordneten Zugriffsschlüssel werden zusammen mit dem Benutzer gelöscht.",
  client: "Client",
  "Client Auth determines the Kafka server's policy for TLS client authorization":
    "Client Auth bestimmt die Richtlinie des Kafka-Servers für die TLS-Client-Autorisierung",
  "Client Cert": "Client-Zertifikat",
  "Client cert for mTLS authentication":
    "Client-Zertifikat für mTLS-Authentifizierung",
  "Client cert for NATS mTLS auth":
    "Client-Zertifikat für NATS mTLS-Authentifizierung",
  "Client Cert Key": "Client-Zertifikatschlüssel",
  "Client cert key for mTLS authentication":
    "Client-Zertifikatschlüssel für die mTLS-Authentifizierung",
  "Client cert key for NATS mTLS authorization":
    "Client-Zertifikatschlüssel für NATS mTLS-Autorisierung",
  "Client ID is required": "Client-ID ist erforderlich",
  "Client Key": "Client-Schlüssel",
  "Client ping commands interval in s,m,h,d. Disabled by default":
    "Client-Ping-Intervall in s,m,h,d. Standardmäßig deaktiviert",
  "Client Secret is required": "Client-Geheimnis ist erforderlich",
  "Client Secret must be re-entered to change OpenID configurations":
    "Das Client-Geheimnis muss erneut eingegeben werden, um OpenID-Konfigurationen zu ändern",
  "client TLS cert": "Client-TLS-Zertifikat",
  "client TLS key": "Client-TLS-Schlüssel",
  "ClientAuth determines the Kafka server's policy for TLS client authorization":
    "ClientAuth bestimmt die Richtlinie des Kafka-Servers für die TLS-Client-Autorisierung",
  "Cluster Health Report will be generated, you will be able to download the JSON File.":
    "Der Cluster-Diagnosebericht wird erstellt; anschließend können Sie die JSON-Datei herunterladen.",
  code: "Quellcode",
  "Comma separated list of Kafka broker addresses":
    "Kommagetrennte Liste von Kafka-Brokeradressen",
  Comment: "Kommentar",
  Comments: "Kommentare",
  Compliance: "Compliance",
  Compression: "Komprimierung",
  "Concurrent:": "Gleichzeitig:",
  Config: "Konfig",
  "Config Name is required": "Konfigurationsname ist erforderlich",
  "Config URL": "Konfigurations-URL",
  "Config URL for identity provider configuration":
    "Konfigurations-URL für den Identitätsanbieter",
  "Config URL is required": "Konfigurations-URL ist erforderlich",
  "Configuration cannot be disabled / enabled in this module as LDAP environment variables are set for this SILO instance.":
    "Die Konfiguration kann hier nicht aktiviert/deaktiviert werden, da für diese SILO-Instanz LDAP-Umgebungsvariablen gesetzt sind.",
  "Configuration cannot be disabled / enabled in this module as OpenID environment variables are set for this SILO instance.":
    "Die Konfiguration kann hier nicht aktiviert/deaktiviert werden, da für diese SILO-Instanz OpenID-Umgebungsvariablen gesetzt sind.",
  "Configuration cannot be edited in this module as LDAP environment variables are set for this SILO instance.":
    "Die Konfiguration kann hier nicht bearbeitet werden, da für diese SILO-Instanz LDAP-Umgebungsvariablen gesetzt sind.",
  "Configuration cannot be edited in this module as OpenID environment variables are set for this SILO instance.":
    "Die Konfiguration kann hier nicht bearbeitet werden, da für diese SILO-Instanz OpenID-Umgebungsvariablen gesetzt sind.",
  "Configuration saved successfully": "Konfiguration erfolgreich gespeichert",
  "Configure a {remoteTier} to receive transitioned Objects":
    "Konfigurieren Sie eine {remoteTier}, um umgestellte Objekte zu empfangen",
  "Configure Bucket": "Bucket konfigurieren",
  "Configuring an external IDP enables Single-Sign On workflows, where applications authenticate against the external IDP before accessing SILO.":
    "Durch die Konfiguration einer externen IDP werden Single-Sign-On-Workflows ermöglicht, bei denen sich Anwendungen gegenüber der externen IDP authentifizieren, bevor sie auf SILO zugreifen.",
  "Confirm Dialogs": "Bestätigungsdialoge",
  "connected server": "verbundener Server",
  "Connection String": "Verbindungszeichenfolge",
  "Console Credentials": "Konsolenanmeldeinformationen",
  "Console LICENSE": "Konsolen-LICENSE",
  "Console portions © Georg Mangold and contributors.":
    "Konsolenteile © Georg Mangold und Mitwirkende.",
  "Console predecessor": "Konsolenvorgänger",
  "Copy to Clipboard": "In die Zwischenablage kopieren",
  Copyright: "Urheberrecht",
  "Coredns Path": "CoreDNS-Pfad",
  "Cors Allow Origin": "CORS Allow Origin",
  "Could not process drag and drop.":
    "Drag & Drop konnte nicht verarbeitet werden.",
  "CPU Info": "CPU-Info",
  "Create {idpType} configuration": "{idpType}-Konfiguration erstellen",
  "create a bucket": "einen Bucket zu erstellen",
  "Create a new cryptographic key in the Key Management Service server connected to SILO.":
    "Erstellen Sie einen neuen kryptografischen Schlüssel auf dem Key Management Service-Server, der mit SILO verbunden ist.",
  "create a new path": "einen neuen Pfad zu erstellen",
  "create a Policy": "eine Richtlinie zu erstellen",
  "Create access key": "Zugangsschlüssel erstellen",
  "Create Access Key": "Zugriffsschlüssel erstellen",
  "Create Access Key for {user}": "Zugriffsschlüssel für {user} erstellen",
  "Create Access Keys": "Zugriffsschlüssel erstellen",
  "Create Configuration": "Konfiguration erstellen",
  "Create Configurations": "Konfigurationen erstellen",
  "Create Group": "Gruppe erstellen",
  "Create Key": "Schlüssel erstellen",
  "Create new path": "Neuen Pfad erstellen",
  "Create OpenID Configuration": "OpenID-Konfiguration erstellen",
  "Create Policies": "Richtlinien erstellen",
  "Create Policy": "Richtlinie erstellen",
  "Create Rules": "Regeln erstellen",
  "Create Tier": "Speicherebene erstellen",
  "Create User": "Benutzer erstellen",
  "create users": "Benutzer erstellen",
  "Create Users": "Benutzer erstellen",
  "Created At": "Erstellt am",
  "Created By": "Erstellt von",
  "Creation and deletion of all IAM users, groups, policies and their mappings to users or groups":
    "Erstellen und Löschen aller IAM-Benutzer, -Gruppen, -Richtlinien und deren Zuordnungen",
  "Creation and deletion of buckets and objects":
    "Erstellen und Löschen von Buckets und Objekten",
  "Creation and deletion of service accounts (except those owned by the root user)":
    "Erstellung und Löschung von Dienstkonten (mit Ausnahme derjenigen, die dem Root-Benutzer gehören)",
  "Creation of STS credentials": "Erstellen von STS-Zugangsdaten",
  Credentials: "Anmeldeinformationen",
  current: "aktuell",
  Current: "Aktuell",
  "Current Endpoint:": "Aktueller Endpunkt:",
  "Current Password": "Aktuelles Passwort",
  "Current Path:": "Aktueller Pfad:",
  "Current Policy": "Aktuelle Richtlinie",
  "Current Status": "Aktueller Status",
  "Current Status:": "Aktueller Status:",
  "Current Tags:": "Aktuelle Tags:",
  "Current User Policy - edit the JSON to remove permissions for this Access Key":
    "Aktuelle Benutzerrichtlinie – bearbeiten Sie das JSON, um Berechtigungen für diesen Zugriffsschlüssel einzuschränken",
  "Current Version": "Aktuelle Version",
  "CURRENT VERSION": "CURRENT VERSION",
  "Currently Configured Endpoints": "Derzeit konfigurierte Endpunkte",
  custom: "benutzerdefinierte",
  Custom: "Benutzerdefiniert",
  Cycle: "Zyklus",
  Database: "Datenbank",
  Date: "Datum",
  day: "Tag",
  days: {
    one: "Tag",
    other: "Tage",
  },
  Days: "Tage",
  "DB table name to store/update events, table is auto-created":
    "DB-Tabellenname zum Speichern/Aktualisieren von Ereignissen (wird automatisch erstellt)",
  December: "Dezember",
  Default: "Standard",
  "Default Key ID:": "Standardschlüssel-ID:",
  "Define which actions are permitted on a specified resource.":
    "Definieren Sie, welche Aktionen für eine bestimmte Ressource zulässig sind.",
  "Delay Multiplier": "Verzögerungsmultiplikator",
  "DELETE - Object Deleted": "DELETE – Objekt gelöscht",
  "Delete {name}": "{name} löschen",
  "Delete Access Key": "Zugriffsschlüssel löschen",
  "Delete Access Keys": "Zugriffsschlüssel löschen",
  "Delete All": "Alle löschen",
  "Delete All Versions": "Alle Versionen löschen",
  "Delete Anonymous Access Rule": "Anonyme Zugriffsregel löschen",
  "Delete Bucket": "Bucket löschen",
  "Delete Configuration": "Konfiguration löschen",
  "Delete Endpoint": "Endpunkt löschen",
  "Delete Event": "Ereignis löschen",
  "Delete Group": "Gruppe löschen",
  "delete Groups": "Gruppen löschen",
  "Delete Groups": "Gruppen löschen",
  "Delete Lifecycle Rule": "Lebenszyklusregel löschen",
  "Delete Marker": "Löschmarkierung",
  "Delete Non-Current versions": "Nicht aktuelle Versionen löschen",
  "Delete Object": "Objekt löschen",
  "Delete Objects": "Objekte löschen",
  "delete Policies": "Richtlinien löschen",
  "Delete Policy": "Richtlinie löschen",
  "Delete Replication Rule": "Replikationsregel löschen",
  "Delete Replication Site": "Replikationsstandort löschen",
  "Delete Selected": "Ausgewählte löschen",
  "Delete Selected Files": "Ausgewählte Dateien löschen",
  "Delete Selected Replication Rules": "Ausgewählte Replikationsregeln löschen",
  "Delete Selected Versions": "Ausgewählte Versionen löschen",
  "Delete Site": "Standort löschen",
  "Delete Tag": "Tag löschen",
  "Delete Tier": "Speicherebene löschen",
  "delete user": "Benutzer löschen",
  "Delete User": "Benutzer löschen",
  "delete users": "Benutzer löschen",
  "Delete Users": "Benutzer löschen",
  "Delete version": "Version löschen",
  "Delete Webhook": "Webhook löschen",
  Deleted: "Gelöscht",
  DELETED: "DELETED",
  Deletes: "Löscht",
  "Delivery Mode": "Zustellmodus",
  Description: "Beschreibung",
  Destination: "Ziel",
  "Detailed Results:": "Detaillierte Ergebnisse:",
  Disable: "Deaktivieren",
  "Disable LDAP": "LDAP deaktivieren",
  "Disable SSL certificate verification ":
    "SSL-Zertifikatsprüfung deaktivieren",
  "disable users": "Benutzer deaktivieren",
  Disabled: "Deaktiviert",
  "Display Name": "Anzeigename",
  "Display Object Versions": "Objektversionen anzeigen",
  "Display only Errors": "Nur Fehler anzeigen",
  "Display Versions for this file": "Versionen für diese Datei anzeigen",
  "No object versions are available": "Es sind keine Objektversionen verfügbar",
  "Distributed Mode": "Verteilter Modus",
  "DN (Distinguished Name) for LDAP read-only service account used to perform DN and group lookups":
    "DN (Distinguished Name) des schreibgeschützten LDAP-Dienstkontos für DN- und Gruppensuchen",
  documentation: "Dokumentation",
  Done: "Fertig",
  "Download all access credentials": "Alle Zugangsdaten herunterladen",
  "Download all access credentials to a JSON file. NOTE: This file is not formatted for import using mc alias import. If you plan to import this alias from the file, please use the Download for Import button. ":
    "Alle Zugangsdaten als JSON-Datei herunterladen. HINWEIS: Diese Datei ist nicht für den Import mit „mc alias import“ formatiert. Verwenden Sie dafür die Schaltfläche „Zum Import herunterladen“.",
  "Download as CSV": "Als CSV herunterladen",
  "Download as PNG": "Als PNG herunterladen",
  "Download credentials in a JSON file formatted for import using mc alias import. This will only include the default login credentials.":
    "Zugangsdaten in einer für „mc alias import“ formatierten JSON-Datei herunterladen. Enthält nur die Standard-Anmeldedaten.",
  "Download File": "Datei herunterladen",
  "Download for import": "Zum Import herunterladen",
  "Download JSON": "JSON herunterladen",
  "Download of multiple files failed.":
    "Der Download mehrerer Dateien ist fehlgeschlagen.",
  "Download Results": "Ergebnisse herunterladen",
  "Download Selected": "Ausgewählte herunterladen",
  "Download selected objects as Zip. Any Deleted objects in the selection would be skipped from download.":
    "Ausgewählte Objekte als ZIP herunterladen. Gelöschte Objekte in der Auswahl werden übersprungen.",
  "Download this Object": "Objekt herunterladen",
  "Download this version": "Diese Version herunterladen",
  "Download widget data": "Widget-Daten herunterladen",
  "Downloads / Uploads": "Downloads/Uploads",
  "Drives Partitions Info": "Informationen zu Laufwerkspartitionen",
  "Drives:": "Laufwerke:",
  "DSN String": "DSN-Zeichenfolge",
  Durable: "Dauerhaft",
  Duration: "Dauer",
  "During the speed test all your production traffic will be temporarily suspended.":
    "Während des Geschwindigkeitstests wird Ihr gesamter Produktionsverkehr vorübergehend ausgesetzt.",
  "e.g. 503": "z. B. 503",
  "e.g. FunctionName2055": "z. B. FunctionName2055",
  "e.g. Method 2056": "z. B. Method 2056",
  "e.g. my-bucket/my-prefix/*": "z. B. my-bucket/my-prefix/*",
  "e.g. us-west-rack-2": "z. B. us-west-rack-2",
  "Each user can access only those resources and operations which are explicitly granted by the built-in role. SILO denies access to any other resource or action by default.":
    "Jeder Benutzer kann nur auf die Ressourcen und Vorgänge zugreifen, die explizit durch die integrierte Rolle gewährt werden. SILO verweigert standardmäßig den Zugriff auf alle anderen Ressourcen oder Aktionen.",
  Edit: "Bearbeiten",
  "edit a Policy": "eine Richtlinie zu bearbeiten",
  "Edit Anonymous Access Rule for {target}":
    "Anonyme Zugriffsregel für {target} bearbeiten",
  "Edit Audit Webhook": "Audit-Webhook bearbeiten",
  "Edit Bucket Replication": "Bucket-Replikation bearbeiten",
  "Edit Configuration": "Konfiguration bearbeiten",
  "Edit details of - {name}": "Details von {name} bearbeiten",
  "Edit Endpoint": "Endpunkt bearbeiten",
  "edit Group membership": "Gruppenmitgliedschaft bearbeiten",
  "Edit Lifecycle Configuration": "Lebenszykluskonfiguration bearbeiten",
  "Edit Logger Webhook": "Logger-Webhook bearbeiten",
  "Edit Members": "Mitglieder bearbeiten",
  "Edit Replication Endpoint": "Replikationsendpunkt bearbeiten",
  "Edit Tags": "Tags bearbeiten",
  "Edit the Default Audit Webhook": "Standard-Audit-Webhook bearbeiten",
  "Edit the Default Logger Webhook": "Standard-Logger-Webhook bearbeiten",
  "Edit Webhook": "Webhook bearbeiten",
  "Effect:": "Wirkung:",
  "Elasticsearch index to store/update events, index is auto-created":
    "Elasticsearch-Index zum Speichern/Aktualisieren von Ereignissen (wird automatisch erstellt)",
  "Elasticsearch server's address, with optional authentication info":
    "Elasticsearch-Serveradresse mit optionalen Authentifizierungsdaten",
  Enable: "Aktivieren",
  "Enable audit_kafka target": "Ziel audit_kafka aktivieren",
  "Enable Bucket Encryption": "Bucket-Verschlüsselung aktivieren",
  "Enable Bucket Quota": "Bucket-Kontingent aktivieren",
  "Enable LDAP": "LDAP aktivieren",
  "enable or disable Groups": "Gruppen aktivieren oder deaktivieren",
  "enable or disable users": "Benutzer aktivieren oder deaktivieren",
  "Enable SASL (Simple Authentication and Security Layer) authentication":
    "SASL-Authentifizierung (Simple Authentication and Security Layer) aktivieren",
  "Enable TLS (Transport Layer Security)":
    "TLS (Transport Layer Security) aktivieren",
  "enable users": "Benutzer aktivieren",
  "Enable your preferred options to get filtered records.":
    "Aktivieren Sie Ihre bevorzugten Optionen, um gefilterte Datensätze zu erhalten.",
  Enabled: "Aktiviert",
  Encrypt: "Verschlüsseln",
  "Encryption Key": "Verschlüsselungsschlüssel",
  "Encryption Type": "Verschlüsselungstyp",
  "Encryption:": "Verschlüsselung:",
  "End Time:": "Endzeit:",
  Endpoint: "Endpunkt",
  endpoints: "Endpunkte",
  Endpoints: "Endpunkte",
  "Enter '/' to apply the rule to all prefixes and objects at the bucket root. Do not include the wildcard asterisk '*' as part of the prefix *unless* it is an explicit part of the prefix name. The Console automatically appends an asterisk to the appropriate sections of the resulting IAM policy.":
    "Geben Sie „/“ ein, um die Regel auf alle Präfixe und Objekte im Bucket-Stamm anzuwenden. Schließen Sie das Platzhalter-Sternchen „*“ nicht als Teil des Präfixes ein, *es sei denn*, es ist ein expliziter Teil des Präfixnamens. Die Konsole fügt automatisch ein Sternchen an die entsprechenden Abschnitte der resultierenden IAM-Richtlinie an.",
  "Enter a comment": "Kommentar eingeben",
  "Enter a description": "Beschreibung eingeben",
  "Enter a Mime Type": "MIME-Typ eingeben",
  "Enter a name": "Namen eingeben",
  "Enter Access Key": "Zugriffsschlüssel eingeben",
  "Enter Account Key": "Kontoschlüssel eingeben",
  "Enter Account Name": "Kontonamen eingeben",
  "Enter Address": "Adresse eingeben",
  "Enter allowed origin e.g. https://example.com":
    "Zulässigen Ursprung eingeben, z. B. https://example.com",
  "Enter an Extension": "Dateierweiterung eingeben",
  "Enter Auth Token": "Auth-Token eingeben",
  "Enter auth_token": "auth_token eingeben",
  "Enter Brokers": "Broker eingeben",
  "Enter Bucket": "Bucket eingeben",
  "Enter Cert Authority": "Zertifizierungsstelle eingeben",
  "Enter Claim Name": "Claim-Namen eingeben",
  "Enter Claim Prefix": "Claim-Präfix eingeben",
  "Enter Client Cert": "Client-Zertifikat eingeben",
  "Enter Client Cert Key": "Client-Zertifikatschlüssel eingeben",
  "Enter Client ID": "Client-ID eingeben",
  "Enter Client Key": "Client-Schlüssel eingeben",
  "Enter Client Secret": "Client-Geheimnis eingeben",
  "Enter Coredns Path": "CoreDNS-Pfad eingeben",
  "Enter custom notes if any": "Optionale Notizen eingeben",
  "Enter Cycle": "Zyklus eingeben",
  "Enter DB Name": "DB-Namen eingeben",
  "Enter Delay": "Verzögerung eingeben",
  "Enter Delivery Mode": "Zustellmodus eingeben",
  "Enter Destination Identifier": "Zielkennung eingeben",
  "Enter Display Name": "Anzeigenamen eingeben",
  "Enter DSN String": "DSN-Zeichenfolge eingeben",
  "Enter Endpoint": "Endpunkt eingeben",
  "Enter Exchange": "Exchange eingeben",
  "Enter Exchange Type": "Exchange-Typ eingeben",
  "Enter Format": "Format eingeben",
  "Enter Host": "Host eingeben",
  "Enter Index": "Index eingeben",
  "Enter Kafka Broker": "Kafka-Broker eingeben",
  "Enter Kafka Topic": "Kafka-Topic eingeben",
  "Enter Kafka Version": "Kafka-Version eingeben",
  "Enter Keep Alive Interval": "Keep-Alive-Intervall eingeben",
  "Enter Key": "Schlüssel eingeben",
  "Enter Max IO": "Max. I/O eingeben",
  "Enter Max Sleep Duration": "Maximale Pausendauer eingeben",
  "Enter Max Wait": "Maximale Wartezeit eingeben",
  "Enter Name (Eg. REMOTE-TIER)": "Namen eingeben (z. B. REMOTE-TIER)",
  "Enter NATS password": "NATS-Passwort eingeben",
  "Enter NATS Subject": "NATS-Subject eingeben",
  "Enter NATS token": "NATS-Token eingeben",
  "Enter NATS Username": "NATS-Benutzernamen eingeben",
  "Enter New Tag Key": "Neuen Tag-Schlüssel eingeben",
  "Enter New Tag Label": "Neue Tag-Beschriftung eingeben",
  "Enter nsqd_address": "nsqd_address eingeben",
  "Enter Password": "Passwort eingeben",
  "Enter Path Prefix": "Pfadpräfix eingeben",
  "Enter Ping Interval": "Ping-Intervall eingeben",
  "Enter Port": "Port eingeben",
  "Enter Prefix": "Präfix eingeben",
  "Enter QOS": "QoS eingeben",
  "Enter Queue Dir": "Warteschlangenverzeichnis eingeben",
  "Enter Queue Directory": "Warteschlangenverzeichnis eingeben",
  "Enter Queue Limit": "Warteschlangenlimit eingeben",
  "Enter Reconnect Interval": "Wiederverbindungsintervall eingeben",
  "Enter Replication Failed Workers":
    "Worker für fehlgeschlagene Replikationen eingeben",
  "Enter Replication Workers": "Replikations-Worker eingeben",
  "Enter Requests Max": "Maximale Anfragen eingeben",
  "Enter Routing Key": "Routing-Schlüssel eingeben",
  "Enter SASL Mechanism": "SASL-Mechanismus eingeben",
  "Enter SASL Password": "SASL-Passwort eingeben",
  "Enter SASL Username": "SASL-Benutzernamen eingeben",
  "Enter Secret Key": "Geheimen Schlüssel eingeben",
  "Enter SSL Mode": "SSL-Modus eingeben",
  "Enter Storage Class": "Speicherklasse eingeben",
  "Enter Streaming Cluster ID": "Streaming-Cluster-ID eingeben",
  "Enter Streaming in flight value":
    "Max. parallele Streaming-Nachrichten (In-Flight) eingeben",
  "Enter Table Name": "Tabellennamen eingeben",
  "Enter Tag Key": "Tag-Schlüssel eingeben",
  "Enter Tag Label": "Tag-Beschriftung eingeben",
  "Enter the new Folder Path": "Neuen Ordnerpfad eingeben",
  "Enter TLS Client Auth": "TLS-Client-Auth eingeben",
  "Enter TLS Client Cert": "TLS-Client-Zertifikat eingeben",
  "Enter TLS Client Key": "TLS-Client-Schlüssel eingeben",
  "Enter Topic": "Thema eingeben",
  "Enter URL": "URL eingeben",
  "Enter User": "Benutzer eingeben",
  "Enter Username": "Benutzernamen eingeben",
  Entities: "Entitäten",
  "Erasure Health": "Zustand des Erasure Coding",
  Error: "Fehler",
  "Error - File size too large": "Fehler – Dateigröße zu groß",
  "Error retrieving access keys": "Fehler beim Abrufen der Zugriffsschlüssel",
  "Error:": "Fehler:",
  Errors: "Fehler",
  Erros: "Fehler",
  "ETAG:": "ETAG:",
  Event: "Ereignis",
  "Event Notifications": "Ereignisbenachrichtigungen",
  Exchange: "Exchange",
  "Exchange Type": "Exchange-Typ",
  "Exclude Folders": "Ordner ausschließen",
  "exclude folders and prefixes": "Ordner und Präfixe ausschließen",
  "Exclude folders and prefixes": "Ordner und Präfixe ausschließen",
  "Excluded Prefixes": "Ausgeschlossene Präfixe",
  "Excluded Prefixes :": "Ausgeschlossene Präfixe:",
  "Existing Objects": "Vorhandene Objekte",
  "Expand graph": "Diagramm erweitern",
  "Expire All Versions": "Alle Versionen ablaufen lassen",
  "Expire Delete Marker": "Löschmarkierung ablaufen lassen",
  "Expired All Versions": "Alle Versionen abgelaufen",
  "Expired Object Delete Marker": "Löschmarkierung für abgelaufenes Objekt",
  Expiry: "Ablauf",
  "Expiry Days": "Ablauftage",
  Export: "Exportieren",
  Extensions: "Erweiterungen",
  'Extensions to compress e.g. ".txt", ".log" or ".csv" -  you can write one per field':
    'Zu komprimierende Dateierweiterungen, z. B. ".txt", ".log" oder ".csv" – eine pro Feld',
  Failed: "Fehlgeschlagen",
  Failures: "Fehler",
  False: "Falsch",
  Features: "Funktionen",
  February: "Februar",
  "File Configuration": "Dateikonfiguration",
  "File couldn't be loaded. Please try Download instead":
    "Datei konnte nicht geladen werden. Bitte laden Sie sie stattdessen herunter.",
  "File couldn't be previewed using file extension or mime type. Please try Download instead":
    "Vorschau über Dateierweiterung oder MIME-Typ nicht möglich. Bitte laden Sie die Datei stattdessen herunter.",
  "File download will be handled directly by the browser.":
    "Der Dateidownload wird direkt vom Browser durchgeführt.",
  "Files larger than 5 GiB use a single, non-resumable browser request. Use mcli for multipart uploads.":
    "Dateien, die größer als 5 GiB sind, verwenden eine einzelne, nicht fortsetzbare Browseranforderung. Verwenden Sie mcli für mehrteilige Uploads.",
  "File or Path to inspect": "Zu prüfende Datei oder Pfad",
  "File Preview": "Dateivorschau",
  "File preview couldn't be displayed, Please try Download instead.":
    "Die Dateivorschau konnte nicht angezeigt werden. Versuchen Sie stattdessen den Download.",
  "Filename should be less than 200 characters long.":
    "Der Dateiname sollte weniger als 200 Zeichen lang sein.",
  Filter: "Filter",
  "Filter Users": "Benutzer filtern",
  "Filter:": "Filter:",
  Filters: "Filter",
  "Folder cannot have the same name as an existing file":
    "Der Ordner darf nicht denselben Namen wie eine vorhandene Datei haben",
  "For each write operation to the bucket, SILO checks all configured replication rules for the bucket and applies the matching rule with highest configured priority.":
    "Bei jedem Schreibvorgang in den Bucket überprüft SILO alle konfigurierten Replikationsregeln für den Bucket und wendet die passende Regel mit der höchsten konfigurierten Priorität an.",
  'For each write operation to this "source" bucket, SILO checks all configured replication rules and applies the matching rule with highest configured priority.':
    "Bei jedem Schreibvorgang in diesen „Quell“-Bucket prüft SILO alle konfigurierten Replikationsregeln und wendet die passende Regel mit der höchsten konfigurierten Priorität an.",
  "For per-object retention settings, defer to the documentation for the PUT operation used by your preferred SDK.":
    "Informationen zu Aufbewahrungseinstellungen pro Objekt finden Sie in der Dokumentation für den PUT-Vorgang, der von Ihrem bevorzugten SDK verwendet wird.",
  "For SSE-S3 or SSE-KMS encryption via KMS, all sites must have access to a central KMS deployment server.":
    "Für die SSE-S3- oder SSE-KMS-Verschlüsselung über KMS müssen alle Standorte Zugriff auf einen zentralen KMS-Bereitstellungsserver haben.",
  Format: "Format",
  "full attribution stack": "vollständiger Attributionsstapel",
  "Full Log Information": "Vollständige Protokollinformationen",
  "Function Name": "Funktionsname",
  Functions: "Funktionen",
  "GET - Object accessed": "GET – Auf das Objekt zugegriffen",
  "Get Information": "Informationen abrufen",
  "GNU Affero General Public License, version 3":
    "GNU Affero General Public License, Version 3",
  "GNU AGPL v3 full text": "GNU AGPL v3 Volltext",
  Governance: "Governance",
  Group: "Gruppe",
  "Group Mappings": "Gruppenzuordnungen",
  "Group Name": "Gruppenname",
  "Group Status:": "Gruppenstatus:",
  "Groups provide a simplified method for managing shared permissions among users with common access patterns and workloads. Client’s cannot authenticate to a SILO deployment using a group as an identity.":
    "Gruppen bieten eine vereinfachte Methode zur Verwaltung gemeinsamer Berechtigungen zwischen Benutzern mit gemeinsamen Zugriffsmustern und Arbeitslasten. Clients können sich nicht bei einer SILO-Bereitstellung authentifizieren, indem sie eine Gruppe als Identität verwenden.",
  "Groups with this Policy associated":
    "Gruppen, denen diese Richtlinie zugeordnet ist",
  "Guide to access policy structure":
    "Leitfaden zur Zugriffsrichtlinienstruktur",
  hard: "hart",
  Heal: "Reparieren",
  "Health Check Duration": "Dauer der Systemprüfung",
  "Health Info (Preview)": "Systemzustand (Vorschau)",
  "Health Report": "Diagnosebericht",
  "Health Report complete": "Diagnosebericht abgeschlossen",
  "Health Report file is ready to be downloaded.":
    "Die Diagnoseberichtsdatei steht zum Download bereit.",
  "Health report generated successfully!":
    "Diagnosebericht erfolgreich erstellt!",
  "Health Report in progress...": "Diagnosebericht wird erstellt...",
  "Health Report started. Please do not refresh page during diagnosis.":
    "Diagnosebericht gestartet. Bitte aktualisieren Sie die Seite während der Diagnose nicht.",
  Healthy: "Fehlerfrei",
  "Hide advanced Filters": "Erweiterte Filter ausblenden",
  "Hide Bucket Naming Rules": "Benennungsregeln für Buckets ausblenden",
  "Hide Object Versions": "Objektversionen ausblenden",
  hour: "Stunde",
  hours: {
    one: "Stunde",
    other: "Stunden",
  },
  Hours: "Stunden",
  "IAM conditional statements": "Bedingte IAM-Anweisungen",
  "IAM Policy": "IAM-Richtlinie",
  Id: "ID",
  Identifier: "Kennung",
  "Identity provider Client ID": "Client-ID des Identitätsanbieters",
  "Identity provider Client Secret": "Client-Geheimnis des Identitätsanbieters",
  "If the Health report cannot be generated at this time, please wait a moment and try again.":
    "Wenn der Diagnosebericht derzeit nicht erstellt werden kann, warten Sie bitte einen Moment und versuchen Sie es erneut.",
  "If you are looking to change MINIO_ROOT_USER credentials,":
    "Wenn Sie MINIO_ROOT_USER Anmeldeinformationen ändern möchten,",
  "ILM - Object Transitioned": "ILM – Objektübergang",
  "ILM Rule": "ILM-Regel",
  Import: "Importieren",
  "incorporates and modifies": "übernimmt und ändert",
  Index: "Index",
  "Initially, only one of the sites added for replication may have data. After site-replication is successfully configured, this data is replicated to the other (initially empty) sites. Subsequently, objects may be written to any of the sites, and they will be replicated to all other sites.":
    "Zunächst verfügt möglicherweise nur eine der zur Replikation hinzugefügten Sites über Daten. Nachdem die Site-Replikation erfolgreich konfiguriert wurde, werden diese Daten auf die anderen (zunächst leeren) Sites repliziert. Anschließend können Objekte auf jede der Sites geschrieben werden und werden auf allen anderen Sites repliziert.",
  "Inspect Decryption Key": "Entschlüsselungsschlüssel für Untersuchung",
  "Inspect Object": "Objekt prüfen",
  "Inspect this file": "Datei untersuchen",
  Internal: "Intern",
  "Invalid bucket name": "Ungültiger Bucket-Name",
  "Invalid Endpoint set": "Ungültiger Endpunktsatz",
  "Invalid Name": "Ungültiger Name",
  January: "Januar",
  "JSON Results:": "JSON-Ergebnisse:",
  July: "Juli",
  June: "Juni",
  "Just now": "Gerade eben",
  "Kafka topic used for bucket notifications":
    "Kafka-Topic für Bucket-Benachrichtigungen",
  "Keep Alive Interval": "Keep Alive-Intervall",
  "Keep-alive interval for MQTT connections in s,m,h,d":
    "Keep-Alive-Intervall für MQTT-Verbindungen in s,m,h,d",
  Key: "Schlüssel",
  "Key Management Service Endpoints:": "Schlüsselverwaltungsdienst-Endpunkte:",
  "Key Name": "Schlüsselname",
  "Key name cannot contain spaces":
    "Der Schlüsselname darf keine Leerzeichen enthalten",
  Keys: "Schlüssel",
  "KMS Key ID": "KMS-Schlüssel-ID",
  "Last Modified": "Letzte Änderung",
  "Last modified:": "Letzte Änderung:",
  "Last Modified:": "Letzte Änderung:",
  "Latency Histogram": "Latenzhistogramm",
  "LDAP Enabled": "LDAP aktiviert",
  "Learn more about {link}.": "Erfahren Sie mehr über {link}.",
  "Learn more about Access Keys": "Erfahren Sie mehr über Zugriffsschlüssel",
  "Learn more about Groups": "Erfahren Sie mehr über Gruppen",
  "Learn more about LDAP Configurations":
    "Mehr über LDAP-Konfigurationen erfahren",
  "Learn more about OpenID Connect Configurations":
    "Erfahren Sie mehr über OpenID Connect-Konfigurationen",
  "Learn more about Policies": "Erfahren Sie mehr über Richtlinien",
  "Learn more about the Users feature":
    "Erfahren Sie mehr über die Benutzerfunktion",
  "Learn more about TIERS": "Mehr über Speicherebenen erfahren",
  "Legal Hold": "Legal Hold",
  "Legal Hold Status": "Status der rechtlichen Aufbewahrung",
  "Legal Hold:": "Legal Hold:",
  "licensing in full": "Lizenz vollständig",
  Lifecycle: "Lebenszyklus",
  "Lifecycle Configuration": "Lebenszykluskonfiguration",
  "Lifecycle Rules": "Lebenszyklusregeln",
  Link: "Link",
  'List of etcd endpoints e.g. "http://localhost:2379" - you can write one per field':
    'Liste der etcd-Endpunkte, z. B. "http://localhost:2379" – einer pro Feld',
  "List of origins allowed for CORS requests":
    "Liste der zulässigen Ursprünge für CORS-Anfragen",
  "List of Replicated Sites": "Liste der replizierten Standorte",
  "Load more": "Mehr laden",
  "Load more Versions": "Weitere Versionen laden",
  "Load Time": "Ladezeit",
  "Loading nodes": "Knoten werden geladen",
  "Local Buckets to replicate": "Lokale Buckets zum Replizieren",
  Location: "Standort",
  Locking: "Sperren",
  "Log Details": "Protokolldetails",
  "Logger Webhook": "Logger-Webhook",
  "Lookup Bind DN is required": "Lookup Bind DN ist erforderlich",
  "Lookup Bind Password is required": "Lookup-Bind-Passwort ist erforderlich",
  "Lookup Bind Password must be re-entered to change LDAP configurations":
    "Lookup Bind Password muss erneut eingegeben werden, um LDAP Konfigurationen zu ändern",
  "Manage Groups": "Gruppen verwalten",
  Mandatory: "Obligatorisch",
  "Manually Configure String": "Zeichenfolge manuell konfigurieren",
  March: "März",
  "Max IO": "Max. I/O",
  "Max Sleep": "Max. Pause",
  "Max Wait": "Max. Wartezeit",
  "Maximum IO requests allowed between objects to slow down heal operation, e.g. 3":
    "Maximal zulässige I/O-Anfragen zwischen Objekten zur Drosselung der Reparatur, z. B. 3",
  "Maximum limit for undelivered messages, defaults to '10000'":
    "Maximaler Grenzwert für nicht zugestellte Nachrichten, Standard ist '10000'",
  "Maximum number of concurrent requests, e.g. '1600'":
    "Maximale Anzahl gleichzeitiger Anfragen, z.B. '1600'",
  "Maximum sleep duration between objects to slow down heal operation, e.g. 2s":
    "Maximale Pausendauer zwischen Objekten zur Drosselung der Reparatur, z. B. 2s",
  "Maximum wait time between operations, defaults to '15s'":
    "Maximale Wartezeit zwischen Vorgängen, Standard ist '15s'",
  May: "Mai",
  "May try again or download Health report JSON File.":
    "Versuchen Sie es erneut oder laden Sie die JSON-Datei des Diagnoseberichts herunter.",
  Members: "Mitglieder",
  "Memory Info": "Speicherinfo",
  Metadata: "Metadaten",
  "Metadata Sync": "Metadaten-Synchronisierung",
  Method: "Methode",
  "Mime Types": "MIME-Typen",
  'Mime types e.g. "text/*", "application/json" or "application/xml" - you can write one per field':
    "MIME-Typen, z.B. „text/*“, „application/json“ oder „application/xml“ – Sie können eine pro Feld schreiben",
  minute: "Minute",
  minutes: {
    one: "Minute",
    other: "Minuten",
  },
  Minutes: "Minuten",
  Mode: "Modus",
  "Mode:": "Modus:",
  month: "Monat",
  months: {
    one: "Monat",
    other: "Monate",
  },
  "More filter options": "Weitere Filteroptionen",
  "MQTT password": "MQTT-Passwort",
  "MQTT server endpoint e.g. `tcp://localhost:1883`":
    "MQTT-Server-Endpunkt, z. B. `tcp://localhost:1883`",
  "MQTT username": "MQTT-Benutzername",
  "Multi Bucket lifecycle Assignments Results":
    "Ergebnisse der Multi-Bucket-Lebenszykluszuweisungen",
  Name: "Name",
  "Name for identity provider configuration":
    "Name für die Konfiguration des Identitätsanbieters",
  "Name of the AMQP exchange": "Name des AMQP-Exchange",
  'Name of the location of the server e.g. "us-west-rack2"':
    'Standortname des Servers, z. B. "us-west-rack2"',
  "Name of the MQTT topic to publish":
    "Name des zu veröffentlichenden MQTT-Topics",
  "Name:": "Name:",
  'Namespace prefix to isolate tenants e.g. "customer1/"':
    'Namespace-Präfix zur Mandantenisolierung, z. B. "customer1/"',
  "NATS password": "NATS-Passwort",
  "NATS server address e.g. '0.0.0.0:4222'":
    "NATS-Serveradresse, z. B. '0.0.0.0:4222'",
  "NATS subscription subject": "NATS-Abonnement-Subject",
  "NATS token": "NATS-Token",
  "NATS username": "NATS-Benutzername",
  "Network Info": "Netzwerkinformationen",
  "New {entity} Created": "{entity} neu erstellt",
  "New Audit Webhook": "Neuer Audit-Webhook",
  "New Endpoint": "Neuer Endpunkt",
  "New Endpoint:": "Neuer Endpunkt:",
  "New Folder Path": "Neuer Ordnerpfad",
  "New Logger Webhook": "Neuer Logger-Webhook",
  "New Password": "Neues Passwort",
  "New passwords don't match": "Neue Passwörter stimmen nicht überein",
  "New Tag Key": "Neuer Tag-Schlüssel",
  "New Tag Label": "Neues Tag-Label",
  Next: "Weiter",
  No: "Nein",
  "No changes applied": "Keine Änderungen übernommen",
  "No Changes at this time": "Derzeit keine Änderungen",
  "No data available": "Keine Daten verfügbar",
  "No Groups Available": "Keine Gruppen verfügbar",
  "No Policies Available": "Keine Richtlinien verfügbar",
  "No query results yet": "Noch keine Abfrageergebnisse",
  "No Results Available": "Keine Ergebnisse verfügbar",
  "No Users to display": "Keine Benutzer zum Anzeigen",
  "No Wait": "Keine Wartezeit",
  "no-expiry": "kein Ablaufdatum",
  "Nodes:": "Knoten:",
  "Non-blocking message delivery when set to 'on', default is 'off'":
    "Nicht blockierende Nachrichtenzustellung bei 'on', Standard ist 'off'",
  "Non-Current": "Nicht aktuell",
  "Non-current Expiration Days": "Ablauf Altversionen (Tage)",
  "Non-current Transition Days": "Nicht aktuelle Übergangstage",
  "Non-Current Version": "Nicht aktuelle Version",
  "Non-current Version Transition Storage Class":
    "Übergangsspeicherklasse für nicht aktuelle Versionen",
  None: "Keine",
  "Not what you expected?": "Nicht das, was Sie erwartet haben?",
  "Note:": "Hinweis:",
  "Note: AccessKey and SecretKey values for every site is required while adding or editing peer sites":
    "Hinweis: Beim Hinzufügen oder Bearbeiten von Peer-Standorten sind AccessKey und SecretKey für jeden Standort erforderlich.",
  November: "November",
  "NSQ server address e.g. '127.0.0.1:4150'":
    "NSQ-Serveradresse, z. B. '127.0.0.1:4150'",
  "NSQ topic": "NSQ-Topic",
  "NSQD Address": "NSQD-Adresse",
  "NULL VERSION": "NULL VERSION",
  "Number of {unit} must be less than or equal to 2147483647":
    "Die Anzahl der {unit} muss kleiner oder gleich 2147483647 sein",
  "Number of {unit} to retain must be greater than zero":
    "Die Anzahl der zu behaltenden {unit} muss größer als Null sein",
  "Number of messages to publish without waiting for ACKs":
    "Anzahl der zu veröffentlichenden Nachrichten, ohne auf ACKs zu warten",
  "Number of replication workers for recently failed replicas, defaults to 4":
    "Anzahl der Replikations-Worker für kürzlich fehlgeschlagene Replikate, Standard ist 4",
  "Number of replication workers, defaults to 100":
    "Anzahl der Replikations-Worker, Standard ist 100",
  Object: "Objekt",
  "Object Date": "Objektdatum",
  "Object Filters": "Objektfilter",
  "Object Info": "Objektinformationen",
  "Object Locking:": "Objektsperre:",
  "Object Size": "Objektgröße",
  "Object Version": "Objektversion",
  "Objects deleted successfully.": "Objekte erfolgreich gelöscht.",
  "Objects in excluded prefixes do not replicate to any peer site or remote site.":
    "Objekte in ausgeschlossenen Präfixen werden nicht auf Peer-Sites oder Remote-Sites repliziert.",
  "Objects List unavailable. Please review your WebSockets configuration and try again":
    "Objektliste nicht verfügbar. Bitte überprüfen Sie Ihre WebSockets-Konfiguration und versuchen Sie es erneut",
  "Objects:": "Objekte:",
  "Objs/S": "Objs/S",
  October: "Oktober",
  of: "von",
  "Only empty tiers can be deleted. If the tier has had objects transitioned into it, it cannot be removed.":
    "Nur leere Speicherklassen können gelöscht werden. Sobald Objekte in eine Speicherklasse verschoben wurden, kann diese nicht mehr entfernt werden.",
  "Opaque string or JWT authorization token":
    "Undurchsichtige Zeichenfolge oder JWT-Autorisierungstoken",
  "Open Dialog": "Dialog öffnen",
  "OpenID Configurations": "OpenID-Konfigurationen",
  "OS Info": "OS-Info",
  other: "andere",
  "Password for LDAP read-only service account used to perform DN and group lookups":
    "Passwort des schreibgeschützten LDAP-Dienstkontos für DN- und Gruppensuchen",
  "Password for SASL/PLAIN or SASL/SCRAM authentication":
    "Passwort für SASL/PLAIN- oder SASL/SCRAM-Authentifizierung",
  "Passwords must be at least 8 characters long":
    "Passwörter müssen mindestens 8 Zeichen lang sein",
  Path: "Pfad",
  "Path cannot start with /": "Pfad kann nicht mit / beginnen",
  "Path copied to clipboard": "Pfad in die Zwischenablage kopiert",
  "Path Prefix": "Pfadpräfix",
  "Path to certificate chain of the target NATS server":
    "Pfad zur Zertifikatskette des NATS-Zielservers",
  "Path to client certificate for mTLS authorization":
    "Pfad zum Client-Zertifikat für die mTLS-Autorisierung",
  "Path to client key for mTLS authorization":
    "Pfad zum Clientschlüssel für die mTLS-Autorisierung",
  "Peer Sites": "Peer-Standorte",
  "Perform bitrot scan on disks when checking objects during scanner":
    "Führen Sie einen Bitrot-Scan auf Datenträgern durch, wenn Sie Objekte während des Scanners überprüfen",
  "Performance test": "Leistungstest",
  "Persist queue across broker restarts when set to 'on', default is 'off'":
    "Warteschlange über Broker-Neustarts hinweg beibehalten bei 'on', Standard ist 'off'",
  "Ping Interval": "Ping-Intervall",
  "Please avoid the use of root credentials for this feature":
    "Bitte vermeiden Sie die Verwendung von Root-Anmeldeinformationen für diese Funktion",
  "Please configure {entity} first to use this feature.":
    "Bitte konfigurieren Sie zuerst {entity}, um diese Funktion zu verwenden.",
  "Please deploy a server in {distributedMode} to use these features.":
    "Bitte stellen Sie einen Server in {distributedMode} bereit, um diese Funktionen nutzen zu können.",
  "Please deploy a server in {mode} to use this feature.":
    "Bitte stellen Sie einen Server in {mode} bereit, um diese Funktion zu nutzen.",
  "N/A": "N/A",
  "Enter a positive quota below 8 PiB, with up to two decimal places. Use mcli for larger quotas.":
    "Geben Sie eine positive Quote unter 8 PiB mit bis zu zwei Dezimalstellen ein. Verwenden Sie mcli für größere Kontingente.",
  "The current quota is 8 PiB or larger, which the browser cannot edit exactly. Change it with mcli, enter a smaller quota, or disable it here.":
    "Das aktuelle Kontingent beträgt 8 PiB oder mehr, was der Browser nicht genau bearbeiten kann. Ändern Sie es mit mcli, geben Sie ein kleineres Kontingent ein oder deaktivieren Sie es hier.",
  "Please Login via the configured external identity provider.":
    "Bitte melden Sie sich über den konfigurierten externen Identitätsanbieter an.",
  "Please note": "Bitte beachten",
  "Please note that this may cause your system to not be accessible":
    "Bitte beachten Sie, dass dies dazu führen kann, dass Ihr System nicht erreichbar ist",
  "Please refer to {link} credentials.":
    "Bitte beziehen Sie sich auf {link} Anmeldeinformationen.",
  "Please select / type the desired remote bucket were you want the local data to be replicated.":
    "Bitte wählen Sie den gewünschten Remote-Bucket aus bzw. geben Sie ihn ein, in dem die lokalen Daten repliziert werden sollen.",
  "Please select a valid duration.": "Bitte wählen Sie eine gültige Dauer aus.",
  "Please select Groups on which you want to apply Policies":
    "Bitte wählen Sie Gruppen aus, auf die Sie Richtlinien anwenden möchten",
  "Please verify that string is uppercase only and contains valid characters (numbers, dashes & underscores).":
    "Bitte stellen Sie sicher, dass die Zeichenfolge nur aus Großbuchstaben besteht und gültige Zeichen (Zahlen, Bindestriche und Unterstriche) enthält.",
  Policy: "Richtlinie",
  "Policy has no statements": "Die Richtlinie enthält keine Anweisungen",
  "Policy mapping": "Richtlinienzuordnung",
  "Policy Mappings": "Richtlinienzuordnungen",
  "Policy Name": "Richtlinienname",
  "Policy name cannot be empty": "Der Richtlinienname darf nicht leer sein",
  "Policy successfully updated": "Richtlinie erfolgreich aktualisiert",
  "Policy Summary": "Richtlinienzusammenfassung",
  "Portions © 2015–2026 MinIO, Inc.": "Teile © 2015–2026 MinIO, Inc.",
  prefix: "Präfix",
  Prefix: "Präfix",
  "Preliminar Results:": "Vorläufige Ergebnisse:",
  preview: "Vorschau",
  Preview: "Vorschau",
  "Preview - {object}": "Vorschau - {object}",
  "Preview Selected File": "Vorschau der ausgewählten Datei",
  "Preview this File": "Vorschau dieser Datei",
  "Preview unavailable": "Vorschau nicht verfügbar",
  Priority: "Priorität",
  private: "privat",
  Private: "Privat",
  "Process Info": "Prozessinformationen",
  public: "öffentlich",
  Public: "Öffentlich",
  "PUT - Object Uploaded": "PUT – Objekt hochgeladen",
  "Query Filters": "Abfragefilter",
  "Query Results": "Abfrageergebnisse",
  Queue: "Warteschlange",
  "Queue Dir": "Warteschlangenverzeichnis",
  "Queue Directory": "Warteschlangenverzeichnis",
  "Queue Limit": "Warteschlangenlimit",
  "Quietly ignore undelivered messages when set to 'off', default is 'on'":
    "Nicht zugestellte Nachrichten stillschweigend ignorieren bei 'off', Standard ist 'on'",
  quota: "Kontingent",
  Quota: "Kontingent",
  "Quota:": "Kontingent:",
  "Randomized access credentials are recommended, and provided by default. You may use your own custom Access Key and Secret Key by replacing the default values. After creation of any Access Key, you will be given the opportunity to view and download the account credentials.":
    "Zufällige Zugangsdaten werden empfohlen und standardmäßig bereitgestellt. Sie können Ihren eigenen benutzerdefinierten Zugriffsschlüssel und Geheimschlüssel verwenden, indem Sie die Standardwerte ersetzen. Nach der Erstellung eines Zugriffsschlüssels erhalten Sie die Möglichkeit, die Kontoanmeldeinformationen anzuzeigen und herunterzuladen.",
  "Raw Policy": "Rohrichtlinie",
  readonly: "schreibgeschützt",
  readwrite: "lesen/schreiben",
  "Reconnect Interval": "Wiederverbindungsintervall",
  "Reconnect interval for MQTT connections in s,m,h,d":
    "Wiederverbindungsintervall für MQTT-Verbindungen in s,m,h,d",
  "Redirect URI Dynamic": "Dynamische Weiterleitungs-URI",
  "Redis key to store/update events, key is auto-created":
    "Redis-Schlüssel zum Speichern/Aktualisieren von Ereignissen (wird automatisch erstellt)",
  "Redis server password": "Redis-Serverpasswort",
  "Redis server's address e.g. `localhost:6379`":
    "Redis-Serveradresse, z. B. `localhost:6379`",
  Refresh: "Aktualisieren",
  "Refresh List": "Liste aktualisieren",
  Region: "Region",
  "Remote Bucket Assignments": "Remote-Bucket-Zuweisungen",
  "Remote Configuration": "Fernkonfiguration",
  "Remote Endpoint Configuration": "Remote-Endpunkt-Konfiguration",
  "Remote Host": "Remote-Host",
  "remote tier": "Remote-Speicherebene",
  "Remove Row": "Zeile entfernen",
  "Remove Selected Replication Rules":
    "Ausgewählte Replikationsregeln entfernen",
  "Remove Selected Rules": "Ausgewählte Regeln entfernen",
  "Remove the reference to the object if no versions are left":
    "Entfernen Sie den Verweis auf das Objekt, wenn keine Versionen übrig sind",
  "Removes all the versions of the object already expired":
    "Entfernt alle Versionen des Objekts, die bereits abgelaufen sind",
  "Rename Download": "Download umbenennen",
  "REPLICA - Object Replicated": "REPLICA – Objekt repliziert",
  "Replicate existing objects": "Vorhandene Objekte replizieren",
  "Replicate soft deletes": "Logische Löschungen replizieren",
  "Replicate versioned deletes": "Versionslöschungen replizieren",
  Replication: "Replikation",
  "Replication Failed Workers": "Worker für fehlgeschlagene Replikationen",
  "Replication Mode": "Replikationsmodus",
  "Replication Options": "Replikationsoptionen",
  "Replication Rules": "Replikationsregeln",
  "Replication Status": "Replikationsstatus",
  "Replication status for {type}: {name}.":
    "Replikationsstatus für {type}: {name}.",
  "Replication status from all Sites": "Replikationsstatus aller Standorte",
  "Replication Workers": "Replikations-Worker",
  "Replication:": "Replikation:",
  "Reported Usage:": "Gemeldete Nutzung:",
  "Request Content Length": "Anfrage-Inhaltslänge",
  "Request ID": "Anfrage-ID",
  "Requests Max": "Anfragen max",
  "Requests that took T ms or less": "Anfragen, die T ms oder weniger dauerten",
  Reset: "Zurücksetzen",
  "Reset Configuration": "Konfiguration zurücksetzen",
  "Reset Default Webhook": "Standard-Webhook zurücksetzen",
  "Resources:": "Ressourcen:",
  "Response Content Length": "Länge des Antwortinhalts",
  "Response Status": "Antwortstatus",
  "Response Status Code": "Antwortstatuscode",
  "Response Threshold": "Reaktionsschwelle",
  Restart: "Neustart",
  "Restore Defaults": "Standardwerte",
  "Restore File Version": "Dateiversion wiederherstellen",
  "Restore this version": "Diese Version wiederherstellen",
  "Restrict beyond user policy":
    "Über die Benutzerrichtlinie hinaus einschränken",
  Results: "Ergebnisse",
  Retention: "Aufbewahrung",
  "Retention Mode": "Aufbewahrungsmodus",
  "Retention Policy:": "Aufbewahrungsrichtlinie:",
  "Retention Unit": "Aufbewahrungseinheit",
  "Retention Validity": "Aufbewahrungsdauer",
  "Retention:": "Aufbewahrung:",
  Retest: "Erneut testen",
  "Retry Health Report": "Diagnosebericht erneut erstellen",
  Rewind: "Zurückspulen",
  "Rewind - {bucket}": "Zurückspulen - {bucket}",
  "Rewind Bucket": "Bucket zurückspulen",
  "Rewind to": "Zurückspulen zu",
  "Role Policy": "Rollenrichtlinie",
  rotating: "rotierend",
  "Routing Key": "Routing-Schlüssel",
  "Routing key for publishing": "Routing-Schlüssel für die Veröffentlichung",
  "Rule State": "Regelstatus",
  "Rule Type": "Regeltyp",
  "Running {mcDu} without the {flag} flag or {df} will provide different values corresponding to the size of all {current} versions and the physical disk space occupied respectively.":
    "Wenn Sie {mcDu} ohne das Flag {flag} oder {df} ausführen, werden unterschiedliche Werte bereitgestellt, die der Größe aller {current}-Versionen bzw. dem belegten physischen Speicherplatz entsprechen.",
  "S3 lifecycle": "S3-Lebenszyklus",
  "SASL authentication mechanism": "SASL-Authentifizierungsmechanismus",
  "SASL authentication mechanism, default 'PLAIN'":
    "SASL-Authentifizierungsmechanismus, Standard 'PLAIN'",
  "SASL Mechanism": "SASL-Mechanismus",
  "SASL Password": "SASL-Passwort",
  "SASL Username": "SASL-Benutzername",
  "Save Event Destination": "Ereignisziel speichern",
  "Save Tier Configuration": "Speicherebenen-Konfiguration speichern",
  Scanner: "Scanner",
  "SCANNER - Object has too many versions / Prefixes has too many sub-folders":
    "SCANNER – Objekt hat zu viele Versionen/Präfixe hat zu viele Unterordner",
  "Scanner delay multiplier, defaults to '10.0'":
    "Scanner-Verzögerungsmultiplikator, Standard ist '10.0'",
  Scopes: "Bereiche",
  Search: "Suchen",
  "Search Access Keys": "Zugriffsschlüssel suchen",
  "Search Groups": "Gruppen suchen",
  "Search Keys with pattern": "Schlüssel nach Muster suchen",
  "Search members": "Mitglieder suchen",
  "Search Policies": "Richtlinien suchen",
  "Search target": "Suchziel",
  "Search Users": "Benutzer suchen",
  second: "Sekunde",
  seconds: {
    one: "Sekunde",
    other: "Sekunden",
  },
  "Secret Key": "Geheimer Schlüssel",
  "SecretKey is required": "SecretKey ist erforderlich",
  "Select {expiry} to delete Objects per this rule. Select {transition} to move Objects to a remote storage {tier} per this rule.":
    "Wählen Sie {expiry}, um Objekte gemäß dieser Regel zu löschen. Wählen Sie {transition}, um Objekte gemäß dieser Regel in einen Remote-Speicher {tier} zu verschieben.",
  "Select Bucket": "Bucket auswählen",
  "Select from the list of displayed users to assign users to the new group at creation. These users inherit the policies assigned to the group.":
    "Wählen Sie aus der Liste der angezeigten Benutzer aus, um Benutzer bei der Erstellung der neuen Gruppe zuzuweisen. Diese Benutzer erben die der Gruppe zugewiesenen Richtlinien.",
  "Select Groups to delete": "Zu löschende Gruppen auswählen",
  "Select Multiple Versions": "Mehrere Versionen auswählen",
  "Select Policy": "Richtlinie auswählen",
  "Select the desired level of access available to unauthenticated Users":
    "Wählen Sie die gewünschte Zugriffsebene für nicht authentifizierte Benutzer aus",
  "Select Tier Type": "Speicherebenentyp auswählen",
  "Select to set expiry by days or newer noncurrent versions":
    "Wählen Sie diese Option, um den Ablauf nach Tagen oder neueren, nicht aktuellen Versionen festzulegen",
  "Select Users to delete": "Zu löschende Benutzer auswählen",
  "Select Users to group": "Benutzer für Gruppe auswählen",
  "Select whether to apply the rule to current or non-current Object {versions}":
    "Wählen Sie aus, ob die Regel auf aktuelle oder nicht aktuelle Objekt-{versions} angewendet werden soll",
  "Selected Group": "Ausgewählte Gruppe",
  "Selected Groups": "Ausgewählte Gruppen",
  "Selected Object": "Ausgewähltes Objekt",
  "Selected Objects:": "Ausgewählte Objekte:",
  "Selected User": "Ausgewählter Benutzer",
  "Selected Users": "Ausgewählte Benutzer",
  September: "September",
  Series: "Serie",
  server: "Server",
  "Server Address": "Serveradresse",
  "Server Address is required": "Serveradresse ist erforderlich",
  "Server Config": "Serverkonfiguration",
  "Server Health Info": "Informationen zum Serverzustand",
  "Server Insecure": "Server unsicher",
  "Server Location": "Serverstandort",
  "server-side bucket replication": "serverseitige Bucket-Replikation",
  "Server, client and Console are all AGPLv3. SILO's documentation is CC BY 4.0 — {licensing}.":
    "Server, Client und Konsole sind alle AGPLv3. Die Dokumentation von SILO ist CC BY 4.0 – {licensing}.",
  Service: "Dienst",
  "Service Accounts": "Dienstkonten",
  Services: "Dienste",
  Set: "Festlegen",
  "Set Anonymous Access to this Folder":
    "Anonymen Zugriff für diesen Ordner festlegen",
  "Set Bucket Replication": "Bucket-Replikation festlegen",
  "Set Groups": "Gruppen festlegen",
  "Set Legal Hold": "Legal Hold festlegen",
  "Set Lifecycle to multiple buckets":
    "Lebenszyklus für mehrere Buckets festlegen",
  "Set Multiple Bucket Replication":
    "Replikation für mehrere Buckets festlegen",
  "Set Non-current Version Transition Storage Class":
    "Übergangsspeicherklasse für nicht aktuelle Versionen festlegen",
  "Set Policies": "Richtlinien festlegen",
  "Set Retention Configuration": "Aufbewahrung konfigurieren",
  "Set Retention Policy": "Aufbewahrungsrichtlinie festlegen",
  "Set the quality of service priority, defaults to '0'":
    "QoS-Priorität festlegen, Standard ist '0'",
  "Set to '1' for non-persistent or '2' for persistent queue":
    "Auf '1' für nicht persistente oder '2' für persistente Warteschlange setzen",
  "Set to 'on' for exchange to be not used directly by publishers, but only when bound to other exchanges":
    "Auf 'on' setzen, damit der Exchange nicht direkt von Publishern genutzt wird, sondern nur über Bindings zu anderen Exchanges",
  "Set to 'on' to enable asynchronous publish":
    "Auf 'on' setzen, um asynchrone Veröffentlichung zu aktivieren",
  "Set to 'on' to enable SASL authentication":
    "Auf 'on' setzen, um SASL-Authentifizierung zu aktivieren",
  "Set to 'on' to enable TLS": "Auf 'on' setzen, um TLS zu aktivieren",
  "Set to 'on' to use streaming NATS server":
    "Auf 'on' setzen, um den NATS-Streaming-Server zu verwenden",
  "Setting a {quota} assigns a hard limit to a bucket beyond which SILO does not allow writes.":
    "Das Setzen einer {quota} weist einem Bucket ein hartes Limit zu, über das hinaus SILO keine Schreibvorgänge zulässt.",
  "Setting an {anonymous} policy allows clients to access the Bucket or prefix contents and perform actions consistent with the specified policy without authentication.":
    "Durch das Festlegen einer {anonymous}-Richtlinie können Clients ohne Authentifizierung auf den Bucket- oder Präfixinhalt zugreifen und Aktionen ausführen, die der angegebenen Richtlinie entsprechen.",
  Share: "Teilen",
  "Share File": "Datei teilen",
  "Share Selected File": "Ausgewählte Datei teilen",
  "Share this File": "Datei teilen",
  "Share this version": "Diese Version teilen",
  "Share URL Copied to clipboard": "Freigabe-URL in die Zwischenablage kopiert",
  'Shared bucket DNS records, default is "/skydns"':
    'DNS-Einträge für freigegebene Buckets, Standard ist "/skydns"',
  "Show advanced Filters": "Erweiterte Filter anzeigen",
  "Show Current Data": "Aktuelle Daten anzeigen",
  "Show deleted objects": "Gelöschte Objekte anzeigen",
  "Show Rewind Data": "Rücklaufdaten anzeigen",
  "Show/Hide": "Einblenden/Ausblenden",
  "SILO {bucketNotifications} allow administrators to send notifications to supported external services on certain object or bucket events.":
    "SILO {bucketNotifications} ermöglichen Administratoren das Senden von Benachrichtigungen an unterstützte externe Dienste zu bestimmten Objekt- oder Bucket-Ereignissen.",
  "SILO {objectLocking} enforces Write-Once Read-Many (WORM) immutability to protect versioned objects from deletion.":
    "SILO {objectLocking} erzwingt die Unveränderlichkeit „Write-Once Read-Many“ (WORM), um versionierte Objekte vor dem Löschen zu schützen.",
  "SILO {serverSideReplication} is an automatic bucket-level configuration that synchronizes objects between a source and destination bucket.":
    "SILO {serverSideReplication} ist eine automatische Konfiguration auf Bucket-Ebene, die Objekte zwischen einem Quell- und einem Ziel-Bucket synchronisiert.",
  "SILO bucket notifications allow administrators to send notifications to supported external services on certain object or bucket events. SILO supports bucket and object-level S3 events similar to the Amazon S3 Event Notifications.":
    "SILO-Bucket-Benachrichtigungen ermöglichen Administratoren das Senden von Benachrichtigungen an unterstützte externe Dienste bei bestimmten Objekt- oder Bucket-Ereignissen. SILO unterstützt S3-Ereignisse auf Bucket- und Objektebene ähnlich den Amazon-S3-Ereignisbenachrichtigungen.",
  "SILO derives its behavior and syntax from {s3Lifecycle} for compatibility in migrating workloads and lifecycle rules from S3 to SILO.":
    "SILO leitet sein Verhalten und seine Syntax von {s3Lifecycle} ab, um die Kompatibilität bei der Migration von Arbeitslasten und Lebenszyklusregeln von S3 nach SILO zu gewährleisten.",
  "SILO does not enable existing object replication by default. Objects created before replication was configured or while replication is disabled are not synchronized to the target deployment unless replication of existing objects is enabled.":
    "SILO aktiviert die vorhandene Objektreplikation standardmäßig nicht. Objekte, die vor der Konfiguration der Replikation oder bei deaktivierter Replikation erstellt wurden, werden nicht mit der Zielbereitstellung synchronisiert, es sei denn, die Replikation vorhandener Objekte ist aktiviert.",
  "SILO Health Info": "SILO-Systemzustand",
  "SILO Object Lifecycle Management allows creating rules for time or date based automatic transition or expiry of objects. For object transition, SILO automatically moves the object to a configured remote storage tier.":
    "SILO Object Lifecycle Management ermöglicht die Erstellung von Regeln für den zeit- oder datumsbasierten automatischen Übergang oder Ablauf von Objekten. Für den Objektübergang verschiebt SILO das Objekt automatisch auf eine konfigurierte Remote-Speicherebene.",
  "SILO or other S3-compatible storage":
    "SILO oder anderer S3-kompatibler Speicher",
  "SILO PBAC is built for compatibility with AWS IAM policy syntax, structure, and behavior.":
    "SILO PBAC ist auf Kompatibilität mit der AWS-IAM-Richtliniensyntax, -struktur und dem -verhalten ausgelegt.",
  "SILO queries the configured Active Directory / LDAP server to verify the credentials specified by the application and optionally return a list of groups in which the user has membership. SILO supports two modes (Lookup-Bind Mode and Username-Bind Mode) for performing these queries":
    "SILO fragt den konfigurierten Active Directory-/LDAP-Server ab, um die von der Anwendung angegebenen Anmeldeinformationen zu überprüfen und optional eine Liste der Gruppen zurückzugeben, in denen der Benutzer Mitglied ist. SILO unterstützt zwei Modi (Lookup-Bind-Modus und Benutzername-Bind-Modus) zum Durchführen dieser Abfragen",
  "SILO recommends using Lookup-Bind mode as the preferred method for verifying AD/LDAP credentials. Username-Bind mode is a legacy method retained for backwards compatibility only.":
    "SILO empfiehlt die Verwendung des Lookup-Bind-Modus als bevorzugte Methode zur Überprüfung der AD/LDAP-Anmeldeinformationen. Der Username-Bind-Modus ist eine Legacy-Methode, die nur aus Gründen der Abwärtskompatibilität beibehalten wird.",
  "SILO requires versioning to support replication.":
    "SILO erfordert Versionierung, um die Replikation zu unterstützen.",
  "SILO supports automatically replicating existing objects in a bucket; this setting is enabled by default. Please note that objects created before replication was configured or while replication is disabled are not synchronized to the target deployment in case this setting is not enabled.":
    "SILO unterstützt die automatische Replikation vorhandener Objekte in einem Bucket; Diese Einstellung ist standardmäßig aktiviert. Bitte beachten Sie, dass Objekte, die vor der Konfiguration der Replikation oder bei deaktivierter Replikation erstellt wurden, nicht mit der Zielbereitstellung synchronisiert werden, falls diese Einstellung nicht aktiviert ist.",
  "SILO supports creating object transition lifecycle management rules, where SILO can automatically move an object to a remote storage “tier”.":
    "SILO unterstützt das Erstellen von Lebenszyklusverwaltungsregeln für den Objektübergang, wobei SILO ein Objekt automatisch auf eine Remote-Speicherebene verschieben kann.",
  "SILO supports enabling automatic {sseKms} and {sseS3} encryption of all objects written to a bucket using a specific External Key (EK) stored on the external KMS.":
    "SILO unterstützt die automatische {sseKms}- und {sseS3}-Verschlüsselung aller in einen Bucket geschriebenen Objekte mithilfe eines bestimmten externen Schlüssels (EK) im externen KMS.",
  "SILO supports enabling replication of existing objects in a bucket.":
    "SILO unterstützt die Replikation vorhandener Objekte in einem Bucket.",
  "SILO supports keeping multiple {versions} of an object in a single bucket.":
    "SILO unterstützt das Speichern mehrerer {versions} eines Objekts in einem einzigen Bucket.",
  "SILO supports replicating delete operations, where SILO synchronizes deleting specific object versions and new delete markers. Delete operation replication uses the same replication process as all other replication operations.":
    "SILO unterstützt die Replikation von Löschvorgängen, wobei SILO das Löschen bestimmter Objektversionen und neuer Löschmarkierungen synchronisiert. Die Replikation des Löschvorgangs verwendet denselben Replikationsprozess wie alle anderen Replikationsvorgänge.",
  "SILO supports server-side and client-side replication of objects between source and destination buckets.":
    "SILO unterstützt die serverseitige und clientseitige Replikation von Objekten zwischen Quell- und Ziel-Buckets.",
  "SILO supports setting both {bucketDefault} and per-object retention rules.":
    "SILO unterstützt das Festlegen sowohl von {bucketDefault} als auch von Aufbewahrungsregeln pro Objekt.",
  "SILO supports the following Tier types:":
    "SILO unterstützt die folgenden Speicherebenentypen:",
  "SILO supports using an Active Directory or LDAP (AD/LDAP) service for external management of user identities. Configuring an external IDentity Provider (IDP) enables Single-Sign On (SSO) workflows, where applications authenticate against the external IDP before accessing SILO.":
    "SILO unterstützt die Verwendung eines Active-Directory- oder LDAP-Dienstes (AD/LDAP) für die externe Verwaltung von Benutzeridentitäten. Durch die Konfiguration eines externen Identitätsanbieters (IDP) werden Single-Sign-On-Workflows (SSO) ermöglicht, bei denen sich Anwendungen beim externen IDP authentifizieren, bevor sie auf SILO zugreifen.",
  "SILO uses buckets to organize objects. A bucket is similar to a folder or directory in a filesystem, where each bucket can hold an arbitrary number of objects.":
    "SILO verwendet Buckets, um Objekte zu organisieren. Ein Bucket ähnelt einem Ordner oder Verzeichnis in einem Dateisystem, wobei jeder Bucket eine beliebige Anzahl von Objekten enthalten kann.",
  "SILO uses Policy-Based Access Control (PBAC) to define the authorized actions and resources to which an authenticated user has access. Each policy describes one or more actions and conditions that outline the permissions of a user or group of users.":
    "SILO verwendet richtlinienbasierte Zugriffskontrolle (PBAC), um die autorisierten Aktionen und Ressourcen zu definieren, auf die ein authentifizierter Benutzer Zugriff hat. Jede Richtlinie beschreibt eine oder mehrere Aktionen und Bedingungen, die die Berechtigungen eines Benutzers oder einer Benutzergruppe beschreiben.",
  "SILO VERSION": "SILO VERSION",
  "Site Name": "Standortname",
  "Site:": "Standort:",
  Size: "Größe",
  "Size:": "Größe:",
  "Skip TLS Verification": "TLS-Überprüfung überspringen",
  "something went wrong": "etwas ist schief gelaufen",
  "Something went wrong.": "Etwas ist schief gelaufen.",
  "Sort by": "Sortieren nach",
  "Specify the version of the Kafka cluster":
    "Geben Sie die Version des Kafka-Clusters an",
  "Specify the version of the Kafka cluster e.g '2.2.0'":
    "Version des Kafka-Clusters angeben, z. B. '2.2.0'",
  "Speed Test results:": "Ergebnisse des Geschwindigkeitstests:",
  Speedtest: "Speedtest",
  "Speedtest in progress...": "Geschwindigkeitstest läuft...",
  "Staging directory for undelivered messages e.g. '/home/events'":
    "Staging-Verzeichnis für nicht zugestellte Nachrichten, z.B. '/home/events'",
  "STANDARD_IA,REDUCED_REDUNDANCY etc": "STANDARD_IA,REDUCED_REDUNDANCY usw",
  Start: "Start",
  "Start Health Report": "Diagnosebericht starten",
  "Start Logs": "Protokolle starten",
  "Start Profiling": "Profiling starten",
  "Start Time:": "Startzeit:",
  "Start typing to filter objects in the bucket":
    "Tippen, um Objekte im Bucket zu filtern",
  "Start typing to filter versions of {file}":
    "Tippen, um Versionen von {file} zu filtern",
  "Start typing to search for a Policy":
    "Tippen, um nach einer Richtlinie zu suchen",
  "Start typing to search for Groups": "Tippen, um nach Gruppen zu suchen",
  Statements: "Anweisungen",
  Status: "Status",
  "Status Code": "Statuscode",
  Stop: "Stopp",
  "Stop Logs": "Protokolle stoppen",
  "Stop Profiling": "Profiling stoppen",
  Storage: "Speicher",
  "Storage Class": "Speicherklasse",
  Streaming: "Streaming",
  "Streaming async": "Asynchrones Streaming",
  "Streaming Cluster ID": "Streaming-Cluster-ID",
  "Streaming max publish ACKS in flight":
    "Max. ausstehende Publish-ACKs beim Streaming",
  Subject: "Betreff",
  "Subscribe To Bucket Events": "Bucket-Ereignisse abonnieren",
  "Subscribe to Event": "Ereignis abonnieren",
  Success: "Erfolg",
  "Successfully deleted.": "Erfolgreich gelöscht.",
  "Successfully updated the password for the user {user}.":
    "Das Passwort für den Benutzer {user} wurde erfolgreich aktualisiert.",
  "Successfully updated the password.":
    "Das Passwort wurde erfolgreich aktualisiert.",
  Suffix: "Suffix",
  Summary: "Zusammenfassung",
  "Supported API endpoints": "Unterstützte API-Endpunkte",
  Suspended: "Ausgesetzt",
  Synced: "Synchronisiert",
  Synchronous: "Synchron",
  "System Health Info": "Informationen zum Systemzustand",
  Table: "Tabelle",
  "Tag for: {object}": "Tag für: {object}",
  "Tag Key": "Tag-Schlüssel",
  "Tag Label": "Tag-Label",
  "Tag Value": "Tag-Wert",
  Tags: "Tags",
  "Tags for: {object}": "Tags für: {object}",
  "Tags:": "Tags:",
  "Target Bucket": "Ziel-Bucket",
  "Target URL": "Ziel-URL",
  "The bucket selected in this deployment acts as the “source” while the configured remote deployment acts as the “target”.":
    "Der in dieser Bereitstellung ausgewählte Bucket fungiert als „Quelle“, während die konfigurierte Remote-Bereitstellung als „Ziel“ fungiert.",
  "The file must be valid and  should have valid config values":
    "Die Datei muss gültig sein und sollte gültige Konfigurationswerte haben",
  "The file you are trying to download has a long name.":
    "Die Datei, die Sie herunterladen möchten, hat einen langen Namen.",
  "The following Bucket features will NOT be replicated":
    "Die folgenden Bucket-Funktionen werden NICHT repliziert",
  "The following changes are replicated to all other sites":
    "Die folgenden Änderungen werden auf alle anderen Standorte repliziert",
  "The following URL lets you share this object without requiring a login.":
    "Mit der folgenden URL können Sie dieses Objekt teilen, ohne dass eine Anmeldung erforderlich ist.",
  "The current version of this object is a delete marker and cannot be shared.":
    "Die aktuelle Version dieses Objekts ist eine Löschmarkierung und kann nicht geteilt werden.",
  "The selected object version could not be found. Refresh the object list and try again.":
    "Die ausgewählte Objektversion konnte nicht gefunden werden. Aktualisieren Sie die Objektliste und versuchen Sie es erneut.",
  "This server does not expose object versions; only the current object can be shared.":
    "Dieser Server stellt keine Objektversionen bereit; nur das aktuelle Objekt kann geteilt werden.",
  "The instance needs to be restarted for configuration changes to take effect.":
    "Die Instanz muss neu gestartet werden, damit Konfigurationsänderungen wirksam werden.",
  "The MinIO name is used here solely to identify the origin of the source code and to describe compatibility — {notice}.":
    "Der Name MinIO wird hier ausschließlich zur Identifizierung der Herkunft des Quellcodes und zur Beschreibung der Kompatibilität verwendet – {notice}.",
  "The selected users were added to the following groups.":
    "Die ausgewählten Benutzer wurden den folgenden Gruppen hinzugefügt.",
  "The server is restarting.": "Der Server wird neu gestartet.",
  "The URL expires automatically at the earlier of your configured time ({time}) or the expiration of your current web session.":
    "Die URL läuft automatisch zu dem von Ihnen konfigurierten Zeitpunkt ({time}) oder dem Ablauf Ihrer aktuellen Websitzung früher ab.",
  "There are no Configurations yet.":
    "Es sind noch keine Konfigurationen vorhanden.",
  "There are no endpoints yet.": "Es gibt noch keine Endpunkte.",
  "There are no Groups with this Policy associated yet.":
    "Es sind noch keine Gruppen mit dieser Richtlinie verknüpft.",
  "There are no Groups yet.": "Es gibt noch keine Gruppen.",
  "There are no Policies yet.": "Es liegen noch keine Richtlinien vor.",
  "There are no tags for this object": "Es gibt keine Tags für dieses Objekt",
  "There are no User Access Keys yet.":
    "Es gibt noch keine Benutzerzugriffsschlüssel.",
  "There are no Users with this Policy associated yet.":
    "Es sind noch keine Benutzer mit dieser Richtlinie verknüpft.",
  "There are no Users yet.": "Es gibt noch keine Benutzer.",
  "There is no information with this criteria":
    "Es liegen keine Informationen zu diesem Kriterium vor",
  "There was an error": "Es ist ein Fehler aufgetreten",
  "There was an error creating a Policy ":
    "Beim Erstellen einer Richtlinie ist ein Fehler aufgetreten",
  "There was an error creating a Policy: {details}. Please check Policy syntax.":
    "Beim Erstellen einer Richtlinie ist ein Fehler aufgetreten: {details}. Bitte überprüfen Sie die Richtliniensyntax.",
  "There was an error deleting the tier":
    "Beim Löschen der Speicherebene ist ein Fehler aufgetreten",
  "There was an error retrieving tier information":
    "Beim Abrufen der Speicherebenen-Informationen ist ein Fehler aufgetreten",
  "There was an error updating the Policy ":
    "Beim Aktualisieren der Richtlinie ist ein Fehler aufgetreten",
  "There was an error updating the Policy: {details}. Please check Policy syntax.":
    "Beim Aktualisieren der Richtlinie ist ein Fehler aufgetreten: {details}. Bitte überprüfen Sie die Richtliniensyntax.",
  "These features are unavailable in a single-disk setup.":
    "Diese Funktionen sind in einem Einzelfestplatten-Setup nicht verfügbar.",
  "This action is irreversible.":
    "Diese Aktion kann nicht rückgängig gemacht werden.",
  "This can cause issues on Windows Systems by trimming the file name after download.":
    "Dies kann auf Windows-Systemen zu Problemen führen, da der Dateiname nach dem Download gekürzt wird.",
  "This configuration cannot be deleted using this module as this was set using OpenID environment variables.":
    "Diese Konfiguration kann hier nicht gelöscht werden, da sie über OpenID-Umgebungsvariablen festgelegt wurde.",
  "this Console": "diese Konsole",
  "This feature allows multiple independent SILO sites (or clusters) that are using the same external IDentity Provider (IDP) to be configured as replicas. In this situation the set of replica sites are referred to as peer sites or just sites.":
    "Mit dieser Funktion können mehrere unabhängige SILO-Standorte (oder Cluster), die denselben externen Identitätsanbieter (IDP) verwenden, als Replikate konfiguriert werden. Diese Gruppe von Replikat-Standorten wird als Peer-Standorte oder einfach als Standorte bezeichnet.",
  "This feature is not available for a single-disk setup.":
    "Diese Funktion ist für ein Einzelfestplatten-Setup nicht verfügbar.",
  "This feature is not available.": "Diese Funktion ist nicht verfügbar.",
  "This field is required": "Dieses Feld ist erforderlich",
  "This is a File Preview for the first {count} pages of the document, if you wish to work with the full document please download instead.":
    "Dies ist eine Dateivorschau für die ersten {count} Seiten des Dokuments. Wenn Sie mit dem vollständigen Dokument arbeiten möchten, laden Sie es bitte stattdessen herunter.",
  "This location is empty": "Dieser Standort ist leer",
  "This location is empty, please try uploading a new file":
    "Dieser Speicherort ist leer. Bitte versuchen Sie, eine neue Datei hochzuladen",
  "This Site": "Dieser Standort",
  "This site/cluster": "Diese Site/dieser Cluster",
  "This Usage value is comparable to {command} which represents the size of all object versions that exist in the buckets.":
    "Dieser Verwendungswert ist vergleichbar mit {command}, der die Größe aller in den Buckets vorhandenen Objektversionen darstellt.",
  "This value is set from the {env} environment variable":
    "Dieser Wert wird aus der Umgebungsvariablen {env} festgelegt",
  "This value is set from the {name} environment variable":
    "Dieser Wert wird aus der Umgebungsvariablen {name} festgelegt",
  "This will be displayed only once. It cannot be recovered.":
    "Diese Information wird nur einmal angezeigt und kann nicht wiederhergestellt werden.",
  "This will change your Console password. Please note your new password down, as it will be required to log into Console after this session.":
    "Dadurch wird Ihr Konsolenpasswort geändert. Bitte notieren Sie sich Ihr neues Passwort, da es nach dieser Sitzung für die Anmeldung bei der Konsole erforderlich ist.",
  "This will remove the object as well as all of its versions,":
    "Dadurch werden das Objekt und alle seine Versionen entfernt.",
  "This will remove the objects as well as all of their versions,":
    "Dadurch werden die Objekte sowie alle ihre Versionen entfernt.",
  Tier: "Tier",
  "Tier Name": "Speicherebenenname",
  "Tier Types": "Speicherebenentypen",
  "Tiers are used by the SILO Object Lifecycle Management which allows creating rules for time or date based automatic transition or expiry of objects. For object transition, SILO automatically moves the object to a configured remote storage tier.":
    "Speicherebenen werden vom SILO Object Lifecycle Management verwendet, um Regeln für den zeit- oder datumsbasierten automatischen Übergang oder Ablauf von Objekten zu erstellen. Beim Objektübergang verschiebt SILO das Objekt automatisch auf eine konfigurierte Remote-Speicherebene.",
  "Time duration between scanner cycles, defaults to '1m'":
    "Zeitdauer zwischen Scannerzyklen, Standard ist '1m'",
  "Time to Response NS": "Antwortzeit (ns)",
  Timestamp: "Zeitstempel",
  "TLS Client Auth": "TLS-Client-Authentifizierung",
  "TLS skip verify": "TLS-Überprüfung überspringen",
  "TLS Skip Verify": "TLS-Überprüfung überspringen",
  "To allow Bucket access without credentials, use the {anonymous} setting":
    "Um den Bucket-Zugriff ohne Anmeldeinformationen zu ermöglichen, verwenden Sie die Einstellung {anonymous}",
  "To continue please type {phrase} in the box.":
    "Um fortzufahren, geben Sie bitte {phrase} in das Feld ein.",
  "To enable this feature you need to enable versioning on the bucket before creation":
    "Um diese Funktion zu aktivieren, müssen Sie vor der Erstellung die Versionierung für den Bucket aktivieren",
  "To Tier": "Auf Tier",
  "Today, {time}": "Heute, {time}",
  "Toggle Share URL between Console and object server URL. Change default with CONSOLE_SHARE_MINIO_URL environment variable":
    "Freigabe-URL zwischen Konsole und Objektserver-URL umschalten. Standardwert über Umgebungsvariable CONSOLE_SHARE_MINIO_URL änderbar",
  Token: "Token",
  "Toogle JSON": "JSON umschalten",
  "Toogle Share URL": "Freigabe-URL umschalten",
  Topic: "Thema",
  "Trace Results": "Trace-Ergebnisse",
  "trademark notice": "Markenhinweis",
  Transition: "Übergang",
  "Transition Days": "Übergangstage",
  True: "Wahr",
  "Trust server TLS without verification":
    "Server-TLS ohne Überprüfung vertrauen",
  'Trust server TLS without verification, defaults to "on" (verify)':
    'Server-TLS ohne Überprüfung vertrauen, Standard ist "on" (überprüfen)',
  Type: "Typ",
  "Type New Password Again": "Neues Passwort wiederholen",
  "Type of Lifecycle": "Art des Lebenszyklus",
  "Types to profile:": "Zu profilierende Typen:",
  "Unable to download widget data":
    "Widget-Daten können nicht heruntergeladen werden",
  "Unable to download widget data - data not available":
    "Widget-Daten können nicht heruntergeladen werden – Daten nicht verfügbar",
  "Under section 13 of the AGPL, the corresponding source for this running version is offered to every user who interacts with it over a network, at no charge.":
    "Gemäß Abschnitt 13 der AGPL wird der entsprechende Quellcode für diese laufende Version jedem Benutzer, der über ein Netzwerk damit interagiert, kostenlos zur Verfügung gestellt.",
  "Understand which {policies} and {users} are authorized to access this Bucket.":
    "Verstehen Sie, welche {policies} und {users} berechtigt sind, auf diesen Bucket zuzugreifen.",
  "Unexpected response, download incomplete.":
    "Unerwartete Antwort, Download unvollständig.",
  Unhealthy: "Gestört",
  "Unique descriptive string for this destination":
    "Eindeutige beschreibende Zeichenfolge für dieses Ziel",
  "Unique ID for NATS streaming cluster":
    "Eindeutige ID für den NATS-Streaming-Cluster",
  "Update Credentials - {type} / {name}":
    "Anmeldeinformationen aktualisieren – {type} / {name}",
  "Upload File": "Datei hochladen",
  "Upload Files": "Dateien hochladen",
  "upload files to this bucket": "Dateien in diesen Bucket hochladen",
  "Upload Folder": "Ordner hochladen",
  "Upload is restricted.": "Das Hochladen ist eingeschränkt.",
  "Upload not allowed": "Hochladen nicht erlaubt",
  "upload objects to this location": "Objekte an diesen Ort hochladen",
  "Upstream copyright, authorship and license notices are retained in the repository's {credits} and {notice}. See the {attribution}.":
    "Urheberrechts-, Autoren- und Lizenzhinweise aus dem Upstream werden in {credits} und {notice} des Repositorys beibehalten. Siehe {attribution}.",
  "upstream MinIO code": "Upstream-MinIO-Code",
  "Usage Data Age": "Alter der Nutzungsdaten",
  "Usage:": "Verwendung:",
  "Use Original Name": "Originalnamen verwenden",
  "Use SASL": "SASL verwenden",
  "Use secure medium to share this key.":
    "Verwenden Sie ein sicheres Medium, um diesen Schlüssel zu teilen.",
  "Use TLS": "TLS verwenden",
  "Used to confirm a non-idempotent action.":
    "Wird verwendet, um eine nicht idempotente Aktion zu bestätigen.",
  "User Access Keys": "Benutzerzugriffsschlüssel",
  "User Agent": "Benutzeragent",
  "User Details - {user}": "Benutzerdetails - {user}",
  "User DN Search Base DN is required":
    "Benutzer-DN-Suchbasis ist erforderlich",
  "User DN Search Filter is required":
    "Benutzer-DN-Suchfilter ist erforderlich",
  "User Mappings": "Benutzerzuordnungen",
  "User Name": "Benutzername",
  "Username for SASL/PLAIN or SASL/SCRAM authentication":
    "Benutzername für SASL/PLAIN- oder SASL/SCRAM-Authentifizierung",
  "Users inherit access permissions to data and resources through the groups they belong to.":
    "Benutzer erben Zugriffsberechtigungen für Daten und Ressourcen über die Gruppen, denen sie angehören.",
  "Users with this Policy associated":
    "Benutzer, denen diese Richtlinie zugeordnet ist",
  Validity: "Gültigkeit",
  "Validity:": "Gültigkeit:",
  Version: "Version",
  "Version ID:": "Versions-ID:",
  "Versioning is required to enable {objectLocking} and {retention}.":
    "Zur Aktivierung von {objectLocking} und {retention} ist die Versionierung erforderlich.",
  "Versioning on Bucket": "Bucket-Versionierung",
  "Versioning setting cannot be changed as cluster replication is enabled for this site.":
    "Die Versionierungseinstellung kann nicht geändert werden, da die Clusterreplikation für diese Site aktiviert ist.",
  "Versioning Status": "Versionsstatus",
  versions: {
    one: "Version",
    other: "Versionen",
  },
  Versions: {
    one: "Version",
    other: "Versionen",
  },
  "Versions:": "Versionen:",
  View: "Ansicht",
  "View across sites": "Standortübergreifend anzeigen",
  "View Bucket Naming Rules": "Bucket-Benennungsregeln anzeigen",
  "View env variable Webhook": "Webhook aus Umgebungsvariable anzeigen",
  "view Objects in this bucket": "Objekte in diesem Bucket anzeigen",
  "view Policy details": "Richtliniendetails anzeigen",
  "View Replication Status for a:": "Replikationsstatus anzeigen für:",
  "view User details": "Benutzerdetails anzeigen",
  "Visit the SILO website": "Besuchen Sie die SILO-Website",
  "Volume or Bucket Name": "Volume- oder Bucket-Name",
  "Volume/Bucket name cannot start with /":
    "Volume-/Bucket-Name darf nicht mit / beginnen",
  Warning: "Warnung",
  "Warning: One or more users selected has associated Access Keys.":
    "Warnung: Einem oder mehreren ausgewählten Benutzern sind Zugriffsschlüssel zugeordnet.",
  "Warning! The resulting file will contain server configuration information in plain text":
    "Achtung! Die resultierende Datei enthält Serverkonfigurationsinformationen im Klartext",
  "We recommend to rename the file download":
    "Wir empfehlen, den Dateidownload umzubenennen",
  "Webhook server endpoint e.g. http://localhost:8080/silo/events":
    "Webhook-Server-Endpunkt, z. B. http://localhost:8080/silo/events",
  week: "Woche",
  weeks: {
    one: "Woche",
    other: "Wochen",
  },
  "What are Event Destinations?": "Was sind Ereignisziele?",
  "Would you like to encrypt {object}?": "Möchten Sie {object} verschlüsseln?",
  "Write Policy": "Schreibrichtlinie",
  "Write these down, as this is the only time the secret will be displayed.":
    "Notieren Sie sich diese, da das Geheimnis nur dann angezeigt wird.",
  writeonly: "nur schreiben",
  year: "Jahr",
  years: {
    one: "Jahr",
    other: "Jahre",
  },
  Years: "Jahre",
  Yes: "Ja",
  "Yes, I am sure": "Ja, ich bin sicher",
  "You can add a comment to this setting":
    "Sie können dieser Einstellung einen Kommentar hinzufügen",
  "You can add policies to the group by selecting it from the Groups view after creation. The Policy view lets you manage the assigned policies for the group.":
    "Sie können der Gruppe Richtlinien hinzufügen, indem Sie sie nach der Erstellung in der Gruppenansicht auswählen. In der Richtlinienansicht können Sie die zugewiesenen Richtlinien für die Gruppe verwalten.",
  "You can choose to {excludePrefixes} from versioning if Object Locking is not enabled.":
    "Sie können beim Versionieren {excludePrefixes}, sofern die Objektsperre nicht aktiviert ist.",
  "You can download the the Health report JSON File.":
    "Sie können die JSON-Datei des Diagnoseberichts herunterladen.",
  "You can increase the maximum configuration time by setting the MINIO_STS_DURATION environment variable on all your nodes.":
    "Sie können die maximale Konfigurationszeit erhöhen, indem Sie die Umgebungsvariable MINIO_STS_DURATION auf allen Ihren Knoten festlegen.",
  "You can learn more at the {documentation}.":
    "Mehr erfahren Sie unter {documentation}.",
  "You can learn more at the {link}.":
    "Weitere Informationen finden Sie unter {link}.",
  "You can only enable {objectLocking} when first creating a bucket.":
    "Sie können {objectLocking} nur aktivieren, wenn Sie zum ersten Mal einen Bucket erstellen.",
  "You can reset your session by logging out and logging back in to the web UI.":
    "Sie können Ihre Sitzung zurücksetzen, indem Sie sich in der Web-Oberfläche ab- und wieder anmelden.",
  "You can specify an optional JSON-formatted IAM policy to further restrict Access Key access to a subset of the actions and resources explicitly allowed for the parent user. Additional access beyond that of the parent user cannot be implemented through these policies.":
    "Sie können eine optionale JSON-formatierte IAM-Richtlinie angeben, um den Zugriffsschlüsselzugriff weiter auf eine Teilmenge der Aktionen und Ressourcen einzuschränken, die ausdrücklich für den übergeordneten Benutzer zulässig sind. Ein zusätzlicher Zugriff über den des übergeordneten Benutzers hinaus kann durch diese Richtlinien nicht implementiert werden.",
  "You can use '*' to match any character, '.' to signify a single character or '\\' to scape an special character (E.g. mybucket-*)":
    "Verwenden Sie '*' für beliebige Zeichen, '.' für ein einzelnes Zeichen oder '\\' zum Maskieren eines Sonderzeichens (z. B. mybucket-*)",
  "You can use {mcShare} as an alternative to this UI, where the session length does not limit the URL validity.":
    "Alternativ zu dieser Oberfläche können Sie {mcShare} verwenden, wobei die Sitzungsdauer die Gültigkeit der URL nicht begrenzt.",
  "You cannot delete the currently logged in User":
    "Der aktuell angemeldete Benutzer kann nicht gelöscht werden",
  "You cannot enable or disable the currently logged in User":
    "Sie können den aktuell angemeldeten Benutzer nicht aktivieren oder deaktivieren",
  "You cannot modify the optional Access Key IAM policy after saving.":
    "Die optionale IAM-Richtlinie des Zugriffsschlüssels kann nach dem Speichern nicht mehr geändert werden.",
  "You may only have write access on a limited set of subpaths within this path. Please carefully review your User permissions to understand the paths to which you may write.":
    "Sie dürfen nur auf eine begrenzte Anzahl von Unterpfaden innerhalb dieses Pfades Schreibzugriff haben. Bitte überprüfen Sie Ihre Benutzerberechtigungen sorgfältig, um zu verstehen, zu welchen Pfaden Sie schreiben dürfen.",
  "You must apply a valid name to the bucket":
    "Sie müssen dem Bucket einen gültigen Namen zuweisen",
  "You must disable Object Locking before Versioning can be disabled":
    "Sie müssen die Objektsperre deaktivieren, bevor die Versionierung deaktiviert werden kann",
  "You must disable Retention before Object Locking can be disabled":
    "Sie müssen die Aufbewahrung deaktivieren, bevor die Objektsperre deaktiviert werden kann",
  "You need to select at least one group to assign":
    "Sie müssen mindestens eine Gruppe zum Zuweisen auswählen",
  "You require additional permissions in order to {name}. Please ask your SILO administrator to grant you {scopes} permission in order to {name}.":
    "Sie benötigen zusätzliche Berechtigungen, um {name}. Bitten Sie Ihren SILO-Administrator, Ihnen die Berechtigung {scopes} zu erteilen, um {name}.",
  "You require additional permissions in order to {name}. Please ask your SILO administrator to grant you {scopes} permissions in order to {name}.":
    "Sie benötigen zusätzliche Berechtigungen, um {name}. Bitten Sie Ihren SILO-Administrator, Ihnen die Berechtigungen {scopes} zu erteilen, um {name}.",
  "You require additional permissions in order to create a new Tier. Please ask your SILO administrator to grant you {permission} permission in order to create a Tier.":
    "Sie benötigen zusätzliche Berechtigungen, um eine neue Speicherebene zu erstellen. Bitten Sie Ihren SILO-Administrator um die Berechtigung {permission}.",
  "File is empty": "Datei ist leer",
  "Invalid UTF-8 or binary content": "Ungültiges UTF-8 oder binärer Inhalt",
  "Loading text preview…": "Textvorschau wird geladen…",
  "Object not found or changed": "Objekt nicht gefunden oder geändert",
  "Text preview content": "Inhalt der Textvorschau",
  "Text preview failed": "Textvorschau fehlgeschlagen",
  "Text preview forbidden": "Textvorschau verboten",
  "The object could not be found or changed while the preview was loading.":
    "Das Objekt konnte beim Laden der Vorschau nicht gefunden oder geändert werden.",
  "The text preview could not be loaded because of a network or server error.":
    "Die Textvorschau konnte aufgrund eines Netzwerk- oder Serverfehlers nicht geladen werden.",
  "This object is not valid UTF-8 text or contains binary data. Download it to inspect the original bytes.":
    "Dieses Objekt ist kein gültiger UTF-8-Text oder enthält Binärdaten. Laden Sie es herunter, um die Originalbytes zu prüfen.",
  "You do not have permission to preview this object.":
    "Sie sind nicht berechtigt, eine Vorschau dieses Objekts anzuzeigen.",
  Trademark: "Warenzeichen",
  License: "Lizenz",
  "Corresponding source for this build":
    "Entsprechender Quellcode für diesen Build",
  "The exact corresponding source is not available for this build: {reason}. See the NOTICE for how to obtain it.":
    "Der genaue entsprechende Quellcode ist für diesen Build nicht verfügbar: {reason}. Hinweise zum Bezug finden Sie in NOTICE.",
  "Source: not available for this build":
    "Quellcode: für diesen Build nicht verfügbar",
  "Items per page": "Elemente pro Seite",
  "First page": "Erste Seite",
  "Previous page": "Vorherige Seite",
  "Next page": "Nächste Seite",
  "{count} items in total": "{count} Einträge insgesamt",
  "Page {page} · {count} on this page":
    "Seite {page} · {count} auf dieser Seite",
  "Sorting, filtering and select all apply to this page only.":
    "Sortieren, Filtern und „Alles auswählen“ gelten nur für diese Seite.",
  "No objects match the filter": "Keine Objekte passen zum Filter",
  "No objects on this page match the filter":
    "Keine Objekte auf dieser Seite entsprechen dem Filter",
  "Showing the first {count} entries; the listing stopped at the row or time limit.":
    "Zeigt die ersten {count} Einträge; die Auflistung wurde beim Zeilen- oder Zeitlimit gestoppt.",
  "Start typing to filter objects on this page":
    "Tippen, um Objekte auf dieser Seite zu filtern",
  "Lists and tabs": "Listen und Registerkarten",
  "Move through rows with the pointer or keyboard. Arrow keys focus tabs; Enter or Space opens them.":
    "Bewegen Sie sich mit dem Zeiger oder der Tastatur durch die Zeilen. Pfeiltasten fokussieren Tabs; Enter oder Space öffnet sie.",
  "Browse and select stored objects.":
    "Durchsuchen Sie gespeicherte Objekte und wählen Sie sie aus.",
  "Review stored object versions.":
    "Überprüfen Sie gespeicherte Objektversionen.",
  "Manage bucket settings.": "Bucket-Einstellungen verwalten.",
  "Compact section tabs": "Kompakte Abschnittsregisterkarten",
  "Storage and object usage": "Speicher und Objektnutzung",
  "Recent storage activity": "Letzte Speicheraktivität",
  "Example buckets": "Beispiel-Buckets",
  "Select all objects": "Alle Objekte auswählen",
  Select: "Auswählen",
  Settings: "Einstellungen",
  Overview: "Übersicht",
  Activity: "Aktivität",
  "No matching results": "Keine passenden Ergebnisse",
  "Try a different search or clear the filters to see all items.":
    "Versuchen Sie eine andere Suche oder löschen Sie die Filter, um alle Artikel anzuzeigen.",
  "Clear filters": "Filter löschen",
  "No users yet": "Noch keine Benutzer",
  "Users authenticate with an access key and secret key, and receive permissions through policies and groups.":
    "Benutzer authentifizieren sich mit einem Zugriffsschlüssel und einem geheimen Schlüssel und erhalten Berechtigungen über Richtlinien und Gruppen.",
  "Create user": "Benutzer erstellen",
  "No access keys yet": "Noch keine Zugangsschlüssel",
  "Access keys let applications connect with the permissions of your account.":
    "Mit Zugriffsschlüsseln können Anwendungen eine Verbindung mit den Berechtigungen Ihres Kontos herstellen.",
  "Access keys let applications connect with the permissions assigned to this user.":
    "Mit Zugriffsschlüsseln können Anwendungen eine Verbindung mit den diesem Benutzer zugewiesenen Berechtigungen herstellen.",
  "No groups assigned": "Keine Gruppen zugewiesen",
  "Add this user to a group to share its access policies.":
    "Fügen Sie diesen Benutzer einer Gruppe hinzu, um seine Zugriffsrichtlinien zu teilen.",
  "No policies assigned": "Keine Richtlinien zugewiesen",
  "Policies define which actions and resources this user can access.":
    "Richtlinien legen fest, auf welche Aktionen und Ressourcen dieser Benutzer zugreifen kann.",
  "No members yet": "Noch keine Mitglieder",
  "Add users to this group so they inherit its policies.":
    "Fügen Sie Benutzer zu dieser Gruppe hinzu, damit sie deren Richtlinien erben.",
  "Policies attached to this group apply to all its members.":
    "Die dieser Gruppe zugeordneten Richtlinien gelten für alle ihre Mitglieder.",
  "No encryption keys yet": "Noch keine Verschlüsselungsschlüssel",
  "Create a key to encrypt objects with the configured key management service.":
    "Erstellen Sie einen Schlüssel zum Verschlüsseln von Objekten mit dem konfigurierten Schlüsselverwaltungsdienst.",
  "No groups yet": "Noch keine Gruppen",
  "Groups let users share the same access policies.":
    "Mit Gruppen können Benutzer dieselben Zugriffsrichtlinien teilen.",
  "No event destinations yet": "Noch keine Ereignisziele",
  "Connect an external service to receive bucket and object notifications.":
    "Verbinden Sie einen externen Dienst, um Bucket- und Objektbenachrichtigungen zu erhalten.",
  "No storage tiers yet": "Noch keine Speicherebenen",
  "Connect remote storage to transition objects using lifecycle rules.":
    "Remote-Speicher verbinden, um Objekte per Lebenszyklusregel zu übertragen.",
  "No event subscriptions yet": "Noch keine Ereignisabonnements",
  "Subscribe this bucket to send object events to an event destination.":
    "Abonnieren Sie diesen Bucket, um Objektereignisse an ein Ereignisziel zu senden.",
  "No replication rules yet": "Noch keine Replikationsregeln",
  "Replicate objects from this bucket to a destination bucket.":
    "Replizieren Sie Objekte aus diesem Bucket in einen Ziel-Bucket.",
  "No lifecycle rules yet": "Noch keine Lebenszyklusregeln",
  "Create rules to expire objects or transition them to remote storage.":
    "Erstellen Sie Regeln, um Objekte ablaufen zu lassen oder sie in den Remote-Speicher zu übertragen.",
  "No anonymous access rules": "Keine anonymen Zugriffsregeln",
  "This bucket has no prefix rules for access without credentials.":
    "Dieser Bucket hat keine Präfixregeln für den Zugriff ohne Anmeldeinformationen.",
  "No policies grant access": "Keine Richtlinien gewähren Zugriff",
  "No listed policy currently grants access to this bucket.":
    "Keine aufgeführte Richtlinie gewährt derzeit Zugriff auf diesen Bucket.",
  "No users have access": "Keine Benutzer haben Zugriff",
  "No listed user currently has a policy granting access to this bucket.":
    "Kein aufgeführter Benutzer verfügt derzeit über eine Richtlinie, die Zugriff auf diesen Bucket gewährt.",
  "View Policies": "Richtlinien anzeigen",
  "View Users": "Benutzer anzeigen",
  "Unable to load replication sites":
    "Replikationssites können nicht geladen werden",
  "No replication sites yet": "Noch keine Replikationsstandorte",
  "Refresh to try loading the configured sites again.":
    "Aktualisieren Sie, um erneut zu versuchen, die konfigurierten Sites zu laden.",
  "Connect independent SILO sites to replicate their data and identity configuration.":
    "Unabhängige SILO-Standorte verbinden, um deren Daten und Identitätskonfiguration zu replizieren.",
  "Waiting for logs": "Warten auf Protokolle",
  "Logs are not running": "Protokolle werden nicht ausgeführt",
  "New log entries will appear here as the server emits them.":
    "Neue Protokolleinträge werden hier angezeigt, wenn der Server sie ausgibt.",
  "Choose the nodes and log types, then start logs to see server activity.":
    "Wählen Sie die Knoten und Protokolltypen aus und starten Sie dann Protokolle, um die Serveraktivität anzuzeigen.",
  "Waiting for trace events": "Warten auf Trace-Ereignisse",
  "Trace is not running": "Trace wird nicht ausgeführt",
  "Requests matching the selected calls and filters will appear here.":
    "Hier werden Anfragen angezeigt, die den ausgewählten Aufrufen und Filtern entsprechen.",
  "Choose the calls and filters, then start tracing to inspect live requests.":
    "Wählen Sie die Aufrufe und Filter aus und starten Sie dann das Tracing, um Live-Anfragen zu prüfen.",
  "{count} node": "{count} Knoten",
  "{count} nodes": {
    one: "{count} Knoten",
    other: "{count} Knoten",
  },
  "{count} drive": "{count} Laufwerk",
  "{count} drives": {
    one: "{count} Laufwerk",
    other: "{count} Laufwerke",
  },
  "Quota: {quota}": "Kontingent: {quota}",
  "Open bucket {name}": "Bucket öffnen {name}",
  "Recent buckets": "Aktuelle Buckets",
  "Read and write": "Lesen und schreiben",
  "Read only": "Schreibgeschützt",
  "Write only": "Nur Schreiben",
  "Created {date}": "Erstellt {date}",
  "{count} objects": "{count} Objekte",
  "Bucket actions": "Bucket-Aktionen",
  "Open menu": "Menü öffnen",
  "Page actions": "Seitenaktionen",
  "Selected actions": "Ausgewählte Aktionen",
  "Parent paths": "Übergeordnete Pfade",
  "create Groups": "Gruppen erstellen",
  "view Group details": "Gruppendetails anzeigen",
  "configure event destinations": "Ereignisziele konfigurieren",
  "update Tier credentials": "Tier-Zugangsdaten aktualisieren",
  "delete Tiers": "Ebenen löschen",
  "manage Access Keys": "Zugriffsschlüssel verwalten",
};

export default messages;
