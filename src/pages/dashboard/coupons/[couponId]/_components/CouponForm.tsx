import { useEffect, useState } from "react";
import PageContainer from "@/components/dashbaord/PageContainer";
import { Heading } from "@/components/dashbaord/Heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { mockCoupons } from "../../_components/mockData";
import { navigate } from "astro:transitions/client";
import { toast } from "sonner";

export default function CouponForm({ couponId, isNew }: { couponId: string; isNew: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const [couponData, setCouponData] = useState({
    code: "",
    description: "",
    discount: "",
    type: "percentage",
    minPurchase: "",
    maxUses: "",
    category: "",
    status: "active",
    expiryDate: "",
    isLimitedToCategory: false,
  });

  useEffect(() => {
    if (!isNew) {
      // In a real app, you would fetch the coupon data from your API
      const coupon = mockCoupons.find((c) => c.id === couponId);
      if (coupon) {
        setCouponData({
          code: coupon.code,
          description: coupon.description,
          discount: coupon.discount.toString(),
          type: coupon.type,
          minPurchase: coupon.minPurchase?.toString() || "",
          maxUses: coupon.maxUses?.toString() || "",
          category: coupon.category || "",
          status: coupon.status,
          expiryDate: new Date(coupon.expiryDate).toISOString().split("T")[0],
          isLimitedToCategory: !!coupon.category,
        });
      }
    }
  }, [couponId, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form
      if (!couponData.code) {
        throw new Error("Coupon code is required");
      }
      if (!couponData.discount) {
        throw new Error("Discount amount is required");
      }
      if (!couponData.expiryDate) {
        throw new Error("Expiry date is required");
      }

      // In a real app, you would call your API here
      // For demo purposes, we'll simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(
        isNew ? "Coupon created successfully" : "Coupon updated successfully"
      );
      navigate("/dashboard/coupons", { history: "push" });
    } catch (error) {
      toast.error(error.message || "Failed to save coupon");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCouponData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setCouponData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setCouponData((prev) => ({ ...prev, [name]: checked }));
    
    // Reset category if not limited to category
    if (name === "isLimitedToCategory" && !checked) {
      setCouponData((prev) => ({ ...prev, category: "" }));
    }
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Heading
            title={isNew ? "Create New Coupon" : "Edit Coupon"}
            description={
              isNew
                ? "Create a new discount coupon for your customers"
                : "Update the existing coupon details"
            }
          />
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="code">Coupon Code</Label>
                  <Input
                    id="code"
                    name="code"
                    value={couponData.code}
                    onChange={handleChange}
                    placeholder="e.g., SUMMER25"
                    className="uppercase"
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Customers will enter this code at checkout
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={couponData.status}
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Discount Type</Label>
                  <Select
                    value={couponData.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="shipping">Free Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount">
                    {couponData.type === "percentage"
                      ? "Discount Percentage"
                      : couponData.type === "fixed"
                      ? "Discount Amount (₹)"
                      : "Shipping Discount"}
                  </Label>
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    value={couponData.discount}
                    onChange={handleChange}
                    placeholder={
                      couponData.type === "percentage"
                        ? "e.g., 25"
                        : couponData.type === "fixed"
                        ? "e.g., 500"
                        : "0"
                    }
                    min="0"
                    max={couponData.type === "percentage" ? "100" : undefined}
                    required={couponData.type !== "shipping"}
                    disabled={couponData.type === "shipping"}
                  />
                  {couponData.type === "shipping" && (
                    <p className="text-sm text-gray-500">
                      Free shipping coupon doesn't require a discount value
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minPurchase">Minimum Purchase Amount (₹)</Label>
                  <Input
                    id="minPurchase"
                    name="minPurchase"
                    type="number"
                    value={couponData.minPurchase}
                    onChange={handleChange}
                    placeholder="e.g., 1000 (optional)"
                    min="0"
                  />
                  <p className="text-sm text-gray-500">
                    Leave empty for no minimum purchase requirement
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxUses">Maximum Uses</Label>
                  <Input
                    id="maxUses"
                    name="maxUses"
                    type="number"
                    value={couponData.maxUses}
                    onChange={handleChange}
                    placeholder="e.g., 1000 (optional)"
                    min="1"
                  />
                  <p className="text-sm text-gray-500">
                    Leave empty for unlimited uses
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    type="date"
                    value={couponData.expiryDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isLimitedToCategory">
                      Limit to Specific Category
                    </Label>
                    <Switch
                      id="isLimitedToCategory"
                      checked={couponData.isLimitedToCategory}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("isLimitedToCategory", checked)
                      }
                    />
                  </div>
                  {couponData.isLimitedToCategory && (
                    <Select
                      value={couponData.category}
                      onValueChange={(value) =>
                        handleSelectChange("category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Summer Collection">
                          Summer Collection
                        </SelectItem>
                        <SelectItem value="Winter Collection">
                          Winter Collection
                        </SelectItem>
                        <SelectItem value="Kids">Kids</SelectItem>
                        <SelectItem value="Beauty">Beauty</SelectItem>
                        <SelectItem value="Flash Sale">Flash Sale</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={couponData.description}
                  onChange={handleChange}
                  placeholder="Describe what this coupon offers"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard/coupons", { history: "push" })}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? isNew
                      ? "Creating..."
                      : "Updating..."
                    : isNew
                    ? "Create Coupon"
                    : "Update Coupon"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}