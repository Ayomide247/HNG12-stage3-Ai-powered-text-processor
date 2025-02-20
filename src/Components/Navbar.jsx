import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleDown,
  FaBars,
} from "react-icons/fa";
import { FaRegPenToSquare } from "react-icons/fa6";
import { PiSidebarFill } from "react-icons/pi";
const Navbar = () => {
  return (
    <nav className="bg-primary text-pure pl-3 p-4 flex justify-between items-center transition-all ease-in duration-500">
      <div className="flex gap-3 items-center ">
        <div className="flex gap-1 items-center cursor-pointer rounded-lg hover:bg-secondary py-2 px-3 transition ease-in duration-500">
          <h1 className="font-bold">HNG12-AI </h1>
        </div>
      </div>
      <div className=" rounded-full bg-[#1abc9c] w-12 h-12 grid place-content-center text-[#ffffff] font-bold">
        AY
      </div>
    </nav>
  );
};
export default Navbar;
