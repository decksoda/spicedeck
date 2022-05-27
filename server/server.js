import { Application } from "https://deno.land/x/oak/mod.ts";
import routing from "./routes/mod.js";

const app = new Application();

app.use(async (ctx) => {
  let url = ctx.request.url.pathname;
  url = url.substring(1);
  url = url.split("/");

  let currentRouteLocation = routing;

  for (let i of url) {
    if (currentRouteLocation[i] == undefined) {
      ctx.response.status = 404;
      ctx.response.headers.set("Content-Type", "application/json");
      ctx.response.body = {
        error: "Not found",
      };
    }

    currentRouteLocation = currentRouteLocation[i];
  }

  await currentRouteLocation(ctx);
});

await app.listen({ port: 6937 });
