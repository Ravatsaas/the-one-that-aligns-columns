'use strict';

export class AlignableField {
    public value: string;
    public rawLength: number;
    public trimmedLength: number;
    public leftPadding: number;
    public rightPadding: number;

    public get isNumber(): boolean {
        return !isNaN(Number(this.value));
    }

    constructor(value: string){
        if (value) {
            this.value = value;
            this.rawLength = value.length;
            let leftPadding = value.match(/^\s*/);
            let rightPadding = value.match(/\s*$/);

            this.leftPadding = leftPadding  ? leftPadding[0].length : 0;
            this.rightPadding = rightPadding ? rightPadding[0].length : 0;
            this.trimmedLength = this.rawLength - this.leftPadding - this.rightPadding;
        } else {
            this.value = '';
            this.rawLength = 0;
            this.leftPadding = 0;
            this.rightPadding = 0;
            this.trimmedLength = 0;
        }
    }
}