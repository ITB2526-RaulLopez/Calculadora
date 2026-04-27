// ---------- MILLORES DISPONIBLES ----------
const milloresDisponibles = {
    energia: [
        { id: "ene_led", nom: "Il·luminació LED + sensors presència", estalviPct: 38, activa: true, icona: "fa-lightbulb", descripcio: "Substitució de fluorescents per LED i instal·lació de sensors de moviment. Redueix el consum d'enllumenat fins un 38%, amb un retorn de la inversió en menys d'un any." },
        { id: "ene_gestio", nom: "Gestió equips (stand-by, regletes)", estalviPct: 18, activa: true, icona: "fa-microchip", descripcio: "Eliminació del consum fantasma mitjançant regletes intel·ligents i apagada automàtica d'equips. Estalvi addicional del 18% sobre la factura elèctrica." },
        { id: "ene_clima", nom: "Climatització eficient", estalviPct: 22, activa: false, icona: "fa-temperature-low", descripcio: "Instal·lació de termòstats programables, millora de l'aïllament i manteniment preventiu de climatitzadors. Reducció del 22% en calefacció i aire condicionat." }
    ],
    aigua: [
        { id: "aig_airejadors", nom: "Airejadors i reductors cabal", estalviPct: 32, activa: true, icona: "fa-wind", descripcio: "Col·locació d'airejadors a totes les aixetes. Estalvi del 32% del cabal sense perdre confort. Inversió mínima, amortització en pocs mesos." },
        { id: "aig_cisternes", nom: "Cisternes doble descàrrega", estalviPct: 26, activa: false, icona: "fa-toilet", descripcio: "Substitució de cisternes antigues per models de 3/6 litres. Estalvi del 26% en el consum d'aigua dels lavabos." },
        { id: "aig_reutil", nom: "Reutilització pluvial", estalviPct: 18, activa: false, icona: "fa-cloud-rain", descripcio: "Sistema de captació d'aigua de pluja per a reg i neteja exterior. Reducció addicional del 18% de la factura." }
    ],
    oficina: [
        { id: "ofi_quotes", nom: "Quotes impressió", estalviPct: 34, activa: true, icona: "fa-ban", descripcio: "Establiment de quotes d'impressió per usuari i configuració per defecte en blanc i negre. Estalvi del 34% en paper i tòner." },
        { id: "ofi_digital", nom: "Digitalització total", estalviPct: 42, activa: false, icona: "fa-tablet-alt", descripcio: "Implementació de firma digital, emmagatzematge al núvol i eliminació de fluxos en paper. Estalvi del 42% en consumibles i millora de l'eficiència." }
    ],
    neteja: [
        { id: "net_eco", nom: "Productes ecològics concentrats", estalviPct: 41, activa: true, icona: "fa-leaf", descripcio: "Adopció de productes ultraconcentrats i biodegradables. Reducció del 41% del cost en neteja i menys residus plàstics." },
        { id: "net_dosi", nom: "Dosificadors automàtics", estalviPct: 28, activa: false, icona: "fa-pump-medical", descripcio: "Sistemes de dosificació que barregen el producte en el moment d'ús. Estalvi del 28% per evitar malbaratament." }
    ]
};

let estatMillores = {};

function inicialitzarEstat() {
    for (let cat in milloresDisponibles) {
        milloresDisponibles[cat].forEach(m => {
            let saved = localStorage.getItem(m.id);
            estatMillores[m.id] = saved !== null ? saved === 'true' : m.activa;
        });
    }
}

function guardarEstatMillora(id, valor) {
    estatMillores[id] = valor;
    localStorage.setItem(id, valor);
}

function getEstalviPercentatge(categoria, costBase) {
    let pctTotal = 0;
    for (let m of milloresDisponibles[categoria]) if (estatMillores[m.id]) pctTotal += m.estalviPct;
    pctTotal = Math.min(pctTotal, 75);
    let estalvi = costBase * (pctTotal / 100);
    return { pct: pctTotal, estalviMensual: estalvi, estalviAnual: estalvi * 12 };
}

