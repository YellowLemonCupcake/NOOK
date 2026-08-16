import { google } from "googleapis";

const rawServiceCredentials = process.env.GOOGLE_SHEET_SERVICE_ACCOUNT_JSON;

if (!rawServiceCredentials) {
   throw new Error("GOOGLE_SHEET_SERVICE_ACCOUNT_JSON is not set");
}

interface GoogleServiceAccountCredentials {
   type: "service_account";
   project_id: string;
   private_key_id: string;
   private_key: string;
   client_email: string;
   client_id: string;
   auth_uri: string;
   token_uri: string;
   auth_provider_x509_cert_url: string;
   client_x509_cert_url: string;
   universe_domain: string;
}

export const GOOGLE_SHEETS_API_CREDENTIALS: GoogleServiceAccountCredentials =
   JSON.parse(rawServiceCredentials);
GOOGLE_SHEETS_API_CREDENTIALS.private_key =
   GOOGLE_SHEETS_API_CREDENTIALS.private_key.replace(/\\n/g, "\n");

const auth = new google.auth.GoogleAuth({
   credentials: GOOGLE_SHEETS_API_CREDENTIALS,
   scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export const sheetsService = google.sheets({ version: "v4", auth });
