# NeoConvertXlsx - Conversor Mestre TXT para Planilha CSV

![Conversor Mestre TXT para Planilha CSV](https://img.shields.io/badge/Versão-1.0.0-blue.svg)
![Licença](https://img.shields.io/badge/Licença-MIT-green.svg)

## Descrição

O NeoConvertXlsx é uma ferramenta web que converte arquivos TXT estruturados em planilhas CSV consolidadas. Ele permite processar dados de diferentes dias e gerar uma planilha mestra unificada, com suporte para três tipos de processamento: CAC/CAB FROTA, CAC (Consultor), CAB (Bancário) e CUSTOM (Personalizado).

A aplicação oferece uma interface moderna e intuitiva com recursos como:

-   Modo claro e escuro
-   Processamento por lotes de diferentes dias
-   Validação de campos obrigatórios
-   Detecção automática de campos em arquivos modelo
-   Geração de modelos de entrada

## Estrutura do Projeto

```
neoConvertXlsx/
├── src/
│   ├── css/
│   │   └── style.css           # Estilização e temas
│   ├── js/
│   │   └── main.js             # Lógica de processamento e interatividade
│   └── assets/
│       └── images/             # Imagens e recursos visuais
├── docs/
│   └── README.md               # Documentação completa
├── index.html                  # Página principal da aplicação
└── LICENSE                     # Licença do projeto
```

## Documentação Completa

Para informações detalhadas sobre uso, funcionalidades e desenvolvimento, consulte a [documentação completa](docs/README.md).

## Como Usar

1. Abra o arquivo `index.html` em seu navegador preferido
2. Selecione o tipo de processamento desejado
3. Configure os campos conforme necessário
4. Carregue seus arquivos TXT
5. Processe os dados e gere a planilha final

## Recursos

### Tipos de Processamento

1. **CAC/CAB FROTA - Sistema Principal**

    - Campos: Solicitante, Identificação, Motivo, Contrato/CNPJ, Banco, Origem, Omni, Referência
    - Campos obrigatórios: Solicitante, Identificação, Motivo, Contrato/CNPJ, Banco

2. **CAC - Consultor**

    - Campos: Consultor, Matricula, Motivo, Contrato/CNPJ, Banco, Ligação, Omni, Referencia
    - Campos obrigatórios: Consultor, Matricula, Motivo, Contrato/CNPJ, Banco

3. **CAB - Bancário**

    - Campos: Bancário, CPF, Agencia, Banco, Produto, CNPJ/Contrato, Motivo, Evento, Descricao, Omni, Referencia
    - Campos obrigatórios: Bancário, CPF, Banco, Produto, CNPJ/Contrato

4. **CUSTOM - Personalizado**
    - Permite definir campos personalizados
    - Possibilidade de marcar campos como obrigatórios
    - Geração de modelo TXT personalizado

## Tecnologias Utilizadas

-   HTML5
-   CSS3 (com variáveis CSS para temas)
-   JavaScript (ES6+)
-   Font Awesome (para ícones)
-   Google Fonts (Roboto e Inter)

## Desenvolvimento

Projeto desenvolvido por **KIM INFO TEC**  
WhatsApp: +55 11 99123-1629  
[LinkedIn](https://www.linkedin.com/feed/) | [GitHub](https://github.com/kiminfodeveloper)

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

_Todos os processos são realizados localmente no seu navegador. Nenhum dado é armazenado em servidores externos ou na nuvem._
