import {CSSValue} from "../../syntax/parser";
import {UnprocessedGradientColorStop} from "../image";
import {color} from "../color";

export const parseColorStop = (args: CSSValue[]): UnprocessedGradientColorStop => {
    const c = color.parse(args[0]);
    return args.length === 2 ? {color: c, stop: args[1]} : {color: c, stop: null};
};
