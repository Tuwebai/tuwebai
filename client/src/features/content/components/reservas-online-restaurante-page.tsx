import ClusterContentPage from '@/features/content/components/cluster-content-page';
import { reservasOnlineRestauranteConfig } from '@/features/content/gastronomy-cluster-pages';

export default function ReservasOnlineRestaurantePage() {
  return <ClusterContentPage config={reservasOnlineRestauranteConfig} />;
}