function getTotalsAnuales() {
    const costElec = parseFloat(document.getElementById('cost_elec').value) || 0;
    const costAigua = parseFloat(document.getElementById('cost_aigua').value) || 0;
    const costOfi = parseFloat(document.getElementById('cost_oficina').value) || 0;
    const costNet = parseFloat(document.getElementById('cost_neteja').value) || 0;
    const actualAnual = (costElec + costAigua + costOfi + costNet) * 12;
    const estalviEne = getEstalviPercentatge('energia', costElec).estalviMensual;
    const estalviAigua = getEstalviPercentatge('aigua', costAigua).estalviMensual;
    const estalviOfi = getEstalviPercentatge('oficina', costOfi).estalviMensual;
    const estalviNet = getEstalviPercentatge('neteja', costNet).estalviMensual;
    const estalviMensualTotal = estalviEne + estalviAigua + estalviOfi + estalviNet;
    const optimizadoAnual = actualAnual - (estalviMensualTotal * 12);
    return { actualAnual, optimizadoAnual, estalviAnual: actualAnual - optimizadoAnual, estalviMensualTotal };
}

function actualitzarComparativaAnual() {
    const totals = getTotalsAnuales();
    document.getElementById('gastoActualAnual').innerHTML = totals.actualAnual.toFixed(0) + ' €';
    document.getElementById('gastoOptimizadoAnual').innerHTML = totals.optimizadoAnual.toFixed(0) + ' €';
    document.getElementById('ahorroAnual').innerHTML = totals.estalviAnual.toFixed(0) + ' €';
    document.getElementById('ahorroMensualMedio').innerHTML = totals.estalviMensualTotal.toFixed(2) + ' €';
    let porcentaje = totals.actualAnual > 0 ? (totals.estalviAnual / totals.actualAnual * 100) : 0;
    document.getElementById('reduccionPorcentual').innerHTML = porcentaje.toFixed(1) + '%';
    let retorno = totals.estalviAnual > 0 ? (3000 / totals.estalviAnual * 12).toFixed(1) : '—';
    document.getElementById('retornoInversion').innerHTML = retorno !== '—' ? retorno + ' mesos' : '—';
}

function actualitzarProjeccions() {
    let costElec = parseFloat(document.getElementById('cost_elec').value) || 0;
    let costAigua = parseFloat(document.getElementById('cost_aigua').value) || 0;
    let costOfi = parseFloat(document.getElementById('cost_oficina').value) || 0;
    let costNet = parseFloat(document.getElementById('cost_neteja').value) || 0;

    const baseElec = costElec * 12;
    const baseAigua = costAigua * 12;
    const baseOfi = costOfi * 12;
    const baseNet = costNet * 12;

    const factorsEne = [1.24, 1.24, 1.08, 0.94, 0.86, 0.78, 0.75, 0.78, 0.88, 0.96, 1.12, 1.22];
    const factorsAigua = [0.92, 0.92, 0.96, 1.02, 1.18, 1.32, 1.44, 1.38, 1.24, 1.08, 0.98, 0.94];
    const factorsCons = [1.28, 1.28, 1.22, 1.18, 1.24, 1.20, 0.62, 0.58, 1.32, 1.34, 1.30, 1.28];

    function projectAny(base, factors) {
        let total = 0;
        for (let i = 0; i < 12; i++) total += (base / 12) * factors[i];
        return total;
    }

    function projectPeriod(base, factors) {
        let mesos = [8, 9, 10, 11, 0, 1, 2, 3, 4, 5];
        let suma = 0;
        for (let idx of mesos) suma += (base / 12) * factors[idx];
        return suma;
    }

    const proj = {
        eneAny: projectAny(baseElec, factorsEne),
        enePeriod: projectPeriod(baseElec, factorsEne),
        aiguaAny: projectAny(baseAigua, factorsAigua),
        aiguaPeriod: projectPeriod(baseAigua, factorsAigua),
        ofiAny: projectAny(baseOfi, factorsCons),
        ofiPeriod: projectPeriod(baseOfi, factorsCons),
        netAny: projectAny(baseNet, factorsCons),
        netPeriod: projectPeriod(baseNet, factorsCons)
    };

    document.getElementById('projectionsList').innerHTML = `
        <div class="targeta-proj"><div class="icona-proj"><i class="fas fa-bolt"></i></div><div class="valor-gran">${proj.eneAny.toFixed(0)} €/any</div><div class="etiqueta">Energia anual</div><div class="etiqueta" style="margin-top: 6px;">Curs lectiu: ${proj.enePeriod.toFixed(0)} €</div></div>
        <div class="targeta-proj"><div class="icona-proj"><i class="fas fa-water"></i></div><div class="valor-gran">${proj.aiguaAny.toFixed(0)} €/any</div><div class="etiqueta">Aigua anual</div><div class="etiqueta" style="margin-top: 6px;">Curs: ${proj.aiguaPeriod.toFixed(0)} €</div></div>
        <div class="targeta-proj"><div class="icona-proj"><i class="fas fa-box"></i></div><div class="valor-gran">${proj.ofiAny.toFixed(0)} €/any</div><div class="etiqueta">Oficina anual</div><div class="etiqueta" style="margin-top: 6px;">Curs: ${proj.ofiPeriod.toFixed(0)} €</div></div>
        <div class="targeta-proj"><div class="icona-proj"><i class="fas fa-spray-can"></i></div><div class="valor-gran">${proj.netAny.toFixed(0)} €/any</div><div class="etiqueta">Neteja anual</div><div class="etiqueta" style="margin-top: 6px;">Curs: ${proj.netPeriod.toFixed(0)} €</div></div>
    `;
}

