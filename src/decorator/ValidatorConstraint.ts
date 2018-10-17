import {ConstraintMetadata} from "../metadata/ConstraintMetadata";
import {getFromContainer} from "../container";
import {MetadataStorage} from "../metadata/MetadataStorage";

/**
 * Registers custom validator class.
 */
export function ValidatorConstraint(options?: { name?: string, async?: boolean }) {
    return function (target: Function) {
        const isAsync = options && options.async ? true : false;
        let name = options && options.name ? options.name : "";
        if (!name) {
            name = (target as any).name;
            if (!name) // generate name if it was not given
                name = name.replace(/\.?([A-Z]+)/g, (x, y) => "_" + y.toLowerCase()).replace(/^_/, "");
        }
        const metadata = new ConstraintMetadata(target, name, isAsync);
        getFromContainer(MetadataStorage).addConstraintMetadata(metadata);
    };
}
