import UserModel, { IUser } from '../../models/user.model';


async function getUserBySteamId(steamId: string): Promise<IUser> {
  const user = await UserModel.findOne({ steamId });
  return user;
}
async function UpdateUserTradeUrl(steamId: string, tradeUrl: string): Promise<IUser> {
  const user = await UserModel.findOneAndUpdate(
    { steamId: steamId },
    { tradeUrl: tradeUrl },
    { new: true },
  );
  return user
}


export { getUserBySteamId, UpdateUserTradeUrl }
