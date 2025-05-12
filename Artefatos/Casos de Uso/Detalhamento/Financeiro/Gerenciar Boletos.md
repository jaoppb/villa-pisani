# Descrição de Caso de Uso

Nome do Caso de Uso: Gerenciar Boletos \
ID: ?? \
Ator Primário: Sindíco \
Ator Secundário: Morador \
Sumário: Permite que o sindíco consiga criar, atualizar a apagar boletos que eventualmente serão pagos pelos moradores.

## Precondições

1. Estar logado como Sindíco

## Fluxo Principal

1. Exibir tela com os boletos existentes
2. Realizar ação (criar, alterar, deletar), escolhida pelo sindíco, sobre os boletos
3. Notificar morador da alteração
4. Mostrar na tela o resultado da operação

## Fluxos Alternativos

### Fluxo Alternativo Registrar Boleto

Precondições:

1. Sindíco requisitar a criação de um novo boleto

Passos:

1. Validar as informações recebidas
2. Enviar requisição ao gateway de pagamento
3. Retornar para o fluxo principal

Póscondições:

1. Novo boletado criado no gateway de pagamento
2. Informações extras salvas no banco de dados

### Fluxo Alternativo Alterar Boleto

Precondições:

1. Sindíco requisitar a alteração de um boleto
2. Boleto existir no banco de dados
3. Boleto não ter sido pago por nenhum morador

Passos:

1. Validar informações recebidas
2. Enviar requisição ao gateway de pagamento
3. Retornar para o fluxo principal

Póscondições:

1. Boleto salvo com as novas informações

### Fluxo Alternativo Apagar Boleto

Precondições:

1. Sindíco requisitar a alteração de um boleto
2. Boleto existir no banco de dados
3. Boleto não ter sido pago por nenhum morador

Passos:

1. Enviar requisição ao gateway de pagamento
2. Retornar para o fluxo principal

Póscondições:

1. Boleto deletado do gateway de pagamento
2. Informações extras deletadas do banco de dados

## Póscondições

1. ???