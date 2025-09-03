import { getBrands } from "@/lib/api/brands";
import BrandClientPage from "./BrandPage";

export default async function BrandPage() {
  const initialBrands = await getBrands();
  return <BrandClientPage initialBrands={initialBrands} />;
}