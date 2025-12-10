// Constantes dos NOVOS campos bancários
const CAMPOS = [
    "Bancário", "CPF", "Agência", "Banco", "Produto", 
    "CNPJ/Contrato", "Motivo", "Evento", "Descrição", "Omni", "Referência"
];

// Campos que definimos como OBRIGATÓRIOS para o filtro
const CAMPOS_OBRIGATORIOS = [
    "Bancário", "CPF", "Banco", "Produto", "CNPJ/Contrato"
];

// Conteúdo do arquivo TXT modelo para download (Atualizado com separadores)
const CONTEUDO_MODELO_TXT = `Bancário: Nome do Funcionario (Obrigatorio)
CPF: 123.456.789-00 (Obrigatorio)
Agencia: 0001
Banco: Bradesco (Obrigatorio)

Produto: Cartao de Credito (Obrigatorio)
CNPJ/Contrato: 987654321 (Obrigatorio)

Motivo: Cancelamento
Evento: Aumento de limite

Descricao: 
O cliente solicitou o cancelamento devido a juros altos.

Omni: 
Referencia: 
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
***********************************************************`;


// VARIÁVEL GLOBAL PARA ARMAZENAR TODOS OS DADOS ACUMULADOS
let dadosGlobaisAcumulados = [];

// Variáveis do DOM 
const inputArquivo = document.getElementById('arquivoTxt');
const inputData = document.getElementById('dataManual');
const botaoProcessarDia = document.getElementById('processarDia');
const botaoGerarFinal = document.getElementById('gerarPlanilhaFinal');
const logArea = document.getElementById('logArea');
const totalRegistrosSpan = document.getElementById('totalRegistros');
const feedbackDataDiv = document.getElementById('feedbackData');

// Variáveis do Modal
const modalAjuda = document.getElementById('modalAjuda');
const btnAjuda = document.getElementById('btnAjuda');
const btnFecharModal = document.getElementsByClassName('close-button')[0];
const btnDownloadModelo = document.getElementById('btnDownloadModelo');

let conteudoTxt = null;

// --- Funções Auxiliares ---

function log(mensagem) {
    logArea.textContent += `\n[${new Date().toLocaleTimeString()}] ${mensagem}`;
    logArea.scrollTop = logArea.scrollHeight; 
}

function atualizarStatusAcumulado() {
    const total = dadosGlobaisAcumulados.length;
    totalRegistrosSpan.textContent = total;
    botaoGerarFinal.disabled = total === 0; 
}

function limparTextoParaCSV(texto) {
    if (!texto) return '';
    // Esta função é crucial para a normalização de texto sem acentos para chaves/valores
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
}

function normalizarCampo(texto) {
    let limpo = limparTextoParaCSV(texto);
    return limpo.trim()
        .replace(/[:\/]/g, '')
        .replace(/\s/g, '');
}

/**
 * Processa um bloco de texto e extrai os valores dos campos.
 */
function processarBloco(blocoTexto) {
    const dados = {};
    CAMPOS.forEach(campo => {
        dados[normalizarCampo(campo)] = '';
    });

    // A lógica de extração de campos por regex (campo:) permanece a mesma
    let textoLimpo = blocoTexto.trim();

    const campoRegex = new RegExp(`(${CAMPOS.join(':|')}:)`, 'g');
    const matches = Array.from(textoLimpo.matchAll(campoRegex));

    if (matches.length === 0) return dados;

    for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        const nomeCampoComDoisPontos = match[0].trim();
        const nomeCampo = nomeCampoComDoisPontos.slice(0, -1).trim();
        const chaveNormalizada = normalizarCampo(nomeCampo);
        const inicioValor = match.index + nomeCampoComDoisPontos.length;

        const fimValor = (i + 1 < matches.length) ? matches[i+1].index : textoLimpo.length;
        
        let valor = textoLimpo.substring(inicioValor, fimValor).trim();
        
        // Mantemos a conversão de quebras de linha em " | " para consolidação no CSV
        valor = valor.split('\n').map(line => limparTextoParaCSV(line).trim()).filter(line => line.length > 0).join(' | ').trim();
        
        dados[chaveNormalizada] = valor;
    }

    return dados;
}

function filtrarBloco(dados) {
    let preenchido = true;
    
    for (const campo of CAMPOS_OBRIGATORIOS) {
        const chave = normalizarCampo(campo);
        if (!dados[chave] || dados[chave].length === 0) {
            preenchido = false;
            break;
        }
    }

    return preenchido;
}

