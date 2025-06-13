import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

export async function handler(event: HandlerEvent, context: HandlerContext) {
  const headers = {
    'Access-Control-Allow-Origin': 'https://www.brandingbrothers.de', // Ersetzen Sie dies durch die genaue Domain, von der aus Sie Anfragen senden
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
  };

  // Handle Preflight-Anfragen (OPTIONS)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "", // Body für OPTIONS-Anfragen kann leer sein
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  // Hier würden Sie normalerweise die Daten aus event.body verarbeiten und speichern.
  // Fürs Erste geben wir einfach eine Erfolgsmeldung zurück.
  console.log("Analytics data received:", event.body);

  // Beispiel-Antwort für erfolgreichen Empfang
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ message: "Data received successfully!" }),
  };
} 