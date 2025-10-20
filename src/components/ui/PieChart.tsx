import { useState } from "react";
import PartialBorder from './PartialBorder.tsx'

function PieChart(props: any) {
    //const category = "other"
    return (
        <>
        <PartialBorder percentage={props.percentage}>
        <div className="flex justify-center items-center w-40 h-40 border-2 rounded-[50%]">
            {props.category}
        </div>
          </PartialBorder>
        </>
    )
}

export default PieChart