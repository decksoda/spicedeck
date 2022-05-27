import spotifyd from "../../spotifyd_loader/mod.js";

export default async function (ctx) {
  await spotifyd.restartSpotifyd();

  ctx.response.status = 200;
}
