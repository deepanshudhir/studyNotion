import { useForm, Controller } from "react-hook-form";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";

import { createRating } from "../../../services/operations/courseDetailsAPI";
import IconBtn from "../../Common/IconBtn";

const StarRating = ({ value, onChange }) => {
  return (
    <div className="flex gap-2 mt-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onChange(star)}
          className={`cursor-pointer text-2xl transition ${
            star <= value ? "text-yellow-400" : "text-gray-400"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
};
export default function CourseReviewModal({ setReviewModal }) {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { courseEntireData } = useSelector((state) => state.viewCourse);

  // ✅ useForm with control
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      courseRating: 0,
      courseExperience: "",
    },
  });

  // ✅ Submit handler
  const onSubmit = async (data) => {
    if (!data.courseRating || data.courseRating === 0) {
      alert("Please select a rating");
      return;
    }

    try {
      await createRating(
        {
          courseId: courseEntireData._id,
          rating: data.courseRating,
          review: data.courseExperience,
        },
        token
      );

      setReviewModal(false);
    } catch (error) {
      console.log("Error submitting review:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            Add Review
          </p>
          <button onClick={() => setReviewModal(false)}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          
          {/* User Info */}
          <div className="flex items-center justify-center gap-x-4">
            <img
              src={user?.image || "/default-avatar.png"}
              alt={`${user?.firstName} profile`}
              className="aspect-square w-[50px] rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-richblack-5">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-richblack-5">
                Posting Publicly
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 flex flex-col items-center"
          >
            
            {/* ⭐ Rating (FIXED with Controller) */}
            <Controller
              name="courseRating"
              control={control}
              rules={{ required: true, min: 1 }}
              render={({ field }) => (
                <StarRating
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            {/* Rating Error */}
            {errors.courseRating && (
              <span className="text-xs text-pink-200 mt-1">
                Please select a rating
              </span>
            )}

            {/* Textarea */}
            <div className="flex w-11/12 flex-col space-y-2 mt-4">
              <label
                className="text-sm text-richblack-5"
                htmlFor="courseExperience"
              >
                Add Your Experience{" "}
                <sup className="text-pink-200">*</sup>
              </label>

              <textarea
                id="courseExperience"
                placeholder="Add Your Experience"
                {...register("courseExperience", { required: true })}
                className="form-style resize-none min-h-[130px] w-full"
              />

              {errors.courseExperience && (
                <span className="ml-2 text-xs text-pink-200">
                  Please add your experience
                </span>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-6 flex w-11/12 justify-end gap-x-2">
              
              <button
                type="button"
                onClick={() => setReviewModal(false)}
                className="rounded-md bg-richblack-300 py-2 px-5 font-semibold text-richblack-900"
              >
                Cancel
              </button>

              {/* ✅ MUST be submit */}
              <IconBtn text="Save" type="submit" />
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}