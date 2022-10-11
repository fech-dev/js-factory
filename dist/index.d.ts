declare type FactoryDefinitionFn<T> = () => Partial<T>;
declare type FactoryCreateOptions = {
    forceArray?: boolean;
};
declare class Factory<T> {
    private _stateNames;
    private _builder;
    constructor(builder: FactoryBuilder<T>);
    state(name: string): this;
    create(quantity?: number, override?: FactoryDefinitionFn<T> | null, options?: FactoryCreateOptions): T | T[];
}
declare class FactoryBuilder<T> {
    private _definitions;
    constructor(definition: FactoryDefinitionFn<T>);
    defineState(name: string, definition: FactoryDefinitionFn<T>): this;
    getDefinition(name: string): FactoryDefinitionFn<T> | undefined;
    hasDefinition(name: string): boolean;
    get(): Factory<T>;
}
export declare function defineFactory<T>(definition: FactoryDefinitionFn<T>): FactoryBuilder<T>;
export {};
