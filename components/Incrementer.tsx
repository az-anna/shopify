import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { useState, useEffect } from 'react'
import { stockAtom} from '../utils/atoms'
import { useAtom } from 'jotai'
const Incrementer = ({quantity} : { quantity : number} ) =>{
  const [stock, setStock] = useAtom(stockAtom)
  function Increment(){
    setStock(count => count + 1)
  }
  function Decrement(){
    if (stock > 0) {
      setStock(count => count - 1)
    }
  }
  // useEffect(() => {
  //   setStock(quantity)
  // }, [quantity, setStock])

  return (
    <div>
          <div className="isolate inline-flex -space-x-px rounded-md shadow-sm">
            <button
              onClick={Decrement}
              className="relative inline-flex items-center rounded-l-md border border-slate-300 bg-slate-100 px-1 text-sm font-medium text-slate-500 hover:bg-slate-50 focus:z-20"
            >
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <p
              className="inline-flex items-center border border-slate-100 px-4 py-1 text-xs font-medium"
            >
              {stock}
            </p>
            <button
              onClick={Increment}
              className="relative inline-flex items-center rounded-r-md border border-slate-200 bg-slate-100 px-1 font-medium text-slate-500 hover:bg-slate-50 focus:z-20"
              >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
  )
}

export default Incrementer