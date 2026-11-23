import { createRemoteJWKSet, jwtVerify } from "jose";

const RFB_ROOT = "https://api.receitafederal.gov.br";
let cachedToken = null;
let cachedTokenUntil = 0;
const SERVICES = new Set(["debitos", "creditos", "pagamentos", "recolhimentos"]);

function json(data, status = 200, origin = "*", credentials = false) {
  const headers = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "access-control-allow-origin": origin, "vary": "Origin" };
  if (credentials) headers["access-control-allow-credentials"] = "true";
  return new Response(JSON.stringify(data), { status, headers });
}
function corsHeaders(origin, env) {
  const allowed = (env.APP_ORIGIN || "").split(",").map(x => x.trim()).filter(Boolean);
  if (!origin || !allowed.includes(origin)) return null;
  return { "access-control-allow-origin": origin, "access-control-allow-credentials": "true", "access-control-allow-methods": "GET,POST,OPTIONS", "access-control-allow-headers": "Content-Type", "access-control-max-age": "600", "vary": "Origin" };
}
async function requireAccess(request, env) {
  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) throw new Error("ACCESS_NOT_CONFIGURED");
  const assertion = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!assertion) throw new Error("LOGIN_REQUIRED");
  const team = env.ACCESS_TEAM_DOMAIN.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const issuer = "https://" + team;
  const jwks = createRemoteJWKSet(new URL(issuer + "/cdn-cgi/access/certs"));
  const { payload } = await jwtVerify(assertion, jwks, { issuer, audience: env.ACCESS_AUD });
  return String(payload.sub || payload.email || "authenticated-user");
}
async function getToken(env) {
  const now = Date.now();
  if (cachedToken && now < cachedTokenUntil) return cachedToken;
  if (!env.RFB_CLIENT_ID || !env.RFB_CLIENT_SECRET) throw new Error("RFB_CREDENTIALS_NOT_CONFIGURED");
  const basic = btoa(env.RFB_CLIENT_ID + ":" + env.RFB_CLIENT_SECRET);
  const response = await fetch(env.RFB_TOKEN_URL || RFB_ROOT + "/token", {
    method: "POST",
    headers: { "authorization": "Basic " + basic, "content-type": "application/x-www-form-urlencoded", "accept": "application/json" },
    body: "grant_type=client_credentials"
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body.access_token) throw new Error("RFB_AUTH_FAILED:" + (body.error_description || body.mensagemErro || response.status));
  cachedToken = body.access_token;
  cachedTokenUntil = now + Math.max(5, Number(body.expires_in || 3600) - 90) * 1000;
  return cachedToken;
}
function allowedCnpj(cnpj, env) {
  if (!/^\d{8}$/.test(cnpj)) return false;
  return (env.ALLOWED_CNPJ_BASES || "").split(",").map(x => x.trim()).filter(Boolean).includes(cnpj);
}
async function rfbFetch(url, token, options = {}) {
  const response = await fetch(url, { ...options, headers: { ...(options.headers || {}), authorization: "Bearer " + token, accept: "application/json" } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.mensagemErro || data.message || "Falha na API da Receita Federal (" + response.status + ")");
    error.status = response.status; error.code = data.codigoErro || "RFB_API_ERROR"; throw error;
  }
  return data;
}
async function handle(request, env) {
  const url = new URL(request.url);
  if (url.pathname === "/health" && request.method === "GET") {
    return json({ status: "ok", service: "segef-cbs-gateway", configured: Boolean(env.RFB_CLIENT_ID && env.RFB_CLIENT_SECRET && env.ACCESS_AUD && env.ALLOWED_CNPJ_BASES) });
  }
  const origin = request.headers.get("Origin") || "";
  const cors = corsHeaders(origin, env);
  if (request.method === "OPTIONS") return cors ? new Response(null, { status: 204, headers: cors }) : new Response(null, { status: 403 });
  if (!cors) return json({ error: "ORIGIN_NOT_ALLOWED" }, 403);
  let userId;
  try { userId = await requireAccess(request, env); }
  catch (error) {
    const code = error.message || "ACCESS_DENIED";
    const status = code === "LOGIN_REQUIRED" ? 401 : 403;
    return json({ error: code, message: status === 401 ? "Entre pelo acesso institucional autorizado e tente novamente." : "Acesso não autorizado ou configuração de autenticação incompleta." }, status, origin, true);
  }
  try {
    const base = (env.RFB_CBS_API_BASE || "").replace(/\/$/, "");
    if (!base) return json({ error: "RFB_API_BASE_NOT_CONFIGURED" }, 503, origin, true);

    if (url.pathname === "/api/cbs/requests" && request.method === "POST") {
      const input = await request.json();
      const service = String(input.service || "");
      const cnpjBase = String(input.cnpjBase || "").replace(/\D/g, "");
      if (!SERVICES.has(service)) return json({ error: "INVALID_SERVICE" }, 400, origin, true);
      if (!allowedCnpj(cnpjBase, env)) return json({ error: "CNPJ_NOT_ALLOWED", message: "CNPJ-base não autorizado na configuração institucional." }, 403, origin, true);
      const token = await getToken(env);
      const result = await rfbFetch(base + "/" + service + "/" + cnpjBase, token, {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ urlRetorno: "" })
      });
      if (!result.tiqueteSolicitacao) return json({ error: "INVALID_RFB_RESPONSE" }, 502, origin, true);
      return json({ service, cnpjBase, ticket: result.tiqueteSolicitacao, estimatedSeconds: result.tEASegundos ?? null, message: "Solicitação recebida pela Receita Federal. Acompanhe o processamento pelo tíquete." }, 201, origin, true);
    }

    const statusMatch = url.pathname.match(/^\/api\/cbs\/requests\/([A-Za-z0-9._-]{8,200})\/status$/);
    if (statusMatch && request.method === "GET") {
      const token = await getToken(env);
      return json(await rfbFetch(base + "/situacao/" + encodeURIComponent(statusMatch[1]), token), 200, origin, true);
    }

    const resultMatch = url.pathname.match(/^\/api\/cbs\/requests\/([A-Za-z0-9._-]{8,200})\/result$/);
    if (resultMatch && request.method === "GET") {
      const token = await getToken(env);
      const ticket = resultMatch[1];
      const status = await rfbFetch(base + "/situacao/" + encodeURIComponent(ticket), token);
      if (status.situacao !== "CONCLUIDA") return json({ situacao: status.situacao, codigoErro: status.codigoErro, mensagemErro: status.mensagemErro }, 409, origin, true);
      const download = await rfbFetch(base + "/download/" + encodeURIComponent(ticket), token);
      if (!download.urlAssinada) return json({ error: "SIGNED_URL_MISSING" }, 502, origin, true);
      const signedUrl = new URL(download.urlAssinada);
      if (signedUrl.protocol !== "https:") return json({ error: "INVALID_SIGNED_URL" }, 502, origin, true);
      if (download.urlAssinadaExpiraEm && Date.parse(download.urlAssinadaExpiraEm) <= Date.now()) return json({ error: "SIGNED_URL_EXPIRED" }, 410, origin, true);
      // A URL assinada é segredo temporário. Nunca registrar em logs nem devolvê-la ao navegador.
      const fileResponse = await fetch(signedUrl.toString());
      if (!fileResponse.ok) return json({ error: "RFB_FILE_DOWNLOAD_FAILED" }, 502, origin, true);
      const data = await fileResponse.json();
      return json({ situacao: "CONCLUIDA", ticket, data }, 200, origin, true);
    }
    return json({ error: "NOT_FOUND" }, 404, origin, true);
  } catch (error) {
    const status = error.status || (String(error.message).startsWith("RFB_CREDENTIALS") ? 503 : 502);
    return json({ error: error.code || "INTEGRATION_ERROR", message: error.message.startsWith("RFB_AUTH_FAILED") ? "Falha na autenticação com a Receita Federal. Confira as credenciais e o ambiente." : error.message }, status, origin, true);
  }
}
export default { async fetch(request, env) { return handle(request, env); } };
