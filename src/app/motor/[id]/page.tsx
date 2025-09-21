import { MotorDetailView } from "@/components/motor/MotorDetailView";

export default function MotorDetailPage() {
  const isAdmin = process.env.NEXT_ADMINISTRATOR_OR_NOT === 'true';
  return <MotorDetailView isAdmin={isAdmin} />;
}