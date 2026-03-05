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

  const { token, user } = useSelector((state: RootState) => state.auth);
  const { status } = useSelector((state: RootState) => state.product);

  const isAuthenticated = !!token;

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

  /* ---------- RATING BREAKDOWN ---------- */

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => {
    const count =
      product.reviews?.filter((r) => r.rating === star).length || 0;

    const percent =
      product.reviews && product.reviews.length
        ? (count / product.reviews.length) * 100
        : 0;

    return { star, count, percent };
  });

  const avgRating =
    product.reviews?.length
      ? (
          product.reviews.reduce((sum, r) => sum + r.rating, 0) /
          product.reviews.length
        ).toFixed(1)
      : "0";

  return (
    <motion.section
      className="mt-10 bg-[#020617] border border-gray-800 rounded-xl p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="font-semibold mb-6 text-lg">Customer Reviews</h2>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">

        {/* LEFT SIDE → RATING SUMMARY */}
        <div>

          <div className="text-xl font-semibold mb-3">
            {avgRating} ★
          </div>

          <div className="text-gray-400 text-sm mb-5">
            {product.reviews?.length || 0} reviews
          </div>

          {ratingCounts.map(({ star, count, percent }) => (
            <div key={star} className="flex items-center gap-2 text-sm mb-2">
              <span className="w-6">{star}★</span>

              <div className="bg-gray-800 h-2 rounded w-32">
                <div
                  className="bg-yellow-400 h-2 rounded"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <span className="text-gray-400 text-xs w-6">
                {count}
              </span>
            </div>
          ))}

        </div>

        {/* RIGHT SIDE → REVIEWS + FORM */}
        <div>

          {product.reviews?.length === 0 && (
            <p className="text-gray-400 text-sm mb-6">
              No reviews yet.
            </p>
          )}

          {/* REVIEWS */}
          {product.reviews?.map((review) => (
            <div
              key={`${review._id}-${review.createdAt}`}
              className="border-t border-gray-800 pt-4 mt-4"
            >
              <div className="flex justify-between text-sm">
                <span className="font-semibold">
                  {review.name}
                </span>

                <span className="text-gray-500">
                  {review.createdAt
                    ? new Date(review.createdAt).toLocaleDateString()
                    : ""}
                </span>
              </div>

              <div className="text-sm mt-1">
                <span className="text-yellow-400">
                  {"★".repeat(review.rating)}
                </span>
                <span className="text-gray-600">
                  {"★".repeat(5 - review.rating)}
                </span>
              </div>

              <p className="text-gray-400 text-sm mt-1">
                {review.comment}
              </p>
            </div>
          ))}

          {/* REVIEW FORM */}
          {alreadyReviewed ? (
            <p className="mt-6 text-yellow-400 text-sm">
              You already reviewed this product.
            </p>
          ) : (
            <div className="mt-8">
              <h3 className="text-sm font-semibold mb-2">
                Write a review
              </h3>

              {/* STAR SELECT */}
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
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

              {/* COMMENT */}
              <textarea
                value={comment}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setComment(e.target.value)
                }
                placeholder="Share your experience…"
                className="w-full bg-[#020617] border border-gray-700 rounded p-2 text-sm"
              />

              {/* SUBMIT */}
              <motion.button
                disabled={status === "loading"}
                onClick={submitHandler}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="mt-2 bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-semibold disabled:opacity-50"
              >
                {status === "loading"
                  ? "Submitting..."
                  : "Submit Review"}
              </motion.button>
            </div>
          )}

        </div>
      </div>
    </motion.section>
  );
}