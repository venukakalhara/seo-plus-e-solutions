import { NextResponse, type NextRequest } from 'next/server';
export function proxy(request:NextRequest){
 const path=request.nextUrl.pathname;const sinhala=path==='/si'||path.startsWith('/si/');
 const headers=new Headers(request.headers);headers.set('x-site-language',sinhala?'si':'en');
 if(sinhala){const url=request.nextUrl.clone();url.pathname=path.slice(3)||'/';return NextResponse.rewrite(url,{request:{headers}});}
 return NextResponse.next({request:{headers}});
}
export const config={matcher:['/((?!api|_next|.*\\..*).*)']};