function getLevelTextAndClass(cost, category) {
    if (cost === 0) return { text: "Sense dades", class: "level-unknown" };
    let thresholds = { energia: { low: 80, high: 180 }, aigua: { low: 60, high: 130 }, oficina: { low: 70, high: 160 }, neteja: { low: 50, high: 120 } };
    let t = thresholds[category] || { low: 70, high: 150 };
    if (cost < t.low) return { text: "Consum baix", class: "level-low" };
    if (cost > t.high) return { text: "Consum crític", class: "level-high" };
    return { text: "Consum moderat", class: "level-mid" };
}

function getMissatgePersonalitzat(categoria, costBase) {
    const milloresActives = milloresDisponibles[categoria].filter(m => estatMillores[m.id]);
    if (milloresActives.length === 0) {
        return "❌ Cap mesura activada. Marca alguna de les caselles superiors per veure un pla d'acció detallat i l'estalvi associat.";
    }
    let missatge = `✅ **Pla d'acció personalitzat (${milloresActives.length} mesura/s activa/s):**<br><br>`;
    milloresActives.forEach(m => {
        missatge += `🔹 <i class="fas ${m.icona}"></i> <strong>${m.nom}</strong>: ${m.descripcio}<br>`;
    });
    const estalviTotal = getEstalviPercentatge(categoria, costBase).estalviMensual;
    missatge += `<br>📊 <strong>Estalvi total mensual amb aquestes mesures: ${estalviTotal.toFixed(2)} €</strong>.`;
    if (milloresActives.length < milloresDisponibles[categoria].length) {
        const inactives = milloresDisponibles[categoria].filter(m => !estatMillores[m.id]);
        missatge += `<br><br>💡 <strong>Millores addicionals disponibles:</strong> ${inactives.map(m => m.nom).join(', ')}. Activa-les per augmentar l'estalvi.`;
    }
    return missatge;
}

