# koa-session-jwt

> a middleware that stores session data in a jwt token

[![NPM Version][npm-image]][npm-url]

## Install

```bash
npm i -S koa-session-jwt
```
or 
```bash
yarn add koa-session-jwt
```
## Usage

```javascript
import session from "koa-session-jwt"
import Koa from 'koa'
const app = new Koa();

app.use(session("secret!"));

app.use(async (ctx, next)=>{
    if(ctx.session.bar === "foo")
        ctx.session.foo = "bar";
    next()
})

```

### Options
**secret** _string required_ - the secret string used to sign the jwt

**opts** _object optional_ - all the options available for [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback)
plus **cookie** (default jwt-session) that is the name of the cookie used to store the jwt on clients

## License

[MIT](http://vjpr.mit-license.org)

[npm-url]: https://npmjs.org/package/koa-session-jwt