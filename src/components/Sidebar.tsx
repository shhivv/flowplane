import { BsPlusLg } from "react-icons/bs"
import { MdBlurLinear } from "react-icons/md"

export default function(){
    return <div className="h-screen w-1/6 bg-[#111] border-r border-r-neutral-800 p-4 text-sm">

        <div className="py-2">
            <div className="font-heading mb-8 text-lg px-1 text-neutral-300">Flowplane</div>
            <div className="text-neutral-400">
                <div className="flex items-center space-x-3  hover:bg-neutral-900 p-1 w-full  rounded-md">
                    <MdBlurLinear/> <text>Homeboard</text>
                </div>
                <div className="flex items-center space-x-3  hover:bg-neutral-900 p-1 w-full  rounded-md">
                    <MdBlurLinear/> <text>School</text>
                </div>
                <div className="flex items-center space-x-3 hover:bg-neutral-900 p-1 w-full  rounded-md">
                    <MdBlurLinear/> <text>Work</text>
                </div>
            </div>
        </div>

        <div className="bottom-0 text-neutral-400 fixed py-3 px-6 flex items-center space-x-4 hover:bg-neutral-900 left-0 w-1/6">
            <BsPlusLg/> <text >New plane</text>
        </div>
    </div>
}