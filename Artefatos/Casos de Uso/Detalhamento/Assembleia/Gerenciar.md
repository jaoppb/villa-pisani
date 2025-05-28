# Descrição de Caso de Uso

Nome do Caso de Uso: Gerenciar Assembleias \
ID: ? \
Ator Primário: Sindíco \
Ator(es) Secundário(s): N/A \
Sumário: Funcionalidade para permitir que o sindíco faça o upload das ATAs de assembleia

## Precondições

1. Sindíco logado

## Fluxo Principal

1. Exibir tela com as assembleias existentes
2. Realizar ação (registar, alterar, deletar), escolhida pelo sindíco, sobre as assembleias
3. Mostrar na tela o resultado da operação

## Fluxos Alternativos

### Fluxo Alternativo Registrar Assembleia

Passos:

1. Soliciar o anexo e a data da assembleia
2. Validar arquivo (tipo pdf, tamanho máximo de 200MB)
3. Salvar no banco de dados a data
4. Salvar no sistema o arquivo
5. Retornar para o fluxo principal no passo 3

### Póscondições

1. Informações da assembleia salvas no banco de dados
2. Arquivo da assembleia salva no sistema

### Fluxo Alternativo Alterar Assembleia

Precondições:

1. Existe assembleias registradas no sistema

Passos:

1. Solicitar qual assembleia que se deseja alterar
2. Solicitar o arquivo e a data da assembleia, todos opcionais, alterando somento o que for passado
3. Salvar as informações no banco de dados
4. Caso tenha sido recebido, salvar o novo anexo no sistema
5. Retornar para o fluxo principal no passo 3

### Póscondições

1. Informações alteradas da assembleia salvas no banco de dados
2. Arquivo alterado da assembleia salva no sistema

### Fluxo Alternativo Deletar Assembleia

Precondições:

1. Existe assembleias registradas no sistema

Passos:

1. Solicitar qual assembleia que se deseja remover
2. Apagar as informações do banco de dados
3. Apagar o arquivo do sistem
4. Retornar para o fluxo principal no passo 3

### Póscondições

1. Informações da assembleia removidas do banco de dados
2. Arquivo da assembleia removida do sistema