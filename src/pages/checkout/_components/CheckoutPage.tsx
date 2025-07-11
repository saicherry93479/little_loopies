import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '@/lib/store/cart';
import { useAuthStore } from '@/lib/store/auth';
import { AuthGuard } from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().min(10, 'Mobile number must be at least 10 digits'),
  address: z.object({
    street: z.string().min(5, 'Street address must be at least 5 characters'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  }),
  paymentMethod: z.enum(['cod', 'online']),
});

type FormValues = z.infer<typeof formSchema>;

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      mobile: '',
      address: {
        street: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
      },
      paymentMethod: 'cod',
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    setIsProcessing(true);
    
    try {
      // In a real app, you would send this data to your backend
      console.log('Order data:', {
        customer: {
          name: values.name,
          email: values.email,
          mobile: values.mobile,
        },
        shippingAddress: values.address,
        paymentMethod: values.paymentMethod,
        items,
        totalAmount: getTotalPrice(),
      });
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to success page
      window.location.href = '/checkout/success';
    } catch (error) {
      console.error('Checkout error:', error);
      setIsProcessing(false);
    }
  };
  
  if (items.length === 0) {
    return (
      <AuthGuard>
        <div className="max-w-[1200px] mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>
          <div className="bg-gray-50 rounded-lg p-8">
            <p className="text-xl mb-6">Your cart is empty</p>
            <Button asChild>
              <a href="/products">Continue Shopping</a>
            </Button>
          </div>
        </div>
      </AuthGuard>
    );
  }
  
  return (
    <AuthGuard>
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="mobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="address.street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="address.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="address.state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="AP">Andhra Pradesh</SelectItem>
                                  <SelectItem value="KA">Karnataka</SelectItem>
                                  <SelectItem value="KL">Kerala</SelectItem>
                                  <SelectItem value="TN">Tamil Nadu</SelectItem>
                                  <SelectItem value="TG">Telangana</SelectItem>
                                  <SelectItem value="MH">Maharashtra</SelectItem>
                                  <SelectItem value="DL">Delhi</SelectItem>
                                  <SelectItem value="GJ">Gujarat</SelectItem>
                                  <SelectItem value="UP">Uttar Pradesh</SelectItem>
                                  <SelectItem value="WB">West Bengal</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="address.pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pincode</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="address.phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-3"
                          >
                            <div className="flex items-center space-x-2 border p-4 rounded-md">
                              <RadioGroupItem value="cod" id="cod" />
                              <label htmlFor="cod" className="font-medium cursor-pointer flex-1">
                                Cash on Delivery
                              </label>
                            </div>
                            <div className="flex items-center space-x-2 border p-4 rounded-md">
                              <RadioGroupItem value="online" id="online" />
                              <label htmlFor="online" className="font-medium cursor-pointer flex-1">
                                Online Payment (Coming Soon)
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="lg:hidden">
                  <Button 
                    type="submit" 
                    className="w-full py-6 text-lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          
          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg h-fit lg:sticky lg:top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 py-2 border-b">
                  <div className="w-16 h-16 flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    {item.variant && <p className="text-sm text-gray-500">{item.variant}</p>}
                    <div className="flex justify-between mt-1">
                      <p className="text-sm">Qty: {item.quantity}</p>
                      <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18%)</span>
                <span>₹{(getTotalPrice() * 0.18).toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{(getTotalPrice() * 1.18).toFixed(2)}</span>
              </div>
            </div>
            
            <div className="hidden lg:block mt-6">
              <Button 
                onClick={form.handleSubmit(onSubmit)}
                className="w-full py-6 text-lg"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}