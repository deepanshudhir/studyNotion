const mongoose = require("mongoose");
const Course = require("../models/Course");
const Category = require("../models/Category");
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }

exports.createCategory = async (req, res) => {
	try {
		const { name, description } = req.body;
		if (!name) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}
		const CategorysDetails = await Category.create({
			name: name,
			description: description,
		});
		console.log(CategorysDetails);
		return res.status(200).json({
			success: true,
			message: "Categorys Created Successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: true,
			message: error.message,
		});
	}
};

exports.showAllCategories = async (req, res) => {
	try {
        console.log("INSIDE SHOW ALL CATEGORIES");
		const allCategorys = await Category.find({});
		res.status(200).json({
			success: true,
			data: allCategorys,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

//categoryPageDetails 
exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    // 🔥 1. Selected Category
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: [
          { path: "ratingAndReviews" },
          { path: "instructor", select: "firstName lastName image" },
        ],
      })
      .lean();

    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // 🔥 2. If no courses
    if (!selectedCategory.courses?.length) {
      return res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategory: null,
          mostSellingCourses: [],
        },
      });
    }

    // 🔥 3. Random Different Category (efficient)
    const randomCategory = await Category.aggregate([
      { $match: { _id: { $ne: new mongoose.Types.ObjectId(categoryId) } } },
      { $sample: { size: 1 } },
    ]);

    let differentCategory = null;

    if (randomCategory.length > 0) {
      differentCategory = await Category.findById(randomCategory[0]._id)
        .populate({
          path: "courses",
          match: { status: "Published" },
        })
        .lean();
    }

    // 🔥 4. MOST SELLING COURSES (DB LEVEL SORT 🔥)
    const mostSellingCourses = await Course.find({ status: "Published" })
      .sort({ studentsEnrolled: -1 }) // ⚠️ works if stored as count OR array indexed
      .limit(10)
      .populate("instructor", "firstName lastName image")
      .lean();

    // ⚠️ If studentsEnrolled is array, use this instead:
    // .sort({ studentsEnrolled: -1 }) ❌ not reliable
    // Better approach below 👇

    /*
    const mostSellingCourses = await Course.aggregate([
      { $match: { status: "Published" } },
      {
        $addFields: {
          studentCount: { $size: "$studentsEnrolled" },
        },
      },
      { $sort: { studentCount: -1 } },
      { $limit: 10 },
    ]);
    */

    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });

  } catch (error) {
    console.error("CATEGORY PAGE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};