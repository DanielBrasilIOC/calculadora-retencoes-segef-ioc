# Especificação normativa e operacional — módulo IBS/CBS
## Calculadora de Retenções — SEGEF/IOC
**Data de corte:** 23/11/2026  
**Status:** especificação técnica preliminar; exige validação jurídica/contábil institucional antes de ativar cálculo automático em produção.

## 1. Conclusões da auditoria normativa

### 1.1 Base legal confirmada
- **EC 132/2023:** fundamento constitucional da reforma do consumo e do IVA dual.
- **LC 214/2025, texto compilado:** institui IBS, CBS e IS; contém incidência, base, alíquotas, extinção de débitos, créditos, regimes e transição.
- **LC 227/2026:** altera a LC 214/2025 e disciplina, entre outros pontos, CGIBS, processo administrativo e regras materiais complementares.
- **Decreto 12.955/2026:** regulamento da CBS.
- **Resolução CGIBS 6/2026:** regulamento do IBS.
- **Portaria Conjunta MF/CGIBS 7/2026:** reconhece disposições comuns aos regulamentos.

Fontes oficiais:
- https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp214compilado.htm
- https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp227.htm
- https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/reforma-tributaria-do-consumo/legislacao
- https://cgibs.gov.br/regulamentos

### 1.2 Atualizações confirmadas até a data de corte
- **Decreto 13.075/2026:** consta como alteração dos arts. 105, 115 e 619 do Decreto 12.955/2026 na base oficial da Presidência. Conferir o texto integral e o alcance antes de parametrizar regras de cadastro/documentação de pessoas físicas.
- **Decreto 13.140/2026:** confirmado em notícia oficial da Receita/MF, de 23/10/2026, com medidas de simplificação para nanoempreendedores e MEI, inclusive dispensa de CNPJ para nanoempreendedores e de documentos fiscais eletrônicos dos novos tributos, nos limites do ato.
- **Ato Conjunto RFB/CGIBS 7/2026, de 11/11/2026:** confirmado; altera o Ato 4/2026 e atualiza cronogramas de obrigatoriedade de DF-e. O cronograma oficial da RFB foi atualizado em 19/11/2026. Não existe uma única data aplicável a toda NFS-e: a data depende da espécie documental/operação.
- **Resoluções CGSN 190 e 191/2026:** confirmadas em notícia oficial da Receita de 12/08/2026, com efeitos em regra a partir de 01/01/2027.
- **Resolução CGSN 195/2026:** confirmada em notícia oficial da Receita/MF de outubro de 2026, relacionada às simplificações para nanoempreendedores e MEI.
- **Não foi possível confirmar em fonte oficial consultada, até 23/11/2026, o Decreto 13.133/2026 nem a Resolução CGSN 194/2026 com o conteúdo descrito no material recebido.** Não cadastrar como fundamento ativo sem localizar publicação no DOU/Planalto/Receita/CGSN.
- A página oficial do cronograma RFB identifica expressamente o Ato 4/2026 com as alterações do Ato 7/2026. A aplicação deve ser feita por tipo de DF-e e operação, não por uma data genérica.

Fontes oficiais adicionais:
- https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/reforma-tributaria-do-consumo/orientacoes-da-reforma-tributaria/cronograma
- https://www.gov.br/nfse/pt-br/noticias/cgnfs-e-informa-ato-conjunto-rfb-cgibs-no-7-2026-atualiza-o-cronograma-de-obrigatoriedade-de-emissao-da-nfs-e-para-ibs-e-cbs/
- https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/agosto/cgsn-atualiza-regras-do-simples-nacional-para-adequacao-a-reforma-tributaria-do-consumo/
- https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/outubro/novas-medidas-simplificam-obrigacoes-da-reforma-tributaria-para-nanoempreendedores-e-meis

## 2. Regra central para o Financeiro do IOC/Fiocruz

O módulo deve separar quatro conceitos:
1. **Tributo destacado/calculado pelo fornecedor** no documento fiscal;
2. **Tributo devido pelo fornecedor** na apuração própria;
3. **Recolhimento/extinção do débito** por pagamento, split payment, recolhimento pelo adquirente ou responsável legal;
4. **Valor efetivamente dedutível do pagamento ao fornecedor** pelo órgão/entidade pagadora.

