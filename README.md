# NeoConvertXlsx - Conversor Mestre TXT para Planilha CSV

![Conversor Mestre TXT para Planilha CSV](https://img.shields.io/badge/Versão-1.0.0-blue.svg)
![Licença](https://img.shields.io/badge/Licença-MIT-green.svg)

## Descrição

O NeoConvertXlsx é uma ferramenta web que converte arquivos TXT estruturados em planilhas CSV consolidadas. Ele permite processar dados de diferentes dias e gerar uma planilha mestra unificada, com suporte para três tipos de processamento: CAC (Consultor), CAB (Bancário) e CUSTOM (Personalizado).

A aplicação oferece uma interface moderna e intuitiva com recursos como:

-   Modo claro e escuro
-   Processamento por lotes de diferentes dias
-   Validação de campos obrigatórios
-   Detecção automática de campos em arquivos modelo
-   Geração de modelos de entrada

## Recursos

### Tipos de Processamento

1. **CAC - Consultor**

    - Campos: Consultor, Matricula, Motivo, Contrato/CNPJ, Banco, Ligação, Omni, Referencia
    - Campos obrigatórios: Consultor, Matricula, Motivo, Contrato/CNPJ, Banco

2. **CAB - Bancário**

    - Campos: Bancário, CPF, Agencia, Banco, Produto, CNPJ/Contrato, Motivo, Evento, Descricao, Omni, Referencia
    - Campos obrigatórios: Bancário, CPF, Banco, Produto, CNPJ/Contrato

3. **CUSTOM - Personalizado**
    - Permite definir campos personalizados
    - Possibilidade de marcar campos como obrigatórios
    - Geração de modelo TXT personalizado

### Funcionalidades Principais

-   Interface responsiva com modo claro/escuro
-   Processamento sequencial de arquivos por dia
-   Validação de campos obrigatórios
-   Feedback visual em tempo real
-   Geração automática de nomes de arquivos com datas
-   Análise automática de arquivos modelo
-   Download direto da planilha final em formato CSV

## Estrutura do Projeto

```
neoConvertXlsx/
├── index.html          # Página principal da aplicação
├── script.js           # Lógica de processamento e interatividade
├── style.css           # Estilização e temas
└── README.md           # Este arquivo
```

## Como Usar

### 1. Selecionar o Tipo de Processamento

Escolha entre CAC, CAB ou CUSTOM no seletor "Tipo de Processamento".

### 2. Configurar Colunas (somente para CUSTOM)

Se escolher o tipo CUSTOM:

-   Adicione os campos necessários
-   Marque quais campos são obrigatórios
-   Gere um modelo TXT personalizado

### 3. Processar Dados Diários

Siga estes passos para cada dia de dados:

1. Insira a data de inserção do lote
2. Carregue o arquivo TXT correspondente
3. Clique em "Processar e Adicionar Dia"
4. Repita para todos os dias necessários

### 4. Gerar Planilha Final

Após processar todos os dias desejados, clique em "Gerar Planilha FINAL (CSV)" para baixar o arquivo consolidado.

## Formato do Arquivo TXT

Os arquivos TXT devem seguir um formato específico com separadores:

```
Campo1: Valor do Campo 1
Campo2: Valor do Campo 2

==============================================================
***********************************************************

Campo1: Outro Valor 1
Campo2: Outro Valor 2

==============================================================
***********************************************************
```

### Separadores

-   `==============================================================` - Separador principal entre blocos
-   `***********************************************************` - Separador secundário entre blocos

## Problemas Conhecidos e Correções

### Problema com campos Omni/Referencia

**Problema**: Anteriormente, ao usar os tipos de processamento CAC ou CAB, os campos "Omni" e "Referencia" estavam sendo combinados em uma única coluna. Especificamente:

-   O campo Omni estava recebendo o valor "987654 Referencia: 543210" (incluindo o valor e o cabeçalho do campo Referencia)
-   O campo Referencia estava ficando vazio

### Problema com campos CPF/Agencia no CAB

**Problema**: No processamento CAB, os campos "CPF" e "Agencia" estavam sendo combinados em uma única coluna. Especificamente:

-   O campo CPF estava recebendo valores como "123.456.789-00 | Agencia: 0001"
-   O campo Agencia estava ficando vazio

**Solução**: Foram feitas correções para garantir consistência entre os nomes dos campos na configuração e nos modelos:

1. Atualização dos modelos CAC e CAB para garantir uma separação adequada entre campos
2. Correção da consistência nos nomes dos campos na configuração para corresponder aos modelos
3. Remoção de acentos nos nomes dos campos na configuração para corresponder aos modelos

## Tecnologias Utilizadas

-   HTML5
-   CSS3 (com variáveis CSS para temas)
-   JavaScript (ES6+)
-   Font Awesome (para ícones)
-   Google Fonts (Roboto e Inter)

## Instalação

1. Clone este repositório:

    ```
    git clone https://github.com/seu-usuario/neoConvertXlsx.git
    ```

2. Navegue até o diretório do projeto:

    ```
    cd neoConvertXlsx
    ```

3. Abra o arquivo `index.html` em seu navegador preferido

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Autor

Desenvolvido com ❤️ para facilitar a conversão de dados estruturados em planilhas.

## Suporte

Para suporte, utilize a seção de Issues do GitHub ou entre em contato diretamente.

---

## Informações Adicionais

Criado por KIM INFO TEC 2025

Os arquivos são armazenados localmente e não possuem nenhuma saída de dados.
