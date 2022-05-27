import spotifyd from "../../spotifyd_loader/mod.js";

export default async function(ctx) {
    let body = await ctx.request.body().value;

    if (ctx.request.method == "POST") {
        if (body.username == null || body.username == undefined || body.username == "" || body.password == null || body.password == undefined || body.password == "") {
            ctx.response.status = 400;
            ctx.response.headers.set("Content-Type", "application/json");
            ctx.response.body = {
              error: "Invalid data",
            };
            return;
        }

        await spotifyd.setupLogin(body.username, body.password);
        await spotifyd.restartSpotifyd();

        ctx.response.status = 200;
        ctx.response.headers.set("Content-Type", "application/json");
        ctx.response.body = {
            error: "Ok."
        }

        return;
    }
}