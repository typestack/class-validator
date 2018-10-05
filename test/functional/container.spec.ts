import "es6-shim";
import { IsNotEmpty } from "../../src/decorator/decorators";
import { Validator } from "../../src/validation/Validator";
import { should, use } from "chai";

import * as chaiAsPromised from "chai-as-promised";
import { useContainer } from "../../src";

should();
use(chaiAsPromised);

// -------------------------------------------------------------------------
// Setup
// -------------------------------------------------------------------------

const validator = new Validator();

// -------------------------------------------------------------------------
// Specifications: common decorators
// -------------------------------------------------------------------------

describe("container", function () {
    afterEach(function () {
        useContainer(undefined);
    });

    it("should throw an error if defaultContainer is not empty and useContainer hasn't registerExistingInstances function in options", function () {
        class MyClass {
            @IsNotEmpty()
            title: string;
        }

        const model = new MyClass();

        try {
            useContainer({ get: () => { null; } });
        } catch (err) {
            err.message.should.be.equal("class-validator is unable to register existing components on userContainer. Please provide a \'registerExistingInstances\' function in options.");
        }
    });

    it("should invoke registerExistingInstances function with instances", function () {
        const instances: { type: Function, object: any }[] = [];

        const container = {
            get<T>(someClass: { new(...args: any[]): T }): T {
                let instance = instances.find(instance => instance.type === someClass);
                if (!instance) {
                    instance = { type: someClass, object: new someClass() };
                    instances.push(instance);
                }

                return instance.object;
            }
        };

        const options = {
            registerExistingInstances: (newInstances: any[]) => {
                newInstances.forEach(instance => instances.push(instance));
            }
        };

        useContainer(container, options);

        class MyClass {
            @IsNotEmpty()
            title: string;
        }

        const model = new MyClass();

        instances.length.should.not.be.equal(0);
    });
});