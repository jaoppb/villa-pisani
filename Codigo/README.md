# Código do projeto

[Código do front-end](../Codigo/frontend/) -- Repositório do código do front-end

[Código do back-end](../Codigo/backend/) -- Repositório do código do back-end

[Configuração AWS](../Codigo/aws/) -- Configuração para o deploy na AWS

[Configuração Caddy](../Codigo/caddy/) -- Configuração do proxy reverso

[Configuração Localstack](../Codigo/localstack/) -- Configuração para simular o serviço do S3 da AWS

# Tutorial de como rodar Docker do projeto

## Tutorial de Instalação do Docker Desktop

### Requisitos

-   Habilitar a virtualização no BIOS do seu computador

### Passos para Instalação

1. **Baixar o Docker Desktop**

    - Acesse o [site oficial do Docker](https://www.docker.com/products/docker-desktop) e baixe o instalador do Docker Desktop para Windows.

2. **Executar o Instalador**

    - Dê um duplo clique no arquivo baixado para iniciar o processo de instalação.
    - Siga as instruções do instalador. Certifique-se de selecionar a opção para usar o WSL 2 em vez do Hyper-V, se disponível.

3. **Configurar o Docker Desktop**

    - Após a instalação, abra o Docker Desktop.
    - Siga as instruções na tela para concluir a configuração inicial.
    - Verifique se o Docker está funcionando corretamente executando `docker --version` no Prompt de Comando ou PowerShell.

    ```bash
    	docker --version
    ```

4. **Habilitar o WSL 2**

    - Se você escolheu usar o WSL 2, certifique-se de que ele está habilitado. Você pode seguir as instruções no [site oficial da Microsoft](https://docs.microsoft.com/en-us/windows/wsl/install).

5. **Testar a Instalação**
    - Abra o Prompt de Comando ou PowerShell e execute `docker run hello-world`.
    - Se tudo estiver configurado corretamente, você verá uma mensagem de sucesso indicando que o Docker está funcionando.

Pronto! Agora você tem o Docker Desktop instalado e funcionando no seu sistema.

## Tutorial de Instalação da Extensão do Docker no VS Code

### Requisitos

-   Visual Studio Code instalado no seu sistema
-   Docker Desktop instalado e configurado

### Passos para Instalação

1. **Abrir o Visual Studio Code**

    - Inicie o Visual Studio Code no seu computador.

2. **Acessar a aba de Extensões**

    - Clique no ícone de extensões na barra lateral esquerda ou use o atalho `Ctrl+Shift+X`.

3. **Buscar pela Extensão do Docker**

    - Na barra de pesquisa, digite "Docker" e pressione `Enter`.

4. **Instalar a Extensão do Docker**

    - Encontre a extensão oficial do Docker (geralmente a primeira da lista) e clique no botão de instalar.

5. **Configurar a Extensão**

    - Após a instalação, você pode precisar reiniciar o Visual Studio Code.
    - Abra a aba do Docker na barra lateral esquerda para acessar as funcionalidades da extensão.

6. **Verificar a Instalação**

    - Certifique-se de que o Docker Desktop está em execução.
    - Na aba do Docker no VS Code, você deve ver seus contêineres, imagens e volumes listados.

## Tutorial como executar o Docker da aplicação com a extensão do VS Code

### Passos para Executar a Aplicação com Docker no VS Code

1. **Abrir o Visual Studio Code**

    - Inicie o Visual Studio Code no seu computador.

2. **Abrir o Projeto**

    - Abra o projeto clonado no VS Code. Você pode fazer isso clicando em `File > Open Folder` e selecionando o diretório do projeto.

3. **Abrir a Aba do Docker**

    - Clique no ícone do Docker na barra lateral esquerda para abrir a aba do Docker.

4. **Construir as Imagem Docker pelo Docker Compose**

    - Na aba de arquivos do seu vscode clique com botao direito em cima do arquivo docker-compose.yml
    - Na penutima opção click em "Compose up"
    - Espere a compilação

5. **Verificar a Aplicação**

    - Abra o navegador e acesse `http://localhost:4200` para verificar se a aplicação está rodando corretamente.

Pronto! Agora você sabe como executar a aplicação utilizando Docker com a extensão do VS Code.
