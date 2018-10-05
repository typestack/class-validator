
type DefaultContainer = {
    get<T>(someClass: { new(...args: any[]): T } | Function): T;
    getInstances(): Entry[];
    isEmpty(): boolean;
};

type Entry = { type: Function, object: any };

/**
 * Container options.
 */
export interface UseContainerOptions {

    /**
     * If set to true, then default container will be used in the case if given container haven't returned anything.
     */
    fallback?: boolean;

    /**
     * If set to true, then default container will be used in the case if given container thrown an exception.
     */
    fallbackOnErrors?: boolean;

    /**
     * If the default container has registered instances this function allow to class-validator to expose the current state.
     * @param instances 
     */
    registerExistingInstances(instances: Entry[]): void;
}

/**
 * Container to be used by this library for inversion control. If container was not implicitly set then by default
 * container simply creates a new instance of the given class.
 */
const defaultContainer: DefaultContainer = new (class {
    private instances: Entry[] = [];
    get<T>(someClass: { new(...args: any[]): T }): T {
        let instance = this.instances.find(instance => instance.type === someClass);
        if (!instance) {
            instance = { type: someClass, object: new someClass() };
            this.instances.push(instance);
        }

        return instance.object;
    }

    getInstances(): Entry[] {
        return this.instances;
    }

    isEmpty(): boolean {
        return this.instances.length === 0;
    }
})();

let userContainer: { get<T>(someClass: { new(...args: any[]): T } | Function): T };
let userContainerOptions: UseContainerOptions;

/**
 * Sets container to be used by this library.
 */
export function useContainer(iocContainer: { get(someClass: any): any }, options?: UseContainerOptions) {
    userContainer = iocContainer;
    userContainerOptions = options;

    if (userContainer && !defaultContainer.isEmpty()) {
        if (options && typeof (options.registerExistingInstances) === "function") {
            options.registerExistingInstances(defaultContainer.getInstances());
        } else {
            throw new Error("class-validator is unable to register existing components on userContainer. Please provide a 'registerExistingInstances' function in options.");
        }
    }
}

/**
 * Gets the IOC container used by this library.
 */
export function getFromContainer<T>(someClass: { new(...args: any[]): T } | Function): T {
    if (userContainer) {
        try {
            const instance = userContainer.get(someClass);
            if (instance)
                return instance;

            if (!userContainerOptions || !userContainerOptions.fallback)
                return instance;

        } catch (error) {
            if (!userContainerOptions || !userContainerOptions.fallbackOnErrors)
                throw error;
        }
    }
    return defaultContainer.get<T>(someClass);
}
