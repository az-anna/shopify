import Image from 'next/image'
import LinesEllipsis from 'react-lines-ellipsis'

const ProductItem = (props) => {
    const image = props.image
    const handle = props.handle
    const price = props.price
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
                        text={handle}
                        maxLine='2'
                        ellipsis='...'
                        trimRight
                        basedOn='letters'
                        className="text-xs text-gray-800"
                    />
                    <div className="text-xs text-gray-800">
                        {price}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ProductItem