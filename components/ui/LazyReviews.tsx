import Reviews from "@/components/sections/Reviews";

type Review = {
  text: string;
  author: string;
  location: string;
};

export default function LazyReviews({ reviews }: { reviews?: Review[] }) {
  return <Reviews reviews={reviews} />;
}
