# EXECUÇÃO
 * requer o NPM instalado 
 
 - Executar o comando no shell "npm i".
 - Após instalado, executar o comando "npm start ou node server" para a API ou "node terminal" para a linha de comando.
 - Colocar o arquivo de rotas dentro de "./src/storage" com o nome de "input-routes.csv".

# ROTAS API 

POST /best-route 

body: 
  {
    "curr" : "GRU",
    "dest" : "CDG"
  }

POST /new-route

body: 
  {
    "name_route_a" : "BRL",
    "name_route_b" : "USD",
    "price" : 100
  }

# TERMINAL

 - Executar o arquivo "terminal.js" e seguir as instruções no shell.

# ESTRUTURA

src : {
  api: {
    index.js
  },
  storage: {
    index.js
  },
  terminal: {
    index.js
  },
  test: {
    index.js
  },
  utils: {
    index.js
  }
  index.js
},
server.js,
terminal.js
