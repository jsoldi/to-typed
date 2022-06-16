type PrimitiveValue = string | number | bigint | boolean | symbol
type Nothing = undefined | null; // null and undefined should always be converted to `Maybe.nothing()` (unless you want null or undefined) so they trigger the default.
type Primitive = PrimitiveValue | Nothing
type Anything = Primitive | Object // Object = everything except primitives
