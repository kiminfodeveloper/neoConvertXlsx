// Configurações pré-definidas para cada tipo
const CONFIGURACOES_TIPO = {
    CAC_CAB_FROTA: {
        campos: [
            "Solicitante",
            "Identificação",
            "Motivo",
            "Contrato/CNPJ",
            "Banco",
            "Origem",
            "Omni",
            "Referência",
        ],
        camposObrigatorios: [
            "Solicitante",
            "Identificação",
            "Motivo",
            "Contrato/CNPJ",
            "Banco",
        ],
        nomeArquivo: "Planilha_CAC_CAB_FROTA_Ate_",
        modelo: `Solicitante: Nome do Solicitante (Obrigatorio)
Identificação: ID123456 (Obrigatorio)
Motivo: Descricao detalhada do motivo
Contrato/CNPJ: 12345678 (Obrigatorio)
Banco: Nome do Banco (Obrigatorio)
Origem: Canal de origem

Omni: 987654
Referência: 543210
Tabulações incorretas, OMNI não espelhada
==============================================================
***********************************************************
Solicitante: Segundo Solicitante
Identificação: ID654321
Motivo: Outro motivo de alteracao
Contrato/CNPJ: 87654321
Banco: Bradesco
Origem: Telefone

Omni: 987654
Referência: 102938
Tabulações incorretas, OMNI não espelhada
==============================================================
***********************************************************`,
    },
    CAC: {
        campos: [
            "Consultor",
            "Matricula",
            "Motivo",
            "Contrato/CNPJ",
            "Banco",
            "Ligação",
            "Omni",
            "Referencia",
        ],
        camposObrigatorios: [
            "Consultor",
            "Matricula",
            "Motivo",
            "Contrato/CNPJ",
            "Banco",
        ],
        nomeArquivo: "Planilha_MASTER_Ate_",
        modelo: `Consultor: Nome do Consultor (Obrigatorio)
Matricula: 123456 (Obrigatorio)
Motivo: Descricao detalhada do motivo
Contrato/CNPJ: 12345678 (Obrigatorio)
Banco: Nome do Banco (Obrigatorio)

Omni: 987654
Referencia: 543210
Tabulacoes incorretas, OMNI nao espelhada
==============================================================
***********************************************************
Consultor: Segundo Consultor
Matricula: 654321
Motivo: Outro motivo de alteracao
Contrato/CNPJ: 87654321
Banco: Bradesco

Omni: 987654
Referencia: 102938
Tabulacoes incorretas, OMNI nao espelhada
==============================================================
***********************************************************`,
    },
    CAB: {
        campos: [
            "Bancário",
            "CPF",
            "Agencia",
            "Banco",
            "Produto",
            "CNPJ/Contrato",
            "Motivo",
            "Evento",
            "Descricao",
            "Omni",
            "Referencia",
        ],
        camposObrigatorios: [
            "Bancário",
            "CPF",
            "Banco",
            "Produto",
            "CNPJ/Contrato",
        ],
        nomeArquivo: "Planilha_BANCARIO_Ate_",
        modelo: `Bancário: Nome do Funcionario (Obrigatorio)
CPF: 123.456.789-00 (Obrigatorio)
Agencia: 0001
Banco: Bradesco (Obrigatorio)

Produto: Cartao de Credito (Obrigatorio)
CNPJ/Contrato: 987654321 (Obrigatorio)

Motivo: Cancelamento
Evento: Aumento de limite

Descricao: 
O cliente solicitou o cancelamento devido a juros altos.

Omni: 123
Referencia: 456
==============================================================
***********************************************************
Bancário: Fulano de Tal
CPF: 111.222.333-44
Agencia: 0002
Banco: Itau

Produto: Emprestimo Pessoal
CNPJ/Contrato: 11110000

Motivo: Abertura de Conta
Evento: Aprovacao

Descricao: 
Processo de abertura concluido com sucesso.

Omni: 123
Referencia: 456
==============================================================
***********************************************************`,
    },
    CUSTOM: {
        campos: [],
        camposObrigatorios: [],
        nomeArquivo: "Planilha_CUSTOM_Ate_",
        modelo: `Campo1: Valor do Campo 1
Campo2: Valor do Campo 2
Campo3: Valor do Campo 3
==============================================================
***********************************************************
Campo1: Outro Valor 1
Campo2: Outro Valor 2
Campo3: Outro Valor 3
==============================================================
***********************************************************`,
    },
};

// Variáveis globais
let dadosGlobaisAcumulados = [];
let configuracaoAtual = null;
let conteudoTxt = null;
let contadorColunas = 0;

