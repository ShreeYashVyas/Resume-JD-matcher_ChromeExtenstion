console.log("content.js");

let tooltip = null;

// Remove tooltip on scroll
window.addEventListener("scroll", () => {
  if (tooltip) {
    tooltip.remove();
    tooltip = null;
  }
});

// Listen for text selection
document.addEventListener("mouseup", (e) => {
  // Prevent clicking inside tooltip from re-triggering
  if (tooltip && tooltip.contains(e.target)) return;

  const selectedText = window.getSelection().toString().trim();
  console.log(selectedText, "selectedText Text data");

  // Show tooltip when selection length > 50
  if (selectedText.length > 50) {
    createTooltip(selectedText);
  } else {
    if (tooltip) {
      tooltip.remove();
      tooltip = null;
    }
  }
});

function createTooltip(selectedText) {
  // Remove previous tooltip if any
  if (tooltip) {
    tooltip.remove();
    tooltip = null;
  }

  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  // Create tooltip container
  tooltip = document.createElement("div");
  Object.assign(tooltip.style, {
    position: "absolute",
    padding: "8px 14px",
    background: "linear-gradient(135deg, #111827, #1f2937)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "500",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    borderRadius: "8px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
    cursor: "pointer",
    zIndex: "9999",
    transition: "all 0.25s ease",
    userSelect: "none",
    whiteSpace: "nowrap",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(6px)",
    opacity: "0",
    transform: "translateY(6px)",
    pointerEvents: "auto",
  });

  const label = document.createElement("span");
  label.innerText = "Check Score";
  tooltip.appendChild(label);

  // Create tooltip arrow
  const arrow = document.createElement("div");
  Object.assign(arrow.style, {
    position: "absolute",
    width: "10px",
    height: "10px",
    background: "linear-gradient(135deg, #111827, #1f2937)",
    transform: "rotate(45deg)",
    bottom: "-5px",
    left: "20px",
    borderLeft: "1px solid rgba(255,255,255,0.08)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  });
  tooltip.appendChild(arrow);

  document.body.appendChild(tooltip);

  // Calculate tooltip position
  const tooltipHeight = tooltip.offsetHeight || 40;
  const topPos = Math.max(window.scrollY, rect.top + window.scrollY - tooltipHeight - 8);
  const leftPos = rect.left + window.scrollX;
  const maxLeft = window.scrollX + window.innerWidth - tooltip.offsetWidth - 8;

  tooltip.style.top = `${topPos}px`;
  tooltip.style.left = `${Math.min(leftPos, maxLeft)}px`;

  // Hover effects
  tooltip.addEventListener("mouseenter", () => {
    tooltip.style.background = "linear-gradient(135deg, #1f2937, #374151)";
    tooltip.style.transform = "translateY(-2px) scale(1.05)";
    tooltip.style.boxShadow = "0 12px 28px rgba(0, 0, 0, 0.35)";
    arrow.style.background = "linear-gradient(135deg, #1f2937, #374151)";
  });

  tooltip.addEventListener("mouseleave", () => {
    tooltip.style.background = "linear-gradient(135deg, #111827, #1f2937)";
    tooltip.style.transform = "translateY(0) scale(1)";
    tooltip.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.25)";
    arrow.style.background = "linear-gradient(135deg, #111827, #1f2937)";
  });

  // Click event → send message to background.js
  tooltip.onclick = () => {
    label.innerText = "Loading...";

    chrome.runtime.sendMessage(
      {
        type: "CHECK_SCORE",
        jd: selectedText,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          label.innerText = "❌ Extension error";
          return;
        }
        getScore(response, label);
      }
    );
  };

  // Animate tooltip in
  requestAnimationFrame(() => {
    tooltip.offsetHeight; // force reflow
    tooltip.style.opacity = "1";
    tooltip.style.transform = "translateY(0)";
  });
}

// Process the score response
function getScore(response, label) {
  console.log(response, "response from background.js");

  if (!response || response.overall_score == null) {
    label.innerText = "❌ " + (response?.err || "Something went wrong");
    setTimeout(() => {
      if (tooltip) {
        tooltip.remove();
        tooltip = null;
      }
    }, 3000);
    return;
  }

  tooltip.style.whiteSpace = "normal";
  tooltip.style.width = "200px";
  tooltip.style.background = "#111827";
  tooltip.style.cursor = "default";

  label.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:4px;">
        <div style="font-size:15px;font-weight:700;color:#3b82f6;">
            Match: ${response.match_percentage}% · Score: ${response.overall_score}/100
        </div>
    </div>
  `;

  setTimeout(() => {
    if (tooltip) {
      tooltip.remove();
      tooltip = null;
    }
  }, 5000);
}