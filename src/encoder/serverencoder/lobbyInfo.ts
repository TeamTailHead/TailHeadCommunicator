import BinaryReader from "../../binary/BinaryReader";
import BinaryWriter from "../../binary/BinaryWriter";
import { LobbyInfo } from "../../message/serverMessage";

export const lobbyInfo = {
  encode(data: LobbyInfo): Buffer {
    const writer = new BinaryWriter();

    const players = data.players;
    const playerCount = players.length;

    writer.writeString(data.adminId);
    writer.writeInt32(playerCount);
    for (let i = 0; i < playerCount; i++) {
      writer.writeString(players[i].id);
      writer.writeString(players[i].nickname);
    }

    return writer.toBuffer();
  },
  decode(buffer: Buffer): LobbyInfo {
    const reader = new BinaryReader(buffer);

    const adminId = reader.readString();
    const playerCount = reader.readInt32();
    const players = [];
    for (let i = 0; i < playerCount; i++) {
      players.push({
        id: reader.readString(),
        nickname: reader.readString(),
      });
    }

    return {
      players: players,
      adminId: adminId,
    };
  },
};
