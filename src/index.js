// @flow
import jwt from "jsonwebtoken";
import omit from "lodash.omit";
const defOpts = {expiresIn:"1h",cookie:"jwt-session"};
export default function createMiddleware(secret:string, opts={expiresIn:"1h",cookie:"jwt-session"}):Function{
    opts = Object.assign({},defOpts, opts);
    return async (ctx, next)=>{
        const token = ctx.cookies.get(opts.cookie);
        if (token){
            try {
                ctx.session = omit(jwt.verify(token, secret),"exp","iat");
            }catch(e){
                //if the token is expired no session will be load
                if (e.name !== "TokenExpiredError") {
                    ctx.status = 403;
                    return;
                }
            }
        }
        ctx.session = ctx.session || {};
        await next();
        if (ctx.session){
            console.log("SESSION", ctx.session);
            const newToken = jwt.sign(ctx.session, secret, omit(opts, "cookie"));
            ctx.cookies.set(opts.cookie, newToken);
        }
    }
}