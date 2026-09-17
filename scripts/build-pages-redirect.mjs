import { mkdir, writeFile } from "node:fs/promises";

const destination = process.env.PUBLIC_APP_URL?.replace(/\/$/, "");
if (!destination || !/^https:\/\/[^/]+$/.test(destination)) {
  throw new Error("PUBLIC_APP_URL must be the HTTPS origin of the deployed app");
}
const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <meta http-equiv="refresh" content="0;url=${destination}/" />
    <title>Conectando a Comunidade</title>
    <script>
      const base = "/conectando-a-comunidade";
      const path = location.pathname.startsWith(base)
        ? location.pathname.slice(base.length) || "/"
        : "/";
      location.replace(${JSON.stringify(destination)} + path + location.search + location.hash);
    </script>
  </head>
  <body>
    <p>Estamos abrindo o site. <a href="${destination}/">Clique aqui se não abrir automaticamente.</a></p>
  </body>
</html>
`;

await mkdir("dist/public", { recursive: true });
await Promise.all([
  writeFile("dist/public/index.html", html),
  writeFile("dist/public/404.html", html),
]);
