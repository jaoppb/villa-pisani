# Caso de Uso Cadastrar no Sistema

## Precondições

1. O usuário que está tentando se cadastrar deve ser um morador, sindíco ou funcionário do condomínio.

## Fluxo Principal

1. O caso de uso se inicia quando o usuário deseja se cadastrar no sistema.
2. O usuário insere seus dados: nome, email, senha e data de nascimento (opcional).
3. O sistema verifica se o usuário já está cadastrado.
4. O sistema verifica a força da senha.
5. O sistema criptografa a senha.
6. O sistema designa ao usuário o cargo de morador.
7. O sistema armazena os dados recebidos, o(s) cargo(s) e a senha criptografada.
8. Caso de uso encerrado.

## Fluxos Alternativos

### Fluxo Alternativo Usuário já Cadastrado

Precondições:

1. Existe um cadastro no banco de dados com o mesmo e-mail.

Passos:

1. Se no passo 3 o sistema encontrar um usuário com o mesmo e-mail ele informa que o cadastro não foi possível de ser realizado.
2. Caso de uso encerrado.

### Fluxo Alternativo Senha Fraca

Precondições:

1. A senha inserida pelo usuário é fraca.

Passos:

1. Se no passo 4 o sistema julgar que a senha não é forte o suficiente ele informa que a senha inserida é muito fraca.
2. Caso de uso encerrado.