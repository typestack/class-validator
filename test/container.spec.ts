import { getFromContainer, useContainer } from '../src/container';

describe('container', () => {
  afterEach(() => {
    useContainer(
      {
        get() {
          return undefined;
        },
      },
      { fallback: true }
    );
  });

  it('should reuse the same default instance when fallback is enabled', () => {
    class Service {}

    useContainer(
      {
        get() {
          return undefined;
        },
      },
      { fallback: true }
    );

    const first = getFromContainer(Service);
    const second = getFromContainer(Service);

    expect(first).toBeInstanceOf(Service);
    expect(first).toBe(second);
  });

  it('should fall back to the default container when fallbackOnErrors is enabled', () => {
    class ErrorService {}

    useContainer(
      {
        get() {
          throw new Error('container failure');
        },
      },
      { fallbackOnErrors: true }
    );

    const first = getFromContainer(ErrorService);
    const second = getFromContainer(ErrorService);

    expect(first).toBeInstanceOf(ErrorService);
    expect(first).toBe(second);
  });

  it('should return the user container instance when one is provided', () => {
    class ExternalService {}
    const provided = { fromUserContainer: true };

    useContainer({
      get() {
        return provided;
      },
    });

    expect(getFromContainer(ExternalService)).toBe(provided);
  });
});
