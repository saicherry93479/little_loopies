import { AuthGuard } from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';

export default function OrdersPage() {
  return (
    <AuthGuard>
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        
        <div className="text-center py-16">
          <p className="text-xl mb-4">You haven't placed any orders yet.</p>
          <p className="text-gray-500 mb-8">When you place an order, it will appear here.</p>
          <Button asChild>
            <a href="/products">Start Shopping</a>
          </Button>
        </div>
      </div>
    </AuthGuard>
  );
}