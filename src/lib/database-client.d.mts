export type SqlValue=string|number|bigint|null;
export type Statement=string|{sql:string;args?:SqlValue[]};
export type Row=Record<string,SqlValue>;
export class StorageUnavailableError extends Error {}
export function isServerlessStorage(env?:NodeJS.ProcessEnv,cwd?:string):boolean;
export function getDatabase():Promise<{
 execute(statement:Statement):Promise<{rows:Row[]}>;
 batch(statements:Statement[]):Promise<{rows:Row[]}[]>;
 close():void;
}>;
