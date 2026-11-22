import { NextResponse } from 'next/server';
import { StorageUnavailableError } from './storage-error';
export function storageResponse(error:unknown) {
 return error instanceof StorageUnavailableError ? NextResponse.json({error:error.message},{status:503,headers:{'Cache-Control':'no-store','Retry-After':'300'}}) : null;
}
