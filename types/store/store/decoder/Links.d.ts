export function decode(input: unknown, options?: LinkOptions | undefined): API.Result<Array<Link>, API.Failure>;
export function match(options: LinkOptions): API.Decoder<unknown, Array<Link | null>, API.Failure>;
export function optional(options?: LinkOptions | undefined): API.Decoder<unknown, Array<Link> | undefined, API.Failure>;
export type Code = number;
export type Alg = number;
export type Version = 1 | 0;
export type LinkOptions = {
    code?: Code;
    algorithm?: Alg;
    version?: Version;
};
export type Link = API.Link<unknown, Code, Alg, Version>;
import { create } from "@ucanto/core/link";
import { createV0 } from "@ucanto/core/link";
import { isLink } from "@ucanto/core/link";
import { asLink } from "@ucanto/core/link";
import { parse } from "@ucanto/core/link";
import * as API from "@ucanto/interface";
import { Failure } from "@ucanto/validator";
export { create, createV0, isLink, asLink, parse };
//# sourceMappingURL=Links.d.ts.map