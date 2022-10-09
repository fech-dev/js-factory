type FactoryDefinitionFn<T> = () => Partial<T>;
type FactoryCreateOptions = {
  forceArray?: boolean;
};

export function defineFactory<T = Record<string, unknown>>(
  factoryDefinition: FactoryDefinitionFn<T>
) {
  const definitions = new Map<string, FactoryDefinitionFn<T>>();

  definitions.set("_default", factoryDefinition);

  const factory = {
    defineState(name: string, definition: FactoryDefinitionFn<T>) {
      definitions.set(name, definition);
      return this;
    },

    get() {
      const stateNames = new Set<string>(["_default"]);

      const resolveObj = () =>
        Array.from(stateNames).reduce((obj: T, stateName: string) => {
          const definitionFn = definitions.get(
            stateName
          ) as FactoryDefinitionFn<T>;

          return { ...obj, ...definitionFn() };
        }, {} as T);

      const factoryBuilder = {
        state(name: string) {
          if (!definitions.has(name)) {
            throw new Error(`State with name "${name}" is not defined`);
          }

          stateNames.add(name);
          return this;
        },

        create(
          quantity = 1,
          override?: FactoryDefinitionFn<T> | null,
          options: FactoryCreateOptions = {}
        ) {
          const { forceArray = false } = options;

          if (override) {
            factory.defineState("_override", override);
            this.state("_override");
          }

          const data: T[] = [];

          Array.from({ length: quantity }).forEach(() =>
            data.push(resolveObj())
          );

          return quantity === 1 && !forceArray ? data[0] : data;
        },
      };
      return factoryBuilder;
    },
  };

  return factory;
}
