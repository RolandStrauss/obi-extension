# RPGLE Development Instructions (IBM i 7.6)

## Standards
- Use **free-form RPG** exclusively; avoid fixed-format.
- Enforce **DATEYY(*NOALLOW)** to prevent 2-digit year usage.
- Adopt **modular design** with service programs and procedures.
- Integrate **Db2 for i SQL** directly in RPGLE using embedded SQL.
- Apply **AI-assisted code analysis** (Watsonx Code Assistant for RPG).
- Use **Code for IBM i VS Code extension** for compilation and linting.

## Security
- Ensure programs run at **security level 40+**.
- Apply **least privilege** for special authorities.
- Use **exit programs** for access control.
- Enable **MFA with TOTP** for user profiles.

## Modernization
- Refactor legacy RPG with **Watsonx Code Assistant**.
- Expose RPG logic via **REST APIs** (e.g., RPG API Express).
- Support hybrid stacks: **RPG + Node.js/Python via PASE**.
- Adopt **DevOps workflows**: GitHub Actions, Jenkins, CI/CD pipelines.

## Best Practices
- Automate repetitive tasks with APIs.
- Use **audit journaling** and **IFS malware scanning**.
- Document dependencies with AI-driven mapping tools.