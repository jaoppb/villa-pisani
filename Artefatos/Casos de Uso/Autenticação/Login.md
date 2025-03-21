# Caso de Uso Logar no Sistema

## Precondições

1. Usuário estar cadastrado

## Fluxo Principal

1. O caso de uso se inicia quando o usuário deseja acessar alguma parte do sistema protegida por autenticação.
2. O usuário insere suas credenciais: e-mail e senha.
3. O sistema verifica se o usuário existe.
4. O sistema verifica a senha informada com a armazenada.
5. O usuário recebe o Token de autenticação.
6. Caso de uso encerrado.

## Fluxos Alternativos

### Fluxo Alternativo Usuário Não Encontrado

Precondições:

1. O e-mail inserido não é encontrado no banco de dados

Passos:

1. Se no passo 3 do fluxo principal o usuário não é encontrado, o sistema informa ao usuário que a tentativa de login não é válida.
2. Caso de uso encerrado.

### Fluxo Alternativo Senha Inválida

Precondições:

1. A senha inserida não retorna o mesmo hash que a senha cadastrada.

Passos:

1. Se no passo 4 do fluxo principal a senha não é considerada válida, o sistema informa ao usuário que a tentiva de login não é válida.
2. Caso de uso encerrado.