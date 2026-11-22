import { StorageUnavailable } from '@/components/storage-unavailable';
import { StorageUnavailableError } from '@/lib/storage-error';
import { AdminDashboard, AdminLogin } from '@/components/admin';
import { authenticated, adminConfigured } from '@/lib/admin-auth';
import { dashboard } from '@/lib/database';
export const metadata={title:'Admin',robots:{index:false,follow:false}};
export const dynamic='force-dynamic';
export const runtime='nodejs';
export default async function Page() {
 let data; let configured=false;
 try {if(await authenticated())data=await dashboard();else configured=await adminConfigured();}
 catch(error) {if(error instanceof StorageUnavailableError)return <StorageUnavailable admin/>;throw error;}
 return data?<AdminDashboard initial={data}/>:<AdminLogin configured={configured}/>;
}
