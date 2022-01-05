// #!/usr/bin/env node

import { output, outputTokenMap } from '../react/utils';
const path = require('path');
const fs = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const getFileComment = () => `// Do not edit directly
// Generated with design-token-editor on ${new Date().toLocaleString()}
`;

const tokenToJSString = (token: ReturnType<typeof output>) => {
    let string = `${getFileComment()}
module.exports = {`;
    for (const key in token) {
        const { value = '', comment = '' } = token[key];
        string += `
    // ${comment}
    ${key}: '${value}',`;
    }
    string += `
};
`;
    return string;
};

// T_COLOR_BUTTON_BG => $t-color-button-bg
const snakeName = (key: string) => key.toLowerCase().replace(/_/, '-');
const tokenToSCSSString = (token: ReturnType<typeof output>) => {
    let string = getFileComment();
    for (const key in token) {
        const { value = '', comment = '' } = token[key];
        string += `
$${snakeName(key)}: ${value}; // ${comment}`;
    }
    return string;
};

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
                    describe: 'origin file name',
                    default: 'default.json',
                })
                .positional('format', {
                    describe: 'emit file format',
                    default: ['ts', 'js', 'json', 'scss'],
                    type: 'array',
                });
        },
        (argv: any) => {
            console.log(`read token define from ${argv.input}`);

            const tokenDefine = require(path.join(process.cwd(), argv.input));
            const tokens = output(tokenDefine);

            console.log(`write tokens to ${argv.outDir}`);
            const dir = path.join(process.cwd(), argv.outDir);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            argv.format.forEach((f: string) => {
                switch (f) {
                    case 'scss': {
                        fs.writeFileSync(
                            path.join(dir, `token.scss`),
                            tokenToSCSSString(tokens),
                        );
                        break;
                    }
                    case 'ts':
                    case 'js': {
                        fs.writeFileSync(
                            path.join(dir, `token.${f}`),
                            tokenToJSString(tokens),
                        );
                        break;
                    }
                    case 'json':
                    default: {
                        fs.writeFileSync(
                            path.join(dir, 'token.json'),
                            JSON.stringify(outputTokenMap(tokenDefine), null, 4),
                        );
                        break;
                    }
                }
            });
        },
    )
    .parse();
