import fs from "fs";
import path from "path";
import type { Express } from "express";
import { ENV } from "./env";

const imageFallbacks: Record<string, string> = {
  "campo-comprido-novo-1_8562e62a.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/a/ac/Curitiba_From_Barigui_Park.jpg",
  "parque-barigui-1_a184efe0.jpg":
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Parque_Barigui_Curitiba.jpg",
  "brt-canal-bus_ea471771.jpg":
    "https://mid-noticias.curitiba.pr.gov.br/2025/00488404.jpg",
  "brt-corredor_17821a98.jpg":
    "https://mid-noticias.curitiba.pr.gov.br/2018/00239513.jpg",
  "viaduto-orleans_754366df.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/f/f3/Terminal_Campo_Comprido_Curitiba_Brasil.jpg",
  "viaduto-orleans_63d2e314.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/f/f3/Terminal_Campo_Comprido_Curitiba_Brasil.jpg",
  "viaduto-orleans-2_b8e6e47a.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/f/f3/Terminal_Campo_Comprido_Curitiba_Brasil.jpg",
  "teatro-positivo-1_5a7c58e2.jpg":
    "https://cbncuritiba.com.br/wp-content/uploads/2023/03/teatro-positivo.jpg",
  "teatro-positivo-1_05da74ab.jpg":
    "https://cbncuritiba.com.br/wp-content/uploads/2023/03/teatro-positivo.jpg",
  "teatro-positivo-2_1cf99b5e.jpg":
    "https://cbncuritiba.com.br/wp-content/uploads/2023/03/teatro-positivo.jpg",
  "teatro-positivo-3_c945d009.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/4/46/Teatro_Positivo_-_Curitiba_PR_-_2.jpg",
  "campo-comprido-aereo_4bb30e0b.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/a/ac/Curitiba_From_Barigui_Park.jpg",
  "campo-comprido-aereo_9e4dd866.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/a/ac/Curitiba_From_Barigui_Park.jpg",
  "campo-comprido-novo-6_3322afb1.jpg":
    "https://mid-noticias.curitiba.pr.gov.br/2025/00488404.jpg",
  "corredor-ipes_ce61de2c.jpg":
    "https://mid-noticias.curitiba.pr.gov.br/2018/00239513.jpg",
  "corredor-ipes_e6474f5e.jpg":
    "https://mid-noticias.curitiba.pr.gov.br/2018/00239513.jpg",
  "comercio-novo_f65f371d.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/a/ac/Curitiba_From_Barigui_Park.jpg",
  "denuncias-hero_5e28ba3a.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/f/f3/Terminal_Campo_Comprido_Curitiba_Brasil.jpg",
  "eventos-hero_83775eb4.jpg":
    "https://cbncuritiba.com.br/wp-content/uploads/2023/03/teatro-positivo.jpg",
  "mural-hero_655eb2af.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/a/ac/Curitiba_From_Barigui_Park.jpg",
  "noticias-hero_20a2e9aa.png":
    "https://mid-noticias.curitiba.pr.gov.br/2025/00488404.jpg",
  "sugestoes-hero_f9c5cd3c.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/a/ac/Curitiba_From_Barigui_Park.jpg",
  "telefones-hero_18fc03d5.jpg":
    "https://mid-noticias.curitiba.pr.gov.br/2018/00239513.jpg",
};

export function registerStorageProxy(app: Express) {
  const handleStorageRequest = (allowLocalFallback: boolean) => async (req: Parameters<Express["get"]>[1] extends (...args: infer P) => any ? P[0] : never, res: Parameters<Express["get"]>[1] extends (...args: infer P) => any ? P[1] : never) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    const localStorageDir = path.resolve(
      import.meta.dirname,
      "../..",
      "client",
      "public",
      "storage"
    );

    const requestedFile = path.resolve(localStorageDir, key.replace(/^\/+/, ""));
    const isWithinStorageDir = path.relative(localStorageDir, requestedFile);
    const fallbackUrl = imageFallbacks[key.replace(/^\/+/, "")];

    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      if (fs.existsSync(requestedFile) && !isWithinStorageDir.startsWith("..")) {
        if (allowLocalFallback) {
          res.sendFile(requestedFile);
          return;
        }
      }

      if (fallbackUrl) {
        res.set("Cache-Control", "public, max-age=300");
        res.redirect(302, fallbackUrl);
        return;
      }

      res.status(404).send("Storage file not found locally");
      return;
    }

    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/",
      );
      forgeUrl.searchParams.set("path", key);

      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` },
      });

      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        if (fallbackUrl) {
          res.set("Cache-Control", "public, max-age=300");
          res.redirect(302, fallbackUrl);
          return;
        }
        res.status(502).send("Storage backend error");
        return;
      }

      const { url } = (await forgeResp.json()) as { url: string };
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }

      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      if (fallbackUrl) {
        res.set("Cache-Control", "public, max-age=300");
        res.redirect(302, fallbackUrl);
        return;
      }
      res.status(502).send("Storage proxy error");
    }
  };

  app.get("/storage/*", handleStorageRequest(true));
  app.get("/manus-storage/*", handleStorageRequest(false));
}
