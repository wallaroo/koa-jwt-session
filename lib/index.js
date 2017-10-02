"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createMiddleware;

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _lodash = require("lodash.omit");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defOpts = { expiresIn: "1h", cookie: "jwt-session" };
function createMiddleware(secret, opts = { expiresIn: "1h", cookie: "jwt-session" }) {
    opts = Object.assign({}, defOpts, opts);
    return async (ctx, next) => {
        const token = ctx.cookies.get(opts.cookie);
        if (token) {
            try {
                ctx.session = (0, _lodash2.default)(_jsonwebtoken2.default.verify(token, secret), "exp", "iat");
            } catch (e) {
                //if the token is expired no session will be load
                if (e.name !== "TokenExpiredError") {
                    ctx.status = 403;
                    return;
                }
            }
        }
        ctx.session = ctx.session || {};
        await next();
        if (ctx.session) {
            console.log("SESSION", ctx.session);
            const newToken = _jsonwebtoken2.default.sign(ctx.session, secret, (0, _lodash2.default)(opts, "cookie"));
            ctx.cookies.set(opts.cookie, newToken);
        }
    };
}