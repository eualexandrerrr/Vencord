/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Alexandre
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { RendererSettings } from "@main/settings";
import { app } from "electron";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const PLUGIN_NAME = "GoLiveBypass";

/**
 * O bypass roda no processo principal e precisa estar de pé antes do websocket de gateway
 * abrir, por isso ele é carregado aqui em cima e não numa chamada de IPC: o `native.ts` de
 * cada plugin é importado pelo bundle principal antes do patcher subir o Discord.
 *
 * A configuração mora na tela de plugins do Vencord, mas o bypass lê um JSON próprio — é o
 * mesmo formato que ele já usava quando era um mod solto. Em vez de reescrever a leitura,
 * despejamos as configurações do Vencord nesse arquivo antes de carregá-lo.
 */
function exportSettings(): boolean {
    const stored = (RendererSettings.store as any).plugins?.[PLUGIN_NAME] ?? {};
    if (stored.enabled !== true) return false;

    const dir = join(app.getPath("appData"), "Vencord", PLUGIN_NAME);
    mkdirSync(dir, { recursive: true });

    writeFileSync(
        join(dir, "settings.json"),
        JSON.stringify({
            enabled: true,
            routeMode: stored.routeMode ?? "auto",
            proxy: stored.proxy ?? "",
            torAddr: stored.torAddr ?? "",
            excludedCountries: stored.excludedCountries ?? "BR"
        }, null, 4),
        "utf-8"
    );

    return true;
}

try {
    if (exportSettings()) {
        // require, e não import: as configurações precisam estar no disco antes do módulo rodar.
        require("./bypass.js");
    }
} catch (error) {
    console.error("[GoLiveBypass] não consegui iniciar", error);
}
