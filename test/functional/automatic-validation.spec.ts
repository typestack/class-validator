import "es6-shim";
import {
    ArrayNotEmpty, ArrayMinSize, ArrayMaxSize, MaxLength, MinLength, AutoValidate
} from "../../src/decorator/decorators";
import { Validator } from "../../src/validation/Validator";
import { expect } from "chai";

import { should, use } from "chai";

import * as chaiAsPromised from "chai-as-promised";

should();
use(chaiAsPromised);

// -------------------------------------------------------------------------
// Setup
// -------------------------------------------------------------------------

describe("Automatic validation", function () {

    @AutoValidate()
    class TestClass {
        @MinLength(10)
        @MaxLength(20)
        public title: string;

        @ArrayNotEmpty()
        @ArrayMinSize(2)
        @ArrayMaxSize(5)
        @MinLength(3, { each: true, message: "Tag is too short. Minimal length is $value characters" })
        @MaxLength(50, { each: true, message: "Tag is too long. Maximal length is $value characters" })
        tags: string[];

    }

    it("should assign property ", function () {
        const testInstance = new TestClass();

        testInstance.title = "This is a title";

        testInstance.title.should.equal("This is a title");
    });

    it("should assign array property ", function () {
        const testInstance = new TestClass();
        const tags = ["FirstAwesomeTag", "EvenBetterTag"];
        testInstance.tags = tags;

        testInstance.tags.should.equal(tags);
    });

    it("should correctly fail property assignment ", function () {
        const testInstance = new TestClass();

        let errorText;
        try {
            testInstance.title = "Too Short";
        } catch (e) {
            errorText = e.toString();
        }

        errorText.should.be.equal("An instance of TestClass has failed the validation:\n" +
        " - property title has failed the following constraints: minLength \n");
    });

    it("should correctly fail array property assignment ", function () {
        const testInstance = new TestClass();

        let errorText;
        try {
            testInstance.tags = ["JS"];
        } catch (e) {
            errorText = e.toString();
        }

        errorText.should.be.equal("An instance of TestClass has failed the validation:\n" +
        " - property tags has failed the following constraints: minLength, arrayMinSize \n");
    });
});
