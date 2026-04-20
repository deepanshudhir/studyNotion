import React, { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa"
// Swiper
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"

// Icons (optional if needed later)
import { Autoplay, FreeMode, Pagination } from "swiper/modules"

// API
import { apiConnector } from "../../services/apiConnector"
import { ratingsEndpoints } from "../../services/apis"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const truncateWords = 15

  const StarRating = ({ rating = 0 }) => {
    const stars = []
  
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} color="#FFD700" />)
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} color="#FFD700" />)
      } else {
        stars.push(<FaRegStar key={i} color="#FFD700" />)
      }
    }
  
    return <div className="flex gap-1">{stars}</div>
  }
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        )

        if (data?.success) {
          setReviews(data?.data || [])
        }
      } catch (error) {
        console.error("Error fetching reviews:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  if (loading) {
    return (
      <div className="text-white text-center py-10">
        Loading reviews...
      </div>
    )
  }

  return (
    <div className="text-white w-full">
      <div className="my-10 max-w-[1200px] mx-auto px-4">
        <Swiper
          spaceBetween={20}
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          modules={[FreeMode, Pagination, Autoplay]}
          className="w-full"
        >
          {reviews.length === 0 ? (
            <div className="text-center w-full py-10">
              No reviews available
            </div>
          ) : (
            reviews.map((review, i) => (
              <SwiperSlide key={i}>
                <div className="flex flex-col justify-between h-full min-h-[220px] gap-4 bg-richblack-800 p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                  
                  {/* USER INFO */}
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        review?.user?.image ||
                        `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName}-${review?.user?.lastName}`
                      }
                      alt="user"
                      className="h-10 w-10 rounded-full object-cover border border-richblack-600"
                    />

                    <div>
                      <h3 className="text-sm font-semibold text-richblack-5">
                        {`${review?.user?.firstName || "User"} ${
                          review?.user?.lastName || ""
                        }`}
                      </h3>
                      <p className="text-xs text-richblack-400">
                        {review?.course?.courseName || "Course"}
                      </p>
                    </div>
                  </div>

                  {/* REVIEW TEXT */}
                  <p className="text-sm text-richblack-200 leading-relaxed">
                    {review?.review?.split(" ").length > truncateWords
                      ? review?.review
                          .split(" ")
                          .slice(0, truncateWords)
                          .join(" ") + " ..."
                      : review?.review || "No review provided"}
                  </p>

                  {/* RATING */}
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-100 font-semibold text-sm">
                      {review?.rating?.toFixed(1) || "0.0"}
                    </span>

                    <StarRating rating={review?.rating} />
                  </div>
                </div>
              </SwiperSlide>
            ))
          )}
        </Swiper>
      </div>
    </div>
  )
}

export default ReviewSlider