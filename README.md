# conectando-a-comunidade
Projeto conectando a Comunidade


# Conectando a Comunidade: Serviços e Denúncias no Bairro

> Projeto de extensão universitária desenvolvido com o objetivo de aproximar a tecnologia das necessidades da comunidade, facilitando o acesso a serviços locais e criando um canal organizado para registro e acompanhamento de demandas comunitárias.

---

## Sobre o projeto

O **Conectando a Comunidade** é uma proposta de solução tecnológica voltada à comunidade local, desenvolvida no contexto de um projeto acadêmico de extensão.

A iniciativa surgiu a partir da identificação de uma dificuldade comum nos bairros: **encontrar informações sobre serviços existentes na região e comunicar problemas ou demandas comunitárias de maneira organizada**.

Como resposta a esse cenário, foi concebida uma plataforma digital denominada **Plataforma Cidadã**, reunindo duas funcionalidades principais:

* **Mapa de Serviços Locais**
* **Central de Denúncias Comunitárias**

A proposta é utilizar a tecnologia como instrumento de integração entre moradores e o ambiente em que vivem, facilitando o acesso à informação e dando maior organização às demandas identificadas na comunidade.

---

## Problema identificado

Em muitas comunidades, informações sobre serviços, estabelecimentos e recursos disponíveis encontram-se dispersas em diferentes canais.

Ao mesmo tempo, problemas relacionados à infraestrutura, segurança, limpeza, iluminação, acessibilidade e outros aspectos do bairro podem ser identificados pelos moradores, mas nem sempre existe um canal centralizado para registrar essas ocorrências.

Isso pode dificultar:

* A localização de serviços próximos;
* O acesso a informações sobre estabelecimentos e recursos locais;
* A comunicação de problemas existentes no bairro;
* A organização das demandas da comunidade;
* A visualização das necessidades mais recorrentes da região.

---

## Objetivo geral

Desenvolver uma solução tecnológica capaz de **facilitar o acesso a informações sobre serviços locais e proporcionar um canal organizado para registro de demandas e denúncias comunitárias**.

## Objetivos específicos

* Mapear serviços e recursos disponíveis na comunidade;
* Facilitar a localização de estabelecimentos e serviços próximos;
* Permitir o registro de problemas identificados pelos moradores;
* Organizar as informações de forma centralizada;
* Estimular a participação da comunidade;
* Utilizar tecnologia para apoiar a identificação de demandas locais;
* Criar uma solução com possibilidade de expansão para outras regiões.

---

## Público-alvo

A plataforma foi pensada principalmente para:

* Moradores do bairro;
* Escolas;
* Associações comunitárias;
* Pequenos comércios;
* Prestadores de serviços locais;
* Demais pessoas que utilizam os recursos da comunidade.

O projeto possui como contexto inicial de aplicação o **bairro Campo Comprido, em Curitiba — Paraná**.

---

## Principais funcionalidades

### Mapa de Serviços

Permite organizar e visualizar serviços e estabelecimentos existentes na região.

Entre as categorias que podem ser contempladas estão:

* Comércio;
* Alimentação;
* Saúde;
* Educação;
* Serviços;
* Instituições;
* Recursos comunitários.

A utilização de mapas possibilita uma visualização geográfica dos recursos existentes no bairro.

### Central de Denúncias Comunitárias

Área destinada ao registro de problemas ou situações identificadas pelos moradores.

A proposta contempla o registro estruturado de informações como:

* Tipo da ocorrência;
* Localização;
* Descrição do problema;
* Data do registro;
* Evidências, quando aplicável;
* Status da ocorrência.

O objetivo é transformar relatos dispersos em informações organizadas que possam auxiliar na compreensão das necessidades da comunidade.

### Participação comunitária

A plataforma busca transformar os próprios moradores em participantes ativos no levantamento das informações do território.

Dessa forma, a comunidade não apenas consome informações, mas também pode contribuir para a atualização e identificação das necessidades locais.

---

## Metodologia

O desenvolvimento do projeto foi estruturado em etapas:

### 1. Identificação do problema

Levantamento das dificuldades relacionadas ao acesso a informações e à comunicação de demandas existentes na comunidade.

### 2. Escuta e coleta de informações

Observação do contexto local e identificação das necessidades dos possíveis usuários da solução.

### 3. Análise

Organização das informações coletadas e definição dos principais problemas que poderiam ser tratados por meio de uma solução digital.

### 4. Modelagem da solução

Definição das funcionalidades, estrutura da plataforma, fluxo de utilização e organização das informações.

### 5. Desenvolvimento

Implementação da solução web e das funcionalidades definidas durante a etapa de planejamento.

### 6. Testes

Verificação do funcionamento da aplicação, identificação de problemas e realização dos ajustes necessários.

### 7. Avaliação

Análise da solução desenvolvida em relação aos objetivos estabelecidos e às necessidades identificadas na comunidade.

### 8. Documentação

Registro das etapas do projeto, decisões tomadas, funcionalidades desenvolvidas e resultados obtidos.

---

## Tecnologias

Durante o planejamento e desenvolvimento da solução foram consideradas tecnologias web como:

