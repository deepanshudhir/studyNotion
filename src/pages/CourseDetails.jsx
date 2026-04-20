import React, { useEffect, useState } from "react"
import { BiInfoCircle } from "react-icons/bi"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import ReactMarkdown from "react-markdown"

import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import ConfirmationModal from "../components/Common/ConfirmationModal"
import Footer from "../components/Common/Footer"
import RatingStars from "../components/Common/RatingStars"
import CourseAccordionBar from "../components/core/Course/CourseAccordionBar"
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard"

import { formatDate } from "../services/formatDate"
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI"
import { BuyCourse } from "../services/operations/studentFeaturesAPI"
import GetAvgRating from "../utils/avgRating"

import Error from "./Error"

function CourseDetails() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.profile)
  const { paymentLoading } = useSelector((state) => state.course)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { courseId } = useParams()

  const [response, setResponse] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const [avgReviewCount, setAvgReviewCount] = useState(0)
  const [isActive, setIsActive] = useState([])
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0)

  // Fetch
  useEffect(() => {
    const getCourseDetails = async () => {
      try {
        const res = await fetchCourseDetails(courseId)
        setResponse(res)
      } catch (error) {
        console.log(error)
      }
    }
    getCourseDetails()
  }, [courseId])

  // Avg Rating
  useEffect(() => {
    const count = GetAvgRating(
      response?.data?.courseDetails?.ratingAndReviews || []
    )
    setAvgReviewCount(count)
  }, [response])

  // Lectures
  useEffect(() => {
    let lectures = 0
    response?.data?.courseDetails?.courseContent?.forEach((sec) => {
      lectures += sec?.subSection?.length || 0
    })
    setTotalNoOfLectures(lectures)
  }, [response])

  const handleActive = (id) => {
    setIsActive((prev) =>
      prev.includes(id)
        ? prev.filter((e) => e !== id)
        : [...prev, id]
    )
  }

  const handleBuyCourse = () => {
    if (token) {
      BuyCourse(token, [courseId], user, navigate, dispatch)
    } else {
      setConfirmationModal({
        text1: "You are not logged in!",
        text2: "Please login to Purchase Course.",
        btn1Text: "Login",
        btn2Text: "Cancel",
        btn1Handler: () => navigate("/login"),
        btn2Handler: () => setConfirmationModal(null),
      })
    }
  }

  // Loading
  if (loading || !response) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-richblack-900">
        <div className="h-12 w-12 border-4 border-yellow-50 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!response.success) return <Error />

  const {
    courseName,
    courseDescription,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentsEnrolled,
    createdAt,
  } = response.data.courseDetails

  if (paymentLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-richblack-900">
        <div className="h-12 w-12 border-4 border-yellow-50 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="bg-richblack-900 text-white min-h-screen">

      {/* 🔥 HERO */}
      <div className="bg-gradient-to-r from-richblack-900 via-richblack-800 to-richblack-900 border-b border-richblack-700">
        <div className="mx-auto max-w-6xl px-6 py-16 grid lg:grid-cols-2 gap-10">

          <div>
            <h1 className="text-4xl font-bold">{courseName}</h1>

            <p className="text-richblack-300 mt-3">
              {courseDescription}
            </p>

            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <span className="text-yellow-50 font-semibold">
                {avgReviewCount}
              </span>

              <RatingStars Review_Count={avgReviewCount} Star_Size={20} />

              <span className="text-richblack-300 text-sm">
                ({ratingAndReviews?.length || 0} reviews)
              </span>

              <span className="text-richblack-300 text-sm">
                {studentsEnrolled?.length || 0} students
              </span>
            </div>

            <p className="mt-4 text-richblack-300">
              Created by{" "}
              <span className="text-yellow-50 font-medium">
                {instructor.firstName} {instructor.lastName}
              </span>
            </p>

            <div className="flex gap-6 mt-3 text-sm text-richblack-300">
              <p className="flex items-center gap-2">
                <BiInfoCircle /> {formatDate(createdAt)}
              </p>

              <p className="flex items-center gap-2">
                <HiOutlineGlobeAlt /> English
              </p>
            </div>

            {/* Mobile Buy */}
            <div className="lg:hidden mt-6">
              <p className="text-3xl font-bold text-yellow-50">₹ {price}</p>

              <button
                className="mt-4 w-full bg-yellow-50 text-black py-3 rounded-lg font-semibold hover:scale-105 transition"
                onClick={handleBuyCourse}
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Desktop Card */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <CourseDetailsCard
                course={response.data.courseDetails}
                setConfirmationModal={setConfirmationModal}
                handleBuyCourse={handleBuyCourse}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 MAIN CONTENT */}
      <div className="mx-auto max-w-6xl px-6 py-12">

        {/* WHAT YOU LEARN */}
        <div className="bg-richblack-800 border border-richblack-700 p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4">
            What you'll learn
          </h2>

          <div className="prose prose-invert max-w-none text-richblack-200">
            <ReactMarkdown>{whatYouWillLearn}</ReactMarkdown>
          </div>
        </div>

        {/* CONTENT */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-3">
            Course Content
          </h2>

          <div className="flex justify-between text-sm text-richblack-300 mb-4">
            <div>
              {courseContent.length} sections • {totalNoOfLectures} lectures
            </div>

            <button
              className="text-yellow-50 hover:underline"
              onClick={() => setIsActive([])}
            >
              Collapse all
            </button>
          </div>

          <div className="space-y-3">
            {courseContent.map((course, index) => (
              <div className="bg-richblack-800 rounded-lg border border-richblack-700">
                <CourseAccordionBar
                  key={index}
                  course={course}
                  isActive={isActive}
                  handleActive={handleActive}
                />
              </div>
            ))}
          </div>
        </div>

        {/* AUTHOR */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Instructor</h2>

          <div className="flex items-center gap-4">
            <img
              src={
                instructor.image ||
                `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName}`
              }
              className="w-16 h-16 rounded-full border border-richblack-600"
              alt="author"
            />

            <div>
              <p className="text-lg font-semibold">
                {instructor.firstName} {instructor.lastName}
              </p>
            </div>
          </div>

          <p className="mt-4 text-richblack-300 max-w-3xl">
            {instructor?.additionalDetails?.about}
          </p>
        </div>
      </div>

      <Footer />

      {confirmationModal && (
        <ConfirmationModal modalData={confirmationModal} />
      )}
    </div>
  )
}

export default CourseDetails