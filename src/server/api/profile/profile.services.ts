import UserModel, { IUser } from './profile.model';

async function getUserBySteamId(steamId: string): Promise<IUser> {
  return UserModel.findOne({ steamId });
}
async function UpdateUserTradeUrl(steamId: string, tradeUrl: string): Promise<IUser> {
  const user = await UserModel.findOneAndUpdate(
    { steamId: steamId },
    { tradeUrl: tradeUrl },
    { new: true },
  );
  return user;
}

export { getUserBySteamId, UpdateUserTradeUrl };
