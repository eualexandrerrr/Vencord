/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Alexandre
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";

const settings = definePluginSettings({
    routeMode: {
        type: OptionType.SELECT,
        description: "Por onde o gateway sai. Mudança só vale depois de reiniciar o Discord",
        options: [
            { label: "Automático — Tor local se existir, senão saídas gratuitas", value: "auto", default: true },
            { label: "Só Tor", value: "tor" },
            { label: "Só saídas gratuitas (sem Tor)", value: "free" }
        ]
    },
    proxy: {
        type: OptionType.STRING,
        description: "Saída fixa, no formato socks5://usuario:senha@host:porta (vazio = escolher sozinho)",
        default: ""
    },
    torAddr: {
        type: OptionType.STRING,
        description: "Endereço do Tor local (vazio = 127.0.0.1:9050)",
        default: ""
    },
    excludedCountries: {
        type: OptionType.STRING,
        description: "Países cujas saídas não servem, separados por vírgula (é o país bloqueado que precisa ficar de fora)",
        default: "BR"
    }
});

export default definePlugin({
    name: "GoLiveBypass",
    description: "Devolve o Go Live e a câmera em contas bloqueadas, roteando só o websocket de gateway por uma saída de outro país. Todo o trabalho é no processo principal; ligar, desligar ou trocar de rota exige reiniciar o Discord.",
    authors: [{ name: "Alexandre", id: 0n }],
    settings
});