// Variáveis do DOM
const selectTipo = document.getElementById("tipoProcessamento");
const painelColunas = document.getElementById("painelColunas");
const listaColunas = document.getElementById("listaColunas");
const checkboxesObrigatorios = document.getElementById(
    "checkboxesObrigatorios"
);
const btnAdicionarColuna = document.getElementById("btnAdicionarColuna");
const inputArquivo = document.getElementById("arquivoTxt");
const inputData = document.getElementById("dataManual");
const botaoProcessarDia = document.getElementById("processarDia");
const botaoGerarFinal = document.getElementById("gerarPlanilhaFinal");
const logArea = document.getElementById("logArea");
const totalRegistrosSpan = document.getElementById("totalRegistros");
const feedbackDataDiv = document.getElementById("feedbackData");
const modalAjuda = document.getElementById("modalAjuda");
const btnAjuda = document.getElementById("btnAjuda");
const btnToggleTema = document.getElementById("btnToggleTema");
const iconTema = document.getElementById("iconTema");
const btnFecharModal = document.getElementById("btnFecharModalAjuda");
const btnDownloadModeloCAC = document.getElementById("btnDownloadModeloCAC");
const btnDownloadModeloCAB = document.getElementById("btnDownloadModeloCAB");
const btnGerarModeloCustom = document.getElementById("btnGerarModeloCustom");
const exemploModelo = document.getElementById("exemploModelo");
const uploadModelo = document.getElementById("uploadModelo");
const btnAnalisarModelo = document.getElementById("btnAnalisarModelo");
const modalEdicaoModelo = document.getElementById("modalEdicaoModelo");
const btnFecharModalEdicao = document.getElementById("btnFecharModalEdicao");
const conteudoOriginal = document.getElementById("conteudoOriginal");
const camposDetectados = document.getElementById("camposDetectados");
const btnAplicarSeparadores = document.getElementById("btnAplicarSeparadores");
const btnAplicarCampos = document.getElementById("btnAplicarCampos");

let arquivoModeloCarregado = null;
let camposAnalisados = [];

// --- Funções Auxiliares ---

function log(mensagem) {
    if (!logArea) return;
    logArea.textContent += `\n[${new Date().toLocaleTimeString()}] ${mensagem}`;
    logArea.scrollTop = logArea.scrollHeight;
}

function atualizarStatusAcumulado() {
    const total = dadosGlobaisAcumulados.length;
    if (totalRegistrosSpan) {
        totalRegistrosSpan.textContent = total;
    }
    if (botaoGerarFinal) {
        botaoGerarFinal.disabled = total === 0;
    }
}

