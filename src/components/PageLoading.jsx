import { ThreeDots } from "react-loader-spinner";

export default function PageLoding() {
  return (
    <div
      style={{ direction: "rtl" }}
      className="bg-[#f0f9ff] flex justify-center items-center h-dvh"
    >
      <ThreeDots
        height="80"
        width="80"
        radius="9"
        color="#0284c7"
        ariaLabel="three-dots-loading"
        wrapperStyle={{ margin: "20px" }}
        wrapperClass="custom-loader"
        visible={true}
      />
    </div>
  );
}