IBS/CBS não devem ser somados automaticamente às retenções tradicionais (IRRF, CSLL, PIS/Pasep, Cofins, INSS e ISS). O simples destaque de IBS/CBS no documento fiscal não autoriza o aplicativo a descontar esse valor do pagamento do fornecedor.

A LC 214/2025, art. 27, prevê modalidades distintas de extinção do débito, incluindo pagamento pelo contribuinte, split payment, recolhimento pelo adquirente (art. 36) e pagamento por responsável legal. O art. 36 trata de hipótese própria de recolhimento pelo adquirente contribuinte do regime regular, quando o instrumento de pagamento não permite split payment; não equivale a uma retenção genérica pelo setor financeiro.

## 3. Regras por período

### 3.1 Ano-calendário 2026 — fase de teste
- Referências oficiais de transição: CBS de 0,9% e IBS de 0,1%, com compensação dos valores recolhidos com PIS/Cofins no mesmo período, observadas as condições legais.
- A Receita informa dispensa do recolhimento da alíquota de teste para contribuintes que cumprirem as obrigações acessórias previstas.
- A regra de destinação integral da arrecadação de compras governamentais do art. 473 **não se aplica** a fatos geradores de 2026 (LC 214/2025, art. 372, I, “a”).
- **Comportamento do aplicativo:** permitir registrar/visualizar os campos IBS/CBS do DF-e, mas não converter automaticamente 0,9% + 0,1% em retenção a descontar do fornecedor. Exibir alerta: “Ano de teste — verificar cumprimento das obrigações acessórias e regra de dispensa/compensação; destaque não equivale a retenção pelo órgão”.
- Não aplicar o redutor de compras públicas de 2027 em 2026.

### 3.2 Ano-calendário 2027 e 2028
- Inicia-se a cobrança efetiva da CBS e do IBS, com as alíquotas e regras de transição legalmente fixadas.
- Para compras públicas, a LC 214/2025, art. 472, prevê redução uniforme das alíquotas de IBS e CBS conforme redutor anual fixado nos termos do art. 370.
- O TCU aprovou em 28/10/2026 e comunicou ao Senado o cálculo de referência de **11,3% para CBS 2027** e redutor de **44,2%** para compras públicas. Em 23/11/2026, a fonte do TCU informa que cabe ao Senado fixar os percentuais por resolução; portanto, estes números devem permanecer como **provisórios/pendentes de ato final do Senado**, não como parâmetros legais definitivos.
- Exemplo apenas ilustrativo: se a alíquota de referência final da CBS for 11,3% e o redutor final for 44,2%, a aplicação matemática do redutor seria 11,3% × (1 − 0,442) = 6,3054%, antes de ajustes legais de transição, alíquota diferenciada, regime específico ou exceção. Não usar este exemplo como alíquota operacional aprovada.
- A destinação integral da arrecadação prevista no art. 473 aplica-se ao IBS desde 01/01/2027, mas **não se aplica à CBS em 2027 e 2028** (art. 372, I, “b”, e II). O aplicativo não deve antecipar para CBS a regra de destinação integral da União.
- Exceções do redutor do art. 472, parágrafo único: (a) aquisições cumulativamente presenciais e dispensadas de licitação; (b) aquisições sujeitas a alíquotas nacionalmente uniformes indicadas na LC; (c) aquisições sujeitas ao Simples Nacional ou MEI. Exigir classificação/validação e nunca inferir apenas pelo nome do fornecedor.

### 3.3 Anos 2029 a 2032
- O redutor de compras públicas permanece sujeito ao art. 370 e ao ato anual aplicável.
- O regime de destinação integral da arrecadação da CBS é progressivo: 10% em 2029, 20% em 2030, 30% em 2031 e 40% em 2032, conforme art. 372, parágrafo único.
- O regime de destinação integral do IBS aplica-se desde 2027, nos termos do art. 372, II, “a”.
- A transição de ICMS/ISS para IBS segue cronograma constitucional/legal próprio. Não misturar essa transição com a regra de redutor das compras públicas.