* **HTML5**
* **CSS3**
* **JavaScript**
* **Node.js**
* **Express**
* **Firebase / armazenamento de dados**
* **Leaflet.js**
* **APIs de mapas**

A escolha das tecnologias busca possibilitar uma aplicação web acessível, escalável e adequada à representação geográfica dos serviços e ocorrências.

---

## Arquitetura conceitual

A solução pode ser dividida em três componentes principais:

```text
┌──────────────────────────────────────────┐
│          PLATAFORMA CIDADÃ               │
├──────────────────────────────────────────┤
│                                          │
│  ┌────────────────┐  ┌────────────────┐  │
│  │ Mapa de        │  │ Central de     │  │
│  │ Serviços       │  │ Denúncias      │  │
│  └───────┬────────┘  └───────┬────────┘  │
│          │                   │           │
│          └─────────┬─────────┘           │
│                    │                     │
│              Banco de Dados              │
│                    │                     │
│              Informações da              │
│                Comunidade                │
│                                          │
└──────────────────────────────────────────┘
```

---

## Fluxo geral

```text
Comunidade
     │
     ▼
Identificação de necessidade
     │
     ├───────────────┐
     ▼               ▼
Serviço local     Problema
     │               │
     ▼               ▼
Mapa de serviços   Denúncia
     │               │
     └───────┬───────┘
             ▼
      Plataforma Cidadã
             │
             ▼
    Informação organizada
             │
             ▼
       Apoio à comunidade
```

---

## Relação com a extensão universitária

O projeto procura aplicar conhecimentos adquiridos durante a formação acadêmica para resolver um problema observado no contexto social.

A proposta conecta:

**Universidade → Tecnologia → Comunidade**

Nesse processo, conhecimentos de desenvolvimento de sistemas, modelagem, banco de dados, interfaces e análise de requisitos são aplicados a uma situação real.

O projeto também busca demonstrar que uma solução tecnológica não precisa estar limitada a aplicações comerciais: ela pode ser utilizada para **organizar informações, facilitar o acesso a serviços e apoiar a participação comunitária**.

---

## Impacto esperado

Entre os impactos esperados estão:

* Maior facilidade para encontrar serviços locais;
* Centralização de informações da comunidade;
* Maior visibilidade das demandas existentes no bairro;
* Incentivo à participação dos moradores;
* Organização das ocorrências registradas;
* Criação de uma base de informações sobre o território;
* Possibilidade de expansão da solução para outros bairros.

---

## Escalabilidade

Embora o projeto tenha como contexto inicial uma comunidade específica de Curitiba, sua estrutura foi pensada de forma que a solução possa ser adaptada para outras regiões.

Uma evolução futura poderia permitir:

```text
Bairro
  │
  ├── Serviços
  ├── Ocorrências
  ├── Moradores
  └── Informações locais

          ↓

Cidade
  │
  ├── Bairro A
  ├── Bairro B
  ├── Bairro C
  └── Bairro D
```

Isso possibilitaria transformar a solução em uma plataforma comunitária com atuação em diferentes bairros e municípios.

---

## Possíveis evoluções

Entre as funcionalidades que podem ser incorporadas em versões futuras:

* Sistema de autenticação;
* Perfis de usuários;
* Painel administrativo;
* Categorias de ocorrências;
* Geolocalização;
* Upload de imagens;
* Status e acompanhamento das denúncias;
* Filtros no mapa;
* Busca por serviços;
* Avaliação de serviços;
* Dashboard de indicadores comunitários;
* Notificações;
* Relatórios;
* Integração com APIs de mapas;
* Sistema de moderação das informações.

---

## Estrutura conceitual dos dados

Exemplo simplificado das principais entidades:

```text
USUÁRIO
 ├── id
 ├── nome
 └── contato

SERVIÇO
 ├── id
 ├── nome
 ├── categoria
 ├── endereço
 ├── latitude
 └── longitude

OCORRÊNCIA
 ├── id
 ├── categoria
 ├── descrição
 ├── localização
 ├── data
 └── status
```

---

## Status do projeto

**Projeto acadêmico / extensão universitária**

O desenvolvimento da solução ocorre de forma incremental, passando pelas etapas de levantamento, modelagem, desenvolvimento, testes e documentação.

> Este repositório tem finalidade acadêmica e demonstra a aplicação prática de conhecimentos de desenvolvimento de sistemas em um problema relacionado à comunidade.

---

## Contexto acadêmico

**Curso:** Análise e Desenvolvimento de Sistemas
**Instituição:** Centro Universitário Internacional UNINTER
**Modalidade:** Projeto de extensão / atividade acadêmica
**Área:** Tecnologia da Informação e Desenvolvimento Comunitário
**Local de aplicação:** Curitiba — Paraná
**Comunidade de referência:** Campo Comprido

---

## Autor

**Jhonathan Silva Fernandes**

Estudante de **Análise e Desenvolvimento de Sistemas**, com foco em desenvolvimento web e construção de soluções tecnológicas aplicadas a problemas reais.

---

## Licença

Este projeto foi desenvolvido para fins acadêmicos.

Caso o projeto seja posteriormente disponibilizado para uso público, a licença e as condições de utilização poderão ser definidas de acordo com a versão publicada.
