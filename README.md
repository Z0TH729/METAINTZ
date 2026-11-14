# METAINTZ

**Advanced Public File Search**

METAINTZ é um gerador de consultas avançadas para localizar arquivos públicos indexados pelo Google. Usa operadores como `filetype:`, `site:`, `intitle:`, `inurl:`, `intext:`, exclusões e combinações com `OR`.

## Como funciona
1. Informe termos relacionados ao conteúdo.
2. Selecione uma ou mais extensões.
3. Opcionalmente, filtre por domínio, título, URL ou conteúdo.
4. Gere a consulta e abra a pesquisa no Google.

Exemplo:
```text
site:gov.br "segurança da informação" (filetype:pdf OR filetype:docx OR filetype:pptx)
```

## Catálogo
Documentos, planilhas, dados, apresentações, imagens, áudio, vídeo, arquivos compactados, pacotes, formatos web e desenvolvimento.

## Tecnologia
HTML, JavaScript puro, Google Search por URL e GitHub Pages. Não utiliza API de busca, backend, Python ou Node.js. O METAINTZ constrói a consulta e encaminha o usuário ao Google; os resultados dependem do índice e dos operadores aceitos pelo buscador.

## Executar localmente
Abra `index.html` no navegador.

## Uso responsável
Use para localizar conteúdo público. Respeite privacidade, direitos autorais, termos dos sites e controles de acesso. Não utilize a ferramenta para coletar documentos privados de terceiros.

## Licença
MIT
