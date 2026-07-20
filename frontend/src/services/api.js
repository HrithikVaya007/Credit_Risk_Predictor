const API_URL = import.meta.env.VITE_API_URL;

export async function predictCreditRisk(payload) {
    const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Prediction failed");
    }

    return response.json();
}