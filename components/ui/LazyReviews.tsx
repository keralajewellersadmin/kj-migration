import Reviews from "@/components/sections/Reviews";

type Review = {
  text: string;
  author: string;
  location: string;
};

export default function LazyReviews({
  reviews,
  title,
  subtitle,
}: {
  reviews?: Review[];
  title?: string;
  subtitle?: string;
}) {
  return <Reviews reviews={reviews} title={title} subtitle={subtitle} />;
}
