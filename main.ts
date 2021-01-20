// deno-lint-ignore-file
import { Application, Router, send, helpers } from "https://deno.land/x/oak/mod.ts";

const router = new Router();
const app = new Application();

var encoder = new TextEncoder();
var routes: any = await import("./src/routes.ts");

var libs: any = {};

for await (const file of Deno.readDirSync("./libs")) {
    var LibName: any = file.name.split(".", 1)[0];
    libs[LibName] = await import(`./libs/${file.name}`)
}

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
            ctx.libs = libs;
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