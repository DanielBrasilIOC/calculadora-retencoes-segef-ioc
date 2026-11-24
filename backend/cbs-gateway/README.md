# Gateway seguro CBS — SEGEF/IOC

Este serviço é a retaguarda da aplicação estática publicada no GitHub Pages. O Client ID, Client Secret e token OAuth permanecem no servidor e nunca são solicitados ou enviados pelo navegador.

## Funcionalidades implementadas

- OAuth 2.0 Client Credentials no Receita Integra (POST /token, HTTP Basic e grant_type=client_credentials).
- Abertura de solicitações CBS v2 para débitos, créditos, pagamentos e recolhimentos RAD.
- Consulta da situação de um tíquete.
- Download do JSON apenas quando a situação estiver CONCLUIDA.
- A URL assinada de download é consumida no servidor e nunca devolvida ao navegador.
- Proteção das rotas fiscais por JWT do Cloudflare Access (issuer e audience verificados).
- CORS com origem explicitamente permitida.
- Lista de CNPJ-base autorizados por configuração institucional.

## O que depende da instituição

Este código não pode ser ativado com credenciais inventadas. A instituição precisa:

1. Autorizar o uso da API e definir qual CNPJ-base/representação está autorizado.
2. Gerar credencial de API válida para a matriz/representante no portal da Receita Federal.
3. Criar o Worker na conta Cloudflare institucional e proteger o hostname com Cloudflare Access.
4. Definir a origem web autorizada e o audience do Access.
5. Configurar no ambiente do Worker os seguintes segredos/variáveis:
   - RFB_CLIENT_ID (secret)
   - RFB_CLIENT_SECRET (secret)
   - ACCESS_TEAM_DOMAIN
   - ACCESS_AUD
   - ALLOWED_CNPJ_BASES (CNPJ-base de 8 dígitos, separado por vírgula)
   - APP_ORIGIN (origem exata da aplicação)
6. Confirmar a URL base do ambiente de API com a Receita/área institucional. A configuração inicial aponta para a base de produção beta documentada; homologação/produção restrita não deve ser presumida.

## Implantação

Pré-requisitos: Node.js LTS e conta Cloudflare institucional autorizada.

    npm install
    npx wrangler login
    npx wrangler deploy

Depois do deploy, configure um hostname próprio para o Worker, aplique uma política Cloudflare Access aos usuários autorizados e cadastre as variáveis/segredos acima. Ajuste a variável APP_ORIGIN para a origem exata do frontend. Os segredos podem ser cadastrados pelo terminal, sem incluí-los no repositório:\n\n    npx wrangler secret put RFB_CLIENT_ID\n    npx wrangler secret put RFB_CLIENT_SECRET\n\nConfigure ACCESS_TEAM_DOMAIN, ACCESS_AUD e ALLOWED_CNPJ_BASES como variáveis protegidas/configurações do Worker. Não envie Client ID, Client Secret, token, CNPJ completo ou JSON fiscal pelo chat ou por issues públicas do GitHub.

Faça primeiro os testes no ambiente de produção restrita usando a URL oficialmente fornecida à instituição. Não use credenciais pessoais nem credenciais de outra unidade. Faça um teste autorizado de baixo impacto antes de liberar o uso geral.

## Rotas

| Método | Rota | Função |
|---|---|---|
| GET | /health | Diagnóstico sem dados fiscais |
| POST | /api/cbs/requests | Abre consulta; JSON: { service: debitos, cnpjBase: 12345678 } |
| GET | /api/cbs/requests/{ticket}/status | Consulta situação |
| GET | /api/cbs/requests/{ticket}/result | Obtém JSON quando concluído |

Valores aceitos em service: debitos, creditos, pagamentos e recolhimentos.

## Segurança e limites

- A credencial da Receita é de aplicação/representação institucional, não uma credencial pessoal exposta no browser.
- As rotas fiscais exigem JWT do Cloudflare Access válido.
- O backend só permite CNPJ-base incluído em ALLOWED_CNPJ_BASES.
- Não há upload de NFS-e, PDF ou XML para o gateway.
- A URL assinada expira e é tratada como segredo temporário.
- A Receita limita as aberturas a quatro chamadas por dia, por API e credencial. A própria API aplica o limite; a interface deve evitar cliques repetidos.
- A API retorna dados da apuração CBS, não uma conclusão automática sobre retenção/dedução do pagamento ao fornecedor. O gateway não grava arquivos fiscais ou URL assinada; o resultado é entregue diretamente à sessão autenticada do usuário. O frontend não persiste o JSON automaticamente.
- Não registrar payload fiscal integral, token ou URL assinada em logs.
- Antes da produção institucional, exigir avaliação da TI/Segurança da Informação e política de retenção.

## Documentação oficial consultada

- https://docs.receitafederal.gov.br/apuracao-cbs/
- https://docs.receitafederal.gov.br/apuracao-cbs/guiaapiassincrona.html
- https://docs.receitafederal.gov.br/apuracao-cbs/debito.html
- https://docs.receitafederal.gov.br/apuracao-cbs/credito.html
- https://docs.receitafederal.gov.br/apuracao-cbs/pagamentos.html
- https://docs.receitafederal.gov.br/apuracao-cbs/recolhimentos.html
- https://docs.receitafederal.gov.br/apuracao-cbs/situacao-solicitacao.html
- https://docs.receitafederal.gov.br/apuracao-cbs/download.html
- https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/novembro/receita-federal-libera-acesso-as-novas-apis-de-apuracao-da-cbs

## Limitação conhecida

As consultas são assíncronas e incrementais. Quando existe consulta concluída nos últimos três meses, o retorno contém inclusões/atualizações desde a última consulta concluída, limitado aos últimos oito dias. Sem consulta concluída nesse período, a busca começa no primeiro dia do mês corrente. É necessária rotina institucional de consulta e conciliação para preservar o histórico; o gateway não reconstrói dados que a Receita não devolve.