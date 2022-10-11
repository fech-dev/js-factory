type FactoryDefinitionFn<T> = () => Partial<T>;
type FactoryCreateOptions = {
  forceArray?: boolean;
};

class Factory<T> {
  private _stateNames;
  private _builder;

  constructor(builder: FactoryBuilder<T>) {
    this._builder = builder;
    this._stateNames = new Set<string>(["_default"]);
  }

  state(name: string) {
    if (!this._builder.hasDefinition(name)) {
      throw new Error(`State with name "${name}" is not defined`);
    }

    this._stateNames.add(name);
    return this;
  }

  create(
    quantity = 1,
    override?: FactoryDefinitionFn<T> | null,
    options: FactoryCreateOptions = {}
  ) {
    const { forceArray = false } = options;
    if (override) {
      this._builder.defineState("_override", override);
      this.state("_override");
    }

    const data = Array.from({ length: quantity }).map(() => {
      return Array.from(this._stateNames).reduce(
        (obj: T, stateName: string) => {
          const definitionFn = this._builder.getDefinition(stateName);

          if (!definitionFn) {
            return obj;
          }

          return { ...obj, ...definitionFn() };
        },
        {} as T
      );
    });

    return quantity === 1 && !forceArray ? data[0] : data;
  }
}

class FactoryBuilder<T> {
  private _definitions;

  constructor(definition: FactoryDefinitionFn<T>) {
    this._definitions = new Map<string, FactoryDefinitionFn<T>>();
    this._definitions.set(
      "_default",
      definition instanceof Function ? definition : () => definition
    );
  }

  defineState(name: string, definition: FactoryDefinitionFn<T>) {
    this._definitions.set(name, definition);
    return this;
  }

  getDefinition(name: string) {
    return this._definitions.get(name);
  }

  hasDefinition(name: string) {
    return this._definitions.has(name);
  }

  get() {
    return new Factory<T>(this);
  }
}

export function defineFactory<T>(definition: FactoryDefinitionFn<T>) {
  return new FactoryBuilder<T>(definition);
}
