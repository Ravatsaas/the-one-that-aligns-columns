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
        this.value = value;
        this.rawLength = value.length;
        let leftPadding = value.match(/^\s*/);
        let rightPadding = value.match(/\s*$/);
        
        this.leftPadding = leftPadding  ? leftPadding[0].length : 0;
        this.rightPadding = rightPadding ? rightPadding[0].length : 0;
        this.trimmedLength = this.rawLength - this.leftPadding - this.rightPadding;
    }
}