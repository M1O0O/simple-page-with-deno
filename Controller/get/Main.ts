// deno-lint-ignore-file

export default {
    Main: async (ctx: any) => {
        var HeaderFooter = await ctx.fonctions.HF(ctx);
        ctx.response.body = await ctx.fonctions.Template("index", HeaderFooter.res);
    },
};