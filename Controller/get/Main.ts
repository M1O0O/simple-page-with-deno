// deno-lint-ignore-file

export default {
    Main: async (ctx: any) => {
        var parameters = await ctx.libs.fonctions.HF(ctx);
        ctx.response.body = await ctx.libs.fonctions.Template("index", parameters.res);
    },
};