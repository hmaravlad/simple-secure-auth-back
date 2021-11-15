# Password storage security report

## Hashing
**Argon2id** is used for hashing with a configuration of 15 MiB of memory, an iteration count of 2, and 1 degree of parallelism as [recommended](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#argon2id).

Function crypto.randomBytes() is used for generating salt.

Password hashes are compared with secure functions.

Also hashing scheme versioning was implemented to make changes in hashing easier. If new version is out old hashes are hashed one more time using new hashing, and if user logs in we replace hash of hash of password with hash of password.

## Password requirements
- Minimum length - 8
- Maximum length - 64 (i considered using pre-hashing to solve issues maximum length solves, but it is [not recommended](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#pre-hashing-passwords))
- Character set is unlimited
- Very popular passwords are not allowed

## Other security measures
- Limiting number of failed login attempts for protection from various automated attacks.