function gerarCSV(dadosFinais) {
    let header = 'DATA_INSERCAO;';
    const chavesNormalizadas = ['DataInsercao'];
    CAMPOS.forEach(campo => {
        const nomeColuna = limparTextoParaCSV(campo).toUpperCase().replace(/\//g, '');
        header += nomeColuna + ';';
        chavesNormalizadas.push(normalizarCampo(campo));
    });
    header = header.slice(0, -1);

    let csv = '\ufeff' + header + '\n';

    dadosFinais.forEach(item => {
        let linha = item.DataInsercao + ';';
        
        chavesNormalizadas.slice(1).forEach(chave => { 
            let valor = item[chave] ? item[chave].replace(/"/g, '""') : '';
            
            if (valor.includes(';') || valor.includes('\n')) {
                valor = `"${valor}"`;
            }
            linha += valor + ';';
        });
        
        linha = linha.slice(0, -1);
        csv += linha + '\n';
    });

    return csv;
}

function baixarArquivo(conteudo, nomeArquivo) {
    const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement("a");
    
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", nomeArquivo);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function avancarData(dataAnteriorString) {
    const dataAnterior = new Date(dataAnteriorString + 'T00:00:00'); 
    const dataAnteriorFormatada = dataAnterior.toLocaleDateString('pt-BR');
    
    const proximoDia = new Date(dataAnterior);
    proximoDia.setDate(proximoDia.getDate() + 1); 
    
    const dataProximaString = proximoDia.toISOString().split('T')[0];
    const dataProximaFormatada = proximoDia.toLocaleDateString('pt-BR');

    inputData.value = dataProximaString;

    const mensagem = `Próximo dia: **${dataAnteriorFormatada}** → **${dataProximaFormatada}**`;
    feedbackDataDiv.innerHTML = mensagem;
    
    feedbackDataDiv.classList.add('show');
}


// ----------------------------------------------------------------------

// --- Funções de Eventos (Event Listeners) ---

// 1. Lida com o carregamento do arquivo TXT.
inputArquivo.addEventListener('change', (e) => {
    const arquivo = e.target.files[0];
    if (arquivo) {
        log(`Arquivo '${arquivo.name}' carregado. Lendo conteúdo...`);
        const leitor = new FileReader();
        
        leitor.onload = (evento) => {
            conteudoTxt = evento.target.result;
            botaoProcessarDia.disabled = false;
            log('Leitura do TXT concluída. Pronto para processar o dia.');
        };

        leitor.onerror = () => {
            log('ERRO: Falha ao ler o arquivo.');
            conteudoTxt = null;
            botaoProcessarDia.disabled = true;
        };
        
        leitor.readAsText(arquivo, 'UTF-8');
    } else {
        conteudoTxt = null;
        botaoProcessarDia.disabled = true;
    }
});


// 2. Lógica de PROCESSAR UM DIA, ACUMULAR OS DADOS E AVANÇAR O DIA
botaoProcessarDia.addEventListener('click', () => {
    if (!conteudoTxt) {
        log('ERRO: Nenhum arquivo TXT carregado. Por favor, carregue o arquivo do dia.');
        return;
    }
    
    const dataManual = inputData.value;
    if (!dataManual) {
        log('ERRO: Por favor, insira a Data de Inserção do Lote.');
        inputData.focus();
        return;
    }

    log(`Iniciando processamento do dia: ${dataManual}...`);

    // SEPARADOR ANTIGO/REUTILIZADO: Combinação de 20+ '=' e 20+ '*'
    const SEPARADOR_REGEX = /={20,}\s*\*{20,}| \*{20,}\s*={20,}/g; 
    
    // Divide o texto em blocos brutos usando o separador
    const blocosBrutos = conteudoTxt.split(SEPARADOR_REGEX).filter(bloco => bloco.trim() !== '');
    
    // Limpa os blocos
    const blocosFinais = blocosBrutos
        .map(b => b.replace(/={20,}/g, '').replace(/\*{20,}/g, '').trim())
        .filter(b => b.length > 0);
    
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
    inputArquivo.value = '';
    conteudoTxt = null;
    botaoProcessarDia.disabled = true;
    
    avancarData(dataManual); 

    log(`-> Total Geral Acumulado: ${dadosGlobaisAcumulados.length} registros.`);
    atualizarStatusAcumulado();
    
});


// 3. Lógica para GERAR A PLANILHA FINAL
botaoGerarFinal.addEventListener('click', () => {
    if (dadosGlobaisAcumulados.length === 0) {
        log('AVISO: Não há registros acumulados para gerar a planilha.');
        return;
    }

    log('Gerando Planilha Final com todos os dados acumulados...');
    
    const csvContent = gerarCSV(dadosGlobaisAcumulados);
    
    const hoje = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const nomeArquivo = `Planilha_BANCARIO_Ate_${hoje}.csv`;
    
    // Download do CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", nomeArquivo);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    log(`SUCESSO: Arquivo MESTRE '${nomeArquivo}' gerado e download iniciado.`);
});


// --- Lógica do Modal de Ajuda ---

// Abre o modal
btnAjuda.onclick = function() {
  modalAjuda.style.display = "block";
}

// Fecha o modal pelo botão "x"
btnFecharModal.onclick = function() {
  modalAjuda.style.display = "none";
}

// Fecha o modal clicando fora
window.onclick = function(event) {
  if (event.target == modalAjuda) {
    modalAjuda.style.display = "none";
  }
}

// Botão de Download do TXT Modelo
btnDownloadModelo.onclick = function() {
    baixarArquivo(CONTEUDO_MODELO_TXT, 'modelo_bancario_txt.txt');
}


// Inicialização
log('Interface pronta. Insira a data, carregue o TXT e clique em "Processar e Adicionar Dia".');
atualizarStatusAcumulado();