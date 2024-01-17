# Web-scraping-Template
Web scraping template for Chrome and Firefox automation using webdriver.io V8

## How to use
O arquivo commons/util.js tem métodos comuns para interação com a pagina web:
 * **navigate** - Acessa uma URL e espera a página carregar
 * **clickField** - click em alguma elemento
 * **clickByScript** - click em algum elemento porem usando o comando via console
 * **setFieldValue** - Insere valor em input ou textarea
 * **setFieldValueTyping** - Insere o valor no input ou textarea, digitando o valor
 * **selectByValue** - seleciona o option do select apartir do value do option
 * **selectByText** - seleciona o option do select apartir do innerText (texto) do option,
 * **getAttribute** - captura o valor de um atributo html
 * **getTexts** - pega o valor do innerText (texto) de um seletor **retorna array**
 * **getHTMLs** -  pega o other html de um seletor **retorna array**
 * **checkExisting** - verifica se existe o elemento na tela
 * **waitForExisting** - aguarda o elemento existir na tela
 * **checkVisibity** - verifica se o elemento está visivel na tela
 * **waitForVisible** - Aguarda o elemento ficar visivel na tela
 * **pageIsComplete** - Verifica se a página terminou de carregar
 * **isLoagind** - verifica se o loading (spinner) está visivel
 * **savePDF** - salva a pagina web em formato PDF
 * **waitDownloadDocument** - Aguarda a conclusão do download de um arquivo

Edite o arquivo laucher/worcker.js e implemente a interação com a pagina web utilizando os métodos do utils.js

## How to execute
rode o comando **node main** no terminal dentro da pasta raiz do projeto
