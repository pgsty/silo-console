// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Brazilian Portuguese dictionary for feature screens. Keys are the exact English
// source strings used at t() call sites; keep them byte-identical to code.
export const ptScreens: Record<string, string> = {
  "Users inherit policies from their groups. Access is denied unless explicitly granted.":
    "Os usuários herdam as políticas dos seus grupos. O acesso é negado, a menos que seja concedido explicitamente.",
  "Policies define allowed actions and resources for users and groups.":
    "As políticas definem as ações e os recursos permitidos para usuários e grupos.",
  "IAM policies": "Políticas IAM",
  "Access keys inherit their parent user’s permissions. An inline policy can only restrict them further.":
    "As chaves de acesso herdam as permissões do usuário pai. Uma política inline só pode restringi-las ainda mais.",
  "Access keys": "Chaves de acesso",
  "Configure a destination, then add bucket notification rules to send S3 events to it.":
    "Configure um destino e depois adicione regras de notificação de bucket para enviar eventos S3 a ele.",
  "Event destinations": "Destinos de eventos",
  "SILO version": "Versão do SILO",
  "Raw JSON": "JSON bruto",
  "Recursive inspections can be expensive. Limit the bucket and path before starting.":
    "Inspeções recursivas podem ser custosas. Limite o bucket e o caminho antes de começar.",
  "Open Help for examples, or read the":
    "Abra a Ajuda para ver exemplos ou leia a",
  Tasks: "Tarefas",
  "Tasks: {count} running": "Tarefas: {count} em execução",
  "Close Tasks": "Fechar tarefas",
  "Object operations": "Operações com objetos",
  Running: "Em execução",
  Finished: "Encerradas",
  Queued: "Na fila",
  Completed: "Concluída",
  "No running tasks": "Nenhuma tarefa em execução",
  "No finished tasks": "Nenhuma tarefa encerrada",
  "Clear finished": "Limpar encerradas",
  "ZIP download": "Download em ZIP",
  "Browser handoff": "Transferência ao navegador",
  "Task progress": "Progresso da tarefa",
  "Waiting for data": "Aguardando dados",
  "Remove task": "Remover tarefa",
  "Cancel task": "Cancelar tarefa",
  "Retry failed": "Repetir as que falharam",
  "Open bucket/prefix": "Abrir bucket/prefixo",
  "{done}/{total} completed · {failed} failed · {cancelled} cancelled":
    "{done}/{total} concluídas · {failed} com falha · {cancelled} canceladas",
  "{bytes} bytes received": "{bytes} bytes recebidos",
  "Handoff is complete; final download progress is unavailable here.":
    "A transferência foi concluída; o progresso final do download não está disponível aqui.",
  "Counts represent selected targets. Progress within a folder or version cleanup is unavailable.":
    "As contagens representam os alvos selecionados. O progresso dentro de uma pasta ou limpeza de versões não está disponível.",
  "Completed changes remain in place. In-flight requests may have reached the server; inspect before repeating them.":
    "As alterações concluídas permanecem. Requisições em andamento podem ter chegado ao servidor; verifique antes de repeti-las.",
  "Review {count} results": "Revisar {count} resultados",
  "Server outcome is unconfirmed. Inspect this object before another operation.":
    "O resultado no servidor não foi confirmado. Inspecione este objeto antes de outra operação.",
  "Task failed: {name}": "Tarefa com falha: {name}",
  "Task completed: {name}": "Tarefa concluída: {name}",
  "Open Tasks to inspect the results.":
    "Abra Tarefas para inspecionar os resultados.",
  "The request failed. Inspect the object before trying again.":
    "A requisição falhou. Inspecione o objeto antes de tentar novamente.",
  "Tasks are still running": "Ainda há tarefas em execução",
  "Stay here": "Ficar aqui",
  "Cancel tasks and leave": "Cancelar tarefas e sair",
  "Leave page": "Sair da página",
  "Leaving this session cancels queued and running tasks. Changes already completed on the server remain in place.":
    "Sair desta sessão cancela as tarefas na fila e em execução. As alterações já concluídas no servidor permanecem.",
  "Tasks will continue in this session. You can check their progress in Tasks on another page.":
    "As tarefas continuarão nesta sessão. Você pode acompanhar o progresso em Tarefas em outra página.",
  "Delete Versions": "Excluir versões",
  "Cluster health": "Integridade do cluster",
  "servers online": "servidores online",
  "{count} drives online": "{count} discos online",
  "{count} server(s) offline": "{count} servidor(es) offline",
  "{count} drive(s) offline": "{count} disco(s) offline",
  "{count} drive(s) healing": "{count} disco(s) em recuperação",
  "Drive {drive} is at least 95% full. The server may reject writes.":
    "O disco {drive} está pelo menos 95% cheio. O servidor pode rejeitar escritas.",
  "Drive {drive} is at least 85% full.":
    "O disco {drive} está pelo menos 85% cheio.",
  "Configuration changes are waiting for a server restart.":
    "Há alterações de configuração aguardando a reinicialização do servidor.",
  "Some server or drive health information is unavailable.":
    "Algumas informações de integridade de servidores ou discos estão indisponíveis.",
  "Capacity is incomplete. Only reported drive measurements are shown.":
    "A capacidade está incompleta. Só são exibidas as medições informadas pelos discos.",
  "Generate health report": "Gerar relatório de integridade",
  "No servers reported": "Nenhum servidor informado",
  Server: "Servidor",
  "Just started": "Recém-iniciado",
  "Hide drives for {server}": "Ocultar discos de {server}",
  "Show drives for {server}": "Mostrar discos de {server}",
  "No drive information available": "Nenhuma informação de disco disponível",
  "Drives on {server}": "Discos em {server}",
  "{used} / {total} used": "{used} / {total} usados",
  "Drive usage: {drive}": "Uso do disco: {drive}",
  "Refresh failed. The last received data is still shown.":
    "Falha ao atualizar. Os últimos dados recebidos continuam sendo exibidos.",
  "Could not load deployment information. Try refreshing.":
    "Não foi possível carregar as informações da implantação. Tente atualizar.",
  "Deployment statistics": "Estatísticas da implantação",
  "of {total} raw capacity": "de {total} de capacidade bruta",
  "{available} available": "{available} disponíveis",
  Data: "Dados",
  objects: "objetos",
  Alerts: "Alertas",
  "Health information unavailable": "Informações de integridade indisponíveis",
  "All systems normal": "Todos os sistemas normais",
  "Quick actions": "Ações rápidas",
  "No quick actions available for your permissions.":
    "Nenhuma ação rápida disponível para suas permissões.",
  "Read & write": "Leitura e escrita",
  "Delete bucket": "Excluir bucket",
  "Actions for {bucket}": "Ações de {bucket}",
  "Select {bucket}": "Selecionar {bucket}",
  "Object lock": "Bloqueio",
  Created: "Criado em",
  "Select all visible buckets": "Selecionar todos os buckets visíveis",
  "Bucket rows": "Linhas de buckets",
  "The bucket list could not be loaded.":
    "Não foi possível carregar a lista de buckets.",
  "Select one or more buckets first.": "Selecione um ou mais buckets primeiro.",
  "configure the selected buckets": "configurar os buckets selecionados",
  "Search buckets": "Pesquisar buckets",
  "Bucket view": "Visualização de buckets",
  Cards: "Cartões",
  "{count} buckets selected": "{count} buckets selecionados",
  "1 bucket selected": "1 bucket selecionado",
  "No buckets match “{q}”": "Nenhum bucket corresponde a “{q}”",
  "Clear filter": "Limpar filtro",
  "Built-in · Modified": "Embutida · Modificada",
  "Actions for {name}": "Ações de {name}",
  "Reset to default": "Redefinir para o padrão",
  "Could not load policies": "Não foi possível carregar as políticas",
  "Refresh to try again.": "Atualize para tentar novamente.",
  "Create a policy to define permissions for users and groups.":
    "Crie uma política para definir permissões de usuários e grupos.",
  "Could not update policy": "Não foi possível atualizar a política",
  "Reset policy {name} to its default definition?":
    "Redefinir a política {name} para a definição padrão?",
  "The built-in policy will be restored to the SILO default definition.":
    "A política embutida será restaurada para a definição padrão do SILO.",
  "Loading attachment information…": "Carregando informações de vínculo…",
  "This policy has changed or is no longer available. Refresh the list.":
    "Esta política foi alterada ou não está mais disponível. Atualize a lista.",
  "Attachment information is unavailable.":
    "As informações de vínculo estão indisponíveis.",
  "This policy is attached to {users} users and {groups} groups.":
    "Esta política está vinculada a {users} usuários e {groups} grupos.",
  "Their permissions will follow the default definition.":
    "As permissões deles seguirão a definição padrão.",
  "They will lose the permissions it grants.":
    "Eles perderão as permissões concedidas por ela.",
  "Could not load policy. Refresh to try again.":
    "Não foi possível carregar a política. Atualize para tentar novamente.",
  "Could not load policy": "Não foi possível carregar a política",
  "Could not load users for this policy":
    "Não foi possível carregar os usuários desta política",
  "Could not load groups for this policy":
    "Não foi possível carregar os grupos desta política",
  "Built-in policies can be overridden by saving a modified version; you can reset it later.":
    "Políticas embutidas podem ser substituídas ao salvar uma versão modificada; você pode redefini-la depois.",
  "Override policy": "Substituir política",
  "Cancel editing": "Cancelar edição",
  "Direct policies": "Políticas diretas",
  "Policies inherited through groups": "Políticas herdadas de grupos",
  "Access-key count is unavailable.":
    "A contagem de chaves de acesso está indisponível.",
  "Group policy information is unavailable.":
    "As informações de políticas de grupo estão indisponíveis.",
  "Also assigned directly": "Também atribuída diretamente",
  "From groups:": "Dos grupos:",
  "Group policies could not be loaded.":
    "Não foi possível carregar as políticas de grupo.",
  "Group is disabled; its policies are not inherited.":
    "O grupo está desativado; suas políticas não são herdadas.",
  "Group status is unavailable; inherited permissions are unknown.":
    "O status do grupo está indisponível; as permissões herdadas são desconhecidas.",
  "No inherited group policies": "Nenhuma política herdada de grupo",
  "Some group policies are unavailable. Refresh to try again.":
    "Algumas políticas de grupo estão indisponíveis. Atualize para tentar novamente.",
  "Could not load user": "Não foi possível carregar o usuário",
  "Could not update user status":
    "Não foi possível atualizar o status do usuário",
  "Edit replication": "Editar replicação",
  "Page not found": "Página não encontrada",
  "Go to Buckets": "Ir para Buckets",
  "Go back": "Voltar",
  "Read the documentation": "Ler a documentação",
  "You do not have permission to view this page":
    "Você não tem permissão para ver esta página",
  "Ask your administrator for access. This page checks the following IAM actions:":
    "Peça acesso ao seu administrador. Esta página verifica as seguintes ações IAM:",
  "Required IAM actions": "Ações IAM necessárias",
  "Encryption is not configured": "A criptografia não está configurada",
  "Configure KES or KMS on the SILO server to manage encryption keys in Console.":
    "Configure o KES ou o KMS no servidor SILO para gerenciar chaves de criptografia no Console.",
  "Local identity management is unavailable":
    "O gerenciamento local de identidades está indisponível",
  "LDAP is enabled. Manage users and groups in your LDAP directory; connection settings are available on the LDAP configuration page.":
    "O LDAP está ativado. Gerencie usuários e grupos no seu diretório LDAP; os parâmetros de conexão estão na página de configuração do LDAP.",
  "Tier creation is unavailable": "A criação de camadas está indisponível",
  "This Console requires a distributed server setup to add a remote storage tier.":
    "Este Console requer uma configuração de servidor distribuído para adicionar uma camada de armazenamento remota.",
  "This page is unavailable in object browser mode":
    "Esta página não está disponível no modo de navegador de objetos",
  "This Console is configured for object browsing only. Ask your administrator to enable the full Console to use this page.":
    "Este Console está configurado apenas para navegar por objetos. Peça ao seu administrador que ative o Console completo para usar esta página.",
  "Prometheus is configured but unreachable":
    "O Prometheus está configurado, mas inacessível",
  "Check the Prometheus address, network access and authentication, then retry.":
    "Verifique o endereço do Prometheus, o acesso à rede e a autenticação e tente novamente.",
  "Advanced metrics need Prometheus":
    "As métricas avançadas precisam do Prometheus",
  "Configure Prometheus to collect SILO metrics, then set the URL for your deployment and restart the corresponding service.":
    "Configure o Prometheus para coletar métricas do SILO, depois defina a URL da sua implantação e reinicie o serviço correspondente.",
  "Standalone Console": "Console independente",
  "Console embedded in SILO": "Console embutido no SILO",
  "Optional standalone settings": "Parâmetros opcionais do modo independente",
  "Bearer token: ": "Token bearer: ",
  "Or basic authentication: ": "Ou autenticação básica: ",
  "Embedded settings: ": "Parâmetros embutidos: ",
  Icons: "Ícones",
  "Create bucket": "Criar bucket",
  "Edit {label}": "Editar {label}",
  "Calculating…": "Calculando…",
  "The server has not finished computing usage yet.":
    "O servidor ainda não terminou de calcular o uso.",
  "Calculated {time}": "Calculado {time}",
  "Updated {time}": "Atualizado {time}",
  "Permission required": "Permissão necessária",
  "Ask your administrator to grant the following IAM actions.":
    "Peça ao seu administrador que conceda as seguintes ações IAM.",
  "More actions": "Mais ações",
  "Equivalent mcli command": "Comando mcli equivalente",
  Copied: "Copiado",
  "Copy failed. Select and copy the command.":
    "Falha ao copiar. Selecione e copie o comando.",
  "Copy commands": "Copiar comandos",
  "Replace ALIAS with your configured mcli alias (for example, {alias}).":
    "Substitua ALIAS pelo alias configurado do mcli (por exemplo, {alias}).",
  "Replace ALIAS with your configured mcli alias.":
    "Substitua ALIAS pelo alias configurado do mcli.",
  "Loading…": "Carregando…",
  "SILO primitives": "Primitivas do SILO",
  "Shared building blocks for storage, identity and monitoring.":
    "Blocos compartilhados de armazenamento, identidade e monitoramento.",
  "Healthy capacity": "Capacidade saudável",
  "Capacity warning": "Alerta de capacidade",
  "Above the 85% warning threshold": "Acima do limite de alerta de 85%",
  "Capacity critical": "Capacidade crítica",
  "Above the 95% critical threshold": "Acima do limite crítico de 95%",
  "Usage is calculated by the server.": "O uso é calculado pelo servidor.",
  "View buckets": "Ver buckets",
  "Status and values": "Status e valores",
  "Built-in": "Embutida",
  "Freshness and actions": "Atualização e ações",
  "Select an object to inspect its details.":
    "Selecione um objeto para inspecionar seus detalhes.",
  "Object details": "Detalhes do objeto",
  "Demo action completed.": "Ação de demonstração concluída.",
  "Select an object to download.": "Selecione um objeto para baixar.",
  "Empty and unavailable states": "Estados vazios e indisponíveis",
  "No buckets yet": "Ainda não há buckets",
  "Create a bucket to start storing objects.":
    "Crie um bucket para começar a armazenar objetos.",
  "No matching objects": "Nenhum objeto corresponde",
  "Try a different name or clear the search filter.":
    "Tente outro nome ou limpe o filtro de pesquisa.",
  "Metrics are unavailable": "As métricas estão indisponíveis",
  "Connect a Prometheus endpoint to view monitoring metrics.":
    "Conecte um endpoint do Prometheus para ver as métricas de monitoramento.",
  "Loading rows": "Carregando linhas",
  "Command preview": "Pré-visualização do comando",
  "Showing the first 1 MiB. Download the object to see the full file.":
    "Exibindo o primeiro 1 MiB. Baixe o objeto para ver o arquivo completo.",
  "Showing first 500 rows": "Exibindo as primeiras 500 linhas",
  "Showing the first 100 columns. View Source or download the object to see all columns.":
    "Exibindo as primeiras 100 colunas. Veja o código-fonte ou baixe o objeto para ver todas as colunas.",
  Rendered: "Renderizado",
  "Wrap lines": "Quebrar linhas",
  Row: "Linha",
  "CSV preview content": "Conteúdo da pré-visualização CSV",
  "Markdown preview content": "Conteúdo da pré-visualização Markdown",
  "Markdown rendering is unavailable for this content. Showing the source instead.":
    "A renderização de Markdown não está disponível para este conteúdo. Exibindo o código-fonte.",
  "Image: {alt}": "Imagem: {alt}",
  Image: "Imagem",
  Actions: "Ações",
  "Select version": "Selecionar versão",
  "This version is a delete marker.": "Esta versão é um marcador de exclusão.",
  "You need s3:GetObject permission.":
    "Você precisa da permissão s3:GetObject.",
  "You need s3:GetObjectVersion permission.":
    "Você precisa da permissão s3:GetObjectVersion.",
  "Preview is not available for this file type.":
    "A pré-visualização não está disponível para este tipo de arquivo.",
  "Object Lock is not enabled on this bucket.":
    "O bloqueio de objetos não está ativado neste bucket.",
  "You need s3:PutObjectLegalHold permission.":
    "Você precisa da permissão s3:PutObjectLegalHold.",
  "You need s3:PutObjectRetention permission.":
    "Você precisa da permissão s3:PutObjectRetention.",
  "Tags can only be changed on the current version.":
    "As tags só podem ser alteradas na versão atual.",
  "Versioning is not enabled on this bucket.":
    "O versionamento não está ativado neste bucket.",
  "Select one or more objects first.": "Selecione um ou mais objetos primeiro.",
  "Select a single object first.": "Selecione um único objeto primeiro.",
  "Select a file instead of a folder.":
    "Selecione um arquivo em vez de uma pasta.",
  "Select a folder to change anonymous access.":
    "Selecione uma pasta para alterar o acesso anônimo.",
  "Open the current object to use this action.":
    "Abra o objeto atual para usar esta ação.",
  "This action requires a distributed server.":
    "Esta ação requer um servidor distribuído.",
  "You need s3:PutObjectTagging permission.":
    "Você precisa da permissão s3:PutObjectTagging.",
  "You need admin:InspectData permission.":
    "Você precisa da permissão admin:InspectData.",
  "You need permission to view object versions.":
    "Você precisa de permissão para ver as versões do objeto.",
  "You need s3:DeleteObject permission.":
    "Você precisa da permissão s3:DeleteObject.",
  "You need permission to change the bucket policy.":
    "Você precisa de permissão para alterar a política do bucket.",
  "You need permission to read objects and bucket versioning.":
    "Você precisa de permissão para ler objetos e o versionamento do bucket.",
  "You need s3:ListBucket permission.":
    "Você precisa da permissão s3:ListBucket.",
  "You need permission to restore this version.":
    "Você precisa de permissão para restaurar esta versão.",
  "You need permission to select this version.":
    "Você precisa de permissão para selecionar esta versão.",
  "You need permission to delete object versions.":
    "Você precisa de permissão para excluir versões de objetos.",
  "Exit rewind mode to refresh the object list.":
    "Saia do modo de retrocesso para atualizar a lista de objetos.",
  "There are no non-current versions to delete.":
    "Não há versões não atuais para excluir.",
  "Invalid Endpoint": "Endpoint inválido",
  Broker: "Broker",
  QOS: "QOS",
  "Client ID": "ID do cliente",
  "Client Secret": "Segredo do cliente",
  "Redirect URI": "URI de redirecionamento",
  "Lookup Bind DN": "DN de bind para consulta",
  "Lookup Bind Password": "Senha de bind para consulta",
  "User DN Search Base": "Base de pesquisa do DN de usuário",
  "User DN Search Filter": "Filtro de pesquisa do DN de usuário",
  "Group Search Base DN": "DN base de pesquisa de grupos",
  "Group Search Filter": "Filtro de pesquisa de grupos",
  "Sign Out": "Sair",
  "Remove transfer": "Remover transferência",
  "Cancel transfer": "Cancelar transferência",
  "This download has already started. Dismiss its transfer entry to start it again.":
    "Este download já começou. Dispense a entrada da transferência para iniciá-lo de novo.",
  "Track or cancel this download in your browser's download manager.":
    "Acompanhe ou cancele este download no gerenciador de downloads do navegador.",
  "For selections above 5 GiB or of unknown size, MCLI is recommended. This ZIP will stream without buffering in memory.":
    "Para seleções acima de 5 GiB ou de tamanho desconhecido, recomenda-se o MCLI. Este ZIP será transmitido sem armazenamento em memória.",
  "Set lifecycle": "Definir ciclo de vida",
  "Set replication": "Definir replicação",
  "Refresh buckets": "Atualizar buckets",
  "Close details": "Fechar detalhes",
  "Copy share URL": "Copiar URL de compartilhamento",
  "Select multiple versions": "Selecionar várias versões",
  "Delete selected versions": "Excluir versões selecionadas",
  "Delete non-current versions": "Excluir versões não atuais",
  "Copy code": "Copiar código",
  "Delete group": "Excluir grupo",
  "Refresh list": "Atualizar lista",
  "Copy path": "Copiar caminho",
  "Delete user": "Excluir usuário",
  "Change password": "Alterar senha",
  "Copy {label}": "Copiar {label}",
  "Add site": "Adicionar site",
  "Remove site": "Remover site",
  "Delete selected users": "Excluir usuários selecionados",
  "View All": "Ver tudo",
  "Deployment ID:": "ID da implantação:",
  "Request ID:": "ID da requisição:",
  "Remote host:": "Host remoto:",
  "User agent:": "User agent:",
  "Backtrace:": "Backtrace:",
  "Time:": "Hora:",
  "API:": "API:",
  "Not available": "Não disponível",
  " and ": " e ",
  "'namespace' reflects current bucket/object list and 'access' reflects a journal of object operations, defaults to 'namespace'":
    "'namespace' reflete a lista atual de buckets/objetos e 'access' reflete um registro de operações com objetos; o padrão é 'namespace'",
  "{compliance} lock protects Objects from write operations by all users, including the SILO root user.":
    "O bloqueio {compliance} protege os objetos contra operações de escrita de todos os usuários, incluindo o usuário root do SILO.",
  "{count} days": "{count} dias",
  "{count} Entities Found": "{count} entidades encontradas",
  "{count} Entity Found": "{count} entidade encontrada",
  "{count} Version": "{count} versão",
  "{count} version, {size}": "{count} versão, {size}",
  "{count} versions": "{count} versões",
  "{count} Versions": "{count} versões",
  "{count} versions, {size}": "{count} versões, {size}",
  "{custom} policy can be written to define which accounts are authorized to access this Bucket":
    "{custom}: permite escrever uma política que define quais contas têm autorização para acessar este bucket",
  "{entity} not available": "{entity} não disponível",
  "{entity} will be available until:": "{entity} estará disponível até:",
  "{excludeFolders} options will not be available if this option is enabled.":
    "As opções de {excludeFolders} não estarão disponíveis se esta opção estiver ativada.",
  "{file} - Versions": "{file} - Versões",
  "{governance} lock protects Objects from write operations by non-privileged users.":
    "O bloqueio {governance} protege os objetos contra operações de escrita de usuários sem privilégios.",
  "{label} copied to clipboard": "{label} copiado para a área de transferência",
  "{minio} is a registered trademark of MinIO, Inc. {silo} is not a MinIO, Inc. product, and is not affiliated with, sponsored by, or endorsed by MinIO, Inc.":
    "{minio} é uma marca registrada da MinIO, Inc. {silo} não é um produto da MinIO, Inc. e não é afiliado, patrocinado nem endossado pela MinIO, Inc.",
  "{object} Versions": "Versões de {object}",
  "{objectLocking} prevents objects from being deleted. Required to support retention and legal hold. Can only be enabled at bucket creation.":
    "{objectLocking} impede que objetos sejam excluídos. É necessário para retenção e retenção legal. Só pode ser ativado na criação do bucket.",
  "{private} policy limits access to credentialled accounts with appropriate permissions":
    "{private}: limita o acesso a contas autenticadas com as permissões adequadas",
  "{provider} - Add Tier Configuration":
    "{provider} - Adicionar configuração de camada",
  "{public} policy anyone will be able to upload, download and delete files from this Bucket once logged in":
    "{public}: qualquer pessoa conectada poderá enviar, baixar e excluir arquivos deste bucket",
  "{quota} limits the amount of data in the bucket.":
    "{quota} limita a quantidade de dados no bucket.",
  "{retention} imposes rules to prevent object deletion for a period of time. Versioning must be enabled in order to set bucket retention policies.":
    "{retention} impõe regras que impedem a exclusão de objetos por um período. O versionamento precisa estar ativado para definir políticas de retenção do bucket.",
  "{service} which is {status}": "{service} que está {status}",
  "{silo} is an independently maintained continuation of the {minio} object storage project, carried forward by the {pigsty} community since 2026. Its {code} {incorporates} {upstream}, and the complete work remains licensed under the {agpl}.":
    "{silo} é uma continuação mantida de forma independente do projeto de armazenamento de objetos {minio}, conduzida pela comunidade {pigsty} desde 2026. Seu {code} {incorporates} {upstream}, e a obra completa continua licenciada sob a {agpl}.",
  "{target} Event Destination": "Destino de eventos {target}",
  "{time} ago": "há {time}",
  "{type}: {name} not found.": "{type}: {name} não encontrado.",
  "{versioning} allows to keep multiple versions of the same object under the same key.":
    "{versioning} permite manter várias versões do mesmo objeto sob a mesma chave.",
  "* Warning: With Public access anyone will be able to upload, download and delete files from this Bucket *":
    "* Aviso: com acesso público, qualquer pessoa poderá enviar, baixar e excluir arquivos deste bucket *",
  "# Associated Access Keys": "Nº de chaves de acesso associadas",
  "© 2026 Ruohang Feng / PGSTY and the SILO contributors.":
    "© 2026 Ruohang Feng / PGSTY e os colaboradores do SILO.",
  "<Day>": "<Dia>",
  "<Month>": "<Mês>",
  "<Year>": "<Ano>",
  "A bucket can only be deleted if it's empty.":
    "Um bucket só pode ser excluído se estiver vazio.",
  "A group can have one attached IAM policy, where all users with membership in that group inherit that policy. Groups support more simplified management of user permissions on the SILO Tenant.":
    "Um grupo pode ter uma política IAM anexada, herdada por todos os usuários membros desse grupo. Os grupos simplificam o gerenciamento de permissões de usuários no locatário do SILO.",
  "A network error occurred.": "Ocorreu um erro de rede.",
  "A new {entity} has been created with the following details:":
    "Uma nova {entity} foi criada com os seguintes detalhes:",
  "A SILO user consists of a unique access key (username) and corresponding secret key (password). Clients must authenticate their identity by specifying both a valid access key (username) and the corresponding secret key (password) of an existing SILO user.":
    "Um usuário do SILO é formado por uma chave de acesso única (nome de usuário) e pela chave secreta correspondente (senha). Os clientes precisam se autenticar informando uma chave de acesso válida (nome de usuário) e a chave secreta correspondente (senha) de um usuário existente do SILO.",
  "A user can be a member of multiple groups.":
    "Um usuário pode ser membro de vários grupos.",
  "About Site Replication": "Sobre a replicação entre sites",
  Access: "Acesso",
  "Access Audit": "Auditoria de acesso",
  "Access Key": "Chave de acesso",
  "Access Key and Secret Key should be same on the new site/endpoint.":
    "A chave de acesso e a chave secreta devem ser iguais no novo site/endpoint.",
  "Access Key Policy": "Política da chave de acesso",
  "Access Key details - {name}": "Detalhes da chave de acesso - {name}",
  "Access keys deleted successfully.":
    "Chaves de acesso excluídas com sucesso.",
  "Access Keys deleted successfully.":
    "Chaves de acesso excluídas com sucesso.",
  "Access Keys inherit the policies explicitly attached to the parent user, and the policies attached to each group in which the parent user has membership.":
    "As chaves de acesso herdam as políticas anexadas explicitamente ao usuário pai e as políticas anexadas a cada grupo de que ele é membro.",
  "Access Keys support programmatic access by applications. You cannot use a Access Key to log into the SILO Console.":
    "As chaves de acesso permitem o acesso programático por aplicações. Você não pode usar uma chave de acesso para entrar no Console do SILO.",
  "Access Policy": "Política de acesso",
  "Access Policy:": "Política de acesso:",
  "Access Rule added successfully": "Regra de acesso adicionada com sucesso",
  "Access Rules": "Regras de acesso",
  "AccessKey is required": "A chave de acesso é obrigatória",
  "Account Key": "Chave da conta",
  "Account Name": "Nome da conta",
  "Actions:": "Ações:",
  Active: "Ativo",
  "Active for": "Ativo por",
  'AD/LDAP server address e.g. "myldapserver.com:636"':
    'Endereço do servidor AD/LDAP, por exemplo "myldapserver.com:636"',
  "Add a Row": "Adicionar linha",
  "Add Access Rule": "Adicionar regra de acesso",
  "Add Anonymous Access Rule": "Adicionar regra de acesso anônimo",
  "Add Bucket Replication Rule - {bucket}":
    "Adicionar regra de replicação de bucket - {bucket}",
  "Add Event Destination": "Adicionar destino de eventos",
  "Add key": "Adicionar chave",
  "Add Lifecycle Rule": "Adicionar regra de ciclo de vida",
  "Add Members": "Adicionar membros",
  "Add New Tag": "Adicionar nova tag",
  "Add New Tag ": "Adicionar nova tag ",
  "Add new Webhook": "Adicionar novo webhook",
  "Add Replication Rule": "Adicionar regra de replicação",
  "Add Replication Site": "Adicionar site",
  "Add Replication Sites": "Adicionar sites de replicação",
  "Add Sites": "Adicionar sites",
  "Add Sites for Replication": "Adicionar sites para replicação",
  "Add tag": "Adicionar tag",
  "Add Tier": "Adicionar camada",
  "Add to Group": "Adicionar ao grupo",
  "Add to Groups": "Adicionar a grupos",
  "Add Users to Group": "Adicionar usuários ao grupo",
  "add users to groups": "adicionar usuários a grupos",
  "Adding groups lets you assign IAM policies to multiple users at once.":
    "Adicionar grupos permite atribuir políticas IAM a vários usuários de uma vez.",
  Address: "Endereço",
  After: "Depois de",
  All: "Todos",
  "All Log Types": "Todos os tipos de log",
  "All Nodes": "Todos os nós",
  "All sites must be using the same external IDP(s) if any.":
    "Todos os sites devem usar os mesmos IDPs externos, se houver.",
  "All sites must have the same deployment credentials (i.e. MINIO_ROOT_USER, MINIO_ROOT_PASSWORD).":
    "Todos os sites devem ter as mesmas credenciais de implantação (ou seja, MINIO_ROOT_USER e MINIO_ROOT_PASSWORD).",
  "All User Agents": "Todos os user agents",
  "Amazon Resource Name": "Amazon Resource Name",
  "AMQP exchange type": "Tipo de exchange do AMQP",
  "AMQP server endpoint e.g. `amqp://myuser:mypassword@localhost:5672`":
    "Endpoint do servidor AMQP, por exemplo `amqp://myuser:mypassword@localhost:5672`",
  "An error occurred": "Ocorreu um erro",
  "An error occurred while getting the Health Report file.":
    "Ocorreu um erro ao obter o arquivo do relatório de integridade.",
  "An error occurred while uploading the file.":
    "Ocorreu um erro ao enviar o arquivo.",
  "An error occurred while uploading the files.":
    "Ocorreu um erro ao enviar os arquivos.",
  "An unknown error occurred. Please refer to Console logs to get more information.":
    "Ocorreu um erro desconhecido. Consulte os logs do Console para obter mais informações.",
  Anonymous: "Anônimo",
  "Anonymous Access": "Acesso anônimo",
  "API Name": "Nome da API",
  "API Requests": "Requisições de API",
  Application: "Aplicação",
  "apply policies to Groups": "aplicar políticas a grupos",
  April: "Abril",
  "Are you sure you want to continue?": "Tem certeza de que deseja continuar?",
  "Are you sure you want to delete Access Key {name}?":
    "Tem certeza de que deseja excluir a chave de acesso {name}?",
  "Are you sure you want to delete all the non-current versions for: {object}?":
    "Tem certeza de que deseja excluir todas as versões não atuais de: {object}?",
  "Are you sure you want to delete bucket {bucket}?":
    "Tem certeza de que deseja excluir o bucket {bucket}?",
  "Are you sure you want to delete IDP {name} configuration?":
    "Tem certeza de que deseja excluir a configuração do IDP {name}?",
  "Are you sure you want to delete policy {name}?":
    "Tem certeza de que deseja excluir a política {name}?",
  "Are you sure you want to delete replication rule {rule}?":
    "Tem certeza de que deseja excluir a regra de replicação {rule}?",
  "Are you sure you want to delete the {rule} rule?":
    "Tem certeza de que deseja excluir a regra {rule}?",
  "Are you sure you want to delete the Configured Endpoint {name}?":
    "Tem certeza de que deseja excluir o endpoint configurado {name}?",
  "Are you sure you want to delete the event destination ?":
    "Tem certeza de que deseja excluir o destino de eventos?",
  "Are you sure you want to delete the following {count} groups?":
    "Tem certeza de que deseja excluir os {count} grupos a seguir?",
  "Are you sure you want to delete the following {count} users?":
    "Tem certeza de que deseja excluir os {count} usuários a seguir?",
  "Are you sure you want to delete the following group?":
    "Tem certeza de que deseja excluir o grupo a seguir?",
  "Are you sure you want to delete the following user?":
    "Tem certeza de que deseja excluir o usuário a seguir?",
  "Are you sure you want to delete the selected {count} Access Keys?":
    "Tem certeza de que deseja excluir as {count} chaves de acesso selecionadas?",
  "Are you sure you want to delete the selected {count} objects?":
    "Tem certeza de que deseja excluir os {count} objetos selecionados?",
  "Are you sure you want to delete the selected {count} versions for {object}?":
    "Tem certeza de que deseja excluir as {count} versões selecionadas de {object}?",
  "Are you sure you want to delete the tag {tag} ?":
    "Tem certeza de que deseja excluir a tag {tag}?",
  "Are you sure you want to delete the tag {tag}?":
    "Tem certeza de que deseja excluir a tag {tag}?",
  "Are you sure you want to delete the tier {name}?":
    "Tem certeza de que deseja excluir a camada {name}?",
  "Are you sure you want to delete this access rule?":
    "Tem certeza de que deseja excluir esta regra de acesso?",
  "Are you sure you want to delete this event?":
    "Tem certeza de que deseja excluir este evento?",
  "Are you sure you want to delete:": "Tem certeza de que deseja excluir:",
  "Are you sure you want to remove all the replication sites?.":
    "Tem certeza de que deseja remover todos os sites de replicação?",
  "Are you sure you want to remove the replication site: {name}?":
    "Tem certeza de que deseja remover o site de replicação: {name}?",
  "Are you sure you want to remove the selected replication rules for bucket {bucket}?":
    "Tem certeza de que deseja remover as regras de replicação selecionadas do bucket {bucket}?",
  "Are you sure you want to reset the Default {name}?":
    "Tem certeza de que deseja redefinir o padrão de {name}?",
  "Are you sure you want to restore {object} with Version ID: {version}?":
    "Tem certeza de que deseja restaurar {object} com o ID de versão {version}?",
  "Are you sure you want to restore these configurations to default values?":
    "Tem certeza de que deseja restaurar estas configurações para os valores padrão?",
  "Assign Access Policies": "Atribuir políticas de acesso",
  "Assign Custom Credentials": "Atribuir credenciais personalizadas",
  "Assign Custom IAM Policies for Group":
    "Atribuir políticas IAM personalizadas ao grupo",
  "Assign groups": "Atribuir grupos",
  "Assign Groups": "Atribuir grupos",
  "assign policies": "atribuir políticas",
  "assign Policies": "atribuir políticas",
  "Assign Policies": "Atribuir políticas",
  "Assign Policy": "Atribuir política",
  "Assign Users": "Atribuir usuários",
  Asynchronous: "Assíncrono",
  "Audit Kafka": "Kafka de auditoria",
  "Audit Webhook": "Webhook de auditoria",
  August: "Agosto",
  "Auth Token": "Token de autenticação",
  "Auto delete queue when set to 'on', when there are no consumers":
    "Exclui a fila automaticamente quando definido como 'on' e não houver consumidores",
  "Auto Deleted": "Exclusão automática",
  "Available Capacity": "Capacidade disponível",
  Back: "Voltar",
  Backend: "Backend",
  Bandwidth: "Largura de banda",
  "Enter a non-negative bandwidth below 8 PiB/s, with at most two decimals (0 means unlimited).":
    "Informe uma largura de banda não negativa abaixo de 8 PiB/s, com no máximo duas casas decimais (0 significa ilimitada).",
  "Bitrot Scan": "Verificação de bit rot",
  Brokers: "Brokers",
  "Browse Bucket": "Navegar pelo bucket",
  Bucket: "Bucket",
  "Bucket Assignments": "Atribuições de bucket",
  "Bucket Encryption configuration": "Configuração de criptografia do bucket",
  "Bucket lifecycle (ILM) configuration":
    "Configuração do ciclo de vida do bucket (ILM)",
  "Bucket Name": "Nome do bucket",
  "Bucket names can consist only of lowercase letters, numbers, dots (.), and hyphens (-).":
    "Nomes de bucket só podem conter letras minúsculas, números, pontos (.) e hifens (-).",
  "Bucket names must be between 3 (min) and 63 (max) characters long.":
    "Nomes de bucket devem ter entre 3 (mín.) e 63 (máx.) caracteres.",
  "Bucket names must be unique within a partition.":
    "Nomes de bucket devem ser únicos dentro de uma partição.",
  "Bucket names must not be formatted as an IP address (for example, 192.168.5.4).":
    "Nomes de bucket não podem ter o formato de endereço IP (por exemplo, 192.168.5.4).",
  "Bucket names must not contain two adjacent periods, or a period adjacent to a hyphen.":
    "Nomes de bucket não podem conter dois pontos seguidos nem um ponto ao lado de um hífen.",
  "Bucket names must not end with the suffix -s3alias. This suffix is reserved for access point alias names.":
    "Nomes de bucket não podem terminar com o sufixo -s3alias. Esse sufixo é reservado para aliases de pontos de acesso.",
  "Bucket names must not start with the prefix xn--.":
    "Nomes de bucket não podem começar com o prefixo xn--.",
  "Bucket notification configuration": "Configuração de notificações do bucket",
  "bucket notifications": "notificações de bucket",
  "Bucket Object-Lock configurations":
    "Configurações de bloqueio de objetos do bucket",
  "Bucket Policies": "Políticas de bucket",
  "Bucket Replication Configuration": "Configuração de replicação do bucket",
  "Bucket Tags": "Tags do bucket",
  "bucket-default": "padrão do bucket",
  "Buckets Results": "Resultados de buckets",
  "Buckets:": "Buckets:",
  "Bypass Governance Mode": "Ignorar modo de governança",
  Bytes: "Bytes",
  "Calls to Trace": "Chamadas a rastrear",
  Cancelled: "Cancelada",
  "Cannot delete currently logged in user":
    "Não é possível excluir o usuário conectado",
  "Cannot delete currently logged in user {user}":
    "Não é possível excluir o usuário conectado {user}",
  "Cert Authority": "Autoridade certificadora",
  "Change Access Policy": "Alterar política de acesso",
  "Change Legal Hold rules for this File":
    "Alterar regras de retenção legal deste arquivo",
  "Change Password": "Alterar senha",
  "Change Password for {user}": "Alterar senha de {user}",
  "Change password for: {user}": "Alterar senha de: {user}",
  "Change Retention rules for this File":
    "Alterar regras de retenção deste arquivo",
  "Change Tags for this File": "Alterar tags deste arquivo",
  "Change User Password": "Alterar senha do usuário",
  "Changes to Bucket features such as":
    "Alterações em recursos do bucket, como",
  "Choose or create a new path": "Escolha ou crie um novo caminho",
  "Claim from which SILO will read the policy or role to use":
    "Claim de onde o SILO lerá a política ou o papel a usar",
  "Claim Name": "Nome da claim",
  "Claim Prefix": "Prefixo da claim",
  "Claim User Info": "Claim de informações do usuário",
  Clear: "Limpar",
  "Click on a user to view the full listing of associated Access Keys. All Access Keys associated with a user will be deleted along with the user.":
    "Clique em um usuário para ver a lista completa de chaves de acesso associadas. Todas as chaves de acesso de um usuário serão excluídas junto com ele.",
  client: "cliente",
  "Client Auth determines the Kafka server's policy for TLS client authorization":
    "Client Auth determina a política do servidor Kafka para autorização de clientes TLS",
  "Client Cert": "Certificado do cliente",
  "Client cert for mTLS authentication":
    "Certificado do cliente para autenticação mTLS",
  "Client cert for NATS mTLS auth":
    "Certificado do cliente para autenticação mTLS no NATS",
  "Client Cert Key": "Chave do certificado do cliente",
  "Client cert key for mTLS authentication":
    "Chave do certificado do cliente para autenticação mTLS",
  "Client cert key for NATS mTLS authorization":
    "Chave do certificado do cliente para autorização mTLS no NATS",
  "Client ID is required": "O ID do cliente é obrigatório",
  "Client Key": "Chave do cliente",
  "Client ping commands interval in s,m,h,d. Disabled by default":
    "Intervalo dos comandos de ping do cliente em s, m, h, d. Desativado por padrão",
  "Client Secret is required": "O segredo do cliente é obrigatório",
  "Client Secret must be re-entered to change OpenID configurations":
    "O segredo do cliente precisa ser informado novamente para alterar as configurações do OpenID",
  "client TLS cert": "certificado TLS do cliente",
  "client TLS key": "chave TLS do cliente",
  "ClientAuth determines the Kafka server's policy for TLS client authorization":
    "ClientAuth determina a política do servidor Kafka para autorização de clientes TLS",
  "Cluster Health Report will be generated, you will be able to download the JSON File.":
    "O relatório de integridade do cluster será gerado e você poderá baixar o arquivo JSON.",
  code: "código",
  "Comma separated list of Kafka broker addresses":
    "Lista de endereços de brokers Kafka separados por vírgula",
  Comment: "Comentário",
  Comments: "Comentários",
  Compliance: "Conformidade",
  Compression: "Compactação",
  "Concurrent:": "Simultâneos:",
  Config: "Configuração",
  "Config Name is required": "O nome da configuração é obrigatório",
  "Config URL": "URL de configuração",
  "Config URL for identity provider configuration":
    "URL de configuração do provedor de identidade",
  "Config URL is required": "A URL de configuração é obrigatória",
  "Configuration cannot be disabled / enabled in this module as LDAP environment variables are set for this SILO instance.":
    "A configuração não pode ser ativada ou desativada neste módulo porque há variáveis de ambiente LDAP definidas nesta instância do SILO.",
  "Configuration cannot be disabled / enabled in this module as OpenID environment variables are set for this SILO instance.":
    "A configuração não pode ser ativada ou desativada neste módulo porque há variáveis de ambiente OpenID definidas nesta instância do SILO.",
  "Configuration cannot be edited in this module as LDAP environment variables are set for this SILO instance.":
    "A configuração não pode ser editada neste módulo porque há variáveis de ambiente LDAP definidas nesta instância do SILO.",
  "Configuration cannot be edited in this module as OpenID environment variables are set for this SILO instance.":
    "A configuração não pode ser editada neste módulo porque há variáveis de ambiente OpenID definidas nesta instância do SILO.",
  "Configuration saved successfully": "Configuração salva com sucesso",
  "Configure a {remoteTier} to receive transitioned Objects":
    "Configure uma {remoteTier} para receber os objetos em transição",
  "Configure Bucket": "Configurar bucket",
  "Configuring an external IDP enables Single-Sign On workflows, where applications authenticate against the external IDP before accessing SILO.":
    "Configurar um IDP externo habilita fluxos de login único, em que as aplicações se autenticam no IDP externo antes de acessar o SILO.",
  "Confirm Dialogs": "Caixas de confirmação",
  "connected server": "servidor conectado",
  "Connection String": "String de conexão",
  "Console Credentials": "Credenciais do Console",
  "Console LICENSE": "LICENÇA do Console",
  "Console portions © Georg Mangold and contributors.":
    "Partes do Console © Georg Mangold e colaboradores.",
  "Console predecessor": "Antecessor do Console",
  "Copy to Clipboard": "Copiar para a área de transferência",
  Copyright: "Direitos autorais",
  "Coredns Path": "Caminho do CoreDNS",
  "Cors Allow Origin": "Origem permitida de CORS",
  "Could not process drag and drop.":
    "Não foi possível processar o arrastar e soltar.",
  "CPU Info": "Informações da CPU",
  "Create {idpType} configuration": "Criar configuração {idpType}",
  "create a bucket": "criar um bucket",
  "Create a new cryptographic key in the Key Management Service server connected to SILO.":
    "Crie uma nova chave criptográfica no servidor do serviço de gerenciamento de chaves conectado ao SILO.",
  "create a new path": "criar um novo caminho",
  "create a Policy": "criar uma política",
  "Create access key": "Criar chave de acesso",
  "Create Access Key": "Criar chave de acesso",
  "Create Access Key for {user}": "Criar chave de acesso para {user}",
  "Create Access Keys": "Criar chaves de acesso",
  "Create Configuration": "Criar configuração",
  "Create Configurations": "Criar configurações",
  "Create Group": "Criar grupo",
  "Create Key": "Criar chave",
  "Create new path": "Criar novo caminho",
  "Create OpenID Configuration": "Criar configuração OpenID",
  "Create Policies": "Criar políticas",
  "Create Policy": "Criar política",
  "Create Rules": "Criar regras",
  "Create Tier": "Criar camada",
  "Create User": "Criar usuário",
  "create users": "criar usuários",
  "Create Users": "Criar usuários",
  "Created At": "Criado em",
  "Created By": "Criado por",
  "Creation and deletion of all IAM users, groups, policies and their mappings to users or groups":
    "Criação e exclusão de todos os usuários, grupos e políticas IAM e seus mapeamentos para usuários ou grupos",
  "Creation and deletion of buckets and objects":
    "Criação e exclusão de buckets e objetos",
  "Creation and deletion of service accounts (except those owned by the root user)":
    "Criação e exclusão de contas de serviço (exceto as do usuário root)",
  "Creation of STS credentials": "Criação de credenciais STS",
  Credentials: "Credenciais",
  current: "atual",
  Current: "Atual",
  "Current Endpoint:": "Endpoint atual:",
  "Current Password": "Senha atual",
  "Current Path:": "Caminho atual:",
  "Current Policy": "Política atual",
  "Current Status": "Status atual",
  "Current Status:": "Status atual:",
  "Current Tags:": "Tags atuais:",
  "Current User Policy - edit the JSON to remove permissions for this Access Key":
    "Política atual do usuário - edite o JSON para remover permissões desta chave de acesso",
  "Current Version": "Versão atual",
  "CURRENT VERSION": "VERSÃO ATUAL",
  "Currently Configured Endpoints": "Endpoints configurados no momento",
  custom: "personalizado",
  Custom: "Personalizado",
  Cycle: "Ciclo",
  Database: "Banco de dados",
  Date: "Data",
  day: "dia",
  days: "dias",
  Days: "Dias",
  "DB table name to store/update events, table is auto-created":
    "Nome da tabela do banco para armazenar/atualizar eventos; a tabela é criada automaticamente",
  December: "Dezembro",
  Default: "Padrão",
  "Default Key ID:": "ID da chave padrão:",
  "Define which actions are permitted on a specified resource.":
    "Defina quais ações são permitidas em um recurso especificado.",
  "Delay Multiplier": "Multiplicador de atraso",
  "DELETE - Object Deleted": "DELETE - Objeto excluído",
  "Delete {name}": "Excluir {name}",
  "Delete Access Key": "Excluir chave de acesso",
  "Delete Access Keys": "Excluir chaves de acesso",
  "Delete All": "Excluir tudo",
  "Delete All Versions": "Excluir todas as versões",
  "Delete Anonymous Access Rule": "Excluir regra de acesso anônimo",
  "Delete Bucket": "Excluir bucket",
  "Delete Configuration": "Excluir configuração",
  "Delete Endpoint": "Excluir endpoint",
  "Delete Event": "Excluir evento",
  "Delete Group": "Excluir grupo",
  "delete Groups": "excluir grupos",
  "Delete Groups": "Excluir grupos",
  "Delete Lifecycle Rule": "Excluir regra de ciclo de vida",
  "Delete Marker": "Marcador de exclusão",
  "Delete Non-Current versions": "Excluir versões não atuais",
  "Delete Object": "Excluir objeto",
  "Delete Objects": "Excluir objetos",
  "delete Policies": "excluir políticas",
  "Delete Policy": "Excluir política",
  "Delete Replication Rule": "Excluir regra de replicação",
  "Delete Replication Site": "Excluir site de replicação",
  "Delete Selected": "Excluir selecionados",
  "Delete Selected Files": "Excluir arquivos selecionados",
  "Delete Selected Replication Rules":
    "Excluir regras de replicação selecionadas",
  "Delete Selected Versions": "Excluir versões selecionadas",
  "Delete Site": "Excluir site",
  "Delete Tag": "Excluir tag",
  "Delete Tier": "Excluir camada",
  "delete user": "excluir usuário",
  "Delete User": "Excluir usuário",
  "delete users": "excluir usuários",
  "Delete Users": "Excluir usuários",
  "Delete version": "Excluir versão",
  "Delete Webhook": "Excluir webhook",
  Deleted: "Excluído",
  DELETED: "EXCLUÍDO",
  Deletes: "Exclusões",
  "Delivery Mode": "Modo de entrega",
  Description: "Descrição",
  Destination: "Destino",
  "Detailed Results:": "Resultados detalhados:",
  Disable: "Desativar",
  "Disable LDAP": "Desativar LDAP",
  "Disable SSL certificate verification ":
    "Desativar verificação do certificado SSL ",
  "disable users": "desativar usuários",
  Disabled: "Desativado",
  "Display Name": "Nome de exibição",
  "Display Object Versions": "Exibir versões do objeto",
  "Display only Errors": "Exibir apenas erros",
  "Display Versions for this file": "Exibir versões deste arquivo",
  "No object versions are available": "Nenhuma versão do objeto disponível",
  "Distributed Mode": "Modo distribuído",
  "DN (Distinguished Name) for LDAP read-only service account used to perform DN and group lookups":
    "DN (Distinguished Name) da conta de serviço LDAP somente leitura usada para consultas de DN e grupos",
  documentation: "documentação",
  Done: "Concluído",
  "Download all access credentials": "Baixar todas as credenciais de acesso",
  "Download all access credentials to a JSON file. NOTE: This file is not formatted for import using mc alias import. If you plan to import this alias from the file, please use the Download for Import button. ":
    "Baixe todas as credenciais de acesso em um arquivo JSON. OBSERVAÇÃO: este arquivo não está formatado para importação com mc alias import. Se você pretende importar este alias a partir do arquivo, use o botão Baixar para importação. ",
  "Download as CSV": "Baixar como CSV",
  "Download as PNG": "Baixar como PNG",
  "Download credentials in a JSON file formatted for import using mc alias import. This will only include the default login credentials.":
    "Baixe as credenciais em um arquivo JSON formatado para importação com mc alias import. Ele incluirá apenas as credenciais de login padrão.",
  "Download File": "Baixar arquivo",
  "Download for import": "Baixar para importação",
  "Download JSON": "Baixar JSON",
  "Download of multiple files failed.": "Falha no download de vários arquivos.",
  "Download Results": "Baixar resultados",
  "Download Selected": "Baixar selecionados",
  "Download selected objects as Zip. Any Deleted objects in the selection would be skipped from download.":
    "Baixe os objetos selecionados como ZIP. Objetos excluídos na seleção serão ignorados no download.",
  "Download this Object": "Baixar este objeto",
  "Download this version": "Baixar esta versão",
  "Download widget data": "Baixar dados do widget",
  "Downloads / Uploads": "Downloads / uploads",
  "Drives Partitions Info": "Informações de partições dos discos",
  "Drives:": "Discos:",
  "DSN String": "String DSN",
  Durable: "Durável",
  Duration: "Duração",
  "During the speed test all your production traffic will be temporarily suspended.":
    "Durante o teste de velocidade, todo o seu tráfego de produção ficará temporariamente suspenso.",
  "e.g. 503": "ex.: 503",
  "e.g. FunctionName2055": "ex.: FunctionName2055",
  "e.g. Method 2056": "ex.: Method 2056",
  "e.g. my-bucket/my-prefix/*": "ex.: my-bucket/my-prefix/*",
  "e.g. us-west-rack-2": "ex.: us-west-rack-2",
  "Each user can access only those resources and operations which are explicitly granted by the built-in role. SILO denies access to any other resource or action by default.":
    "Cada usuário só pode acessar os recursos e as operações concedidos explicitamente pelo papel embutido. Por padrão, o SILO nega o acesso a qualquer outro recurso ou ação.",
  Edit: "Editar",
  "edit a Policy": "editar uma política",
  "Edit Anonymous Access Rule for {target}":
    "Editar regra de acesso anônimo de {target}",
  "Edit Audit Webhook": "Editar webhook de auditoria",
  "Edit Bucket Replication": "Editar replicação de bucket",
  "Edit Configuration": "Editar configuração",
  "Edit details of - {name}": "Editar detalhes de - {name}",
  "Edit Endpoint": "Editar endpoint",
  "edit Group membership": "editar a associação ao grupo",
  "Edit Lifecycle Configuration": "Editar configuração de ciclo de vida",
  "Edit Logger Webhook": "Editar webhook de logger",
  "Edit Members": "Editar membros",
  "Edit Replication Endpoint": "Editar endpoint de replicação",
  "Edit Tags": "Editar tags",
  "Edit the Default Audit Webhook": "Editar o webhook de auditoria padrão",
  "Edit the Default Logger Webhook": "Editar o webhook de logger padrão",
  "Edit Webhook": "Editar webhook",
  "Effect:": "Efeito:",
  "Elasticsearch index to store/update events, index is auto-created":
    "Índice do Elasticsearch para armazenar/atualizar eventos; o índice é criado automaticamente",
  "Elasticsearch server's address, with optional authentication info":
    "Endereço do servidor Elasticsearch, com informações opcionais de autenticação",
  Enable: "Ativar",
  "Enable audit_kafka target": "Ativar destino audit_kafka",
  "Enable Bucket Encryption": "Ativar criptografia do bucket",
  "Enable Bucket Quota": "Ativar cota do bucket",
  "Enable LDAP": "Ativar LDAP",
  "enable or disable Groups": "ativar ou desativar grupos",
  "enable or disable users": "ativar ou desativar usuários",
  "Enable SASL (Simple Authentication and Security Layer) authentication":
    "Ativar autenticação SASL (Simple Authentication and Security Layer)",
  "Enable TLS (Transport Layer Security)":
    "Ativar TLS (Transport Layer Security)",
  "enable users": "ativar usuários",
  "Enable your preferred options to get filtered records.":
    "Ative as opções desejadas para obter registros filtrados.",
  Enabled: "Ativado",
  Encrypt: "Criptografar",
  "Encryption Key": "Chave de criptografia",
  "Encryption Type": "Tipo de criptografia",
  "Encryption:": "Criptografia:",
  "End Time:": "Hora de término:",
  Endpoint: "Endpoint",
  endpoints: "endpoints",
  Endpoints: "Endpoints",
  "Enter '/' to apply the rule to all prefixes and objects at the bucket root. Do not include the wildcard asterisk '*' as part of the prefix *unless* it is an explicit part of the prefix name. The Console automatically appends an asterisk to the appropriate sections of the resulting IAM policy.":
    "Digite '/' para aplicar a regra a todos os prefixos e objetos na raiz do bucket. Não inclua o asterisco curinga '*' no prefixo, *a menos que* ele faça parte explícita do nome do prefixo. O Console acrescenta automaticamente um asterisco às seções apropriadas da política IAM resultante.",
  "Enter a comment": "Digite um comentário",
  "Enter a description": "Digite uma descrição",
  "Enter a Mime Type": "Digite um tipo MIME",
  "Enter a name": "Digite um nome",
  "Enter Access Key": "Digite a chave de acesso",
  "Enter Account Key": "Digite a chave da conta",
  "Enter Account Name": "Digite o nome da conta",
  "Enter Address": "Digite o endereço",
  "Enter allowed origin e.g. https://example.com":
    "Digite a origem permitida, por exemplo https://example.com",
  "Enter an Extension": "Digite uma extensão",
  "Enter Auth Token": "Digite o token de autenticação",
  "Enter auth_token": "Digite auth_token",
  "Enter Brokers": "Digite os brokers",
  "Enter Bucket": "Digite o bucket",
  "Enter Cert Authority": "Digite a autoridade certificadora",
  "Enter Claim Name": "Digite o nome da claim",
  "Enter Claim Prefix": "Digite o prefixo da claim",
  "Enter Client Cert": "Digite o certificado do cliente",
  "Enter Client Cert Key": "Digite a chave do certificado do cliente",
  "Enter Client ID": "Digite o ID do cliente",
  "Enter Client Key": "Digite a chave do cliente",
  "Enter Client Secret": "Digite o segredo do cliente",
  "Enter Coredns Path": "Digite o caminho do CoreDNS",
  "Enter custom notes if any": "Digite observações personalizadas, se houver",
  "Enter Cycle": "Digite o ciclo",
  "Enter DB Name": "Digite o nome do banco de dados",
  "Enter Delay": "Digite o atraso",
  "Enter Delivery Mode": "Digite o modo de entrega",
  "Enter Destination Identifier": "Digite o identificador do destino",
  "Enter Display Name": "Digite o nome de exibição",
  "Enter DSN String": "Digite a string DSN",
  "Enter Endpoint": "Digite o endpoint",
  "Enter Exchange": "Digite a exchange",
  "Enter Exchange Type": "Digite o tipo de exchange",
  "Enter Format": "Digite o formato",
  "Enter Host": "Digite o host",
  "Enter Index": "Digite o índice",
  "Enter Kafka Broker": "Digite o broker Kafka",
  "Enter Kafka Topic": "Digite o tópico Kafka",
  "Enter Kafka Version": "Digite a versão do Kafka",
  "Enter Keep Alive Interval": "Digite o intervalo de keep-alive",
  "Enter Key": "Digite a chave",
  "Enter Max IO": "Digite o máximo de E/S",
  "Enter Max Sleep Duration": "Digite a duração máxima de espera",
  "Enter Max Wait": "Digite a espera máxima",
  "Enter Name (Eg. REMOTE-TIER)": "Digite o nome (ex.: REMOTE-TIER)",
  "Enter NATS password": "Digite a senha do NATS",
  "Enter NATS Subject": "Digite o subject do NATS",
  "Enter NATS token": "Digite o token do NATS",
  "Enter NATS Username": "Digite o nome de usuário do NATS",
  "Enter New Tag Key": "Digite a chave da nova tag",
  "Enter New Tag Label": "Digite o rótulo da nova tag",
  "Enter nsqd_address": "Digite nsqd_address",
  "Enter Password": "Digite a senha",
  "Enter Path Prefix": "Digite o prefixo do caminho",
  "Enter Ping Interval": "Digite o intervalo de ping",
  "Enter Port": "Digite a porta",
  "Enter Prefix": "Digite o prefixo",
  "Enter QOS": "Digite o QOS",
  "Enter Queue Dir": "Digite o diretório da fila",
  "Enter Queue Directory": "Digite o diretório da fila",
  "Enter Queue Limit": "Digite o limite da fila",
  "Enter Reconnect Interval": "Digite o intervalo de reconexão",
  "Enter Replication Failed Workers":
    "Digite os workers para réplicas com falha",
  "Enter Replication Workers": "Digite os workers de replicação",
  "Enter Requests Max": "Digite o máximo de requisições",
  "Enter Routing Key": "Digite a chave de roteamento",
  "Enter SASL Mechanism": "Digite o mecanismo SASL",
  "Enter SASL Password": "Digite a senha SASL",
  "Enter SASL Username": "Digite o nome de usuário SASL",
  "Enter Secret Key": "Digite a chave secreta",
  "Enter SSL Mode": "Digite o modo SSL",
  "Enter Storage Class": "Digite a classe de armazenamento",
  "Enter Streaming Cluster ID": "Digite o ID do cluster de streaming",
  "Enter Streaming in flight value": "Digite o valor de streaming em andamento",
  "Enter Table Name": "Digite o nome da tabela",
  "Enter Tag Key": "Digite a chave da tag",
  "Enter Tag Label": "Digite o rótulo da tag",
  "Enter the new Folder Path": "Digite o caminho da nova pasta",
  "Enter TLS Client Auth": "Digite o TLS Client Auth",
  "Enter TLS Client Cert": "Digite o certificado TLS do cliente",
  "Enter TLS Client Key": "Digite a chave TLS do cliente",
  "Enter Topic": "Digite o tópico",
  "Enter URL": "Digite a URL",
  "Enter User": "Digite o usuário",
  "Enter Username": "Digite o nome de usuário",
  Entities: "Entidades",
  "Erasure Health": "Integridade do erasure coding",
  Error: "Erro",
  "Error - File size too large": "Erro - arquivo muito grande",
  "Error retrieving access keys": "Erro ao obter as chaves de acesso",
  "Error:": "Erro:",
  Errors: "Erros",
  Erros: "Erros",
  "ETAG:": "ETAG:",
  Event: "Evento",
  "Event Notifications": "Notificações de eventos",
  Exchange: "Exchange",
  "Exchange Type": "Tipo de exchange",
  "Exclude Folders": "Excluir pastas",
  "exclude folders and prefixes": "excluir pastas e prefixos",
  "Exclude folders and prefixes": "Excluir pastas e prefixos",
  "Excluded Prefixes": "Prefixos excluídos",
  "Excluded Prefixes :": "Prefixos excluídos:",
  "Existing Objects": "Objetos existentes",
  "Expand graph": "Expandir gráfico",
  "Expire All Versions": "Expirar todas as versões",
  "Expire Delete Marker": "Expirar marcador de exclusão",
  "Expired All Versions": "Expirar todas as versões",
  "Expired Object Delete Marker": "Marcador de exclusão de objeto expirado",
  Expiry: "Expiração",
  "Expiry Days": "Dias até a expiração",
  Export: "Exportar",
  Extensions: "Extensões",
  'Extensions to compress e.g. ".txt", ".log" or ".csv" -  you can write one per field':
    'Extensões a compactar, por exemplo ".txt", ".log" ou ".csv" - você pode escrever uma por campo',
  Failed: "Falha",
  Failures: "Falhas",
  False: "Falso",
  Features: "Recursos",
  February: "Fevereiro",
  "File Configuration": "Configuração de arquivo",
  "File couldn't be loaded. Please try Download instead":
    "Não foi possível carregar o arquivo. Tente baixá-lo",
  "File couldn't be previewed using file extension or mime type. Please try Download instead":
    "Não foi possível pré-visualizar o arquivo pela extensão ou pelo tipo MIME. Tente baixá-lo",
  "File download will be handled directly by the browser.":
    "O download do arquivo será feito diretamente pelo navegador.",
  "Files larger than 5 GiB use a single, non-resumable browser request. Use mcli for multipart uploads.":
    "Arquivos maiores que 5 GiB usam uma única requisição do navegador, sem retomada. Use o mcli para uploads multipart.",
  "File or Path to inspect": "Arquivo ou caminho a inspecionar",
  "File Preview": "Pré-visualização do arquivo",
  "File preview couldn't be displayed, Please try Download instead.":
    "Não foi possível exibir a pré-visualização do arquivo. Tente baixá-lo.",
  "Filename should be less than 200 characters long.":
    "O nome do arquivo deve ter menos de 200 caracteres.",
  Filter: "Filtrar",
  "Filter Users": "Filtrar usuários",
  "Filter:": "Filtro:",
  Filters: "Filtros",
  "Folder cannot have the same name as an existing file":
    "A pasta não pode ter o mesmo nome de um arquivo existente",
  "For each write operation to the bucket, SILO checks all configured replication rules for the bucket and applies the matching rule with highest configured priority.":
    "Em cada operação de escrita no bucket, o SILO verifica todas as regras de replicação configuradas e aplica a regra correspondente de maior prioridade.",
  'For each write operation to this "source" bucket, SILO checks all configured replication rules and applies the matching rule with highest configured priority.':
    'Em cada operação de escrita neste bucket de "origem", o SILO verifica todas as regras de replicação configuradas e aplica a regra correspondente de maior prioridade.',
  "For per-object retention settings, defer to the documentation for the PUT operation used by your preferred SDK.":
    "Para configurações de retenção por objeto, consulte a documentação da operação PUT do SDK de sua preferência.",
  "For SSE-S3 or SSE-KMS encryption via KMS, all sites must have access to a central KMS deployment server.":
    "Para criptografia SSE-S3 ou SSE-KMS via KMS, todos os sites precisam ter acesso a um servidor KMS central.",
  Format: "Formato",
  "full attribution stack": "lista completa de atribuições",
  "Full Log Information": "Informações completas do log",
  "Function Name": "Nome da função",
  Functions: "Funções",
  "GET - Object accessed": "GET - Objeto acessado",
  "Get Information": "Obter informações",
  "GNU Affero General Public License, version 3":
    "Licença Pública Geral GNU Affero, versão 3",
  "GNU AGPL v3 full text": "Texto completo da GNU AGPL v3",
  Governance: "Governança",
  Group: "Grupo",
  "Group Mappings": "Mapeamentos de grupo",
  "Group Name": "Nome do grupo",
  "Group Status:": "Status do grupo:",
  "Groups provide a simplified method for managing shared permissions among users with common access patterns and workloads. Client’s cannot authenticate to a SILO deployment using a group as an identity.":
    "Os grupos oferecem uma forma simples de gerenciar permissões compartilhadas entre usuários com padrões de acesso e cargas de trabalho em comum. Os clientes não podem se autenticar em uma implantação do SILO usando um grupo como identidade.",
  "Groups with this Policy associated": "Grupos associados a esta política",
  "Guide to access policy structure":
    "Guia da estrutura de políticas de acesso",
  hard: "rígida",
  Heal: "Recuperar",
  "Health Check Duration": "Duração da verificação de integridade",
  "Health Info (Preview)": "Informações de integridade (prévia)",
  "Health Report": "Relatório de integridade",
  "Health Report complete": "Relatório de integridade concluído",
  "Health Report file is ready to be downloaded.":
    "O arquivo do relatório de integridade está pronto para download.",
  "Health report generated successfully!":
    "Relatório de integridade gerado com sucesso!",
  "Health Report in progress...": "Relatório de integridade em andamento...",
  "Health Report started. Please do not refresh page during diagnosis.":
    "Relatório de integridade iniciado. Não atualize a página durante o diagnóstico.",
  Healthy: "Íntegro",
  "Hide advanced Filters": "Ocultar filtros avançados",
  "Hide Bucket Naming Rules": "Ocultar regras de nomes de bucket",
  "Hide Object Versions": "Ocultar versões do objeto",
  hour: "hora",
  hours: "horas",
  Hours: "Horas",
  "IAM conditional statements": "instruções condicionais do IAM",
  "IAM Policy": "Política IAM",
  Id: "ID",
  Identifier: "Identificador",
  "Identity provider Client ID": "ID do cliente do provedor de identidade",
  "Identity provider Client Secret":
    "Segredo do cliente do provedor de identidade",
  "If the Health report cannot be generated at this time, please wait a moment and try again.":
    "Se o relatório de integridade não puder ser gerado agora, aguarde um pouco e tente novamente.",
  "If you are looking to change MINIO_ROOT_USER credentials,":
    "Se você quiser alterar as credenciais de MINIO_ROOT_USER,",
  "ILM - Object Transitioned": "ILM - Objeto transferido",
  "ILM Rule": "Regra ILM",
  Import: "Importar",
  "incorporates and modifies": "incorpora e modifica",
  Index: "Índice",
  "Initially, only one of the sites added for replication may have data. After site-replication is successfully configured, this data is replicated to the other (initially empty) sites. Subsequently, objects may be written to any of the sites, and they will be replicated to all other sites.":
    "Inicialmente, apenas um dos sites adicionados à replicação pode ter dados. Depois que a replicação entre sites for configurada, esses dados serão replicados para os outros sites (inicialmente vazios). A partir daí, os objetos podem ser escritos em qualquer site e serão replicados para todos os demais.",
  "Inspect Decryption Key": "Chave de descriptografia da inspeção",
  "Inspect Object": "Inspecionar objeto",
  "Inspect this file": "Inspecionar este arquivo",
  Internal: "Interno",
  "Invalid bucket name": "Nome de bucket inválido",
  "Invalid Endpoint set": "Endpoint definido inválido",
  "Invalid Name": "Nome inválido",
  January: "Janeiro",
  "JSON Results:": "Resultados em JSON:",
  July: "Julho",
  June: "Junho",
  "Just now": "Agora mesmo",
  "Kafka topic used for bucket notifications":
    "Tópico Kafka usado para notificações de bucket",
  "Keep Alive Interval": "Intervalo de keep-alive",
  "Keep-alive interval for MQTT connections in s,m,h,d":
    "Intervalo de keep-alive das conexões MQTT em s, m, h, d",
  Key: "Chave",
  "Key Management Service Endpoints:":
    "Endpoints do serviço de gerenciamento de chaves:",
  "Key Name": "Nome da chave",
  "Key name cannot contain spaces": "O nome da chave não pode conter espaços",
  Keys: "Chaves",
  "KMS Key ID": "ID da chave KMS",
  "Last Modified": "Última modificação",
  "Last modified:": "Última modificação:",
  "Last Modified:": "Última modificação:",
  "Latency Histogram": "Histograma de latência",
  "LDAP Enabled": "LDAP ativado",
  "Learn more about {link}.": "Saiba mais sobre {link}.",
  "Learn more about Access Keys": "Saiba mais sobre chaves de acesso",
  "Learn more about Groups": "Saiba mais sobre grupos",
  "Learn more about LDAP Configurations": "Saiba mais sobre configurações LDAP",
  "Learn more about OpenID Connect Configurations":
    "Saiba mais sobre configurações do OpenID Connect",
  "Learn more about Policies": "Saiba mais sobre políticas",
  "Learn more about the Users feature":
    "Saiba mais sobre o recurso de usuários",
  "Learn more about TIERS": "Saiba mais sobre CAMADAS",
  "Legal Hold": "Retenção legal",
  "Legal Hold Status": "Status da retenção legal",
  "Legal Hold:": "Retenção legal:",
  "licensing in full": "licenciamento completo",
  Lifecycle: "Ciclo de vida",
  "Lifecycle Configuration": "Configuração de ciclo de vida",
  "Lifecycle Rules": "Regras de ciclo de vida",
  Link: "Link",
  'List of etcd endpoints e.g. "http://localhost:2379" - you can write one per field':
    'Lista de endpoints do etcd, por exemplo "http://localhost:2379" - você pode escrever um por campo',
  "List of origins allowed for CORS requests":
    "Lista de origens permitidas para requisições CORS",
  "List of Replicated Sites": "Lista de sites replicados",
  "Load more": "Carregar mais",
  "Load more Versions": "Carregar mais versões",
  "Load Time": "Tempo de carregamento",
  "Loading nodes": "Carregando nós",
  "Local Buckets to replicate": "Buckets locais a replicar",
  Location: "Localização",
  Locking: "Bloqueio de objetos",
  "Log Details": "Detalhes do log",
  "Logger Webhook": "Webhook de logger",
  "Lookup Bind DN is required": "O DN de bind para consulta é obrigatório",
  "Lookup Bind Password is required":
    "A senha de bind para consulta é obrigatória",
  "Lookup Bind Password must be re-entered to change LDAP configurations":
    "A senha de bind para consulta precisa ser informada novamente para alterar as configurações LDAP",
  "Manage Groups": "Gerenciar grupos",
  Mandatory: "Entrega obrigatória",
  "Manually Configure String": "Configurar string manualmente",
  March: "Março",
  "Max IO": "E/S máxima",
  "Max Sleep": "Pausa máxima",
  "Max Wait": "Espera máxima",
  "Maximum IO requests allowed between objects to slow down heal operation, e.g. 3":
    "Máximo de requisições de E/S permitidas entre objetos para desacelerar a operação de recuperação, por exemplo 3",
  "Maximum limit for undelivered messages, defaults to '10000'":
    "Limite máximo de mensagens não entregues; o padrão é '10000'",
  "Maximum number of concurrent requests, e.g. '1600'":
    "Número máximo de requisições simultâneas, por exemplo '1600'",
  "Maximum sleep duration between objects to slow down heal operation, e.g. 2s":
    "Duração máxima da pausa entre objetos para desacelerar a operação de recuperação, por exemplo 2s",
  "Maximum wait time between operations, defaults to '15s'":
    "Tempo máximo de espera entre operações; o padrão é '15s'",
  May: "Maio",
  "May try again or download Health report JSON File.":
    "Você pode tentar novamente ou baixar o arquivo JSON do relatório de integridade.",
  Members: "Membros",
  "Memory Info": "Informações de memória",
  Metadata: "Metadados",
  "Metadata Sync": "Sincronização de metadados",
  Method: "Método",
  "Mime Types": "Tipos MIME",
  'Mime types e.g. "text/*", "application/json" or "application/xml" - you can write one per field':
    'Tipos MIME, por exemplo "text/*", "application/json" ou "application/xml" - você pode escrever um por campo',
  minute: "minuto",
  minutes: "minutos",
  Minutes: "Minutos",
  Mode: "Modo",
  "Mode:": "Modo:",
  month: "mês",
  months: "meses",
  "More filter options": "Mais opções de filtro",
  "MQTT password": "Senha do MQTT",
  "MQTT server endpoint e.g. `tcp://localhost:1883`":
    "Endpoint do servidor MQTT, por exemplo `tcp://localhost:1883`",
  "MQTT username": "Nome de usuário do MQTT",
  "Multi Bucket lifecycle Assignments Results":
    "Resultados das atribuições de ciclo de vida em vários buckets",
  Name: "Nome",
  "Name for identity provider configuration":
    "Nome da configuração do provedor de identidade",
  "Name of the AMQP exchange": "Nome da exchange do AMQP",
  'Name of the location of the server e.g. "us-west-rack2"':
    'Nome da localização do servidor, por exemplo "us-west-rack2"',
  "Name of the MQTT topic to publish": "Nome do tópico MQTT de publicação",
  "Name:": "Nome:",
  'Namespace prefix to isolate tenants e.g. "customer1/"':
    'Prefixo de namespace para isolar locatários, por exemplo "customer1/"',
  "NATS password": "Senha do NATS",
  "NATS server address e.g. '0.0.0.0:4222'":
    "Endereço do servidor NATS, por exemplo '0.0.0.0:4222'",
  "NATS subscription subject": "Subject de assinatura do NATS",
  "NATS token": "Token do NATS",
  "NATS username": "Nome de usuário do NATS",
  "Network Info": "Informações de rede",
  "New {entity} Created": "Nova {entity} criada",
  "New Audit Webhook": "Novo webhook de auditoria",
  "New Endpoint": "Novo endpoint",
  "New Endpoint:": "Novo endpoint:",
  "New Folder Path": "Caminho da nova pasta",
  "New Logger Webhook": "Novo webhook de logger",
  "New Password": "Nova senha",
  "New passwords don't match": "As novas senhas não coincidem",
  "New Tag Key": "Chave da nova tag",
  "New Tag Label": "Rótulo da nova tag",
  Next: "Próximo",
  No: "Não",
  "No changes applied": "Nenhuma alteração aplicada",
  "No Changes at this time": "Nenhuma alteração no momento",
  "No data available": "Nenhum dado disponível",
  "No Groups Available": "Nenhum grupo disponível",
  "No Policies Available": "Nenhuma política disponível",
  "No query results yet": "Ainda não há resultados de consulta",
  "No Results Available": "Nenhum resultado disponível",
  "No Users to display": "Nenhum usuário para exibir",
  "No Wait": "Sem espera",
  "no-expiry": "sem expiração",
  "Nodes:": "Nós:",
  "Non-blocking message delivery when set to 'on', default is 'off'":
    "Entrega de mensagens sem bloqueio quando definido como 'on'; o padrão é 'off'",
  "Non-Current": "Não atual",
  "Non-current Expiration Days": "Dias até a expiração de não atuais",
  "Non-current Transition Days": "Dias até a transição de não atuais",
  "Non-Current Version": "Versão não atual",
  "Non-current Version Transition Storage Class":
    "Classe de armazenamento de transição de versões não atuais",
  None: "Nenhum",
  "Not what you expected?": "Não era o que você esperava?",
  "Note:": "Observação:",
  "Note: AccessKey and SecretKey values for every site is required while adding or editing peer sites":
    "Observação: os valores de AccessKey e SecretKey de cada site são obrigatórios ao adicionar ou editar sites pares",
  November: "Novembro",
  "NSQ server address e.g. '127.0.0.1:4150'":
    "Endereço do servidor NSQ, por exemplo '127.0.0.1:4150'",
  "NSQ topic": "Tópico NSQ",
  "NSQD Address": "Endereço do NSQD",
  "NULL VERSION": "VERSÃO NULA",
  "Number of {unit} must be less than or equal to 2147483647":
    "O número de {unit} deve ser menor ou igual a 2147483647",
  "Number of {unit} to retain must be greater than zero":
    "O número de {unit} a reter deve ser maior que zero",
  "Number of messages to publish without waiting for ACKs":
    "Número de mensagens a publicar sem esperar ACKs",
  "Number of replication workers for recently failed replicas, defaults to 4":
    "Número de workers de replicação para réplicas com falha recente; o padrão é 4",
  "Number of replication workers, defaults to 100":
    "Número de workers de replicação; o padrão é 100",
  Object: "Objeto",
  "Object Date": "Data do objeto",
  "Object Filters": "Filtros de objetos",
  "Object Info": "Informações do objeto",
  "Object Locking:": "Bloqueio de objetos:",
  "Object Size": "Tamanho do objeto",
  "Object Version": "Versão do objeto",
  "Objects deleted successfully.": "Objetos excluídos com sucesso.",
  "Objects in excluded prefixes do not replicate to any peer site or remote site.":
    "Objetos em prefixos excluídos não são replicados para nenhum site par ou remoto.",
  "Objects List unavailable. Please review your WebSockets configuration and try again":
    "Lista de objetos indisponível. Revise sua configuração de WebSockets e tente novamente",
  "Objects:": "Objetos:",
  "Objs/S": "Objs/s",
  October: "Outubro",
  of: "de",
  "Only empty tiers can be deleted. If the tier has had objects transitioned into it, it cannot be removed.":
    "Só camadas vazias podem ser excluídas. Se objetos já tiverem feito transição para a camada, ela não pode ser removida.",
  "Opaque string or JWT authorization token":
    "String opaca ou token de autorização JWT",
  "Open Dialog": "Abrir caixa de diálogo",
  "OpenID Configurations": "Configurações OpenID",
  "OS Info": "Informações do SO",
  other: "outro",
  "Password for LDAP read-only service account used to perform DN and group lookups":
    "Senha da conta de serviço LDAP somente leitura usada para consultas de DN e grupos",
  "Password for SASL/PLAIN or SASL/SCRAM authentication":
    "Senha para autenticação SASL/PLAIN ou SASL/SCRAM",
  "Passwords must be at least 8 characters long":
    "As senhas devem ter pelo menos 8 caracteres",
  Path: "Caminho",
  "Path cannot start with /": "O caminho não pode começar com /",
  "Path copied to clipboard": "Caminho copiado para a área de transferência",
  "Path Prefix": "Prefixo do caminho",
  "Path to certificate chain of the target NATS server":
    "Caminho da cadeia de certificados do servidor NATS de destino",
  "Path to client certificate for mTLS authorization":
    "Caminho do certificado do cliente para autorização mTLS",
  "Path to client key for mTLS authorization":
    "Caminho da chave do cliente para autorização mTLS",
  "Peer Sites": "Sites pares",
  "Perform bitrot scan on disks when checking objects during scanner":
    "Executar verificação de bit rot nos discos ao checar objetos durante o scanner",
  "Performance test": "Teste de desempenho",
  "Persist queue across broker restarts when set to 'on', default is 'off'":
    "Mantém a fila entre reinicializações do broker quando definido como 'on'; o padrão é 'off'",
  "Ping Interval": "Intervalo de ping",
  "Please avoid the use of root credentials for this feature":
    "Evite usar credenciais root neste recurso",
  "Please configure {entity} first to use this feature.":
    "Configure {entity} primeiro para usar este recurso.",
  "Please deploy a server in {distributedMode} to use these features.":
    "Implante um servidor em {distributedMode} para usar estes recursos.",
  "Please deploy a server in {mode} to use this feature.":
    "Implante um servidor em {mode} para usar este recurso.",
  "N/A": "N/D",
  "Enter a positive quota below 8 PiB, with up to two decimal places. Use mcli for larger quotas.":
    "Informe uma cota positiva abaixo de 8 PiB, com até duas casas decimais. Use o mcli para cotas maiores.",
  "The current quota is 8 PiB or larger, which the browser cannot edit exactly. Change it with mcli, enter a smaller quota, or disable it here.":
    "A cota atual é de 8 PiB ou mais, o que o navegador não consegue editar com exatidão. Altere-a com o mcli, informe uma cota menor ou desative-a aqui.",
  "Please Login via the configured external identity provider.":
    "Entre pelo provedor de identidade externo configurado.",
  "Please note": "Atenção:",
  "Please note that this may cause your system to not be accessible":
    "Observe que isso pode deixar seu sistema inacessível",
  "Please refer to {link} credentials.": "consulte a {link} de credenciais.",
  "Please select / type the desired remote bucket were you want the local data to be replicated.":
    "Selecione ou digite o bucket remoto para o qual os dados locais devem ser replicados.",
  "Please select a valid duration.": "Selecione uma duração válida.",
  "Please select Groups on which you want to apply Policies":
    "Selecione os grupos aos quais deseja aplicar políticas",
  "Please verify that string is uppercase only and contains valid characters (numbers, dashes & underscores).":
    "Verifique se o texto está apenas em maiúsculas e contém caracteres válidos (números, traços e sublinhados).",
  Policy: "Política",
  "Policy has no statements": "A política não tem instruções",
  "Policy mapping": "Mapeamento de política",
  "Policy Mappings": "Mapeamentos de política",
  "Policy Name": "Nome da política",
  "Policy name cannot be empty": "O nome da política não pode ficar vazio",
  "Policy successfully updated": "Política atualizada com sucesso",
  "Policy Summary": "Resumo da política",
  "Portions © 2015–2026 MinIO, Inc.": "Partes © 2015–2026 MinIO, Inc.",
  prefix: "prefixo",
  Prefix: "Prefixo",
  "Preliminar Results:": "Resultados preliminares:",
  preview: "pré-visualização",
  Preview: "Pré-visualizar",
  "Preview - {object}": "Pré-visualização - {object}",
  "Preview Selected File": "Pré-visualizar arquivo selecionado",
  "Preview this File": "Pré-visualizar este arquivo",
  "Preview unavailable": "Pré-visualização indisponível",
  Priority: "Prioridade",
  private: "privado",
  Private: "Privado",
  "Process Info": "Informações do processo",
  public: "público",
  Public: "Público",
  "PUT - Object Uploaded": "PUT - Objeto enviado",
  "Query Filters": "Filtros de consulta",
  "Query Results": "Resultados da consulta",
  Queue: "Fila",
  "Queue Dir": "Diretório da fila",
  "Queue Directory": "Diretório da fila",
  "Queue Limit": "Limite da fila",
  "Quietly ignore undelivered messages when set to 'off', default is 'on'":
    "Ignora silenciosamente mensagens não entregues quando definido como 'off'; o padrão é 'on'",
  quota: "cota",
  Quota: "Cota",
  "Quota:": "Cota:",
  "Randomized access credentials are recommended, and provided by default. You may use your own custom Access Key and Secret Key by replacing the default values. After creation of any Access Key, you will be given the opportunity to view and download the account credentials.":
    "Recomendamos credenciais de acesso aleatórias, fornecidas por padrão. Você pode usar sua própria chave de acesso e chave secreta substituindo os valores padrão. Depois de criar uma chave de acesso, você poderá ver e baixar as credenciais da conta.",
  "Raw Policy": "Política bruta",
  readonly: "somente leitura",
  readwrite: "leitura e escrita",
  "Reconnect Interval": "Intervalo de reconexão",
  "Reconnect interval for MQTT connections in s,m,h,d":
    "Intervalo de reconexão das conexões MQTT em s, m, h, d",
  "Redirect URI Dynamic": "URI de redirecionamento dinâmica",
  "Redis key to store/update events, key is auto-created":
    "Chave do Redis para armazenar/atualizar eventos; a chave é criada automaticamente",
  "Redis server password": "Senha do servidor Redis",
  "Redis server's address e.g. `localhost:6379`":
    "Endereço do servidor Redis, por exemplo `localhost:6379`",
  Refresh: "Atualizar",
  "Refresh List": "Atualizar lista",
  Region: "Região",
  "Remote Bucket Assignments": "Atribuições de bucket remoto",
  "Remote Configuration": "Configuração remota",
  "Remote Endpoint Configuration": "Configuração do endpoint remoto",
  "Remote Host": "Host remoto",
  "remote tier": "camada remota",
  "Remove Row": "Remover linha",
  "Remove Selected Replication Rules":
    "Remover regras de replicação selecionadas",
  "Remove Selected Rules": "Remover regras selecionadas",
  "Remove the reference to the object if no versions are left":
    "Remove a referência ao objeto se não restar nenhuma versão",
  "Removes all the versions of the object already expired":
    "Remove todas as versões do objeto já expirado",
  "Rename Download": "Renomear download",
  "REPLICA - Object Replicated": "REPLICA - Objeto replicado",
  "Replicate existing objects": "Replicar objetos existentes",
  "Replicate soft deletes": "Replicar exclusões lógicas",
  "Replicate versioned deletes": "Replicar exclusões versionadas",
  Replication: "Replicação",
  "Replication Failed Workers": "Workers para réplicas com falha",
  "Replication Mode": "Modo de replicação",
  "Replication Options": "Opções de replicação",
  "Replication Rules": "Regras de replicação",
  "Replication Status": "Status da replicação",
  "Replication status for {type}: {name}.":
    "Status da replicação de {type}: {name}.",
  "Replication status from all Sites": "Status da replicação de todos os sites",
  "Replication Workers": "Workers de replicação",
  "Replication:": "Replicação:",
  "Reported Usage:": "Uso informado:",
  "Request Content Length": "Tamanho do conteúdo da requisição",
  "Request ID": "ID da requisição",
  "Requests Max": "Máximo de requisições",
  "Requests that took T ms or less": "Requisições que levaram T ms ou menos",
  Reset: "Redefinir",
  "Reset Configuration": "Redefinir configuração",
  "Reset Default Webhook": "Redefinir webhook padrão",
  "Resources:": "Recursos:",
  "Response Content Length": "Tamanho do conteúdo da resposta",
  "Response Status": "Status da resposta",
  "Response Status Code": "Código de status da resposta",
  "Response Threshold": "Limite de resposta",
  Restart: "Reiniciar",
  "Restore Defaults": "Restaurar padrões",
  "Restore File Version": "Restaurar versão do arquivo",
  "Restore this version": "Restaurar esta versão",
  "Restrict beyond user policy": "Restringir além da política do usuário",
  Results: "Resultados",
  Retention: "Retenção",
  "Retention Mode": "Modo de retenção",
  "Retention Policy:": "Política de retenção:",
  "Retention Unit": "Unidade de retenção",
  "Retention Validity": "Validade da retenção",
  "Retention:": "Retenção:",
  Retest: "Testar novamente",
  "Retry Health Report": "Repetir relatório de integridade",
  Rewind: "Retroceder",
  "Rewind - {bucket}": "Retroceder - {bucket}",
  "Rewind Bucket": "Retroceder bucket",
  "Rewind to": "Retroceder para",
  "Role Policy": "Política de papel",
  rotating: "rotação",
  "Routing Key": "Chave de roteamento",
  "Routing key for publishing": "Chave de roteamento para publicação",
  "Rule State": "Estado da regra",
  "Rule Type": "Tipo de regra",
  "Running {mcDu} without the {flag} flag or {df} will provide different values corresponding to the size of all {current} versions and the physical disk space occupied respectively.":
    "Executar {mcDu} sem a opção {flag} ou {df} fornecerá valores diferentes, correspondentes ao tamanho de todas as versões {current} e ao espaço físico ocupado em disco, respectivamente.",
  "S3 lifecycle": "Ciclo de vida do S3",
  "SASL authentication mechanism": "Mecanismo de autenticação SASL",
  "SASL authentication mechanism, default 'PLAIN'":
    "Mecanismo de autenticação SASL; o padrão é 'PLAIN'",
  "SASL Mechanism": "Mecanismo SASL",
  "SASL Password": "Senha SASL",
  "SASL Username": "Nome de usuário SASL",
  "Save Event Destination": "Salvar destino de eventos",
  "Save Tier Configuration": "Salvar configuração da camada",
  Scanner: "Scanner",
  "SCANNER - Object has too many versions / Prefixes has too many sub-folders":
    "SCANNER - Objeto com versões demais / prefixos com subpastas demais",
  "Scanner delay multiplier, defaults to '10.0'":
    "Multiplicador de atraso do scanner; o padrão é '10.0'",
  Scopes: "Escopos",
  Search: "Pesquisar",
  "Search Access Keys": "Pesquisar chaves de acesso",
  "Search Groups": "Pesquisar grupos",
  "Search Keys with pattern": "Pesquisar chaves por padrão",
  "Search members": "Pesquisar membros",
  "Search Policies": "Pesquisar políticas",
  "Search target": "Destino da pesquisa",
  "Search Users": "Pesquisar usuários",
  second: "segundo",
  seconds: "segundos",
  "Secret Key": "Chave secreta",
  "SecretKey is required": "A chave secreta é obrigatória",
  "Select {expiry} to delete Objects per this rule. Select {transition} to move Objects to a remote storage {tier} per this rule.":
    "Selecione {expiry} para excluir objetos conforme esta regra. Selecione {transition} para mover objetos para uma {tier} remota de armazenamento conforme esta regra.",
  "Select Bucket": "Selecionar bucket",
  "Select from the list of displayed users to assign users to the new group at creation. These users inherit the policies assigned to the group.":
    "Selecione na lista exibida os usuários a atribuir ao novo grupo na criação. Esses usuários herdam as políticas atribuídas ao grupo.",
  "Select Groups to delete": "Selecione os grupos a excluir",
  "Select Multiple Versions": "Selecionar várias versões",
  "Select Policy": "Selecionar política",
  "Select the desired level of access available to unauthenticated Users":
    "Selecione o nível de acesso disponível para usuários não autenticados",
  "Select Tier Type": "Selecionar tipo de camada",
  "Select to set expiry by days or newer noncurrent versions":
    "Selecione para definir a expiração por dias ou por versões não atuais mais recentes",
  "Select Users to delete": "Selecione os usuários a excluir",
  "Select Users to group": "Selecione os usuários para o grupo",
  "Select whether to apply the rule to current or non-current Object {versions}":
    "Selecione se a regra se aplica às {versions} atuais ou não atuais do objeto",
  "Selected Group": "Grupo selecionado",
  "Selected Groups": "Grupos selecionados",
  "Selected Object": "Objeto selecionado",
  "Selected Objects:": "Objetos selecionados:",
  "Selected User": "Usuário selecionado",
  "Selected Users": "Usuários selecionados",
  September: "Setembro",
  Series: "Série",
  server: "servidor",
  "Server Address": "Endereço do servidor",
  "Server Address is required": "O endereço do servidor é obrigatório",
  "Server Config": "Configuração do servidor",
  "Server Health Info": "Informações de integridade do servidor",
  "Server Insecure": "Servidor inseguro",
  "Server Location": "Localização do servidor",
  "server-side bucket replication": "replicação de bucket do lado do servidor",
  "Server, client and Console are all AGPLv3. SILO's documentation is CC BY 4.0 — {licensing}.":
    "Servidor, cliente e Console são todos AGPLv3. A documentação do SILO é CC BY 4.0 — {licensing}.",
  Service: "Serviço",
  "Service Accounts": "Contas de serviço",
  Services: "Serviços",
  Set: "Definir",
  "Set Anonymous Access to this Folder": "Definir acesso anônimo a esta pasta",
  "Set Bucket Replication": "Definir replicação de bucket",
  "Set Groups": "Definir grupos",
  "Set Legal Hold": "Definir retenção legal",
  "Set Lifecycle to multiple buckets":
    "Definir ciclo de vida em vários buckets",
  "Set Multiple Bucket Replication": "Definir replicação em vários buckets",
  "Set Non-current Version Transition Storage Class":
    "Definir classe de armazenamento de transição de versões não atuais",
  "Set Policies": "Definir políticas",
  "Set Retention Configuration": "Definir configuração de retenção",
  "Set Retention Policy": "Definir política de retenção",
  "Set the quality of service priority, defaults to '0'":
    "Define a prioridade de qualidade de serviço; o padrão é '0'",
  "Set to '1' for non-persistent or '2' for persistent queue":
    "Defina como '1' para fila não persistente ou '2' para fila persistente",
  "Set to 'on' for exchange to be not used directly by publishers, but only when bound to other exchanges":
    "Defina como 'on' para que a exchange não seja usada diretamente por publicadores, apenas quando vinculada a outras exchanges",
  "Set to 'on' to enable asynchronous publish":
    "Defina como 'on' para ativar a publicação assíncrona",
  "Set to 'on' to enable SASL authentication":
    "Defina como 'on' para ativar a autenticação SASL",
  "Set to 'on' to enable TLS": "Defina como 'on' para ativar o TLS",
  "Set to 'on' to use streaming NATS server":
    "Defina como 'on' para usar o servidor NATS de streaming",
  "Setting a {quota} assigns a hard limit to a bucket beyond which SILO does not allow writes.":
    "Definir uma {quota} atribui a um bucket um limite rígido, acima do qual o SILO não permite escritas.",
  "Setting an {anonymous} policy allows clients to access the Bucket or prefix contents and perform actions consistent with the specified policy without authentication.":
    "Definir uma política de acesso {anonymous} permite que clientes acessem o conteúdo do bucket ou prefixo e executem ações compatíveis com a política especificada, sem autenticação.",
  Share: "Compartilhar",
  "Share File": "Compartilhar arquivo",
  "Share Selected File": "Compartilhar arquivo selecionado",
  "Share this File": "Compartilhar este arquivo",
  "Share this version": "Compartilhar esta versão",
  "Share URL Copied to clipboard":
    "URL de compartilhamento copiada para a área de transferência",
  'Shared bucket DNS records, default is "/skydns"':
    'Registros DNS compartilhados de buckets; o padrão é "/skydns"',
  "Show advanced Filters": "Mostrar filtros avançados",
  "Show Current Data": "Mostrar dados atuais",
  "Show deleted objects": "Mostrar objetos excluídos",
  "Show Rewind Data": "Mostrar dados retrocedidos",
  "Show/Hide": "Mostrar/ocultar",
  "SILO {bucketNotifications} allow administrators to send notifications to supported external services on certain object or bucket events.":
    "As {bucketNotifications} do SILO permitem que administradores enviem notificações a serviços externos compatíveis quando ocorrem determinados eventos de objeto ou de bucket.",
  "SILO {objectLocking} enforces Write-Once Read-Many (WORM) immutability to protect versioned objects from deletion.":
    "O {objectLocking} do SILO impõe imutabilidade WORM (Write-Once Read-Many) para proteger objetos versionados contra exclusão.",
  "SILO {serverSideReplication} is an automatic bucket-level configuration that synchronizes objects between a source and destination bucket.":
    "A {serverSideReplication} do SILO é uma configuração automática em nível de bucket que sincroniza objetos entre um bucket de origem e um de destino.",
  "SILO bucket notifications allow administrators to send notifications to supported external services on certain object or bucket events. SILO supports bucket and object-level S3 events similar to the Amazon S3 Event Notifications.":
    "As notificações de bucket do SILO permitem que administradores enviem notificações a serviços externos compatíveis quando ocorrem determinados eventos de objeto ou de bucket. O SILO aceita eventos S3 em nível de bucket e de objeto, semelhantes às notificações de eventos do Amazon S3.",
  "SILO derives its behavior and syntax from {s3Lifecycle} for compatibility in migrating workloads and lifecycle rules from S3 to SILO.":
    "O SILO deriva seu comportamento e sua sintaxe do {s3Lifecycle} para manter a compatibilidade ao migrar cargas de trabalho e regras de ciclo de vida do S3 para o SILO.",
  "SILO does not enable existing object replication by default. Objects created before replication was configured or while replication is disabled are not synchronized to the target deployment unless replication of existing objects is enabled.":
    "O SILO não ativa a replicação de objetos existentes por padrão. Objetos criados antes da configuração da replicação, ou enquanto ela está desativada, não são sincronizados com a implantação de destino, a menos que a replicação de objetos existentes esteja ativada.",
  "SILO Health Info": "Informações de integridade do SILO",
  "SILO Object Lifecycle Management allows creating rules for time or date based automatic transition or expiry of objects. For object transition, SILO automatically moves the object to a configured remote storage tier.":
    "O gerenciamento do ciclo de vida de objetos do SILO permite criar regras de transição ou expiração automática de objetos com base em tempo ou data. Na transição, o SILO move automaticamente o objeto para uma camada de armazenamento remota configurada.",
  "SILO or other S3-compatible storage":
    "SILO ou outro armazenamento compatível com S3",
  "SILO PBAC is built for compatibility with AWS IAM policy syntax, structure, and behavior.":
    "O PBAC do SILO foi criado para ser compatível com a sintaxe, a estrutura e o comportamento das políticas do AWS IAM.",
  "SILO queries the configured Active Directory / LDAP server to verify the credentials specified by the application and optionally return a list of groups in which the user has membership. SILO supports two modes (Lookup-Bind Mode and Username-Bind Mode) for performing these queries":
    "O SILO consulta o servidor Active Directory / LDAP configurado para verificar as credenciais informadas pela aplicação e, opcionalmente, retornar uma lista de grupos dos quais o usuário é membro. O SILO aceita dois modos para essas consultas (Lookup-Bind e Username-Bind)",
  "SILO recommends using Lookup-Bind mode as the preferred method for verifying AD/LDAP credentials. Username-Bind mode is a legacy method retained for backwards compatibility only.":
    "O SILO recomenda o modo Lookup-Bind como método preferencial para verificar credenciais AD/LDAP. O modo Username-Bind é um método legado, mantido apenas por compatibilidade.",
  "SILO requires versioning to support replication.":
    "O SILO exige versionamento para oferecer replicação.",
  "SILO supports automatically replicating existing objects in a bucket; this setting is enabled by default. Please note that objects created before replication was configured or while replication is disabled are not synchronized to the target deployment in case this setting is not enabled.":
    "O SILO pode replicar automaticamente os objetos existentes em um bucket; este ajuste vem ativado por padrão. Se ele não estiver ativado, objetos criados antes da configuração da replicação, ou enquanto ela estiver desativada, não serão sincronizados com a implantação de destino.",
  "SILO supports creating object transition lifecycle management rules, where SILO can automatically move an object to a remote storage “tier”.":
    "O SILO permite criar regras de ciclo de vida de transição de objetos, com as quais pode mover automaticamente um objeto para uma “camada” de armazenamento remota.",
  "SILO supports enabling automatic {sseKms} and {sseS3} encryption of all objects written to a bucket using a specific External Key (EK) stored on the external KMS.":
    "O SILO permite ativar a criptografia automática {sseKms} e {sseS3} de todos os objetos escritos em um bucket usando uma chave externa (EK) específica armazenada no KMS externo.",
  "SILO supports enabling replication of existing objects in a bucket.":
    "O SILO permite ativar a replicação de objetos existentes em um bucket.",
  "SILO supports keeping multiple {versions} of an object in a single bucket.":
    "O SILO pode manter várias {versions} de um objeto em um único bucket.",
  "SILO supports replicating delete operations, where SILO synchronizes deleting specific object versions and new delete markers. Delete operation replication uses the same replication process as all other replication operations.":
    "O SILO pode replicar operações de exclusão, sincronizando a exclusão de versões específicas de objetos e novos marcadores de exclusão. A replicação de exclusões usa o mesmo processo das demais operações de replicação.",
  "SILO supports server-side and client-side replication of objects between source and destination buckets.":
    "O SILO oferece replicação de objetos do lado do servidor e do lado do cliente entre buckets de origem e de destino.",
  "SILO supports setting both {bucketDefault} and per-object retention rules.":
    "O SILO permite definir regras de retenção {bucketDefault} e por objeto.",
  "SILO supports the following Tier types:":
    "O SILO aceita os seguintes tipos de camada:",
  "SILO supports using an Active Directory or LDAP (AD/LDAP) service for external management of user identities. Configuring an external IDentity Provider (IDP) enables Single-Sign On (SSO) workflows, where applications authenticate against the external IDP before accessing SILO.":
    "O SILO permite usar um serviço Active Directory ou LDAP (AD/LDAP) para o gerenciamento externo de identidades de usuários. Configurar um provedor de identidade (IDP) externo habilita fluxos de login único (SSO), em que as aplicações se autenticam no IDP externo antes de acessar o SILO.",
  "SILO uses buckets to organize objects. A bucket is similar to a folder or directory in a filesystem, where each bucket can hold an arbitrary number of objects.":
    "O SILO usa buckets para organizar objetos. Um bucket é semelhante a uma pasta ou diretório em um sistema de arquivos; cada bucket pode conter um número arbitrário de objetos.",
  "SILO uses Policy-Based Access Control (PBAC) to define the authorized actions and resources to which an authenticated user has access. Each policy describes one or more actions and conditions that outline the permissions of a user or group of users.":
    "O SILO usa controle de acesso baseado em políticas (PBAC) para definir as ações e os recursos autorizados a que um usuário autenticado tem acesso. Cada política descreve uma ou mais ações e condições que delimitam as permissões de um usuário ou grupo de usuários.",
  "SILO VERSION": "VERSÃO DO SILO",
  "Site Name": "Nome do site",
  "Site:": "Site:",
  Size: "Tamanho",
  "Size:": "Tamanho:",
  "Skip TLS Verification": "Ignorar verificação TLS",
  "something went wrong": "algo deu errado",
  "Something went wrong.": "Algo deu errado.",
  "Sort by": "Ordenar por",
  "Specify the version of the Kafka cluster":
    "Especifique a versão do cluster Kafka",
  "Specify the version of the Kafka cluster e.g '2.2.0'":
    "Especifique a versão do cluster Kafka, por exemplo '2.2.0'",
  "Speed Test results:": "Resultados do teste de velocidade:",
  Speedtest: "Teste de velocidade",
  "Speedtest in progress...": "Teste de velocidade em andamento...",
  "Staging directory for undelivered messages e.g. '/home/events'":
    "Diretório temporário para mensagens não entregues, por exemplo '/home/events'",
  "STANDARD_IA,REDUCED_REDUNDANCY etc": "STANDARD_IA, REDUCED_REDUNDANCY etc.",
  Start: "Iniciar",
  "Start Health Report": "Iniciar relatório de integridade",
  "Start Logs": "Iniciar logs",
  "Start Profiling": "Iniciar perfil de execução",
  "Start Time:": "Hora de início:",
  "Start typing to filter objects in the bucket":
    "Comece a digitar para filtrar objetos no bucket",
  "Start typing to filter versions of {file}":
    "Comece a digitar para filtrar versões de {file}",
  "Start typing to search for a Policy":
    "Comece a digitar para pesquisar uma política",
  "Start typing to search for Groups": "Comece a digitar para pesquisar grupos",
  Statements: "Instruções",
  Status: "Status",
  "Status Code": "Código de status",
  Stop: "Parar",
  "Stop Logs": "Parar logs",
  "Stop Profiling": "Parar perfil de execução",
  Storage: "Armazenamento",
  "Storage Class": "Classe de armazenamento",
  Streaming: "Streaming",
  "Streaming async": "Streaming assíncrono",
  "Streaming Cluster ID": "ID do cluster de streaming",
  "Streaming max publish ACKS in flight":
    "Máximo de ACKs de publicação em andamento no streaming",
  Subject: "Subject",
  "Subscribe To Bucket Events": "Assinar eventos do bucket",
  "Subscribe to Event": "Assinar evento",
  Success: "Sucesso",
  "Successfully deleted.": "Excluído com sucesso.",
  "Successfully updated the password for the user {user}.":
    "Senha do usuário {user} atualizada com sucesso.",
  "Successfully updated the password.": "Senha atualizada com sucesso.",
  Suffix: "Sufixo",
  Summary: "Resumo",
  "Supported API endpoints": "Endpoints de API compatíveis",
  Suspended: "Suspenso",
  Synced: "Sincronizado",
  Synchronous: "Síncrono",
  "System Health Info": "Informações de integridade do sistema",
  Table: "Tabela",
  "Tag for: {object}": "Tag de: {object}",
  "Tag Key": "Chave da tag",
  "Tag Label": "Rótulo da tag",
  "Tag Value": "Valor da tag",
  Tags: "Tags",
  "Tags for: {object}": "Tags de: {object}",
  "Tags:": "Tags:",
  "Target Bucket": "Bucket de destino",
  "Target URL": "URL de destino",
  "The bucket selected in this deployment acts as the “source” while the configured remote deployment acts as the “target”.":
    "O bucket selecionado nesta implantação atua como “origem”, e a implantação remota configurada atua como “destino”.",
  "The file must be valid and  should have valid config values":
    "O arquivo deve ser válido e ter valores de configuração válidos",
  "The file you are trying to download has a long name.":
    "O arquivo que você está tentando baixar tem um nome longo.",
  "The following Bucket features will NOT be replicated":
    "Os seguintes recursos do bucket NÃO serão replicados",
  "The following changes are replicated to all other sites":
    "As seguintes alterações são replicadas para todos os outros sites",
  "The following URL lets you share this object without requiring a login.":
    "A URL a seguir permite compartilhar este objeto sem exigir login.",
  "The current version of this object is a delete marker and cannot be shared.":
    "A versão atual deste objeto é um marcador de exclusão e não pode ser compartilhada.",
  "The selected object version could not be found. Refresh the object list and try again.":
    "A versão selecionada do objeto não foi encontrada. Atualize a lista de objetos e tente novamente.",
  "This server does not expose object versions; only the current object can be shared.":
    "Este servidor não expõe versões de objetos; só o objeto atual pode ser compartilhado.",
  "The instance needs to be restarted for configuration changes to take effect.":
    "A instância precisa ser reiniciada para que as alterações de configuração tenham efeito.",
  "The MinIO name is used here solely to identify the origin of the source code and to describe compatibility — {notice}.":
    "O nome MinIO é usado aqui somente para identificar a origem do código-fonte e descrever a compatibilidade — {notice}.",
  "The selected users were added to the following groups.":
    "Os usuários selecionados foram adicionados aos grupos a seguir.",
  "The server is restarting.": "O servidor está reiniciando.",
  "The URL expires automatically at the earlier of your configured time ({time}) or the expiration of your current web session.":
    "A URL expira automaticamente no que ocorrer primeiro: o tempo configurado ({time}) ou o fim da sua sessão web atual.",
  "There are no Configurations yet.": "Ainda não há configurações.",
  "There are no endpoints yet.": "Ainda não há endpoints.",
  "There are no Groups with this Policy associated yet.":
    "Ainda não há grupos associados a esta política.",
  "There are no Groups yet.": "Ainda não há grupos.",
  "There are no Policies yet.": "Ainda não há políticas.",
  "There are no tags for this object": "Não há tags para este objeto",
  "There are no User Access Keys yet.":
    "Ainda não há chaves de acesso de usuário.",
  "There are no Users with this Policy associated yet.":
    "Ainda não há usuários associados a esta política.",
  "There are no Users yet.": "Ainda não há usuários.",
  "There is no information with this criteria":
    "Não há informações com esse critério",
  "There was an error": "Ocorreu um erro",
  "There was an error creating a Policy ":
    "Ocorreu um erro ao criar uma política ",
  "There was an error creating a Policy: {details}. Please check Policy syntax.":
    "Ocorreu um erro ao criar uma política: {details}. Verifique a sintaxe da política.",
  "There was an error deleting the tier": "Ocorreu um erro ao excluir a camada",
  "There was an error retrieving tier information":
    "Ocorreu um erro ao obter as informações da camada",
  "There was an error updating the Policy ":
    "Ocorreu um erro ao atualizar a política ",
  "There was an error updating the Policy: {details}. Please check Policy syntax.":
    "Ocorreu um erro ao atualizar a política: {details}. Verifique a sintaxe da política.",
  "These features are unavailable in a single-disk setup.":
    "Estes recursos não estão disponíveis em uma configuração de disco único.",
  "This action is irreversible.": "Esta ação é irreversível.",
  "This can cause issues on Windows Systems by trimming the file name after download.":
    "Isso pode causar problemas em sistemas Windows, cortando o nome do arquivo após o download.",
  "This configuration cannot be deleted using this module as this was set using OpenID environment variables.":
    "Esta configuração não pode ser excluída neste módulo porque foi definida com variáveis de ambiente OpenID.",
  "this Console": "este Console",
  "This feature allows multiple independent SILO sites (or clusters) that are using the same external IDentity Provider (IDP) to be configured as replicas. In this situation the set of replica sites are referred to as peer sites or just sites.":
    "Este recurso permite configurar como réplicas vários sites (ou clusters) independentes do SILO que usam o mesmo provedor de identidade (IDP) externo. Nesse caso, o conjunto de sites de réplica é chamado de sites pares ou apenas sites.",
  "This feature is not available for a single-disk setup.":
    "Este recurso não está disponível em uma configuração de disco único.",
  "This feature is not available.": "Este recurso não está disponível.",
  "This field is required": "Este campo é obrigatório",
  "This is a File Preview for the first {count} pages of the document, if you wish to work with the full document please download instead.":
    "Esta é uma pré-visualização das primeiras {count} páginas do documento. Para trabalhar com o documento completo, faça o download.",
  "This location is empty": "Este local está vazio",
  "This location is empty, please try uploading a new file":
    "Este local está vazio. Tente enviar um novo arquivo",
  "This Site": "Este site",
  "This site/cluster": "Este site/cluster",
  "This Usage value is comparable to {command} which represents the size of all object versions that exist in the buckets.":
    "Este valor de uso é comparável a {command}, que representa o tamanho de todas as versões de objetos existentes nos buckets.",
  "This value is set from the {env} environment variable":
    "Este valor é definido pela variável de ambiente {env}",
  "This value is set from the {name} environment variable":
    "Este valor é definido pela variável de ambiente {name}",
  "This will be displayed only once. It cannot be recovered.":
    "Isto será exibido apenas uma vez. Não poderá ser recuperado.",
  "This will change your Console password. Please note your new password down, as it will be required to log into Console after this session.":
    "Isto alterará sua senha do Console. Anote a nova senha, pois ela será necessária para entrar no Console após esta sessão.",
  "This will remove the object as well as all of its versions,":
    "Isto removerá o objeto e todas as suas versões,",
  "This will remove the objects as well as all of their versions,":
    "Isto removerá os objetos e todas as suas versões,",
  Tier: "Camada",
  "Tier Name": "Nome da camada",
  "Tier Types": "Tipos de camada",
  "Tiers are used by the SILO Object Lifecycle Management which allows creating rules for time or date based automatic transition or expiry of objects. For object transition, SILO automatically moves the object to a configured remote storage tier.":
    "As camadas são usadas pelo gerenciamento do ciclo de vida de objetos do SILO, que permite criar regras de transição ou expiração automática de objetos com base em tempo ou data. Na transição, o SILO move automaticamente o objeto para uma camada de armazenamento remota configurada.",
  "Time duration between scanner cycles, defaults to '1m'":
    "Tempo entre os ciclos do scanner; o padrão é '1m'",
  "Time to Response NS": "Tempo de resposta em NS",
  Timestamp: "Data e hora",
  "TLS Client Auth": "TLS Client Auth",
  "TLS skip verify": "Ignorar verificação TLS",
  "TLS Skip Verify": "Ignorar verificação TLS",
  "To allow Bucket access without credentials, use the {anonymous} setting":
    "Para permitir o acesso ao bucket sem credenciais, use a opção {anonymous}",
  "To continue please type {phrase} in the box.":
    "Para continuar, digite {phrase} na caixa.",
  "To enable this feature you need to enable versioning on the bucket before creation":
    "Para ativar este recurso, você precisa ativar o versionamento no bucket antes da criação",
  "To Tier": "Para a camada",
  "Today, {time}": "Hoje, {time}",
  "Toggle Share URL between Console and object server URL. Change default with CONSOLE_SHARE_MINIO_URL environment variable":
    "Alterna a URL de compartilhamento entre o Console e a URL do servidor de objetos. Altere o padrão com a variável de ambiente CONSOLE_SHARE_MINIO_URL",
  Token: "Token",
  "Toogle JSON": "Alternar JSON",
  "Toogle Share URL": "Alternar URL de compartilhamento",
  Topic: "Tópico",
  "Trace Results": "Resultados do rastreamento",
  "trademark notice": "aviso de marca registrada",
  Transition: "Transição",
  "Transition Days": "Dias até a transição",
  True: "Verdadeiro",
  "Trust server TLS without verification":
    "Confiar no TLS do servidor sem verificação",
  'Trust server TLS without verification, defaults to "on" (verify)':
    'Confiar no TLS do servidor sem verificação; o padrão é "on" (verificar)',
  Type: "Tipo",
  "Type New Password Again": "Digite a nova senha novamente",
  "Type of Lifecycle": "Tipo de ciclo de vida",
  "Types to profile:": "Tipos a analisar:",
  "Unable to download widget data":
    "Não foi possível baixar os dados do widget",
  "Unable to download widget data - data not available":
    "Não foi possível baixar os dados do widget - dados indisponíveis",
  "Under section 13 of the AGPL, the corresponding source for this running version is offered to every user who interacts with it over a network, at no charge.":
    "Nos termos da seção 13 da AGPL, o código-fonte correspondente desta versão em execução é oferecido gratuitamente a todo usuário que interagir com ela pela rede.",
  "Understand which {policies} and {users} are authorized to access this Bucket.":
    "Entenda quais {policies} e {users} têm autorização para acessar este bucket.",
  "Unexpected response, download incomplete.":
    "Resposta inesperada, download incompleto.",
  Unhealthy: "Com problemas",
  "Unique descriptive string for this destination":
    "Texto descritivo único para este destino",
  "Unique ID for NATS streaming cluster":
    "ID único do cluster de streaming do NATS",
  "Update Credentials - {type} / {name}":
    "Atualizar credenciais - {type} / {name}",
  "Upload File": "Enviar arquivo",
  "Upload Files": "Enviar arquivos",
  "upload files to this bucket": "enviar arquivos para este bucket",
  "Upload Folder": "Enviar pasta",
  "Upload is restricted.": "O envio está restrito.",
  "Upload not allowed": "Envio não permitido",
  "upload objects to this location": "enviar objetos para este local",
  "Upstream copyright, authorship and license notices are retained in the repository's {credits} and {notice}. See the {attribution}.":
    "Os avisos de direitos autorais, autoria e licença do projeto original são mantidos em {credits} e {notice} do repositório. Veja a {attribution}.",
  "upstream MinIO code": "código do MinIO original",
  "Usage Data Age": "Idade dos dados de uso",
  "Usage:": "Uso:",
  "Use Original Name": "Usar nome original",
  "Use SASL": "Usar SASL",
  "Use secure medium to share this key.":
    "Use um meio seguro para compartilhar esta chave.",
  "Use TLS": "Usar TLS",
  "Used to confirm a non-idempotent action.":
    "Usado para confirmar uma ação não idempotente.",
  "User Access Keys": "Chaves de acesso do usuário",
  "User Agent": "User agent",
  "User Details - {user}": "Detalhes do usuário - {user}",
  "User DN Search Base DN is required":
    "O DN base de pesquisa de usuários é obrigatório",
  "User DN Search Filter is required":
    "O filtro de pesquisa do DN de usuário é obrigatório",
  "User Mappings": "Mapeamentos de usuário",
  "User Name": "Nome de usuário",
  "Username for SASL/PLAIN or SASL/SCRAM authentication":
    "Nome de usuário para autenticação SASL/PLAIN ou SASL/SCRAM",
  "Users inherit access permissions to data and resources through the groups they belong to.":
    "Os usuários herdam permissões de acesso a dados e recursos por meio dos grupos a que pertencem.",
  "Users with this Policy associated": "Usuários associados a esta política",
  Validity: "Validade",
  "Validity:": "Validade:",
  Version: "Versão",
  "Version ID:": "ID da versão:",
  "Versioning is required to enable {objectLocking} and {retention}.":
    "O versionamento é obrigatório para ativar {objectLocking} e {retention}.",
  "Versioning on Bucket": "Versionamento no bucket",
  "Versioning setting cannot be changed as cluster replication is enabled for this site.":
    "O ajuste de versionamento não pode ser alterado porque a replicação de cluster está ativada neste site.",
  "Versioning Status": "Status do versionamento",
  versions: "versões",
  Versions: "Versões",
  "Versions:": "Versões:",
  View: "Ver",
  "View across sites": "Ver entre sites",
  "View Bucket Naming Rules": "Ver regras de nomes de bucket",
  "View env variable Webhook": "Ver webhook de variável de ambiente",
  "view Objects in this bucket": "ver objetos neste bucket",
  "view Policy details": "ver detalhes da política",
  "View Replication Status for a:": "Ver status da replicação de um:",
  "view User details": "ver detalhes do usuário",
  "Visit the SILO website": "Acesse o site do SILO",
  "Volume or Bucket Name": "Nome do volume ou bucket",
  "Volume/Bucket name cannot start with /":
    "O nome do volume/bucket não pode começar com /",
  Warning: "Aviso",
  "Warning: One or more users selected has associated Access Keys.":
    "Aviso: um ou mais usuários selecionados têm chaves de acesso associadas.",
  "Warning! The resulting file will contain server configuration information in plain text":
    "Aviso! O arquivo resultante conterá informações de configuração do servidor em texto simples",
  "We recommend to rename the file download":
    "Recomendamos renomear o arquivo baixado",
  "Webhook server endpoint e.g. http://localhost:8080/silo/events":
    "Endpoint do servidor de webhook, por exemplo http://localhost:8080/silo/events",
  week: "semana",
  weeks: "semanas",
  "What are Event Destinations?": "O que são destinos de eventos?",
  "Would you like to encrypt {object}?": "Deseja criptografar {object}?",
  "Write Policy": "Política de escrita",
  "Write these down, as this is the only time the secret will be displayed.":
    "Anote estes dados, pois esta é a única vez que o segredo será exibido.",
  writeonly: "somente escrita",
  year: "ano",
  years: "anos",
  Years: "Anos",
  Yes: "Sim",
  "Yes, I am sure": "Sim, tenho certeza",
  "You can add a comment to this setting":
    "Você pode adicionar um comentário a este ajuste",
  "You can add policies to the group by selecting it from the Groups view after creation. The Policy view lets you manage the assigned policies for the group.":
    "Você pode adicionar políticas ao grupo selecionando-o na visualização de grupos após a criação. A visualização de políticas permite gerenciar as políticas atribuídas ao grupo.",
  "You can choose to {excludePrefixes} from versioning if Object Locking is not enabled.":
    "Você pode optar por {excludePrefixes} do versionamento se o bloqueio de objetos não estiver ativado.",
  "You can download the the Health report JSON File.":
    "Você pode baixar o arquivo JSON do relatório de integridade.",
  "You can increase the maximum configuration time by setting the MINIO_STS_DURATION environment variable on all your nodes.":
    "Você pode aumentar o tempo máximo configurável definindo a variável de ambiente MINIO_STS_DURATION em todos os seus nós.",
  "You can learn more at the {documentation}.":
    "Saiba mais na {documentation}.",
  "You can learn more at the {link}.": "Saiba mais em {link}.",
  "You can only enable {objectLocking} when first creating a bucket.":
    "Você só pode ativar {objectLocking} ao criar um bucket.",
  "You can reset your session by logging out and logging back in to the web UI.":
    "Você pode redefinir sua sessão saindo e entrando novamente na interface web.",
  "You can specify an optional JSON-formatted IAM policy to further restrict Access Key access to a subset of the actions and resources explicitly allowed for the parent user. Additional access beyond that of the parent user cannot be implemented through these policies.":
    "Você pode especificar uma política IAM opcional em JSON para restringir ainda mais o acesso da chave de acesso a um subconjunto das ações e dos recursos permitidos explicitamente ao usuário pai. Essas políticas não podem conceder acesso além do que o usuário pai já tem.",
  "You can use '*' to match any character, '.' to signify a single character or '\\' to scape an special character (E.g. mybucket-*)":
    "Você pode usar '*' para corresponder a qualquer caractere, '.' para indicar um único caractere ou '\\' para escapar um caractere especial (ex.: mybucket-*)",
  "You can use {mcShare} as an alternative to this UI, where the session length does not limit the URL validity.":
    "Você pode usar {mcShare} como alternativa a esta interface, caso em que a duração da sessão não limita a validade da URL.",
  "You cannot delete the currently logged in User":
    "Você não pode excluir o usuário conectado",
  "You cannot enable or disable the currently logged in User":
    "Você não pode ativar nem desativar o usuário conectado",
  "You cannot modify the optional Access Key IAM policy after saving.":
    "Você não pode modificar a política IAM opcional da chave de acesso depois de salvar.",
  "You may only have write access on a limited set of subpaths within this path. Please carefully review your User permissions to understand the paths to which you may write.":
    "Você pode ter acesso de escrita apenas em um conjunto limitado de subcaminhos deste caminho. Revise com atenção as permissões do seu usuário para entender em quais caminhos pode escrever.",
  "You must apply a valid name to the bucket":
    "Você precisa informar um nome válido para o bucket",
  "You must disable Object Locking before Versioning can be disabled":
    "Você precisa desativar o bloqueio de objetos antes de desativar o versionamento",
  "You must disable Retention before Object Locking can be disabled":
    "Você precisa desativar a retenção antes de desativar o bloqueio de objetos",
  "You need to select at least one group to assign":
    "Você precisa selecionar pelo menos um grupo para atribuir",
  "You require additional permissions in order to {name}. Please ask your SILO administrator to grant you {scopes} permission in order to {name}.":
    "Você precisa de permissões adicionais para {name}. Peça ao seu administrador do SILO que conceda a permissão {scopes} para {name}.",
  "You require additional permissions in order to {name}. Please ask your SILO administrator to grant you {scopes} permissions in order to {name}.":
    "Você precisa de permissões adicionais para {name}. Peça ao seu administrador do SILO que conceda as permissões {scopes} para {name}.",
  "You require additional permissions in order to create a new Tier. Please ask your SILO administrator to grant you {permission} permission in order to create a Tier.":
    "Você precisa de permissões adicionais para criar uma nova camada. Peça ao seu administrador do SILO que conceda a permissão {permission} para criar uma camada.",
  "File is empty": "O arquivo está vazio",
  "Invalid UTF-8 or binary content": "UTF-8 inválido ou conteúdo binário",
  "Loading text preview…": "Carregando pré-visualização de texto…",
  "Object not found or changed": "Objeto não encontrado ou alterado",
  "Text preview content": "Conteúdo da pré-visualização de texto",
  "Text preview failed": "Falha na pré-visualização de texto",
  "Text preview forbidden": "Pré-visualização de texto proibida",
  "The object could not be found or changed while the preview was loading.":
    "O objeto não foi encontrado ou foi alterado enquanto a pré-visualização carregava.",
  "The text preview could not be loaded because of a network or server error.":
    "Não foi possível carregar a pré-visualização de texto por causa de um erro de rede ou do servidor.",
  "This object is not valid UTF-8 text or contains binary data. Download it to inspect the original bytes.":
    "Este objeto não é um texto UTF-8 válido ou contém dados binários. Baixe-o para inspecionar os bytes originais.",
  "You do not have permission to preview this object.":
    "Você não tem permissão para pré-visualizar este objeto.",
  Trademark: "Marca registrada",
  License: "Licença",
  "Corresponding source for this build":
    "Código-fonte correspondente desta compilação",
  "The exact corresponding source is not available for this build: {reason}. See the NOTICE for how to obtain it.":
    "O código-fonte correspondente exato não está disponível para esta compilação: {reason}. Veja no NOTICE como obtê-lo.",
  "Source: not available for this build":
    "Código-fonte: não disponível para esta compilação",
  "Items per page": "Itens por página",
  "First page": "Primeira página",
  "Previous page": "Página anterior",
  "Next page": "Próxima página",
  "{count} items in total": "{count} itens no total",
  "Page {page} · {count} on this page": "Página {page} · {count} nesta página",
  "Sorting, filtering and select all apply to this page only.":
    "Ordenação, filtro e selecionar tudo se aplicam apenas a esta página.",
  "No objects match the filter": "Nenhum objeto corresponde ao filtro",
  "No objects on this page match the filter":
    "Nenhum objeto desta página corresponde ao filtro",
  "Showing the first {count} entries; the listing stopped at the row or time limit.":
    "Exibindo as primeiras {count} entradas; a listagem parou no limite de linhas ou de tempo.",
  "Start typing to filter objects on this page":
    "Comece a digitar para filtrar objetos nesta página",
  "Lists and tabs": "Listas e abas",
  "Move through rows with the pointer or keyboard. Arrow keys focus tabs; Enter or Space opens them.":
    "Mova-se pelas linhas com o ponteiro ou o teclado. As setas focam as abas; Enter ou Espaço as abre.",
  "Browse and select stored objects.":
    "Navegue pelos objetos armazenados e selecione-os.",
  "Review stored object versions.":
    "Revise as versões dos objetos armazenados.",
  "Manage bucket settings.": "Gerencie os ajustes do bucket.",
  "Compact section tabs": "Abas compactas de seção",
  "Storage and object usage": "Uso de armazenamento e objetos",
  "Recent storage activity": "Atividade recente de armazenamento",
  "Example buckets": "Buckets de exemplo",
  "Select all objects": "Selecionar todos os objetos",
  Select: "Selecionar",
  Settings: "Ajustes",
  Overview: "Visão geral",
  Activity: "Atividade",
  "No matching results": "Nenhum resultado correspondente",
  "Try a different search or clear the filters to see all items.":
    "Tente outra pesquisa ou limpe os filtros para ver todos os itens.",
  "Clear filters": "Limpar filtros",
  "No users yet": "Ainda não há usuários",
  "Users authenticate with an access key and secret key, and receive permissions through policies and groups.":
    "Os usuários se autenticam com uma chave de acesso e uma chave secreta e recebem permissões por meio de políticas e grupos.",
  "Create user": "Criar usuário",
  "No access keys yet": "Ainda não há chaves de acesso",
  "Access keys let applications connect with the permissions of your account.":
    "As chaves de acesso permitem que aplicações se conectem com as permissões da sua conta.",
  "Access keys let applications connect with the permissions assigned to this user.":
    "As chaves de acesso permitem que aplicações se conectem com as permissões atribuídas a este usuário.",
  "No groups assigned": "Nenhum grupo atribuído",
  "Add this user to a group to share its access policies.":
    "Adicione este usuário a um grupo para compartilhar as políticas de acesso dele.",
  "No policies assigned": "Nenhuma política atribuída",
  "Policies define which actions and resources this user can access.":
    "As políticas definem quais ações e recursos este usuário pode acessar.",
  "No members yet": "Ainda não há membros",
  "Add users to this group so they inherit its policies.":
    "Adicione usuários a este grupo para que herdem as políticas dele.",
  "Policies attached to this group apply to all its members.":
    "As políticas anexadas a este grupo se aplicam a todos os membros.",
  "No encryption keys yet": "Ainda não há chaves de criptografia",
  "Create a key to encrypt objects with the configured key management service.":
    "Crie uma chave para criptografar objetos com o serviço de gerenciamento de chaves configurado.",
  "No groups yet": "Ainda não há grupos",
  "Groups let users share the same access policies.":
    "Os grupos permitem que usuários compartilhem as mesmas políticas de acesso.",
  "No event destinations yet": "Ainda não há destinos de eventos",
  "Connect an external service to receive bucket and object notifications.":
    "Conecte um serviço externo para receber notificações de buckets e objetos.",
  "No storage tiers yet": "Ainda não há camadas de armazenamento",
  "Connect remote storage to transition objects using lifecycle rules.":
    "Conecte um armazenamento remoto para fazer a transição de objetos com regras de ciclo de vida.",
  "No event subscriptions yet": "Ainda não há assinaturas de eventos",
  "Subscribe this bucket to send object events to an event destination.":
    "Assine eventos neste bucket para enviar eventos de objetos a um destino de eventos.",
  "No replication rules yet": "Ainda não há regras de replicação",
  "Replicate objects from this bucket to a destination bucket.":
    "Replique objetos deste bucket para um bucket de destino.",
  "No lifecycle rules yet": "Ainda não há regras de ciclo de vida",
  "Create rules to expire objects or transition them to remote storage.":
    "Crie regras para expirar objetos ou fazer a transição deles para um armazenamento remoto.",
  "No anonymous access rules": "Nenhuma regra de acesso anônimo",
  "This bucket has no prefix rules for access without credentials.":
    "Este bucket não tem regras de prefixo para acesso sem credenciais.",
  "No policies grant access": "Nenhuma política concede acesso",
  "No listed policy currently grants access to this bucket.":
    "Nenhuma política listada concede acesso a este bucket no momento.",
  "No users have access": "Nenhum usuário tem acesso",
  "No listed user currently has a policy granting access to this bucket.":
    "Nenhum usuário listado tem, no momento, uma política que conceda acesso a este bucket.",
  "View Policies": "Ver políticas",
  "View Users": "Ver usuários",
  "Unable to load replication sites":
    "Não foi possível carregar os sites de replicação",
  "No replication sites yet": "Ainda não há sites de replicação",
  "Refresh to try loading the configured sites again.":
    "Atualize para tentar carregar os sites configurados novamente.",
  "Connect independent SILO sites to replicate their data and identity configuration.":
    "Conecte sites independentes do SILO para replicar seus dados e sua configuração de identidade.",
  "Waiting for logs": "Aguardando logs",
  "Logs are not running": "Os logs não estão em execução",
  "New log entries will appear here as the server emits them.":
    "Novas entradas de log aparecerão aqui à medida que o servidor as emitir.",
  "Choose the nodes and log types, then start logs to see server activity.":
    "Escolha os nós e os tipos de log e inicie os logs para ver a atividade do servidor.",
  "Waiting for trace events": "Aguardando eventos de rastreamento",
  "Trace is not running": "O rastreamento não está em execução",
  "Requests matching the selected calls and filters will appear here.":
    "As requisições que correspondem às chamadas e aos filtros selecionados aparecerão aqui.",
  "Choose the calls and filters, then start tracing to inspect live requests.":
    "Escolha as chamadas e os filtros e inicie o rastreamento para inspecionar requisições ao vivo.",
  "{count} node": "{count} nó",
  "{count} nodes": "{count} nós",
  "{count} drive": "{count} disco",
  "{count} drives": "{count} discos",
  "Quota: {quota}": "Cota: {quota}",
  "Open bucket {name}": "Abrir bucket {name}",
  "Recent buckets": "Buckets recentes",
  "Read and write": "Leitura e escrita",
  "Read only": "Somente leitura",
  "Write only": "Somente escrita",
  "Created {date}": "Criado em {date}",
  "{count} objects": "{count} objetos",
  "Bucket actions": "Ações do bucket",
  "Open menu": "Abrir menu",
  "Page actions": "Ações da página",
  "Selected actions": "Ações da seleção",
  "Parent paths": "Caminhos superiores",
  "create Groups": "criar grupos",
  "view Group details": "ver detalhes do grupo",
  "configure event destinations": "configurar destinos de eventos",
  "update Tier credentials": "atualizar credenciais de camada",
  "delete Tiers": "excluir camadas",
  "manage Access Keys": "gerenciar chaves de acesso",
};
