import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

export async function handler(event: HandlerEvent, context: HandlerContext) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  // Hier würden Sie normalerweise die Daten aus event.body verarbeiten und speichern.
  // Fürs Erste geben wir einfach eine Erfolgsmeldung zurück.
  console.log("Analytics data received:", event.body);

  // Beispiel-Antwort für erfolgreichen Empfang
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Data received successfully!" }),
  };
} 