### 3.4 A partir de 2033
- O regime de destinação integral do produto da arrecadação de IBS e CBS ao ente contratante passa a ser integral, conforme art. 372, II.
- ICMS e ISS deixam de existir no modelo geral a partir de 2033, conforme cronograma da reforma; manter o histórico das regras antigas para documentos e fatos anteriores.

## 4. Enquadramento do adquirente — IOC/Fiocruz
- A regra de compras governamentais dos arts. 370, 372 e 472 a 473 alcança Administração Pública direta, autarquias e fundações públicas, conforme o dispositivo.
- Para parametrizar o IOC, registrar o adquirente jurídico real e seu CNPJ institucional no documento/contrato. Não presumir que o IOC, como unidade administrativa, seja adquirente autônomo. Confirmar que o adquirente contratual é a Fundação Oswaldo Cruz e que a aquisição atende aos requisitos legais.
- O art. 473 estabelece tratamento de destinação da arrecadação ao ente contratante. Para aquisições pela União, prevê redução a zero das alíquotas do IBS dos demais entes e ajuste da CBS, observada a regra de transição do art. 372.
- O art. 10, § 2º, prevê que, nas aquisições públicas sujeitas ao art. 473, o fato gerador ocorre no pagamento. Para execução continuada/fracionada, observar também a redação vigente do art. 10, § 3º, alterada pela LC 227/2026. A data de emissão da NF não deve ser o único critério de vigência.
- A classificação como fundação pública e a condição do adquirente devem ser validadas pela área jurídica/contábil da Fiocruz antes de habilitar a regra automática.

## 5. Fluxo operacional proposto no aplicativo

### Etapa A — identificação obrigatória
Capturar ou solicitar:
- data do fornecimento e data(s) do pagamento;
- tipo e chave/número do DF-e;
- CNPJ e regime tributário do fornecedor;
- opção Simples Nacional/MEI e, quando aplicável, opção pelo regime regular de IBS/CBS;
- CNPJ do adquirente contratual;
- natureza da aquisição: bem, serviço, importação, serviço continuado/fracionado;
- código/classificação do serviço ou produto e município/local da operação;
- valores da operação, descontos incondicionais, parcelas e campos IBS/CBS destacados;
- modalidade de contratação e se a aquisição foi presencial e dispensada de licitação;
- indicador de alíquota padrão, reduzida, zero, isenta, suspensa, diferida ou regime específico.

### Etapa B — seleção da regra vigente
1. Determinar o marco temporal pelo fato gerador, pagamento e regra específica da operação.
2. Consultar a tabela normativa versionada por data de vigência.
3. Identificar se o adquirente está abrangido pelos arts. 370/472/473.
4. Aplicar as exceções do art. 472, parágrafo único.
5. Consultar alíquota de referência e redutor aprovados para o exercício. Se ainda pendentes de ato final, bloquear cálculo conclusivo e permitir somente simulação identificada como provisória.
6. Aplicar o regime de destinação do art. 473 conforme a transição do art. 372, sem confundir destinação da arrecadação com retenção no pagamento.

### Etapa C — cálculo
- Guardar separadamente a base IBS e a base CBS.
- Calcular cada tributo com sua alíquota legal aplicável ao tipo de operação e exercício.
- Aplicar o redutor de compras públicas somente quando o adquirente e a operação estiverem enquadrados e não incidirem exceções.
- Não calcular IBS/CBS a partir de percentuais digitados sem identificar se são alíquotas nominais, alíquotas reduzidas, alíquotas efetivas, redutor ou destaque do documento.
- Não somar IBS/CBS ao total de retenções tradicionais nem reduzir o líquido do fornecedor, salvo quando houver fundamento legal e modalidade operacional específica de recolhimento pelo adquirente/responsável, documentada no processo.
- Em pagamento parcelado ou serviço continuado, calcular por parcela e observar o fato gerador específico; não duplicar o valor integral em cada medição.

