import { AdminDashboard, AdminLogin } from '@/components/admin';
import { authenticated, adminConfigured } from '@/lib/admin-auth';
import { dashboard } from '@/lib/database';
export const metadata={title:'Admin',robots:{index:false,follow:false}};
export const dynamic='force-dynamic';
export const runtime='nodejs';
export default async function Page() {
 return await authenticated()?<AdminDashboard initial={dashboard()}/>:<AdminLogin configured={adminConfigured()}/>;
}
