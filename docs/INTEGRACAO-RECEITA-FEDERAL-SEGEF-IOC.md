# Integração das soluções oficiais da Receita Federal — Calculadora SEGEF/IOC

**Status:** especificação técnica para implementação; não representa integração já ativa.  
**Data de referência:** 23/11/2026.

## 1. Objetivo

Aproveitar as soluções oficiais publicadas pela Receita Federal para ampliar a Calculadora de Retenções — SEGEF/IOC, mantendo o foco no apoio à análise de documentos fiscais, conferência de tributos e instrução do pagamento no âmbito do IOC/Fiocruz.

A integração deve preservar os módulos existentes (IRRF, CSLL, PIS/Pasep, Cofins, INSS e ISS) e tratar IBS/CBS em módulo próprio, com regras e vigências separadas.

## 2. Fontes oficiais e componentes identificados

### 2.0 Quadro de incorporação dos três repositórios oficiais

| Repositório oficial | Linguagem | Situação no projeto SEGEF/IOC | Integração pretendida |
|---|---|---|---|
| [calculadora-rtc-regime-regular](https://github.com/ReceitaFederal/calculadora-rtc-regime-regular) | Java | **Não incorporado ao código da calculadora** | Avaliar e integrar o motor oficial de cálculo de CBS, IBS e Imposto Seletivo, incluindo consultas às tabelas tributárias e validações de documentos fiscais. |
| [calculadora-rtc-simples-nacional](https://github.com/ReceitaFederal/calculadora-rtc-simples-nacional) | Java | **Não incorporado ao código da calculadora** | Avaliar e integrar as regras específicas de cálculo de CBS e IBS para contribuintes optantes pelo Simples Nacional. |
| [calculadora-rtc-gerador-danfse](https://github.com/ReceitaFederal/calculadora-rtc-gerador-danfse) | Go | **Não incorporado ao código da calculadora** | Avaliar a geração e a validação do DANFSe em PDF a partir do XML da NFS-e, como recurso auxiliar de visualização e conferência. |

**Nota de status:** os três projetos estão identificados e documentados como componentes oficiais a serem avaliados para integração. Nesta etapa, seus códigos-fonte ainda não foram incorporados ao repositório SEGEF/IOC, nem foram executados, adaptados ou homologados no ambiente institucional. A inclusão nesta documentação não deve ser interpretada como funcionalidade já disponível.


### 2.1 Calculadora de Tributos — regime regular

- Repositório: https://github.com/ReceitaFederal/calculadora-rtc-regime-regular
- Licença indicada no repositório: MIT.
- README consultado em 23/11/2026.
- O projeto oficial é uma API REST para cálculo de CBS, IBS e Imposto Seletivo, consulta tabelas oficiais e geração/validação de grupos tributários de documentos fiscais eletrônicos.
- Endpoints documentados no README incluem cálculo do regime regular, cálculo com observabilidade por item, base unificada de NF-e/NFC-e e NFS-e, geração/validação de XML e consultas a CST, cClassTrib, fundamentações legais, NCM, NBS e alíquotas.
- Requisitos informados pelo projeto: Java 25, Spring Boot 4.1.2, SQLite e Flyway; o modo offline depende de banco local previamente gerado.

**Diretriz:** estudar e incorporar o motor oficial como componente de servidor/serviço separado, após avaliação de compatibilidade, versão, dependências, licença e testes. Não copiar taxas ou regras manualmente sem rastreabilidade da versão oficial.

### 2.2 Gerador DANFSe

- Repositório: https://github.com/ReceitaFederal/calculadora-rtc-gerador-danfse
- Serviço HTTP em Go para gerar DANFSe em PDF a partir do XML da NFS-e.
- Pode ser avaliado como ferramenta auxiliar para visualização/representação do XML, sem substituir a leitura estruturada do XML nem a conferência dos dados fiscais.

### 2.3 Calculadora do Simples Nacional

- Repositório: https://github.com/ReceitaFederal/calculadora-rtc-simples-nacional
- Deve ser consultado quando a situação do prestador exigir análise de regime do Simples Nacional.
- Não aplicar o motor de regime regular automaticamente a fornecedor optante pelo Simples.

### 2.4 APIs da Apuração Assistida da CBS

- Documentação: https://docs.receitafederal.gov.br/apuracao-cbs/
- Notícia oficial de liberação da versão 2.0: https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/novembro/receita-federal-libera-acesso-as-novas-apis-de-apuracao-da-cbs
- A Receita informou a liberação, em 28/10/2026, das APIs 2.0 de consulta a débitos e créditos em produção restrita e produção beta.
- A documentação lista consultas de débitos, créditos, pagamentos e recolhimentos como adquirente (RAD), consulta de situação de solicitação e emissão de DARF para RAD e PCONT.
- As consultas são incrementais e assíncronas: retornam alterações desde a consulta anterior, com fluxo de solicitação, acompanhamento e obtenção do resultado.
- O uso requer credencial obtida no serviço oficial “Gerar Credencial de Acesso”; a Receita informou que chaves anteriores precisam ser canceladas e substituídas para a versão 2.0.

**Diretriz:** a API de apuração não é uma calculadora de retenções da nota fiscal. Ela fornece dados da apuração/estado de débitos, créditos e pagamentos da CBS. Usá-la como fonte complementar de conciliação, quando houver autorização e acesso institucional, sem presumir que um débito exibido equivale a retenção que deve ser deduzida do pagamento ao fornecedor.

### 2.5 Tabelas CST e cClassTrib — Conformidade Fácil

- Comunicado técnico do Portal dos Documentos Fiscais Eletrônicos/SVRS: https://dfe-portal.svrs.rs.gov.br/DFE/Noticias/2505
- Endpoint divulgado para consulta: https://cff.svrs.rs.gov.br/api/v1/consultas/classTrib
- O serviço disponibiliza tabelas CST e cClassTrib e atributos associados.
- A informação divulgada indica autenticação mútua com certificado digital ICP-Brasil e recomendação de limitar a consulta a, no máximo, uma vez ao dia por empresa, pois as tabelas não mudam diariamente.

**Diretriz:** não chamar esse endpoint diretamente do navegador público. Avaliar rotina de atualização controlada em serviço de retaguarda, com certificado protegido, cache/versionamento e registro da data de consulta. Não incluir certificado ou chave privada no GitHub Pages.

## 3. Arquitetura recomendada para o SEGEF/IOC

A calculadora atual é publicada como aplicação estática no GitHub Pages e executa leitura local de documentos no navegador. Essa arquitetura pode continuar sendo usada para leitura de XML/PDF e conferência manual, mas não deve guardar credenciais de API, certificados ICP-Brasil ou chaves privadas.

Separar as funções:

1. **Interface local (GitHub Pages):** importação e pré-visualização do XML/PDF; formulário de identificação e conferência; edição manual dos campos; memória de cálculo; impressão/exportação.
2. **Motor tributário oficial (serviço isolado):** avaliar implantação controlada da Calculadora RTC da Receita em ambiente institucional, com versão fixada, banco oficial atualizado e testes de regressão.
3. **Conector autenticado da CBS (retaguarda):** somente após autorização institucional, armazenar credenciais em cofre/variáveis seguras; executar consultas assíncronas; registrar protocolo, data/hora, ambiente e última consulta concluída; validar integridade e origem dos retornos.
4. **Atualizador de tabelas CST/cClassTrib:** serviço agendado com certificado protegido, cache local, histórico de versões e consulta não mais frequente que a recomendação oficial.
5. **Camada de auditoria:** registrar versão do motor, versão das tabelas, regra aplicada, fonte normativa, vigência, dados de entrada e resultado. Não registrar credenciais nem documentos fiscais integrais em logs.

Não expor endpoints internos, credenciais, certificados, tokens ou arquivos de retorno sensíveis no código-fonte público ou no navegador.

## 4. Fluxo funcional proposto

1. Importar XML ou PDF da nota e extrair os campos sem presumir que a extração seja correta.
2. Apresentar todos os campos identificados para conferência humana: emitente/prestador, tomador, intermediário, identificação da nota, serviço/item, competência, valores, descontos/deduções, tributos destacados, retenções declaradas, regime e informações complementares.
3. Identificar regime tributário, natureza da operação, município de incidência e data de ocorrência, exigindo confirmação quando houver dúvida.
4. Para IBS/CBS, consultar a tabela CST/cClassTrib vigente e, quando tecnicamente aplicável, submeter os dados ao motor oficial de cálculo.
5. Exibir separadamente: tributo destacado no documento; tributo calculado; débito/crédito registrado na apuração; pagamento/recolhimento identificado; e valor que pode efetivamente ser deduzido do pagamento ao fornecedor.
6. Só apresentar valor como retenção/dedução quando houver fundamento legal e responsabilidade do tomador confirmados para a operação. Não converter automaticamente destaque ou débito da apuração em desconto do fornecedor.
7. Exibir alertas de inconsistência e exigir validação do responsável antes de concluir a análise.

## 5. Vigência e implantação

- Manter o marco operacional definido para o módulo IBS/CBS do SEGEF/IOC em **01/01/2027**, sem apagar o histórico de 2026 nem antecipar automaticamente regras de 2027.
- Cada regra deve respeitar sua própria data legal de início de efeitos, inclusive quando diferente do marco operacional geral.
- Não habilitar cálculo de produção com estimativas, tabelas beta ou parâmetros provisórios sem identificação clara e validação normativa.
- A produção beta e a produção restrita das APIs da CBS não devem ser confundidas com serviço estável e homologado para uso operacional do IOC.

## 6. Segurança, governança e pré-requisitos

Antes de ativar qualquer integração autenticada, obter validação da área de TI/segurança e autorização institucional para uso das credenciais e dados. Definir responsável pelo certificado, procuração/perfil de acesso, ambiente de teste, política de rotação e revogação de credenciais, retenção de dados e trilha de auditoria.

A calculadora pública não deve fazer chamadas autenticadas à Receita ou à SVRS com segredo embutido no JavaScript. A integração exige serviço de retaguarda seguro ou procedimento institucional controlado.

## 7. Testes obrigatórios antes de produção

- Casos oficiais/exemplos disponibilizados pela Receita para o motor RTC.
- Casos de NF-e e NFS-e, incluindo base unificada e itens múltiplos.
- Prestador do regime regular e do Simples Nacional.
- CST/cClassTrib válidos, inválidos, extintos e com vigência futura/passada.
- Diferença entre destaque no documento, apuração assistida, pagamento/RAD e dedução do valor devido ao fornecedor.
- Consultas incrementais, reprocessamento, indisponibilidade, repetição de protocolo e prevenção de duplicidade.
- Testes de segurança para impedir vazamento de certificado, token, credencial e conteúdo fiscal.
- Comparação dos resultados com os exemplos e versões oficiais do motor.

## 8. Limites desta especificação

Esta documentação registra fontes e arquitetura proposta. **Não significa que os repositórios oficiais já foram incorporados ao código da calculadora, que as APIs estejam conectadas, que exista credencial do IOC, nem que os cálculos tenham sido homologados.** A implementação depende de infraestrutura segura, autorização institucional, análise técnica e validação contábil/jurídica.

## 9. Fontes consultadas

- Receita Federal — publicação do código-fonte: https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/novembro/receita-federal-publica-primeiro-codigo-fonte-aberto-no-github-e-amplia-transparencia-da-reforma-tributaria/
- Receita Federal — APIs CBS 2.0: https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/novembro/receita-federal-libera-acesso-as-novas-apis-de-apuracao-da-cbs
- Documentação APIs CBS: https://docs.receitafederal.gov.br/apuracao-cbs/
- Calculadora RTC regime regular: https://github.com/ReceitaFederal/calculadora-rtc-regime-regular
- Calculadora RTC Simples Nacional: https://github.com/ReceitaFederal/calculadora-rtc-simples-nacional
- Gerador DANFSe: https://github.com/ReceitaFederal/calculadora-rtc-gerador-danfse
- SVRS — API Conformidade Fácil: https://dfe-portal.svrs.rs.gov.br/DFE/Noticias/2505


## 10. Implementação técnica do gateway (23/11/2026)

Foi criada na branch `feature/receita-cbs-secure-backend` a primeira implementação do gateway Cloudflare Worker em `backend/cbs-gateway/`, com:
- autenticação OAuth2 Client Credentials no endpoint Receita Integra;
- rotas para abrir consultas de débitos, créditos, pagamentos e recolhimentos;
- consulta de situação e download do retorno JSON;
- verificação de JWT Cloudflare Access, CORS por origem e lista de CNPJ-base permitidos;
- tratamento da URL assinada somente no servidor, sem retorná-la ao navegador;
- interface da calculadora para informar o gateway, abrir consulta, acompanhar o tíquete e visualizar o JSON recebido;
- workflow de CI para validar o bundle do Worker.

**Situação:** código preparado em branch e sujeito a validação automatizada/revisão. Não está implantado em infraestrutura Cloudflare, não contém credenciais e não executou chamadas reais à Receita. A ativação depende da autorização institucional, da criação do Worker/hostname, da política Cloudflare Access, do cadastro de segredos e da confirmação do CNPJ-base e do ambiente oficial de teste.

A interface web permanece sem acesso à Receita enquanto o gateway não estiver implantado e configurado. O cálculo IBS/CBS continua sendo simulação aritmética; a integração do motor oficial de cálculo local é uma frente distinta e ainda não está conectada.
