// deno-lint-ignore-file
import { Application, Router, send, helpers } from "https://deno.land/x/oak/mod.ts";
import * as fonctions from "./src/fonctions.ts";
import * as sql from "./src/sql.ts";

const router = new Router();
const app = new Application();

var encoder = new TextEncoder();
var routes: any = await import("./src/routes.ts");

Object.keys(routes.default).forEach(async (routeType: any) => {
    switch (routeType) {
        case "get":
            Object.keys(routes.default[routeType]).forEach(async route => {
                var routeImported = await import("./Controller/get/" + routes.default[routeType][route] + ".ts");
                router.get(route, routeImported.default.Main);
            });
            break;
        case "post":
            Object.keys(routes.default[routeType]).forEach(async route => {
                var routeImported = await import("./Controller/post/" + routes.default[routeType][route] + ".ts");
                router.post(route, routeImported.default.Main);
            });
            break;
        default:
            break;
    }
});

var logIP: any = "";

setInterval(async () => {
    var data = await encoder.encode(logIP);
    logIP = "";
    await Deno.writeFileSync("./logs/ips.log", data, { append: true });
}, 750);

app.use(async (ctx: any, next) => {
    if (ctx.request.url.pathname.includes("/assets")) {
        var request = ctx.request.url.pathname;
        await send(ctx, "/assets" + request.slice(request.indexOf("assets") + "assets".length), {
            root: `${Deno.cwd()}/public`,
        });
    } else {
        logIP += `[${new Date()}] ${ctx.request.headers.get("cf-connecting-ip")} -> ${ctx.request.url}\n`
        console.log(`[${new Date()}] ${ctx.request.headers.get("cf-connecting-ip")} -> ${ctx.request.url}`);
        try {
            ctx.libs.fonctions = fonctions;
            ctx.libs.sql = sql;
            ctx.libs.helpers = helpers;
            await next();
        } catch (error) {
            console.log(error)
        }
    }
});

console.log("Started !");

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 80 });