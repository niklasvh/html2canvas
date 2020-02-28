export function layout(chars: string[], width: number, measure: (s: string, len: number) => number): number[][] {
    const pos: number[][] = [];
    let line = 0;
    let lineString = '';
    let lineLen = 0;
    for (let i = 0; i < chars.length; i++) {
        if (chars[i] === '\n') {
            pos.push([-1, line]);
            line++;
            setLine(0, 0);
        } else {
            addChar(i);
            const lineWidth = measure(lineString, lineLen);
            pos.push([lineWidth - measure(chars[i], 1), line]);
            if (lineWidth > width) {
                if (chars[i] === ' ') {
                    let p = i;
                    while (p > 0 && pos[p][1] === line && chars[p] === ' ') p--;
                    for (let j = i; j > p; j--) {
                        pos[j][0] = -1;
                    }
                    line++;
                    setLine(0, 0);
                    while (i < chars.length + 1 && chars[i + 1] === ' ') {
                        pos.push([-1, line]);
                        i++;
                    }
                } else if (chars[i] === '-') {
                    line++;
                    setLine(i, i + 1);
                    pos[i] = [0, line];
                } else {
                    let p = i;
                    while (p > 0 && pos[p][1] === line && chars[p] !== ' ' && chars[p] !== '-') p--;
                    line++;
                    if (chars[p] === ' ' || chars[p] === '-') {
                        setLine(p + 1, i + 1);
                        for (let j = i; j > p; j--) {
                            pos[j] = [pos[j][0] - pos[p + 1][0], line];
                        }
                        if (chars[p] === ' ') {
                            pos[p][0] = -1;
                        }
                    } else {
                        setLine(i, i + 1);
                        pos[i] = [0, line];
                    }
                }
            }
        }
    }
    return pos;

    function addChar(pos: number) {
        lineString += chars[pos];
        lineLen++;
    }

    function setLine(from: number, to: number) {
        lineString = '';
        for (let i = from; i < to; i++) {
            lineString += chars[i];
        }
        lineLen = to - from;
    }
}
