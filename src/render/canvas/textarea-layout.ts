export function layout(chars: string[], width: number, measure: (s: string) => number): number[][] {
    const pos: number[][] = [];
    let line = 0;
    let lineWidth = 0;
    for (let i = 0; i < chars.length; i++) {
        if (chars[i] === '\n') {
            pos.push([-1, line]);
            line++;
            lineWidth = 0;
        } else {
            pos.push([lineWidth, line]);
            lineWidth += measure(chars[i]);
            if (lineWidth > width) {
                if (chars[i] === ' ') {
                    let p = i;
                    while (p > 0 && pos[p][1] === line && chars[p] === ' ') p--;
                    for (let j = i; j > p; j--) {
                        pos[j][0] = -1;
                    }
                    line++;
                    lineWidth = 0;
                    while (i < chars.length + 1 && chars[i + 1] === ' ') {
                        pos.push([-1, line]);
                        i++;
                    }
                } else {
                    let p = i;
                    while (p > 0 && pos[p][1] === line && chars[p] !== ' ') p--;
                    line++;
                    if (chars[p] === ' ') {
                        lineWidth -= pos[p + 1][0];
                        for (let j = i; j > p; j--) {
                            pos[j] = [pos[j][0] - pos[p + 1][0], line];
                        }
                        pos[p][0] = -1;
                    } else {
                        lineWidth -= pos[i][0];
                        pos[i] = [0, line];
                    }
                }
            }
        }
    }
    return pos;
}
