## Layout sugerido

![Layout da lista de entregas](../images/Entrega-Unico.png)
![Layout da Criar encomenda](../images/confirma-entrega.png)
![Layout da Criar encomenda](../images/entregar-encomenda.png)

## Campos

| Numero | Nome               | Descrição                             | Valores Validos | Formato        | Tipo   | Restrições                    |
| ------ | ------------------ | ------------------------------------- | --------------- | -------------- | ------ | ----------------------------- |
| 01     | Quem foi entrege   | O nome para quem da casa foi entregue | Alfabetos alfa  | caixa de texto | String | Maior ou igual a 3 caracteres |
| 02     | comfirma encomenda | confima a entrega da encomeda         | bollean         | botao          | bool   | Nemnhum                       |

# Comandos

| Numero | Nome                           | Ação                                                    | Restrição                                                                               |
| ------ | ------------------------------ | ------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 01     | Abri modal(entregar encomenda) | Abri o modal para registra quem foi entregue a encomeda | O usuario ser um adminsitrador ou um funcionario e encomdda esteja no estado 'recebido' |
