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
2. Realizar ação (emitir, deletar), escolhida pelo sindíco, sobre os boletos
3. Notificar morador da alteração
4. Mostrar na tela o resultado da operação

## Fluxos Alternativos

### Fluxo Alternativo Registrar Boleto

Precondições:

1. Sindíco requisitar a criação de um novo boleto

Passos:

1. Validar as informações recebidas: valor (entre 5 e 49.999,99), vencimento (data), referencia (mês)
2. Enviar requisição ao gateway de pagamento
3. Salvar o boleto (pdf) recebido no servidor (see ExpenseFile)
4. Retornar para o fluxo principal no passo 3

Póscondições:

1. Novo boletado criado no gateway de pagamento
2. Arquivo do boleto salvo no servidor
3. Informações extras salvas no banco de dados

### Fluxo Alternativo Erro (Requisição) Registrando Boleto

Precondições:

1. Erro no fluxo de registrar boleto
2. Erro na requisição feita ao gateway de pagamento

Passos:

1. Mostrar na tela a mensagem do erro que ocorreu

### Fluxo Alternativo Erro (Salvar Arquivo) Registrando Boleto

Precondições:

1. Erro no fluxo de registrar boleto
2. Erro ao salvar o arquivo no servidor

Passos:

1. Mostrar na tela uma mensagem informando que houve uma falha ao salvar o arquivo recebido e que o sistema irá tentar apagar o boleto gerado no gateway automaticamente
2. Enviar requisição de apagar ao gateway de pagamento

### Fluxo Alternativo Apagar Boleto

Precondições:

1. Sindíco requisitar a remoção de um boleto
2. Boleto existir no banco de dados
3. Boleto não ter sido pago pelo morador

Passos:

1. Enviar requisição ao gateway de pagamento
2. Apagar arquivo (pdf) salvo no sistema
3. Retornar para o fluxo principal no passo 3

Póscondições:

1. Boleto deletado do gateway de pagamento
2. Arquivo do boleto deletado do servidor
3. Informações extras deletadas do banco de dados

### Fluxo Alternativo Erro (Requisição) Apagando Boleto

Precondições:

1. Erro no fluxo de apagar boleto
2. Erro na requisição de apagar o boleto

Passos:

1. Mostrar na tela a mensagem do erro que ocorreu

### Fluxo Alternativo Erro (Apagar Arquivo) Apagando Boleto

Precondições:

1. Erro no fluxo de apagar boleto
2. Erro ao apagar o arquivo do boleto no servidor

Passos:

1. Mostrar na tela uma mensagem informando que o boleto foi deletado com sucesso do gateway de pagamentos, porém o arquivo não foi possível de ser apagado do servidor