"""Generate Figure 4.10 - SHAP global importance bar plot from real notebook outputs (cell 18)."""
import os

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt

plt.rcParams["font.family"] = "DejaVu Sans"

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, "figures", "shap_bar_plot.png")

# Real values from XAI_Bus.ipynb Cell 18 (mean absolute SHAP values, logit space)
data = [
    ("Overtime", 0.9869),
    ("Stock option level", 0.5120),
    ("Frequent business travel", 0.3364),
    ("Number of companies worked", 0.3147),
    ("Job satisfaction", 0.2956),
    ("Monthly income", 0.2924),
    ("Age", 0.2884),
    ("Years with current manager", 0.2849),
    ("Distance from home", 0.2638),
    ("Environment satisfaction", 0.2442),
]

labels = [d[0] for d in data][::-1]
values = [d[1] for d in data][::-1]

fig, ax = plt.subplots(figsize=(9, 5.5))
bars = ax.barh(labels, values, color="#1f77b4", edgecolor="black", linewidth=0.5)
for bar, v in zip(bars, values):
    ax.text(
        bar.get_width() + 0.01,
        bar.get_y() + bar.get_height() / 2,
        f"{v:.4f}",
        va="center",
        fontsize=9,
    )

ax.set_xlabel("Mean |SHAP value| (attrition log-odds impact)", fontsize=11)
ax.set_title(
    "Figure 4.10: Global SHAP feature importance - XGBoost attrition model",
    fontsize=12,
)
ax.set_xlim(0, 1.15)
ax.grid(axis="x", linestyle="--", alpha=0.4)
ax.spines[["top", "right"]].set_visible(False)

fig.tight_layout()
fig.savefig(OUT, dpi=200)
print(f"Wrote: {OUT} ({os.path.getsize(OUT)} bytes)")
