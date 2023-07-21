import { driverAtom } from "@/state";
import { FaAngleRight } from "react-icons/fa";
import { useRecoilState } from "recoil";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { HREF } from "@/constants";
import { getDriver } from "@/server";
import { Driver } from "@/types";

export const DriverIDInput = ({}) => {
  const [, setDriver] = useRecoilState(driverAtom);
  const router = useRouter();
  const {
    register: register,
    setError: setError,
    handleSubmit: handleSubmit,
    formState: { errors: errors },
  } = useForm();
  const onSubmit = handleSubmit((data) => {
    // Fetch driver data from the driverID
    // If the driver does not exist, trigger an error
    getDriver(data.driverID, (data: Driver) => {
      if (data) {
        setDriver(data);
        router.push(HREF.TRIPS);
      } else {
        setError("driverID", {
          type: "custom",
          message: "Driver does not exist",
        });
      }
    });
  });

  return (
    <>
      <label className="mt-12">Driver ID</label>
      <form className="-mx-3 mb-2 flex flex-wrap" onSubmit={onSubmit}>
        <div className="w-4/5 pb-3">
          <input
            {...register("driverID", {
              required: true,
              maxLength: 8,
              minLength: 1,
              pattern: /^[0-9]*$/i,
            })}
            defaultValue=""
            className="white-input h-10 !rounded-l-lg"
            placeholder="Enter driver ID"
          />
        </div>
        <button
          type="submit"
          className="rect-button rounded-r-lg shadow-md h-10"
        >
          <FaAngleRight />
        </button>
      </form>
      {errors.driverID && (
        <p className="text-red-200 text-xs -mt-6">Driver ID not found</p>
      )}
    </>
  );
};
