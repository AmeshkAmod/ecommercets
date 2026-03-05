import { useState, type ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { submitReview } from "../store/slice/productSlice";
import type { Product } from "../types/product";
import type { RootState, AppDispatch } from "../store/store";

interface ProductReviewsProps {
  product: Product;
}

export default function ProductReviews({ product }: ProductReviewsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { token } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!token;

  const { status } = useSelector((state: RootState) => state.product);
  const { user } = useSelector((state: RootState) => state.auth);

  const alreadyReviewed = product.reviews?.some(
    (r) => r.user === user?._id
  );

  const [rating, setRating] = useState<number | "">("");
  const [comment, setComment] = useState<string>("");

  const submitHandler = async (): Promise<void> => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!rating || !comment.trim()) return;

    await dispatch(
      submitReview({
        productId: product._id,
        rating: Number(rating),
        comment,
      })
    );

    setRating("");
    setComment("");
  };

  const ratingCounts = [5,4,3,2,1].map((star) => {
    const count =
      product.reviews?.filter((r) => r.rating === star).length || 0;

      const percent =
        product.reviews && product.reviews.length
          ? (count / product.reviews.length) * 100
          : 0;

    return { star, count, percent };
  })

  return (
    <motion.section
      className="mt-10 bg-[#020617] border border-gray-800 rounded-xl p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="font-semibold mb-4">Customer Reviews</h2>

      {product.reviews?.length === 0 && (
        <p className="text-gray-400 text-sm">No reviews yet.</p>
      )}

      {product.reviews?.map((review) => (
        <div key={review._id} className="border-t border-gray-800 pt-3 mt-3">
          <div className="flex justify-between text-sm">
            <span className="font-semibold">{review.name}</span>
            <span className="text-gray-500">
              {review.createdAt
                ? new Date(review.createdAt).toLocaleDateString()
                : ""}
            </span>
          </div>

          <div className="text-yellow-400 text-sm">
            {"★".repeat(review.rating) + "★".repeat(5 - review.rating)}
          </div>

          <p className="text-gray-400 text-sm mt-1">{review.comment}</p>
        </div>
      ))}

      {/* Review Form */}
      {alreadyReviewed ? (
        <p className="mt-4 text-yellow-400 text-sm">
          You already reviewed this product.
        </p>
      ) : (
      <div className="mt-6">
        <h3 className="text-sm font-semibold mb-2">Write a review</h3>

        <div className="flex gap-1 mb-3">
          {[1,2,3,4,5].map((star) => (
            <span
              key={star}
              onMouseEnter={() => setRating(star)}
              className={`cursor-pointer text-2xl transition ${
                rating && star <= rating
                ? "text-yellow-400"
                : "text-gray-600"
              }`}
            >
              ★
            </span>
          ))}
        </div>


        <textarea
          value={comment}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setComment(e.target.value)
          }
          placeholder="Share your experience…"
          className="w-full bg-[#020617] border border-gray-700 rounded p-2 text-sm"
        />

        <motion.button
          disabled={status === "loading"}
          onClick={submitHandler}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="mt-2 bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-semibold disabled:opacity-50"
        >
          {status === "loading" ? "Submitting..." : "Submit Review"}
        </motion.button>
      </div>
      )}
    </motion.section>
  );
}