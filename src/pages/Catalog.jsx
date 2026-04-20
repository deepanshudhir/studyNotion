import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"

import Footer from "../components/Common/Footer"
import Course_Card from "../components/core/Catalog/Course_Card"
import Course_Slider from "../components/core/Catalog/Course_Slider"

import { apiConnector } from "../services/apiConnector"
import { categories } from "../services/apis"
import { getCatalogPageData } from "../services/operations/pageAndComponentData"

import Error from "./Error"

function Catalog() {
  const { loading } = useSelector((state) => state.profile)
  const { catalogName } = useParams()

  const [active, setActive] = useState(1)
  const [catalogPageData, setCatalogPageData] = useState(null)
  const [categoryId, setCategoryId] = useState("")

  // Fetch Categories
  useEffect(() => {
    ;(async () => {
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)

        const category_id = res?.data?.data?.filter(
          (ct) =>
            ct.name.split(" ").join("-").toLowerCase() === catalogName
        )[0]?._id

        setCategoryId(category_id)
      } catch (error) {
        console.log("Could not fetch Categories.", error)
      }
    })()
  }, [catalogName])

  // Fetch Catalog Data
  useEffect(() => {
    if (categoryId) {
      ;(async () => {
        try {
          const res = await getCatalogPageData(categoryId)
          setCatalogPageData(res)
        } catch (error) {
          console.log(error)
        }
      })()
    }
  }, [categoryId])

  // Loading State
  if (loading || !catalogPageData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-richblack-900">
        <div className="h-12 w-12 border-4 border-yellow-50 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // Error State
  if (!loading && !catalogPageData.success) {
    return <Error />
  }

  return (
    <div className="bg-richblack-900 text-white min-h-screen">
      
      {/* 🔥 HERO SECTION */}
      <div className="bg-gradient-to-r from-richblack-900 via-richblack-800 to-richblack-900 px-6 py-16 border-b border-richblack-700">
        <div className="mx-auto max-w-maxContentTab lg:max-w-maxContent flex flex-col gap-5">

          <p className="text-sm text-richblack-400">
            Home / Catalog /{" "}
            <span className="text-yellow-50 font-medium">
              {catalogPageData?.data?.selectedCategory?.name}
            </span>
          </p>

          <h1 className="text-4xl font-bold text-richblack-5">
            {catalogPageData?.data?.selectedCategory?.name}
          </h1>

          <p className="text-richblack-300 max-w-3xl leading-relaxed">
            {catalogPageData?.data?.selectedCategory?.description}
          </p>
        </div>
      </div>

      {/* 🔥 SECTION 1 */}
      <div className="mx-auto w-full max-w-maxContentTab lg:max-w-maxContent px-6 py-14">
        
        <h2 className="text-2xl font-bold mb-6 relative inline-block">
          Courses to get you started
          <span className="block w-1/2 h-[3px] bg-yellow-50 mt-2 rounded"></span>
        </h2>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-richblack-700 text-sm font-medium mb-6">
          <button
            className={`pb-3 transition-all duration-200 ${
              active === 1
                ? "text-yellow-50 border-b-2 border-yellow-50"
                : "text-richblack-300 hover:text-white"
            }`}
            onClick={() => setActive(1)}
          >
            Most Popular
          </button>

          <button
            className={`pb-3 transition-all duration-200 ${
              active === 2
                ? "text-yellow-50 border-b-2 border-yellow-50"
                : "text-richblack-300 hover:text-white"
            }`}
            onClick={() => setActive(2)}
          >
            New
          </button>
        </div>

        {/* Slider */}
        <div className="rounded-xl overflow-hidden">
          <Course_Slider
            Courses={catalogPageData?.data?.selectedCategory?.courses}
          />
        </div>
      </div>

      {/* 🔥 SECTION 2 (Frequently Bought) */}
      <div className="mx-auto w-full max-w-maxContentTab lg:max-w-maxContent px-6 py-14">
        
        <h2 className="text-3xl font-bold mb-10 relative inline-block">
          Frequently Bought
          <span className="block w-1/2 h-[3px] bg-yellow-50 mt-2 rounded"></span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {catalogPageData?.data?.mostSellingCourses
            ?.slice(0, 4)
            .map((course, i) => (
              <div
                key={i}
                className="bg-richblack-800 rounded-xl overflow-hidden shadow-md 
                hover:shadow-yellow-500/20 hover:scale-[1.02] 
                transition-all duration-300"
              >
                <Course_Card course={course} Height={"h-[400px]"} />
              </div>
            ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Catalog