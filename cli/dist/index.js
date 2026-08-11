#!/usr/bin/env node
import { Command } from "commander";
import { login } from "./identity/commands/login.js";
import { whoami } from "./identity/commands/whoami.js";
import { logout } from "./identity/commands/logout.js";
import { register } from "./identity/commands/register.js";
import { googleLogin } from "./identity/commands/google-login.js";
const program = new Command();
program
    .name("ldgr")
    .description("LDGR command-line interface")
    .version("0.1.0");
program.command("login").description("Authenticate with LDGR").action(login);
program.command("whoami").description("Show the authenticated identity").action(whoami);
program.command("logout").description("Sign out of LDGR").action(logout);
program.command("register").description("Create an LDGR account").action(register);
program.command("login-google").description("Authenticate with Google").action(googleLogin);
program.parseAsync().catch((err) => {
    if (err instanceof Error) {
        console.error(`✗ ${err.message}`);
    }
    else {
        console.error("✗ An unexpected error occurred");
    }
    process.exit(1);
});
//# sourceMappingURL=index.js.map