# Docs

More documentation to read

- [OIDC](OIDC.md)
- [LDAP](ldap/LDAP.md)
- [systemd](../systemd/README.md)
- [TLS](TLS.md)
- [Debug Logging](Debug.md)
- [Environment Variables](Environment.md)
- [Object Browser](ObjectBrowser.md)
- [Embedding Console in SILO](Embedding.md)
- [Release procedure](Release.md)
- **Development**
    - [DEVELOPMENT](../DEVELOPMENT.md)
    - [Frontend Web App](../web-app/README.md)
    - [CONTRIBUTING](../CONTRIBUTING.md)

### Share Option
The compatibility environment variable `CONSOLE_SHARE_MINIO_URL=on` changes
the default shared-object URL from the Console URL to the configured SILO or
MinIO-compatible server URL when the Console endpoint is not exposed. The UI
also provides a toggle between the two.

## FAQ

### How do I log in?
Console uses the same users as the configured SILO or MinIO-compatible server;
it passes the credentials you enter to that server.

These are the users shown by the `mc` command below, including an administrator
configured on the object-storage server.
``` bash
mc admin user ls
```
These are NOT the access keys that every users can create themselves and you will get with
``` bash
mc admin accesskey ls
```

### Cant login, get error wrong region?
``` bash
ErrorWithContext:The authorization header is malformed; the region is wrong; expecting 'us-east-1'.
%!(EXTRA *errors.errorString=invalid login)
```
Set `CONSOLE_MINIO_REGION` to the same region configured on the object-storage server:
``` bash
export CONSOLE_MINIO_REGION=eu-central-1
export CONSOLE_MINIO_SERVER=http://localhost:9000
./console server
```
You can query the configured region with:
``` bash
mc admin config get ALIAS region
```

### Does OIDC works?
Yes, see docs [OIDC](OIDC.md).

### Docker Volume Mount?
Console stores no persistent data of its own; it is configured with environment
variables. The only required value is the SILO or MinIO-compatible server URL,
using the retained compatibility variable `CONSOLE_MINIO_SERVER`.

### Can I use this Console as S3 Browser for other S3 Provider?
No. This Console requires the MinIO-compatible administration APIs implemented
by SILO/MinIO; generic S3 API compatibility alone is not enough.
```
silo-console-1  | ErrorWithContext:The s3 command you requested is not implemented.
silo-console-1  | %!(EXTRA *errors.errorString=invalid login)
```
