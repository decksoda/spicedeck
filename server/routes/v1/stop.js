import spotifyd from "../../spotifyd_loader/mod.js";

export default async function (ctx) {
  await spotifyd.stopSpotifyd();

  ctx.response.status = 200;
}
