import { create } from 'domain'
import Image from 'next/image'
import LinesEllipsis from 'react-lines-ellipsis'

const ProductItem = (props) => {
  const image = props.image
  const vendor = props.vendor
  const title = props.title
  const price = props.price
  const created_at = props.created_at ? new Date(props.created_at).toISOString().split("T")[0] : ""
  const updated_at = props.updated_at ? new Date(props.updated_at).toISOString().split("T")[0] : ""

  return (
    <div>
      <div
        className='flex p-2 hover:bg-gray-100 rounded-md cursor-pointer'
      >
        <Image
          className='h-12 w-12 rounded'
          src={image}
          width={200}
          height={200}
          alt='sample'
        />
        <div className="ml-3">
          <LinesEllipsis
            text={title}
            maxLine='1'
            ellipsis='...'
            trimRight
            basedOn='letters'
            className="text-xs text-gray-800"
          />
          <LinesEllipsis
            text={vendor}
            maxLine='1'
            ellipsis='...'
            trimRight
            basedOn='letters'
            className="text-xs text-gray-800"
          />
          <div className='flex text-xs text-gray-800 gap-x-3'>
            <div className="">
              {price}
            </div>
            <div>
              更新：{updated_at}
            </div>
            <div>
              作成：{created_at}
            </div>
          </div>

        </div>
      </div>
    </div >
  )
}

export default ProductItem