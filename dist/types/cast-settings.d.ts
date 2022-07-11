export interface CastSettings {
    readonly keyGuarding: 'loose' | 'strict';
    readonly booleanNames: {
        readonly true: string[];
        readonly false: string[];
    };
    readonly unwrapArray: 'never' | 'single' | 'first' | 'last';
    readonly wrapArray: 'never' | 'single';
}
