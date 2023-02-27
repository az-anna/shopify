export const Loader = () => {
  return (
    <div className='grid h-screen place-items-center'>
      <div className="flex justify-center">
        <div>please wait...</div>
        <span className="circle"></span>
        <span className="circle animate-loader"></span>
        <span className="circle animate-loader animation-delay-200"></span>
        <span className="circle animate-loader animation-delay-400"></span>
      </div>
    </div>
  )
}

