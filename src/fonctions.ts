// deno-lint-ignore-file
import Handlebars from "https://dev.jspm.io/handlebars@4.7.6";

const decoder = new TextDecoder('utf-8');

var HandlebarsJS = (Handlebars as any);

HandlebarsJS.registerHelper({
    x: function (expression: any, options: any) {
        return eval(expression);
    },
});

HandlebarsJS.registerHelper("isdefined", function (value: any) {
    return value != undefined;
});

HandlebarsJS.registerHelper("isnull", function (value: any) {
    return value == null;
});

HandlebarsJS.registerHelper("equal", function (value1: any, value2: any) {
    return value1 == value2;
});

export async function Template(path: string, options: any): Promise<string> {
    path = "./views/" + path + ".hbs";
    var template = await HandlebarsJS.compile(
        decoder.decode(await Deno.readFile(path)),
    );
    return template(options);
}

export async function HF(ctx: any) {
    var header = ctx.fonctions.Template("HF/header", {

    }), footer = ctx.fonctions.Template("HF/footer", {

    })

    let res = {
        "header": new HandlebarsJS.SafeString(await header),
        "footer": new HandlebarsJS.SafeString(await footer)
    }

    return {
        "res": res
    };
}