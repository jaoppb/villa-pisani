# Caso de Uso Validar Token

## Precondições

1. O usuário já está cadastrado.
2. O usuário têm o token de autenticação.

## Fluxo Principal

1. O caso de uso se inicia com qualquer outro caso de uso que precise do usuário autenticado.
2. O sistema recebe o token de autenticação em formato JWT.
3. O sistema verifica se o token é válido.
4. O sistema verifica se o usuário tem o(s) cargo(s) necessários para a operação.
5. O sistema autoriza a operação.
6. Caso de uso encerrado.

## Fluxos Alternativos

### Fluxo Alternativo Token Inválido

Precondições:

1. O token recebido é inválido.

Passos:

1. Se no passo 3 o sistema não conseguir validar o token ou julgar o token inválido, ele retorna um erro de acesso negado.
2. Caso de uso encerrado.

### Fluxo Alternativo Permissão Insuficiente

Precondições

1. A operação precisa de um usuário com cargo especifíco.

Passos:

1. Se no passo 4 o(s) cargo(s) forem insuficientes o sistema retorna um erro de acesso negado.
2. Caso de uso encerrado.