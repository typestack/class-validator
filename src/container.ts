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
}

/**
 * Container to be used by this library for inversion control. If container was not implicitly set then by default
 * container simply creates a new instance of the given class.
 */
const defaultContainer: { get<T>(someClass: { new (...args: any[]): T } | Function): T } = new (class {
  private instances: { type: Function; object: any }[] = [];
  get<T>(someClass: { new (...args: any[]): T }): T {
    let instance = this.instances.find(instance => instance.type === someClass);
    if (!instance) {
      instance = { type: someClass, object: new someClass() };
      this.instances.push(instance);
    }

    return instance.object;
  }
})();

let userContainer: { get<T>(someClass: { new (...args: any[]): T } | Function): T };
let userContainerOptions: UseContainerOptions;

/**
 * Sets container to be used by this library.
 */
export function useContainer(iocContainer: { get(someClass: any): any }, options?: UseContainerOptions): void {
  userContainer = iocContainer;
  userContainerOptions = options;
}

/**
 * Gets the IOC container used by this library.
 */
export function getFromContainer<T>(someClass: { new (...args: any[]): T } | Function): T {
  if (userContainer) {
    try {
      const instance = userContainer.get(someClass);
      if (instance) return instance;

      if (!userContainerOptions || !userContainerOptions.fallback) return instance;
    } catch (error) {
      if (!userContainerOptions || !userContainerOptions.fallbackOnErrors) throw error;
    }
  }
  return defaultContainer.get<T>(someClass);
}
