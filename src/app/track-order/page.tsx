import { Header, Footer } from '@/components/chrome';
import { OrderTracking } from '@/components/order-request';
export const metadata={title:'Track your order',robots:{index:false,follow:false}};
export default function Page(){return <><Header/><main id="main" className="container article-page"><h1>Order status / ඇණවුම් තත්ත්වය</h1><OrderTracking/></main><Footer/></>;}
