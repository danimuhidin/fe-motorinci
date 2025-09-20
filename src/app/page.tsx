import { getHomePageData } from "@/lib/api/motor";
import { HomePageClient } from "@/components/home/HomePageClient";

export default async function HomePage() {
  const data = await getHomePageData();
  return (
    <HomePageClient
      randomMotors={data.randomMotors}
      categories={data.categories}
      brands={data.brands}
    />
  );
}