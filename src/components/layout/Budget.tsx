import PieChart from '@ui/PieChart.tsx'

function Budget(){
    return (
        <>
        <div className='text-6xl mb-4'>Expenses !</div>
        <div className='grid grid-cols-2'>
        <PieChart category={"Grosaries"} percentage={60}/>
        <PieChart category={"EMI"} percentage={60}/>
        <PieChart category={"Savings"} percentage={60}/>
        <PieChart category={"Others"} percentage={60}/>
        </div>
        </>
    )
}

export default Budget