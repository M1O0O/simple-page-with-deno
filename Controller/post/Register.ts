// deno-lint-ignore-file

export default {
    Main: async (ctx: any) => {
        var post = ctx.request.body({ type: "form" });
        var value = await post.value;
    },
};