function limparTextoParaCSV(texto) {
    if (!texto) return "";
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizarCampo(texto) {
    let limpo = limparTextoParaCSV(texto);
    return limpo.trim().replace(/[:\/]/g, "").replace(/\s/g, "");
}

function obterConfiguracaoAtual() {
    if (!selectTipo) return null;
    const tipo = selectTipo.value;

    if (tipo === "CUSTOM") {
        // Obter campos personalizados
        const campos = [];
        const camposObrigatorios = [];

        if (listaColunas) {
            const inputsColunas =
                listaColunas.querySelectorAll(".input-coluna");
            inputsColunas.forEach((input) => {
                const nomeCampo = input.value.trim();
                if (nomeCampo) {
                    campos.push(nomeCampo);
                }
            });
        }

        if (checkboxesObrigatorios) {
            const checkboxes = checkboxesObrigatorios.querySelectorAll(
                'input[type="checkbox"]:checked'
            );
            checkboxes.forEach((checkbox) => {
                const nomeCampo = checkbox.value;
                if (campos.includes(nomeCampo)) {
                    camposObrigatorios.push(nomeCampo);
                }
            });
        }

        return {
            campos: campos,
            camposObrigatorios: camposObrigatorios,
            nomeArquivo: "Planilha_CUSTOM_Ate_",
            modelo: CONFIGURACOES_TIPO.CUSTOM.modelo,
        };
    } else {
        return CONFIGURACOES_TIPO[tipo];
    }
}

function processarBloco(blocoTexto) {
    if (
        !configuracaoAtual ||
        !configuracaoAtual.campos ||
        configuracaoAtual.campos.length === 0
    ) {
        log("ERRO: Nenhuma configuração de campos definida.");
        return {};
    }

    const dados = {};
    configuracaoAtual.campos.forEach((campo) => {
        dados[normalizarCampo(campo)] = "";
    });

    let textoLimpo = blocoTexto.trim();

    // Remove texto específico indesejado
    // Remover ambas as versões do texto problemático
    textoLimpo = textoLimpo
        .replace(/Tabulações incorretas, OMNI não espelhada/g, "")
        .replace(/Tabulacoes incorretas, OMNI nao espelhada/g, "")
        .trim();

    // Processar linha por linha para extrair campos corretamente
    const linhas = textoLimpo.split("\n");
    let campoAtual = null;
    let valorAtual = "";

    for (let i = 0; i < linhas.length; i++) {
        const linha = linhas[i];

        // Verificar se esta linha é um cabeçalho de campo
        let campoEncontrado = null;
        let valorCampo = "";

        for (const campo of configuracaoAtual.campos) {
            const campoPattern = new RegExp(
                `^\\s*${campo.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")}\\s*:`,
                "i"
            );
            const match = linha.match(campoPattern);

            if (match) {
                campoEncontrado = normalizarCampo(campo);
                // Extrair o valor após os ":" e espaços
                valorCampo = linha.substring(match[0].length).trim();
                break;
            }
        }

        if (campoEncontrado) {
            // Se já estávamos processando um campo, salvar seu valor
            if (campoAtual !== null) {
                // Processar o valor acumulado
                let valorProcessado = valorAtual
                    .split("\n")
                    .map((line) => limparTextoParaCSV(line).trim())
                    .filter((line) => line.length > 0)
                    .join(selectTipo.value === "CAB" ? " | " : " ")
                    .trim();

                dados[campoAtual] = valorProcessado;
            }

            // Começar a processar o novo campo
            campoAtual = campoEncontrado;
            valorAtual = valorCampo;
        } else if (campoAtual !== null && linha.trim() !== "") {
            // Adicionar linha ao valor atual apenas se não for um separador vazio
            if (valorAtual !== "") {
                valorAtual += "\n" + linha;
            } else {
                valorAtual = linha;
            }
        }
    }

    // Não esquecer de salvar o último campo processado
    if (campoAtual !== null) {
        // Processar o valor acumulado
        let valorProcessado = valorAtual
            .split("\n")
            .map((line) => limparTextoParaCSV(line).trim())
            .filter((line) => line.length > 0)
            .join(selectTipo.value === "CAB" ? " | " : " ")
            .trim();

        dados[campoAtual] = valorProcessado;
    }

    return dados;
}

function filtrarBloco(dados) {
    if (
        !configuracaoAtual ||
        !configuracaoAtual.camposObrigatorios ||
        configuracaoAtual.camposObrigatorios.length === 0
    ) {
        return true; // Se não há campos obrigatórios, aceita tudo
    }

    let preenchido = true;

    for (const campo of configuracaoAtual.camposObrigatorios) {
        const chave = normalizarCampo(campo);
        if (!dados[chave] || dados[chave].length === 0) {
            preenchido = false;
            break;
        }
    }

    return preenchido;
}

function gerarCSV(dadosFinais) {
    if (
        !configuracaoAtual ||
        !configuracaoAtual.campos ||
        configuracaoAtual.campos.length === 0
    ) {
        log("ERRO: Nenhuma configuração de campos definida para gerar CSV.");
        return "";
    }

    let header = "DATA_INSERCAO;";
    const chavesNormalizadas = ["DataInsercao"];
    configuracaoAtual.campos.forEach((campo) => {
        const nomeColuna = limparTextoParaCSV(campo)
            .toUpperCase()
            .replace(/\//g, "");
        header += nomeColuna + ";";
        chavesNormalizadas.push(normalizarCampo(campo));
    });
    header = header.slice(0, -1);

    let csv = "\ufeff" + header + "\n";

    dadosFinais.forEach((item) => {
        let linha = item.DataInsercao + ";";

        chavesNormalizadas.slice(1).forEach((chave) => {
            let valor = item[chave] ? item[chave].replace(/"/g, '""') : "";

            if (valor.includes(";") || valor.includes("\n")) {
                valor = `"${valor}"`;
            }
            linha += valor + ";";
        });

        linha = linha.slice(0, -1);
        csv += linha + "\n";
    });

    return csv;
}

function baixarArquivo(conteudo, nomeArquivo) {
    const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");

    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", nomeArquivo);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function avancarData(dataAnteriorString) {
    const dataAnterior = new Date(dataAnteriorString + "T00:00:00");
    const dataAnteriorFormatada = dataAnterior.toLocaleDateString("pt-BR");

    const proximoDia = new Date(dataAnterior);
    proximoDia.setDate(proximoDia.getDate() + 1);

    const dataProximaString = proximoDia.toISOString().split("T")[0];
    const dataProximaFormatada = proximoDia.toLocaleDateString("pt-BR");

    if (inputData) {
        inputData.value = dataProximaString;
    }

    if (feedbackDataDiv) {
        const mensagem = `Próximo dia: **${dataAnteriorFormatada}** → **${dataProximaFormatada}**`;
        feedbackDataDiv.innerHTML = mensagem;
        feedbackDataDiv.classList.add("show");
    }
}

// --- Funções de Interface para Colunas Personalizadas ---

function adicionarColuna(nomeCampo = "") {
    if (!listaColunas) return;
    contadorColunas++;
    const idColuna = `coluna_${contadorColunas}`;

    const divColuna = document.createElement("div");
    divColuna.className = "item-coluna";
    divColuna.id = idColuna;

    divColuna.innerHTML = `
        <input type="text" class="input-coluna" placeholder="Nome do Campo (ex: Cliente, CPF, etc)" value="${nomeCampo}">
        <button type="button" class="btn-remover-coluna" onclick="removerColuna('${idColuna}')">
            <i class="fas fa-trash"></i>
        </button>
    `;

    listaColunas.appendChild(divColuna);

    // Adicionar listener para atualizar checkboxes quando o campo mudar
    const input = divColuna.querySelector(".input-coluna");
    if (input) {
        input.addEventListener("input", () => {
            atualizarCheckboxesObrigatorios();
            verificarEstadoProcessamento();
        });
    }

    atualizarCheckboxesObrigatorios();
    verificarEstadoProcessamento();
}

// Função global para remover coluna (chamada via onclick no HTML)
window.removerColuna = function (idColuna) {
    const elemento = document.getElementById(idColuna);
    if (elemento) {
        elemento.remove();
        atualizarCheckboxesObrigatorios();
    }
};

function atualizarCheckboxesObrigatorios() {
    if (!checkboxesObrigatorios) return;
    checkboxesObrigatorios.innerHTML = "";

    if (!listaColunas) return;
    const inputsColunas = listaColunas.querySelectorAll(".input-coluna");
    inputsColunas.forEach((input) => {
        const nomeCampo = input.value.trim();
        if (nomeCampo) {
            const divCheckbox = document.createElement("div");
            divCheckbox.className = "checkbox-item";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `obrigatorio_${normalizarCampo(nomeCampo)}`;
            checkbox.value = nomeCampo;

            // Verificar se está na lista de obrigatórios da configuração atual
            if (
                configuracaoAtual &&
                configuracaoAtual.camposObrigatorios.includes(nomeCampo)
            ) {
                checkbox.checked = true;
            }

            const label = document.createElement("label");
            label.htmlFor = checkbox.id;
            label.textContent = nomeCampo;

            divCheckbox.appendChild(checkbox);
            divCheckbox.appendChild(label);
            checkboxesObrigatorios.appendChild(divCheckbox);
        }
    });
}

function atualizarInterfacePorTipo() {
    if (!selectTipo) return;
    const tipo = selectTipo.value;

    // Limpar dados acumulados quando mudar o tipo
    dadosGlobaisAcumulados = [];
    atualizarStatusAcumulado();
    log(`Tipo de processamento alterado para: ${tipo}`);

    if (tipo === "CUSTOM") {
        if (painelColunas) {
            painelColunas.style.display = "block";
        }
        // Se não houver colunas, adicionar uma vazia
        if (
            listaColunas &&
            listaColunas.querySelectorAll(".item-coluna").length === 0
        ) {
            adicionarColuna();
        }
    } else {
        if (painelColunas) {
            painelColunas.style.display = "none";
        }
        // Limpar colunas personalizadas
        if (listaColunas) {
            listaColunas.innerHTML = "";
        }
        if (checkboxesObrigatorios) {
            checkboxesObrigatorios.innerHTML = "";
        }
    }

    // Atualizar configuração atual
    configuracaoAtual = obterConfiguracaoAtual();

    // Atualizar exemplo no modal
    atualizarExemploModelo();

    // Verificar se pode habilitar processamento
    verificarEstadoProcessamento();
}

function verificarEstadoProcessamento() {
    configuracaoAtual = obterConfiguracaoAtual();
    const temConfiguracao =
        configuracaoAtual &&
        configuracaoAtual.campos &&
        configuracaoAtual.campos.length > 0;
    const temArquivo = conteudoTxt !== null;
    const temData = inputData && inputData.value !== "";

    if (botaoProcessarDia) {
        botaoProcessarDia.disabled = !(
            temConfiguracao &&
            temArquivo &&
            temData
        );
    }
}

function atualizarExemploModelo() {
    if (!configuracaoAtual || !exemploModelo) return;

    exemploModelo.innerHTML = `<pre>${configuracaoAtual.modelo}</pre>`;
}

function gerarModeloCustomizado() {
    const config = obterConfiguracaoAtual();

    if (!config || !config.campos || config.campos.length === 0) {
        log("ERRO: Configure pelo menos uma coluna antes de gerar o modelo.");
        return;
    }

    // Gerar dois blocos de exemplo
    let modelo = "";

    // Primeiro bloco
    config.campos.forEach((campo, index) => {
        const isObrigatorio = config.camposObrigatorios.includes(campo);
        const marcador = isObrigatorio ? " (Obrigatorio)" : "";
        modelo += `${campo}: Valor exemplo ${index + 1}${marcador}\n`;
    });

    modelo +=
        "==============================================================\n";
    modelo += "***********************************************************\n";

    // Segundo bloco
    config.campos.forEach((campo, index) => {
        const isObrigatorio = config.camposObrigatorios.includes(campo);
        const marcador = isObrigatorio ? " (Obrigatorio)" : "";
        modelo += `${campo}: Outro valor exemplo ${index + 1}${marcador}\n`;
    });

    modelo +=
        "==============================================================\n";
    modelo += "***********************************************************";

    const nomeArquivo = "modelo_custom_txt.txt";
    baixarArquivo(modelo, nomeArquivo);
    log(`Modelo customizado gerado e download iniciado: ${nomeArquivo}`);
}

// --- Funções de Análise e Edição de Modelo ---

function analisarArquivoModelo(conteudo) {
    camposAnalisados = [];
    const linhas = conteudo.split("\n");
    const camposEncontrados = new Set();
    const exemplosCampos = {};

    // Separador padrão
    const SEPARADOR_REGEX = /={20,}\s*\*{20,}| \*{20,}\s*={20,}/;

    // Analisar cada linha procurando por padrão "Campo: valor"
    linhas.forEach((linha, index) => {
        linha = linha.trim();

        // Ignorar linhas vazias e separadores
        if (!linha || SEPARADOR_REGEX.test(linha)) {
            return;
        }

        // Procurar padrão "Campo: valor"
        const match = linha.match(/^([^:]+):\s*(.+)$/);
        if (match) {
            const nomeCampo = match[1].trim();
            const valor = match[2].trim();

            if (nomeCampo && !camposEncontrados.has(nomeCampo)) {
                camposEncontrados.add(nomeCampo);
                exemplosCampos[nomeCampo] = valor;
            }
        }
    });

    // Converter para array
    camposAnalisados = Array.from(camposEncontrados).map((nome) => ({
        nome: nome,
        exemplo: exemplosCampos[nome] || "",
        obrigatorio: false,
    }));

    return camposAnalisados;
}

function exibirCamposDetectados() {
    if (!camposDetectados) return;

    if (camposAnalisados.length === 0) {
        camposDetectados.innerHTML = `
            <p style="color: var(--color-text-secondary); font-style: italic; text-align: center; padding: 20px;">
                <i class="fas fa-info-circle" style="margin-right: 5px;"></i>
                Nenhum campo detectado. Use o formato "NomeCampo: valor" em cada linha.
            </p>
        `;
        btnAplicarCampos.style.display = "none";
        return;
    }

    let html = "";
    camposAnalisados.forEach((campo, index) => {
        const badgeClass = campo.obrigatorio
            ? "badge-obrigatorio"
            : "badge-opcional";
        const badgeText = campo.obrigatorio ? "Obrigatório" : "Opcional";

        html += `
            <div class="campo-item detected">
                <div class="campo-info">
                    <div class="campo-nome">${campo.nome}</div>
                    <div class="campo-exemplo">Exemplo: ${
                        campo.exemplo || "sem valor"
                    }</div>
                </div>
                <div>
                    <span class="campo-badge ${badgeClass}">${badgeText}</span>
                    <input type="checkbox" class="toggle-obrigatorio" data-index="${index}" 
                           ${campo.obrigatorio ? "checked" : ""} 
                           style="margin-left: 10px; cursor: pointer;">
                </div>
            </div>
        `;
    });

    camposDetectados.innerHTML = html;
    btnAplicarCampos.style.display = "block";

    // Adicionar listeners aos checkboxes
    camposDetectados
        .querySelectorAll(".toggle-obrigatorio")
        .forEach((checkbox) => {
            checkbox.addEventListener("change", (e) => {
                const index = parseInt(e.target.dataset.index);
                camposAnalisados[index].obrigatorio = e.target.checked;
            });
        });
}

function aplicarSeparadoresPadroes() {
    if (!conteudoOriginal) return;

    let conteudo = conteudoOriginal.value;

    // Verificar se já tem separadores
    const SEPARADOR_REGEX = /={20,}\s*\*{20,}| \*{20,}\s*={20,}/;
    const temSeparadores = SEPARADOR_REGEX.test(conteudo);

    if (temSeparadores) {
        log("O arquivo já possui separadores.");
        return;
    }

    // Dividir em blocos (linhas vazias ou múltiplas linhas vazias)
    const blocos = conteudo.split(/\n\s*\n/).filter((b) => b.trim());

    if (blocos.length < 2) {
        log(
            "AVISO: É necessário pelo menos 2 blocos para aplicar separadores."
        );
        return;
    }

    // Reconstruir com separadores
    let novoConteudo = "";
    blocos.forEach((bloco, index) => {
        novoConteudo += bloco.trim();
        if (index < blocos.length - 1) {
            novoConteudo +=
                "\n==============================================================\n";
            novoConteudo +=
                "***********************************************************\n";
        }
    });

    conteudoOriginal.value = novoConteudo;
    log("Separadores padrões aplicados com sucesso!");

    // Re-analisar após aplicar separadores
    analisarArquivoModelo(novoConteudo);
    exibirCamposDetectados();
}

function aplicarCamposDetectados() {
    if (camposAnalisados.length === 0) {
        log("ERRO: Nenhum campo detectado para aplicar.");
        return;
    }

    if (!listaColunas) {
        log("ERRO: Elemento listaColunas não encontrado.");
        return;
    }

    // Limpar colunas existentes
    listaColunas.innerHTML = "";

    // Adicionar campos detectados
    camposAnalisados.forEach((campo) => {
        adicionarColuna(campo.nome);
    });

    // Atualizar checkboxes obrigatórios
    atualizarCheckboxesObrigatorios();

    // Marcar campos obrigatórios
    camposAnalisados.forEach((campo) => {
        if (campo.obrigatorio) {
            const checkbox = document.getElementById(
                `obrigatorio_${normalizarCampo(campo.nome)}`
            );
            if (checkbox) {
                checkbox.checked = true;
            }
        }
    });

    // Fechar modal
    if (modalEdicaoModelo) {
        modalEdicaoModelo.style.display = "none";
    }

    log(
        `Campos aplicados: ${camposAnalisados.length} campo(s) configurado(s).`
    );
    verificarEstadoProcessamento();
}

// --- Event Listeners ---

// Mudança de tipo de processamento
if (selectTipo) {
    selectTipo.addEventListener("change", atualizarInterfacePorTipo);
}

// Adicionar coluna personalizada
if (btnAdicionarColuna) {
    btnAdicionarColuna.addEventListener("click", () => {
        adicionarColuna();
    });
}

// Carregamento de arquivo
if (inputArquivo) {
    inputArquivo.addEventListener("change", (e) => {
        const arquivo = e.target.files[0];
        if (arquivo) {
            log(`Arquivo '${arquivo.name}' carregado. Lendo conteúdo...`);
            const leitor = new FileReader();

            leitor.onload = (evento) => {
                conteudoTxt = evento.target.result;
                log("Leitura do TXT concluída. Pronto para processar o dia.");
                verificarEstadoProcessamento();
            };

            leitor.onerror = () => {
                log("ERRO: Falha ao ler o arquivo.");
                conteudoTxt = null;
                verificarEstadoProcessamento();
            };

            leitor.readAsText(arquivo, "UTF-8");
        } else {
            conteudoTxt = null;
            verificarEstadoProcessamento();
        }
    });
}

// Verificar estado quando a data mudar
if (inputData) {
    inputData.addEventListener("change", verificarEstadoProcessamento);
}

// Processar dia
if (botaoProcessarDia) {
    botaoProcessarDia.addEventListener("click", () => {
        if (!conteudoTxt) {
            log(
                "ERRO: Nenhum arquivo TXT carregado. Por favor, carregue o arquivo do dia."
            );
            return;
        }

        const dataManual = inputData.value;
        if (!dataManual) {
            log("ERRO: Por favor, insira a Data de Inserção do Lote.");
            inputData.focus();
            return;
        }

        // Atualizar configuração antes de processar
        configuracaoAtual = obterConfiguracaoAtual();

        if (
            !configuracaoAtual ||
            !configuracaoAtual.campos ||
            configuracaoAtual.campos.length === 0
        ) {
            log(
                "ERRO: Nenhuma campo configurado. Por favor, configure os campos antes de processar."
            );
            return;
        }

        log(`Iniciando processamento do dia: ${dataManual}...`);

        const SEPARADOR_REGEX = /={20,}\s*\*{20,}| \*{20,}\s*={20,}/g;

        const blocosBrutos = conteudoTxt
            .split(SEPARADOR_REGEX)
            .filter((bloco) => bloco.trim() !== "");

        const blocosFinais = blocosBrutos
            .map((b) =>
                b
                    .replace(/={20,}/g, "")
                    .replace(/\*{20,}/g, "")
                    .trim()
            )
            .filter((b) => b.length > 0);

        const dadosDoDia = [];
        let contadorFiltrado = 0;

        blocosFinais.forEach((bloco) => {
            const dadosBloco = processarBloco(bloco);

            if (filtrarBloco(dadosBloco)) {
                dadosBloco.DataInsercao = dataManual;
                dadosDoDia.push(dadosBloco);
                contadorFiltrado++;
            }
        });

        dadosGlobaisAcumulados = dadosGlobaisAcumulados.concat(dadosDoDia);

        log(`Processamento do dia ${dataManual} concluído.`);
        log(`-> Registros Válidos adicionados: ${contadorFiltrado}`);

        // Limpeza e avanço para o próximo dia
        inputArquivo.value = "";
        conteudoTxt = null;
        botaoProcessarDia.disabled = true;

        avancarData(dataManual);

        log(
            `-> Total Geral Acumulado: ${dadosGlobaisAcumulados.length} registros.`
        );
        atualizarStatusAcumulado();
    });
}

// Gerar planilha final
if (botaoGerarFinal) {
    botaoGerarFinal.addEventListener("click", () => {
        if (dadosGlobaisAcumulados.length === 0) {
            log("AVISO: Não há registros acumulados para gerar a planilha.");
            return;
        }

        // Atualizar configuração antes de gerar
        configuracaoAtual = obterConfiguracaoAtual();

        log("Gerando Planilha Final com todos os dados acumulados...");

        const csvContent = gerarCSV(dadosGlobaisAcumulados);

        const hoje = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const nomeArquivo = `${configuracaoAtual.nomeArquivo}${hoje}.csv`;

        // Download do CSV
        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", nomeArquivo);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        log(
            `SUCESSO: Arquivo MESTRE '${nomeArquivo}' gerado e download iniciado.`
        );
    });
}

// Modal de ajuda
if (btnAjuda) {
    btnAjuda.onclick = function () {
        atualizarExemploModelo();
        if (modalAjuda) {
            modalAjuda.style.display = "flex";
            modalAjuda.style.alignItems = "center";
            modalAjuda.style.justifyContent = "center";
        }
    };

    if (btnFecharModal) {
        btnFecharModal.onclick = function () {
            if (modalAjuda) {
                modalAjuda.style.display = "none";
            }
        };
    }

    window.onclick = function (event) {
        if (modalAjuda && event.target == modalAjuda) {
            modalAjuda.style.display = "none";
        }
    };
}

// Download dos modelos
const btnDownloadModeloFROTA = document.getElementById(
    "btnDownloadModeloFROTA"
);

if (btnDownloadModeloFROTA) {
    btnDownloadModeloFROTA.onclick = function () {
        baixarArquivo(
            CONFIGURACOES_TIPO.CAC_CAB_FROTA.modelo,
            "modelo_frota_txt.txt"
        );
        log("Modelo CAC/CAB FROTA baixado com sucesso.");
    };
}

if (btnDownloadModeloCAC) {
    btnDownloadModeloCAC.onclick = function () {
        baixarArquivo(CONFIGURACOES_TIPO.CAC.modelo, "modelo_cac_txt.txt");
        log("Modelo CAC baixado com sucesso.");
    };
}

if (btnDownloadModeloCAB) {
    btnDownloadModeloCAB.onclick = function () {
        baixarArquivo(CONFIGURACOES_TIPO.CAB.modelo, "modelo_cab_txt.txt");
        log("Modelo CAB baixado com sucesso.");
    };
}

// Gerar modelo customizado
if (btnGerarModeloCustom) {
    btnGerarModeloCustom.onclick = function () {
        gerarModeloCustomizado();
    };
}

// Upload de modelo para análise
if (uploadModelo) {
    uploadModelo.addEventListener("change", (e) => {
        const arquivo = e.target.files[0];
        if (arquivo) {
            const leitor = new FileReader();
            leitor.onload = (evento) => {
                arquivoModeloCarregado = evento.target.result;
                conteudoOriginal.value = arquivoModeloCarregado;
                btnAnalisarModelo.style.display = "block";
                log(
                    `Arquivo modelo '${arquivo.name}' carregado. Clique em "Analisar e Configurar Campos" para continuar.`
                );
            };
            leitor.readAsText(arquivo, "UTF-8");
        }
    });
}

// Analisar modelo
if (btnAnalisarModelo) {
    btnAnalisarModelo.onclick = function () {
        if (!conteudoOriginal || !conteudoOriginal.value.trim()) {
            log("ERRO: Nenhum conteúdo para analisar.");
            return;
        }

        analisarArquivoModelo(conteudoOriginal.value);
        exibirCamposDetectados();
        modalEdicaoModelo.style.display = "flex";
        modalEdicaoModelo.style.alignItems = "center";
        modalEdicaoModelo.style.justifyContent = "center";
        log(
            `Análise concluída: ${camposAnalisados.length} campo(s) detectado(s).`
        );
    };
}

// Fechar modal de edição
if (btnFecharModalEdicao) {
    btnFecharModalEdicao.onclick = function () {
        modalEdicaoModelo.style.display = "none";
    };
}

// Aplicar separadores padrões
if (btnAplicarSeparadores) {
    btnAplicarSeparadores.onclick = function () {
        aplicarSeparadoresPadroes();
    };
}

// Atualizar análise quando o conteúdo for editado
if (conteudoOriginal) {
    let timeoutAnalise;
    conteudoOriginal.addEventListener("input", function () {
        clearTimeout(timeoutAnalise);
        timeoutAnalise = setTimeout(() => {
            analisarArquivoModelo(conteudoOriginal.value);
            exibirCamposDetectados();
        }, 1000); // Debounce de 1 segundo
    });
}

// Aplicar campos detectados
if (btnAplicarCampos) {
    btnAplicarCampos.onclick = function () {
        aplicarCamposDetectados();
    };
}

// Fechar modal de edição
if (btnFecharModalEdicao) {
    btnFecharModalEdicao.onclick = function () {
        if (modalEdicaoModelo) {
            modalEdicaoModelo.style.display = "none";
        }
    };
}

// Fechar modal clicando fora
if (modalEdicaoModelo) {
    window.addEventListener("click", function (event) {
        if (event.target == modalEdicaoModelo) {
            modalEdicaoModelo.style.display = "none";
        }
    });
}

// --- Funções de Navegação entre Páginas ---

function mostrarPagina(pageId) {
    // Esconder todas as páginas
    const pages = document.querySelectorAll(".page");
    pages.forEach((page) => {
        page.classList.remove("active");
    });

    // Mostrar a página selecionada
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add("active");
    }

    // Atualizar links ativos na navbar
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("data-page") === pageId) {
            link.classList.add("active");
        }
    });

    // Fechar menu mobile se estiver aberto
    const navMenu = document.querySelector(".nav-menu");
    const hamburger = document.querySelector(".hamburger");
    if (navMenu && hamburger) {
        navMenu.classList.remove("active");
        hamburger.classList.remove("active");
    }
}

