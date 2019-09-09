import * as assert from 'assert';
import * as vscode from 'vscode';
import * as moq from 'typemoq';
import { AlignableLine } from '../alignable-line';

suite("Alignable Line Tests", function () {

    test("Constructor detects plain alignable lines", function() {
        let textLine = moq.Mock.ofType<vscode.TextLine>();
        textLine.setup(tl => tl.text).returns(() => '(1,2,3)');

        var line = new AlignableLine(textLine.object);

        assert.equal(true, line.isCommaAlignable);
    });

    test("Constructor rejects lines without parenthesis", function() {
        let textLine = moq.Mock.ofType<vscode.TextLine>();
        textLine.setup(tl => tl.text).returns(() => '1,2,3');

        var line = new AlignableLine(textLine.object);

        assert.equal(false, line.isCommaAlignable);
    });

    test("Constructor detects alignable lines with comments", function() {
        let textLine = moq.Mock.ofType<vscode.TextLine>();
        textLine.setup(tl => tl.text).returns(() => '(1,2,3) //comment');

        var line = new AlignableLine(textLine.object);

        assert.equal(true, line.isCommaAlignable);
        assert.equal(3, line.fields.length);
    });

    test("Constructor detects fields with quotation marks", function() {
        let textLine = moq.Mock.ofType<vscode.TextLine>();
        textLine.setup(tl => tl.text).returns(() => '("A","B",1)');

        var line = new AlignableLine(textLine.object);

        assert.equal(true, line.isCommaAlignable);
        assert.equal(3, line.fields.length);
    });

    test("Constructor correctly parses fields with commas inside single quotes", function() {
        let textLine = moq.Mock.ofType<vscode.TextLine>();
        textLine.setup(tl => tl.text).returns(() => "('A,B', 'C')");

        var line = new AlignableLine(textLine.object);

        assert.equal(true, line.isCommaAlignable);
        assert.equal(2, line.fields.length);
    });

    test("Constructor correctly parses fields with commas inside double quotes", function() {
        let textLine = moq.Mock.ofType<vscode.TextLine>();
        textLine.setup(tl => tl.text).returns(() => '("A,B", "C")');

        var line = new AlignableLine(textLine.object);

        assert.equal(true, line.isCommaAlignable);
        assert.equal(2, line.fields.length);
    });

    test("Constructor detects and counts empty fields", function() {
        let textLine = moq.Mock.ofType<vscode.TextLine>();
        textLine.setup(tl => tl.text).returns(() => "('',,'X')");

        var line = new AlignableLine(textLine.object);

        assert.equal(true, line.isCommaAlignable);
        assert.equal(3, line.fields.length);
    });

});