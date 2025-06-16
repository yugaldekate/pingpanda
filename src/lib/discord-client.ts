// Refer : https://www.writebots.com/discord-bot-token/

import { REST } from "@discordjs/rest";
import { Routes, RESTPostAPICurrentUserCreateDMChannelResult, APIEmbed, RESTPostAPIChannelMessageResult } from "discord-api-types/v10";

export class DiscordClient {
    private rest: REST;

    // get token from environment variable or use empty string if not provided
    constructor(token: string | undefined) {
        this.rest = new REST({ version: "10" }).setToken(token ?? "");
    }

    /**
     * **Creates a new DM channel with the specified user ID.**
     * @param userId - The ID of the user to create a DM channel with.
     * @returns A promise that resolves to the created DM channel.
     */
    async createDM(userId: string): Promise<RESTPostAPICurrentUserCreateDMChannelResult> {
        return this.rest.post(Routes.userChannels(), {
            body: {
                recipient_id: userId
            },
        }) as Promise<RESTPostAPICurrentUserCreateDMChannelResult>;
    }

    /**
     * **Sends an embed message to the specified channel.**
     * @param channelId - The ID of the channel to send the embed to.
     * @param embed - The embed object to send.
     * @returns A promise that resolves to the result of the message sent.
     */
    async sendEmbed(channelId: string, embed: APIEmbed): Promise<RESTPostAPIChannelMessageResult> {
        return this.rest.post(Routes.channelMessages(channelId), {
            body: {
                embeds: [embed]
            },
        }) as Promise<RESTPostAPIChannelMessageResult>;
    }
}
