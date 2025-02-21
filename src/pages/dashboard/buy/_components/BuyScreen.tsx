// components/BuyScreen.tsx
import { Heading } from "@/components/dashbaord/Heading";
import PageContainer from "@/components/dashbaord/PageContainer";
import ProductCard from "./ProductCard";
import CartSheet from "./CartSheet";

const BuyScreen = ({ productsAll }) => {
  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <Heading
            title="Buy Products"
            description="you can place order to the company"
          />
        </div>
        <CartSheet />
      </div>
      <div className="grid mt-8 lg:gap-6 gap-4 md:grid-cols-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {productsAll.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </PageContainer>
  );
};

export default BuyScreen;