### Etapa D — resultado e alertas
Exibir três blocos independentes:
1. **Tributos destacados no DF-e:** valor informado pelo fornecedor;
2. **Simulação de IBS/CBS da operação:** base, alíquota, redutor, regra e fundamento legal;
3. **Valor a descontar do pagamento:** somente retenções efetivamente exigíveis do fornecedor, com fundamento legal individualizado.

Alertas obrigatórios:
- “Destaque de IBS/CBS não significa retenção automática pelo órgão.”
- “Alíquota/redutor provisório: conferir resolução do Senado e ato vigente.”
- “Regime Simples/MEI: verificar exceção ao redutor e regime de apuração.”
- “Aquisição pública: confirmar CNPJ do adquirente e enquadramento jurídico.”
- “Serviço continuado ou pagamento parcelado: validar momento do fato gerador.”
- “Documento fiscal e leiaute: conferir cronograma vigente por tipo de DF-e.”
- “Não há validação automática de autenticidade, autorização ou cancelamento do documento.”

## 6. Modelo de dados normativos versionado

Cada regra deve conter:
- identificador, tributo (IBS/CBS), título, fundamento legal e artigo;
- vigência inicial/final, data de publicação e data da última validação;
- exercício, tipo de operação, tipo de adquirente e regime do fornecedor;
- alíquota de referência, alíquota operacional, redutor e exceções;
- status (confirmada, provisória, pendente de validação, revogada);
- URL da fonte oficial, observação e responsável pela validação.

Não sobrescrever regras antigas. Criar nova versão com início de vigência e preservar a memória de cálculo utilizada em cada análise.

## 7. Critérios de aceite e testes

1. Documento de 2026 com campos IBS/CBS: exibe fase de teste e não desconta automaticamente esses valores do líquido do fornecedor.
2. Aquisição por entidade pública em 2026: não aplica redutor nem destinação integral do art. 473.
3. Aquisição de 2027 com adquirente público elegível: exige parâmetro anual final e verifica exceções do art. 472.
4. Fornecedor Simples/MEI: não aplica redutor do art. 472 sem tratar a exceção legal.
5. Aquisição presencial e dispensada de licitação: exige validação cumulativa antes de afastar o redutor.
6. Pagamento parcelado: calcula por parcela, sem repetir base total.
7. Serviço continuado: aplica a regra de fato gerador do art. 10, § 3º, vigente.
8. Parâmetro provisório do TCU: identifica claramente “simulação”, impede status “cálculo validado”.
9. Memória de cálculo: registra a versão normativa, base, alíquota, redutor, exceção e fonte usada.
10. IBS/CBS não são incluídos no total de retenções tradicionais sem regra expressa.

## 8. Fontes oficiais para monitoramento
- Receita Federal — legislação da Reforma: https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/reforma-tributaria-do-consumo/legislacao
- Receita Federal — transição: https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/reforma-tributaria-do-consumo/entenda/entenda-a-reforma-tributaria-do-consumo/
- Receita Federal — cronograma DF-e: https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/reforma-tributaria-do-consumo/orientacoes-da-reforma-tributaria/cronograma
- CGIBS — regulamentos: https://cgibs.gov.br/regulamentos
- CGIBS — atos conjuntos: https://cgibs.gov.br/atos-conjuntos
- TCU — cálculo CBS 2027: https://portal.tcu.gov.br/imprensa/noticias/tcu-calcula-aliquota-de-referencia-de-113-para-novo-tributo-sobre-consumo
- TCU — acórdão e relatório sobre alíquota CBS e redutor: https://pesquisa.apps.tcu.gov.br/documento/acordao-completo/apresenta%25C3%25A7%25C3%25A3o%2520de%2520amostras/%2520/DTRELEVANCIA%2520desc%252C%2520NUMACORDAOINT%2520desc/17

---
**Aviso:** esta especificação é instrumento de desenvolvimento e controle. Não substitui parecer da Procuradoria/área jurídica, orientação da Receita Federal/CGIBS nem validação institucional da Fiocruz. Nenhum cálculo deve ser liberado para liquidação/pagamento sem revisão humana e confirmação dos atos normativos vigentes.
