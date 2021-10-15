// save file
function click(node: HTMLAnchorElement) {
    try {
        node.dispatchEvent(new MouseEvent('click'));
    } catch (e) {
        const evt = document.createEvent('MouseEvents');
        evt.initMouseEvent(
            'click',
            true,
            true,
            window,
            0,
            0,
            0,
            80,
            20,
            false,
            false,
            false,
            false,
            0,
            null,
        );
        node.dispatchEvent(evt);
    }
}

const saveAs = function saveAs(blob: Blob, name: string) {
    const URL = window.URL || window.webkitURL;
    const a = document.createElement('a');
    name = name || 'download';

    a.download = name;
    a.rel = 'noopener';

    a.href = URL.createObjectURL(blob);
    setTimeout(function () {
        URL.revokeObjectURL(a.href);
    }, 1);
    setTimeout(function () {
        click(a);
    }, 0);
};

const save = (json: any, name: string) => {
    const blob = new Blob([JSON.stringify(json, null, 4)], { type: 'application/json' });
    saveAs(blob, name);
};

export default save;
