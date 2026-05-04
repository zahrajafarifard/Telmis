import FactoreDetails from "@/components/shop/user/orders/details/factor-details";
interface PageProps {
  params: {
    id: number;
  };
}

const OrderPage = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <div>
      <FactoreDetails factorId={id} />
    </div>
  );
};

export default OrderPage;
