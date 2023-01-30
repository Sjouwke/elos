"use strict";

import Node from "../node.js";
import parseClass from "../helpers/parse-class.js";

export default class Img extends Node {

    static name = 'img';

    constructor(value, className, url = null) {
        super(value);
        this.className = className;
        this.url = url;
    }

    static parse(parser) {

        if (parser.acceptWithVal('ident', 'img')) {
            parser.advance();

            let className = parseClass(parser);

            parser.expect('string');
            let value = parser.getCurrVal();
            parser.advance();

            if (
                parser.accept('symbol', '-') &&
                parser.acceptAtWithVal('symbol', 1, '>')
            ) {
                parser.advance();
                parser.advance();

                parser.expect('string');
                let urlValue = parser.getCurrVal();

                parser.insert(new Img(value, className, urlValue));
                parser.advance();
                return true;
            }

            parser.insert(new Img(value, className));
            return true;
        }

        return false;
    }

    compile(compiler) {
        if (this.url) {
            compiler.writeLn(`<a href="${this.url}" target="_blank" style="text-decoration: none;">`);
        }
        compiler.writeLn(`<img border="0" src="${this.getVal()}" style="display:block; border: 0; width:100%;"/>`);
        if (this.url) {
            compiler.writeLn(`</a>`);
        }
    }
}
