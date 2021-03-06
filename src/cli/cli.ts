// #!/usr/bin/env node

import { output, outputTokenMap, merge } from '../react/utils';
const path = require('path');
const fs = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const Color = require('color');

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

const getImage = (color: string) => {
    if (/^#[0-9a-fA-F]{2,8}$/.test(color)) {
        const pColor = color.replace('#', '');
        const tColor = Color(color).negate().hex().replace('#', '');
        return `![${color}](https://dummyimage.com/50/${pColor}/${tColor}.png&text=${pColor})`;
    }
    return '';
};

const tokenToMarkdownString = (token: ReturnType<typeof output>) => {
    let string = `
> Do not edit directly
> Generated with design-token-editor on ${new Date().toLocaleString()}

|  token name  |  value  |  display  |  comment  |
|---|---|---|---|
`;

    for (const key in token) {
        const { value = '', comment = '' } = token[key];
        string += `|  ${key}  |  ${value}  |  ${getImage(value)}  |  ${comment}  |
`;
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
                .positional('outFile', {
                    describe: 'build output file name',
                    default: 'token',
                })
                .positional('input', {
                    describe: 'origin file name',
                    default: 'default.json',
                })
                .positional('format', {
                    describe: 'emit file format',
                    default: ['ts', 'js', 'json', 'scss'],
                })
                .positional('patch', {
                    desc: 'path file name',
                });
        },
        (argv: any) => {
            console.log(`read token define from ${argv.input}`);

            let tokenDefine = require(path.join(process.cwd(), argv.input));
            if (argv.patch) {
                console.log(`patch token define from ${argv.patch}`);
                const tokenPatch = require(path.join(process.cwd(), argv.patch));
                tokenDefine = merge(tokenDefine, tokenPatch);
            }

            const tokens = output(tokenDefine);

            const fileName = argv.outFile;

            console.log(`write tokens to ${argv.outDir}`);
            const dir = path.join(process.cwd(), argv.outDir);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            argv.format.forEach((f: string) => {
                switch (f) {
                    case 'scss': {
                        fs.writeFileSync(
                            path.join(dir, `${fileName}.scss`),
                            tokenToSCSSString(tokens),
                        );
                        break;
                    }
                    case 'ts':
                    case 'js': {
                        fs.writeFileSync(
                            path.join(dir, `${fileName}.${f}`),
                            tokenToJSString(tokens),
                        );
                        break;
                    }
                    case 'md':
                    case 'markdown': {
                        fs.writeFileSync(
                            path.join(dir, `${fileName}.md`),
                            tokenToMarkdownString(tokens),
                        );
                        break;
                    }
                    case 'json':
                    default: {
                        fs.writeFileSync(
                            path.join(dir, `${fileName}.json`),
                            JSON.stringify(outputTokenMap(tokenDefine), null, 4),
                        );
                        break;
                    }
                }
            });
        },
    )
    .array('format')
    .parse();
