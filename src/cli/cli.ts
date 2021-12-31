// #!/usr/bin/env node

import { output } from '../react/utils';
const path = require('path');
const fs = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

yargs(hideBin(process.argv))
    .command(
        'build',
        'build the designToken to tokens',
        (yargs: any) => {
            return yargs
                .positional('outDir', {
                    describe: 'build output dir',
                    default: './output',
                })
                .positional('input', {
                    describe: 'origin file',
                    default: './default.json',
                });
        },
        (argv: any) => {
            console.log(`read token define from ${argv.input}`);

            const tokenDefine = require(path.join(process.cwd(), argv.input));
            const tokens = output(tokenDefine);

            console.log(`write tokens to ${argv.outDir}`);
            const dir = path.join(process.cwd(), argv.outDir);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(path.join(dir, 'token.json'), JSON.stringify(tokens));
        },
    )
    .parse();
