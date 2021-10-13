const builtin = require('./bi.json');
const dt = require('./dt.json');
const et = require('./external.json');

const extend = (from, to) => {
    for (const key in from) {
        if (key in to) {
            extend(from[key], to[key]);
        } else {
            to[key] = from[key];
        }
    }
};

extend(et, dt);

const map = {};

const parseValue = (value) => {
    if (/{.*}/.test(value)) {
        return value.replace(/{(.*?)}/g, (str) => {
            const target = str.replace(/^\{/, '').replace(/\}$/, '').split('.');
            let v = builtin;
            for (let i = 0; i < target.length; i++) {
                const k = target[i];
                v = v[k];
            }
            return v;
        });
    } else {
        return value;
    }
};

const gobi = (builtin) => {
    for (const key in builtin) {
        const info = builtin[key];
        if (info.value) {
            if (/{.*}/.test(info.value)) {
                info.value = parseValue(info.value);
            }
        } else if (typeof info === 'object') {
            gobi(info);
        } else {
            console.error(info);
        }
    }
};

gobi(builtin);

const go = (dt, prefix) => {
    for (const key in dt) {
        const info = dt[key];
        const fullKey = `${prefix}_${key}`.toUpperCase();
        if (info.value) {
            if (/{.*}/.test(info.value)) {
                map[fullKey] = parseValue(info.value);
            } else {
                map[fullKey] = info.value;
            }
        } else {
            if (typeof info === 'object') {
                go(info, fullKey);
            } else {
                console.error(info, fullKey);
            }
        }
    }
};

go(dt, 'T');

require('fs').writeFileSync('./output.json', JSON.stringify(map, null, 4));
