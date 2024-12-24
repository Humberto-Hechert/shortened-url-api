
# URL Shortener API

Esta é uma API para encurtar URLs. Ela fornece endpoints para criar, listar, atualizar, deletar e redirecionar URLs curtas. Esta API é construída com NestJS, utiliza PostgreSQL como banco de dados e JWT para autenticação.


## Pré-requisitos

Antes de rodar a aplicação, certifique-se de que você tem o Docker e o Docker Compose instalados em sua máquina.

 - [Instalar o Docker](https://docs.docker.com/engine/install/)
 - [Instalar Docker Compose](https://docs.docker.com/compose/install/)


## Configuração

### Variáveis de Ambiente

Certifique-se de criar um arquivo .env na raiz do projeto com as seguintes variáveis de ambiente:

```bash
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=your_database_user
DATABASE_PASSWORD=your_database_password
DATABASE_SCHEMA=your_database_schema
DATABASE_SYNC="true"
JWT_SECRET=your_jwt_secret
PGADMIN_EMAIL=your_pgadmin_email
PGADMIN_PASSWORD=your_pgadmin_password
```
### Docker Compose
Este projeto usa o Docker Compose para orquestrar os containers necessários para rodar a aplicação. Ele inclui:

- PostgreSQL: Banco de dados onde as URLs serão armazenadas.
- pgAdmin: Interface de administração do PostgreSQL.
- Aplicação (API): A própria API que você está rodando.

### Rodando a API com Docker
Para rodar a aplicação e o banco de dados usando Docker Compose, siga os passos abaixo:

- Clone o repositório para o seu ambiente local (https://github.com/Humberto-Hechert/shortened-url-api):

```bash
git clone https://github.com/Humberto-Hechert/shortened-url-api.git
cd url-shortener-api
```

- Configure as Variáveis de Ambiente: Crie o arquivo .env na raiz do projeto com as variáveis de ambiente mencionadas acima.

-Inicie os containers: No diretório raiz do projeto, execute os comandos abaixo para iniciar os containers:

```bash
docker compose build
docker compose up -d
```

- Acessando a API
Após a inicialização dos containers, a API estará disponível na porta 3077. Você pode testar os endpoints da API em:

```bash
http://localhost:3077
```

- Acessando o pgAdmin para visualização gráfica dos dados no banco
O pgAdmin estará disponível na porta 5050. Acesse o pgAdmin através do navegador usando:

```bash
http://localhost:5050
```
- Email: O email configurado nas variáveis de ambiente (PGADMIN_EMAIL).
- Senha: A senha configurada nas variáveis de ambiente (PGADMIN_PASSWORD).

A aplicação se conecta ao banco de dados PostgreSQL rodando no container postgres. O banco de dados estará disponível na porta 5433 localmente, mas a aplicação usa a porta padrão 5432 dentro do Docker.
## Endpoints da API

#### Obs: Para a utilização de alguns dos endpoints a seguir, é necessário ter um usuário criado. A documentação detalhada da criação de usuário você pode encontrar no arquivo feito com swagger através do caminho: 

```bash
http://localhost:3077/api
```

#### Cria uma URL encurtada

```http
  POST /urls/shorten
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `originalUrl` | `string` | **Obrigatório**. URL original que deseja encurtar |

#### Retorna todas URLs

```http
  GET /urls
```

#### Atualiza URL original

```http
  PUT /urls/:id
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `originalUrl` | `string` | **Obrigatório**. URL original que deseja atualizar |


#### Deleta URL

```http
  DELETE /urls/:id
```