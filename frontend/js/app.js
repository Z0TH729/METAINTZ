const API_BASE_URL = "http://127.0.0.1:8000";

async function checkApi() {
  const status = document.querySelector("#api-status");
  const button = document.querySelector("#check-api");

  status.textContent = "Connecting...";
  button.disabled = true;

  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    status.textContent = `Connected: ${data.application} ${data.version}`;
  } catch (error) {
    status.textContent = "API unavailable. Start the FastAPI server and try again.";
    console.error("METAINTZ API check failed:", error);
  } finally {
    button.disabled = false;
  }
}

document.querySelector("#check-api").addEventListener("click", checkApi);
checkApi();
