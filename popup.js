
const toggleButton = document.getElementById("toggle");
const statusText = document.getElementById("status");

async function updatePopup() {
  try {
    const enabledRulesets =
      await chrome.declarativeNetRequest.getEnabledRulesets();

    const isEnabled = enabledRulesets.includes("ads");

    toggleButton.textContent = isEnabled ? "Turn OFF" : "Turn ON";
    statusText.textContent = isEnabled
      ? "Protection is ON"
      : "Protection is OFF";

    toggleButton.dataset.enabled = String(isEnabled);
  } catch (error) {
    toggleButton.textContent = "Unavailable";
    statusText.textContent = "Could not check protection.";
    console.error(error);
  }
}

toggleButton.addEventListener("click", async () => {
  toggleButton.disabled = true;

  try {
    const isEnabled = toggleButton.dataset.enabled === "true";

    if (isEnabled) {
      await chrome.declarativeNetRequest.updateEnabledRulesets({
        disableRulesetIds: ["ads"]
      });
    } else {
      await chrome.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: ["ads"]
      });
    }

    await updatePopup();
  } catch (error) {
    statusText.textContent = "Could not change protection.";
    console.error(error);
  } finally {
    toggleButton.disabled = false;
  }
});

updatePopup();
