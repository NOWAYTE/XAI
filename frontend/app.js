let shapChart = null;
let currentXaiData = null;

document.addEventListener("DOMContentLoaded", () => {
    initTabs();
    loadPresetsData();
    loadGlobalData();
    // Default load Case 1
    loadPreset("case1_high_risk");
});

// Tab switching logic
function initTabs() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tabBtns.forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
            
            btn.classList.add("active");
            const target = btn.dataset.tab;
            document.getElementById(target).classList.add("active");
        });
    });
}

// Preset profiles cache
let presetCache = {};

async function loadPresetsData() {
    try {
        const res = await fetch("/api/presets");
        if (res.ok) {
            presetCache = await res.json();
        }
    } catch (e) {
        console.warn("Using offline presets fallback", e);
    }
}

function loadPreset(key) {
    // Update active button state
    document.querySelectorAll(".btn-preset").forEach(b => b.classList.remove("active"));
    const btn = document.querySelector(`.btn-preset[onclick*="${key}"]`);
    if (btn) btn.classList.add("active");

    const preset = presetCache[key];
    if (!preset) return;

    const data = preset.data;
    const form = document.getElementById("employee-form");

    // Populate form fields
    for (const [field, val] of Object.entries(data)) {
        const input = form.elements[field];
        if (input) {
            input.value = val;
        }
    }

    // Run prediction automatically
    runPrediction();
}

async function runPrediction() {
    const form = document.getElementById("employee-form");
    const formData = new FormData(form);
    
    // Parse values to correct types
    const payload = {};
    for (const [key, val] of formData.entries()) {
        if (!isNaN(val) && val.trim() !== "") {
            payload[key] = Number(val);
        } else {
            payload[key] = val;
        }
    }

    const btn = document.getElementById("predict-btn");
    btn.innerHTML = "⌛ Analyzing SHAP & LIME Explanations...";
    btn.disabled = true;

    try {
        const response = await fetch("/api/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("API response error");

        const data = await response.json();
        currentXaiData = data;

        renderPredictionResults(data, payload);
    } catch (err) {
        console.error("Prediction failed:", err);
        alert("Failed to compute prediction. Make sure backend server is running.");
    } finally {
        btn.innerHTML = "🚀 Evaluate Attrition Risk & Generate Report";
        btn.disabled = false;
    }
}

function renderPredictionResults(data, inputPayload) {
    const pred = data.prediction;
    const report = data.managerial_report;

    // 1. Result Header & Meter
    document.getElementById("probability-value").innerText = `${pred.attrition_probability}%`;
    document.getElementById("probability-value").style.color = pred.risk_color;

    const badge = document.getElementById("risk-badge");
    badge.innerText = pred.risk_badge;
    badge.style.background = pred.risk_color + "25";
    badge.style.color = pred.risk_color;
    badge.style.borderColor = pred.risk_color + "60";

    document.getElementById("risk-level-text").innerText = pred.risk_level;
    document.getElementById("employee-summary-text").innerText = report.employee_summary;

    const meter = document.getElementById("meter-bar");
    meter.style.width = `${Math.min(pred.attrition_probability, 100)}%`;
    meter.style.background = pred.risk_color;

    const card = document.getElementById("result-card");
    card.style.borderColor = pred.risk_color + "60";

    // 2. Render SHAP Waterfall Chart
    renderShapChart(data.explainability.shap_waterfall);

    // 3. Render LIME Table
    renderLimeTable(data.explainability.lime_local_rules);

    // 4. Render Managerial Report Lists
    const driversList = document.getElementById("top-drivers-list");
    driversList.innerHTML = report.top_attrition_drivers.map(d => `<li>🔥 ${d}</li>`).join("");

    const retentionList = document.getElementById("top-retention-list");
    retentionList.innerHTML = report.top_retention_factors.map(r => `<li>🌱 ${r}</li>`).join("");

    // 5. Render Actionable Recommendation Cards
    const recContainer = document.getElementById("recommendations-container");
    recContainer.innerHTML = report.actionable_recommendations.map(rec => `
        <div class="rec-card ${rec.priority.toLowerCase()}">
            <div class="rec-header">
                <span class="rec-title">${rec.category}</span>
                <span class="rec-prio ${rec.priority}">${rec.priority} PRIORITY</span>
            </div>
            <div class="rec-issue"><strong>Issue:</strong> ${rec.issue}</div>
            <div class="rec-action">👉 <strong>Action Plan:</strong> ${rec.action}</div>
        </div>
    `).join("");
}

function renderShapChart(waterfallData) {
    const ctx = document.getElementById("shapChart").getContext("2d");
    
    // Sort for top 8 features
    const topData = waterfallData.slice(0, 8).reverse();
    const labels = topData.map(item => item.feature_name);
    const values = topData.map(item => item.shap_value);
    const bgColors = values.map(v => v > 0 ? "rgba(239, 68, 68, 0.85)" : "rgba(16, 185, 129, 0.85)");
    const borderColors = values.map(v => v > 0 ? "#ef4444" : "#10b981");

    if (shapChart) {
        shapChart.destroy();
    }

    shapChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "SHAP Impact on Attrition Risk",
                data: values,
                backgroundColor: bgColors,
                borderColor: borderColors,
                borderWidth: 1,
                borderRadius: 6
            }]
        },
        options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `Impact: ${ctx.raw > 0 ? '+' : ''}${ctx.raw.toFixed(4)} (${ctx.raw > 0 ? 'Increases Risk' : 'Lowers Risk'})`
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: "rgba(255, 255, 255, 0.1)" },
                    ticks: { color: "#94a3b8" },
                    title: { display: true, text: "← Encourages Retention | Increases Attrition Risk →", color: "#94a3b8" }
                },
                y: {
                    grid: { display: false },
                    ticks: { color: "#f8fafc" }
                }
            }
        }
    });
}

