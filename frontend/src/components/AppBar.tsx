import { Link } from "react-router-dom"
import { Avatar } from "./BlogCard"

export const AppBar = () => {
  return (
    <div className="border-b border-slate-500 flex justify-between px-10 py-4 ">
        <Link to={'/blogs'} className="flex flex-col justify-center cursor-pointer">
        <div className="text-lg font-semibold" >
            Medium
        </div>
        </Link>
        <div>
            <Link to={`/publish`}>
             <button type="button" className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 ">New</button>
             </Link>

            <Avatar name="Apaarmeet" size={"big"}/>
           
        </div>
    </div>
  )
}