// --- Event Listeners para Navegação ---

// Navegação pelos links da navbar
document.addEventListener("click", function (e) {
    if (
        e.target.classList.contains("nav-link") &&
        e.target.getAttribute("data-page")
    ) {
        e.preventDefault();
        const pageId = e.target.getAttribute("data-page");
        mostrarPagina(pageId);

        // Scroll para o topo
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
});

// Menu hamburguer para mobile
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
        navMenu.classList.toggle("active");
        hamburger.classList.toggle("active");
    });
}

// Fechar menu mobile ao clicar fora
document.addEventListener("click", function (e) {
    if (navMenu && hamburger) {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            navMenu.classList.remove("active");
            hamburger.classList.remove("active");
        }
    }
});

// Botão Versão 2.0 - Mostrar mensagem de em breve
const btnVersao2 = document.getElementById("btnVersao2");
if (btnVersao2) {
    btnVersao2.addEventListener("click", function () {
        alert(
            "Em breve teremos novidades! 🚀\n\nEstamos trabalhando na próxima geração do NeoConvertXlsx com novas funcionalidades incríveis."
        );
    });
}

// Inicialização - Aguardar DOM estar pronto
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
        inicializar();
        // Mostrar página inicial por padrão
        mostrarPagina("inicio");
    });
} else {
    inicializar();
    // Mostrar página inicial por padrão
    mostrarPagina("inicio");
}