function renderLimeTable(limeRules) {
    const tbody = document.getElementById("lime-table-body");
    tbody.innerHTML = limeRules.map(rule => `
        <tr>
            <td><strong>${rule.feature}</strong></td>
            <td>${rule.weight > 0 ? '+' : ''}${rule.weight.toFixed(4)}</td>
            <td>
                <span class="badge ${rule.effect === 'Increases Risk' ? 'badge-outline' : 'badge-active'}" 
                      style="${rule.effect === 'Increases Risk' ? 'color:#ef4444; border-color:#ef4444;' : ''}">
                    ${rule.effect}
                </span>
            </td>
        </tr>
    `).join("");
}

function switchXaiView(view) {
    const shapBtn = document.getElementById("toggle-shap");
    const limeBtn = document.getElementById("toggle-lime");
    const shapContainer = document.getElementById("shap-view-container");
    const limeContainer = document.getElementById("lime-view-container");

    if (view === "shap") {
        shapBtn.classList.add("active");
        limeBtn.classList.remove("active");
        shapContainer.classList.remove("hidden");
        limeContainer.classList.add("hidden");
    } else {
        limeBtn.classList.add("active");
        shapBtn.classList.remove("active");
        limeContainer.classList.remove("hidden");
        shapContainer.classList.add("hidden");
    }
}

async function loadGlobalData() {
    try {
        const res = await fetch("/api/global-explain");
        if (!res.ok) return;
        const data = await res.json();

        const grid = document.getElementById("global-features-grid");
        if (data.top_global_drivers && grid) {
            grid.innerHTML = data.top_global_drivers.map(f => `
                <div class="feature-box">
                    <h4>${f.description} (<code>${f.feature}</code>)</h4>
                    <p>Global Impact Score: <strong>${f.global_importance}</strong> • <em>${f.direction}</em></p>
                    <div class="feature-impact-bar" style="width: ${f.global_importance * 200}px;"></div>
                </div>
            `).join("");
        }
    } catch (e) {
        console.warn("Could not fetch global explain data", e);
    }
}