function renderTargetes() {
    const costElec = parseFloat(document.getElementById('cost_elec').value) || 0;
    const costAigua = parseFloat(document.getElementById('cost_aigua').value) || 0;
    const costOfi = parseFloat(document.getElementById('cost_oficina').value) || 0;
    const costNet = parseFloat(document.getElementById('cost_neteja').value) || 0;

    const categories = [
        { id: 'energia', titol: 'Energia elèctrica', cost: costElec, icona: 'fa-bolt', color: '#3f8e4c' },
        { id: 'aigua', titol: 'Aigua', cost: costAigua, icona: 'fa-water', color: '#2f89b3' },
        { id: 'oficina', titol: 'Oficina (paper + consumibles)', cost: costOfi, icona: 'fa-print', color: '#c28b3b' },
        { id: 'neteja', titol: 'Neteja i higiene', cost: costNet, icona: 'fa-spray-can', color: '#5ba475' }
    ];
    let html = '';
    for (let cat of categories) {
        const estalvi = getEstalviPercentatge(cat.id, cat.cost);
        const level = getLevelTextAndClass(cat.cost, cat.id);
        html += `<div class="targeta-millora" style="border-top-color: ${cat.color};">
                    <div class="cap-millora"><h3><i class="fas ${cat.icona}"></i> ${cat.titol}</h3><span class="nivell-actual ${level.class}">${level.text}</span></div>
                    <div class="cos-millora">
                        <div class="estalvi-principal"><span><i class="fas fa-euro-sign"></i> Estalvi mensual</span><span class="xifra-estalvi">${estalvi.estalviMensual.toFixed(2)} €</span></div>
                        <div class="estalvi-principal" style="background:#f2f8ed;"><span><i class="fas fa-calendar-alt"></i> Estalvi anual</span><span class="xifra-estalvi">${estalvi.estalviAnual.toFixed(0)} €</span></div>
                        <div class="detall-millorables">`;
        for (let m of milloresDisponibles[cat.id]) {
            let isChecked = estatMillores[m.id];
            let estalviAdd = (cat.cost * (m.estalviPct / 100)).toFixed(2);
            html += `<div class="millora-item-simple">
                        <div><i class="fas ${m.icona}"></i> ${m.nom}</div>
                        <div class="toggle-millora"><input type="checkbox" id="chk_${m.id}" ${isChecked ? 'checked' : ''} data-id="${m.id}"><span style="margin-left: 10px;">+${estalviAdd} €/mes</span></div>
                    </div>`;
        }
        html += `</div><div class="pla-accio-resum" id="msg_${cat.id}">${getMissatgePersonalitzat(cat.id, cat.cost)}</div></div></div>`;
    }
    document.getElementById('resultatsContainer').innerHTML = html;

    document.querySelectorAll('.toggle-millora input[type="checkbox"]').forEach(chk => {
        chk.addEventListener('change', function() {
            let id = this.getAttribute('data-id');
            if (id) {
                guardarEstatMillora(id, this.checked);
                let categoria = null;
                for (let cat in milloresDisponibles) {
                    if (milloresDisponibles[cat].some(m => m.id === id)) categoria = cat;
                }
                if (categoria) {
                    const costMap = { energia: 'cost_elec', aigua: 'cost_aigua', oficina: 'cost_oficina', neteja: 'cost_neteja' };
                    const cost = parseFloat(document.getElementById(costMap[categoria]).value) || 0;
                    document.getElementById(`msg_${categoria}`).innerHTML = getMissatgePersonalitzat(categoria, cost);
                }
            }
            refreshTotaLaCalculadora();
        });
    });
}

let chartGlobal = null;