// --- Funções de Tema ---

function aplicarTema(tema) {
    const html = document.documentElement;
    if (tema === "dark") {
        html.setAttribute("data-theme", "dark");
        if (iconTema) {
            iconTema.className = "fas fa-sun";
        }
        localStorage.setItem("tema", "dark");
    } else {
        html.removeAttribute("data-theme");
        if (iconTema) {
            iconTema.className = "fas fa-moon";
        }
        localStorage.setItem("tema", "light");
    }
}

function alternarTema() {
    const temaAtual = document.documentElement.getAttribute("data-theme");
    if (temaAtual === "dark") {
        aplicarTema("light");
    } else {
        aplicarTema("dark");
    }
}

function carregarTemaSalvo() {
    const temaSalvo = localStorage.getItem("tema");
    if (temaSalvo) {
        aplicarTema(temaSalvo);
    } else {
        // Verificar preferência do sistema
        if (
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
            aplicarTema("dark");
        }
    }
}

// Event listener para toggle de tema
if (btnToggleTema) {
    btnToggleTema.addEventListener("click", alternarTema);
}

function inicializar() {
    // Carregar tema salvo primeiro
    carregarTemaSalvo();

    if (selectTipo) {
        atualizarInterfacePorTipo();
    }
    log(
        'Interface pronta. Selecione o tipo de processamento, insira a data, carregue o TXT e clique em "Processar e Adicionar Dia".'
    );
    atualizarStatusAcumulado();
}