function actualitzarGrafic() {
    const costElec = parseFloat(document.getElementById('cost_elec').value) || 0;
    const costAigua = parseFloat(document.getElementById('cost_aigua').value) || 0;
    const costOfi = parseFloat(document.getElementById('cost_oficina').value) || 0;
    const costNet = parseFloat(document.getElementById('cost_neteja').value) || 0;
    const estalviEne = getEstalviPercentatge('energia', costElec).estalviMensual;
    const estalviAigua = getEstalviPercentatge('aigua', costAigua).estalviMensual;
    const estalviOfi = getEstalviPercentatge('oficina', costOfi).estalviMensual;
    const estalviNet = getEstalviPercentatge('neteja', costNet).estalviMensual;
    const actual = [costElec, costAigua, costOfi, costNet];
    const sostenible = [costElec - estalviEne, costAigua - estalviAigua, costOfi - estalviOfi, costNet - estalviNet];
    const ctx = document.getElementById('comparativaChart').getContext('2d');
    if (chartGlobal) chartGlobal.destroy();
    const tipus = document.getElementById('chartTypeSelect').value;
    chartGlobal = new Chart(ctx, {
        type: tipus,
        data: {
            labels: ['Energia', 'Aigua', 'Oficina', 'Neteja'],
            datasets: [{
                    label: 'Despesa actual (€/mes)',
                    data: actual,
                    backgroundColor: '#cbdfbe',
                    borderColor: '#558b42',
                    borderWidth: 2,
                    borderRadius: 10
                },
                {
                    label: 'Amb millores actives',
                    data: sostenible,
                    backgroundColor: '#5eaa68',
                    borderColor: '#236b31',
                    borderWidth: 2,
                    borderRadius: 10
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

function refreshTotaLaCalculadora() {
    renderTargetes();
    actualitzarProjeccions();
    actualitzarGrafic();
    actualitzarComparativaAnual();
}

// ---------- PROCESSAMENT JSON ----------
function processJsonAndFill(jsonData) {
    try {
        let data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
        if (!data.dades) throw new Error("Estructura JSON invàlida: falta 'dades'");
        let totalKwh = 0,
            diasEne = 0;
        if (data.dades.energia_solar_gener_2025 && Array.isArray(data.dades.energia_solar_gener_2025)) {
            for (let dia of data.dades.energia_solar_gener_2025) {
                if (dia.importat_xarxa_kwh && typeof dia.importat_xarxa_kwh === 'number') {
                    totalKwh += dia.importat_xarxa_kwh;
                    diasEne++;
                }
            }
        }
        let kwhMensual = (diasEne > 0) ? (totalKwh / diasEne) * 30 : 0;
        let costElectricitat = kwhMensual * 0.14;
        document.getElementById('cost_elec').value = Math.round(costElectricitat);

        let totalLitres = 0,
            diesAigua = 0;
        if (data.dades.consum_aigua_horari && Array.isArray(data.dades.consum_aigua_horari)) {
            for (let dia of data.dades.consum_aigua_horari) {
                if (dia.lectures && Array.isArray(dia.lectures)) {
                    for (let lectura of dia.lectures) {
                        if (lectura.litres && typeof lectura.litres === 'number') {
                            totalLitres += lectura.litres;
                        }
                    }
                    diesAigua++;
                }
            }
        }
        let litresMensuals = (diesAigua > 0) ? (totalLitres / diesAigua) * 30 : 0;
        let costAigua = litresMensuals * 0.0025;
        document.getElementById('cost_aigua').value = Math.round(costAigua);

        let totalDespesa = 0;
        if (data.dades.materials_oficina_2024 && Array.isArray(data.dades.materials_oficina_2024)) {
            for (let item of data.dades.materials_oficina_2024) {
                if (item.import_euros && typeof item.import_euros === 'number') {
                    totalDespesa += item.import_euros;
                }
            }
        }
        let despesaMensualOficina = totalDespesa / 12;
        document.getElementById('cost_oficina').value = Math.round(despesaMensualOficina);
        if (isNaN(parseFloat(document.getElementById('cost_neteja').value))) document.getElementById('cost_neteja').value = 0;

        document.getElementById('fileStatus').innerHTML = `<i class="fas fa-check-circle"></i> ✅ Dades importades: kWh totals: ${totalKwh.toFixed(0)} · Litres totals: ${totalLitres.toFixed(0)} · Despesa oficina anual: ${totalDespesa.toFixed(2)} € → camps actualitzats.`;
        refreshTotaLaCalculadora();
    } catch (err) {
        document.getElementById('fileStatus').innerHTML = `<i class="fas fa-exclamation-triangle"></i> Error: ${err.message}`;
    }
}

// ---------- ESDEVENIMENTS ----------
const fileInput = document.getElementById('jsonUpload');

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    document.getElementById('fileStatus').innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Processant fitxer...';
    const reader = new FileReader();
    reader.onload = e => {
        processJsonAndFill(e.target.result);
        fileInput.value = '';
    };
    reader.onerror = () => {
        document.getElementById('fileStatus').innerHTML = '<i class="fas fa-times-circle"></i> Error lectura';
        fileInput.value = '';
    };
    reader.readAsText(file);
}

fileInput.addEventListener('change', handleFileUpload);
document.querySelector('.upload-label').addEventListener('click', () => fileInput.click());
document.getElementById('resetBtn').addEventListener('click', () => {
    document.getElementById('cost_elec').value = 0;
    document.getElementById('cost_aigua').value = 0;
    document.getElementById('cost_oficina').value = 0;
    document.getElementById('cost_neteja').value = 0;
    refreshTotaLaCalculadora();
    document.getElementById('fileStatus').innerHTML = '<i class="fas fa-undo-alt"></i> Tots els valors restablerts a 0';
    fileInput.value = '';
});

function bindInputs() {
    ['cost_elec', 'cost_aigua', 'cost_oficina', 'cost_neteja'].forEach(id => {
        document.getElementById(id).addEventListener('input', () => refreshTotaLaCalculadora());
    });
    document.getElementById('chartTypeSelect').addEventListener('change', () => actualitzarGrafic());
}

inicialitzarEstat();
bindInputs();
refreshTotaLaCalculadora();

// ---------- EXPORTACIÓ A PDF ----------
document.getElementById('exportPdfBtn').addEventListener('click', async function() {
    const btn = this;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Generant PDF...';
    btn.disabled = true;

    try {
        const chartCanvas = document.getElementById('comparativaChart');
        const chartImage = await html2canvas(chartCanvas, {
            scale: 2,
            backgroundColor: '#ffffff'
        });
        const chartDataUrl = chartImage.toDataURL('image/png');

        const costElec = parseFloat(document.getElementById('cost_elec').value) || 0;
        const costAigua = parseFloat(document.getElementById('cost_aigua').value) || 0;
        const costOfi = parseFloat(document.getElementById('cost_oficina').value) || 0;
        const costNet = parseFloat(document.getElementById('cost_neteja').value) || 0;

        const estalviElec = getEstalviPercentatge('energia', costElec);
        const estalviAigua = getEstalviPercentatge('aigua', costAigua);
        const estalviOfi = getEstalviPercentatge('oficina', costOfi);
        const estalviNet = getEstalviPercentatge('neteja', costNet);

        const totals = getTotalsAnuales();
        const levelElec = getLevelTextAndClass(costElec, 'energia').text;
        const levelAigua = getLevelTextAndClass(costAigua, 'aigua').text;
        const levelOfi = getLevelTextAndClass(costOfi, 'oficina').text;
        const levelNet = getLevelTextAndClass(costNet, 'neteja').text;

        const baseElec = costElec * 12;
        const baseAigua = costAigua * 12;
        const baseOfi = costOfi * 12;
        const baseNet = costNet * 12;
        const factorsEne = [1.24, 1.24, 1.08, 0.94, 0.86, 0.78, 0.75, 0.78, 0.88, 0.96, 1.12, 1.22];
        const factorsAigua = [0.92, 0.92, 0.96, 1.02, 1.18, 1.32, 1.44, 1.38, 1.24, 1.08, 0.98, 0.94];
        const factorsCons = [1.28, 1.28, 1.22, 1.18, 1.24, 1.20, 0.62, 0.58, 1.32, 1.34, 1.30, 1.28];

        function projectAny(base, factors) {
            let total = 0;
            for (let i = 0; i < 12; i++) total += (base / 12) * factors[i];
            return total;
        }

        function projectPeriod(base, factors) {
            let mesos = [8, 9, 10, 11, 0, 1, 2, 3, 4, 5];
            let suma = 0;
            for (let idx of mesos) suma += (base / 12) * factors[idx];
            return suma;
        }

        const projEne = {
            any: projectAny(baseElec, factorsEne),
            period: projectPeriod(baseElec, factorsEne)
        };
        const projAigua = {
            any: projectAny(baseAigua, factorsAigua),
            period: projectPeriod(baseAigua, factorsAigua)
        };
        const projOfi = {
            any: projectAny(baseOfi, factorsCons),
            period: projectPeriod(baseOfi, factorsCons)
        };
        const projNet = {
            any: projectAny(baseNet, factorsCons),
            period: projectPeriod(baseNet, factorsCons)
        };

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        let y = 20;
        const leftMargin = 20;
        const pageWidth = 210;

        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Informe de Sostenibilitat - ITB', leftMargin, y);
        y += 10;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Data: ${new Date().toLocaleDateString('ca-ES')}`, leftMargin, y);
        y += 12;

        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('1. Resum de consums mensuals i nivell d\'impacte', leftMargin, y);
        y += 8;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Energia elèctrica: ${costElec.toFixed(2)} €/mes (${levelElec})`, leftMargin, y);
        y += 6;
        pdf.text(`Aigua: ${costAigua.toFixed(2)} €/mes (${levelAigua})`, leftMargin, y);
        y += 6;
        pdf.text(`Oficina: ${costOfi.toFixed(2)} €/mes (${levelOfi})`, leftMargin, y);
        y += 6;
        pdf.text(`Neteja: ${costNet.toFixed(2)} €/mes (${levelNet})`, leftMargin, y);
        y += 10;

        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('2. Estalvis aplicant millores actives', leftMargin, y);
        y += 8;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Energia: estalvi mensual ${estalviElec.estalviMensual.toFixed(2)} € | anual ${estalviElec.estalviAnual.toFixed(0)} €`, leftMargin, y);
        y += 6;
        pdf.text(`Aigua: estalvi mensual ${estalviAigua.estalviMensual.toFixed(2)} € | anual ${estalviAigua.estalviAnual.toFixed(0)} €`, leftMargin, y);
        y += 6;
        pdf.text(`Oficina: estalvi mensual ${estalviOfi.estalviMensual.toFixed(2)} € | anual ${estalviOfi.estalviAnual.toFixed(0)} €`, leftMargin, y);
        y += 6;
        pdf.text(`Neteja: estalvi mensual ${estalviNet.estalviMensual.toFixed(2)} € | anual ${estalviNet.estalviAnual.toFixed(0)} €`, leftMargin, y);
        y += 10;

        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('3. Comparativa anual (actual vs. amb millores)', leftMargin, y);
        y += 8;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Despesa actual anual: ${totals.actualAnual.toFixed(0)} €`, leftMargin, y);
        y += 6;
        pdf.text(`Despesa amb millores actives: ${totals.optimizadoAnual.toFixed(0)} €`, leftMargin, y);
        y += 6;
        pdf.text(`Estalvi anual net: ${totals.estalviAnual.toFixed(0)} € (${totals.estalviMensualTotal.toFixed(2)} €/mes)`, leftMargin, y);
        y += 6;
        pdf.text(`Reducció percentual: ${((totals.estalviAnual / totals.actualAnual) * 100 || 0).toFixed(1)}%`, leftMargin, y);
        y += 6;
        pdf.text(`Retorn inversió estimat: ${totals.estalviAnual > 0 ? (3000 / totals.estalviAnual * 12).toFixed(1) + ' mesos' : '—'}`, leftMargin, y);
        y += 12;

        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('4. Projeccions financeres anuals (amb estacionalitat)', leftMargin, y);
        y += 8;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Energia: ${projEne.any.toFixed(0)} €/any | Curs lectiu: ${projEne.period.toFixed(0)} €`, leftMargin, y);
        y += 6;
        pdf.text(`Aigua: ${projAigua.any.toFixed(0)} €/any | Curs lectiu: ${projAigua.period.toFixed(0)} €`, leftMargin, y);
        y += 6;
        pdf.text(`Oficina: ${projOfi.any.toFixed(0)} €/any | Curs lectiu: ${projOfi.period.toFixed(0)} €`, leftMargin, y);
        y += 6;
        pdf.text(`Neteja: ${projNet.any.toFixed(0)} €/any | Curs lectiu: ${projNet.period.toFixed(0)} €`, leftMargin, y);
        y += 12;

        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('5. Gràfic comparatiu de despesa mensual', leftMargin, y);
        y += 8;
        const imgWidth = 160;
        const imgHeight = (chartImage.height * imgWidth) / chartImage.width;
        pdf.addImage(chartDataUrl, 'PNG', (pageWidth - imgWidth) / 2, y, imgWidth, imgHeight);
        y += imgHeight + 10;

        const pageCount = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            pdf.setPage(i);
            pdf.setFontSize(8);
            pdf.setTextColor(100);
            pdf.text('ITB · Calculadora d\'estalvi sostenible - Informe generat automàticament', leftMargin, 285);
        }

        pdf.save('informe_sostenibilitat.pdf');
    } catch (error) {
        console.error('Error:', error);
        alert('Hi ha hagut un error en generar el PDF. Revisa la consola.');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
});