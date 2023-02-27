import Image from 'next/image'
import ebayLogo from '../public/ebay.png'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { ShopifyProduct } from '../utils/types'


interface ShopifyProductProps {
  data: ShopifyProduct[]
}

export default function Table({ data }: ShopifyProductProps) {
  console.log(data)
  const router = useRouter()
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedItem, setSelectedItem] = useState<ShopifyProduct>()
  const [date, setDate] = useState<string>()
  const [newPrice, setNewPrice] = useState<number>()
  const [newStock, setNewStock] = useState<number>()
  const [newStatus, setNewStatus] = useState<string>("")

  async function updateProduct() {
    const price = newPrice ? newPrice : selectedItem!.variants[0].price
    const inventory = newStock !== null ? newStock : selectedItem!.variants[0].inventory_quantity
    const barcode = date ? date : selectedItem!.variants[0].barcode
    const status = newStatus ? newStatus : selectedItem!.status
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        barcode: barcode,
        inventory: inventory,
        inventory_id: selectedItem!.variants[0].inventory_item_id,
        id: selectedItem!.id,
        sku: selectedItem!.variants[0].sku,
        price: price,
        option1: selectedItem!.variants[0].option1,
        status: status
      })
    };
    const res = await fetch('http://localhost:8000/api/products/update', requestOptions)
    if (res.status) {
      setShowModal(false)
    }
  }

  function onClickHandler() {
    updateProduct()
    setShowModal(false)
    router.reload()
  }

  function editHandler(product: ShopifyProduct) {
    setSelectedItem(product)
    setShowModal(true)
  }

  function onCancelHandler() {
    setSelectedItem(undefined)
    setShowModal(false)
  }

  return (
    <div className="px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <div className='flex '>
            <Image src={ebayLogo} width='100' alt='ebay' />
            <h1 className="pt-2 ml-3 text-xl font-semibold text-gray-900">{data.title}</h1>
          </div>
        </div>
        <div className="mt-4 mr-4 flex-none">
          <button
            type="button"
            className="block rounded-md bg-orange-600 py-1.5 px-6 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
            onClick={router.back}
          >
            戻る
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-my-2 -mx-6 overflow-x-auto lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="text-sm font-semibold text-gray-900">
                    商品名
                  </th>
                  <th scope="col" className="px-6 text-sm font-semibold text-gray-900">
                    価格
                  </th>
                  <th scope="col" className="px-6 text-sm font-semibold text-gray-900">
                    在庫
                  </th>
                  <th scope="col" className="px-6 text-sm text-right font-semibold text-white">
                    Edit
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((product) => (
                  <tr key={product.id}>
                    <td className="whitespace-nowrap py-4 text-center text-sm font-medium  text-blue-600 hover:underline">
                      <Link
                        href={product.variants[0].option1.split(',')[1]}
                        target="_blank"
                      >
                        {product.title}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap py-4 text-center text-sm font-medium">
                      {product.variants[0].price}
                    </td>
                    <td className="whitespace-nowrap py-4 text-center text-sm font-medium">
                      {product.variants[0].inventory_quantity}
                    </td>
                    <td className="whitespace-nowrap text-center text-sm font-medium">
                      <button
                        className="bg-green-600 px-3 py-1 rounded-full text-white hover:bg-green-700"
                        onClick={() => editHandler(product)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showModal && selectedItem ?
        <div
          className="relative z-10 justify-center"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center text-center">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm">
                <div className='my-5'>
                  <div className="text-center m-5">
                    ＜商品内容の変更＞
                  </div>
                  <div className='grid grid-cols-7 items-center'>
                    <div className='col-span-1 text-center'>
                      <div className='text-xs font-bold text-transparent'>dasdf</div>
                      <div className="text-sm mt-3 pl-5">
                        価格
                      </div>
                    </div>
                    <div className='col-span-3 text-center'>
                      <div className='text-sm font-bold text-red-600'>修正前</div>
                      <div className="mt-3 text-center">
                        {selectedItem.variants[0].price}
                      </div>
                    </div>
                    <div className='col-span-2 text-center'>
                      <div className='text-sm font-bold text-green-600'>修正後</div>
                      <div className='mt-3'>
                        <input
                          name="price"
                          id="price"
                          className="block w-full text-center rounded-md !outline-none border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                          onChange={e => setNewPrice(parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='grid grid-cols-7 items-center'>
                    <div className='col-span-1 text-center'>
                      <div className="text-sm mt-3 pl-5">
                        在庫
                      </div>
                    </div>
                    <div className='col-span-3 text-center'>
                      <div className="mt-3 text-center">
                        {selectedItem.variants[0].inventory_quantity}
                      </div>
                    </div>
                    <div className='col-span-2 text-center'>
                      <div className='mt-3'>
                        <input
                          // type="number"
                          name="price"
                          id="price"
                          className="block w-full text-center rounded-md border !outline-none  border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                          onChange={e => setNewStock(parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='grid grid-cols-7 items-center'>
                    <div className='col-span-1 text-center'>
                      <div className="text-sm mt-3 pl-5">
                        status
                      </div>
                    </div>
                    <div className='col-span-3 text-center'>
                      <div className="mt-3 text-center">
                        {selectedItem.status}
                      </div>
                    </div>
                    <div className='col-span-2 text-center'>
                      <div className='mt-3'>
                        <select
                          // type="number"
                          name="status"
                          id="status"
                          className="block text-sm my-0 py-0 w-full h-8 text-center rounded-md border !outline-none  border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                          onChange={e => setNewStatus(e.target.value)}
                        >
                          <option value=""></option>
                          <option value="active">active</option>
                          <option value="draft">draft</option>
                          <option value="archived">archived</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='flex justify-center m-auto'>
                  <input type='date' id="date" name="date" lang="en-GB" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div className='flex justify-center'>
                  <div className="my-5 mr-5">
                    <button
                      type="button"
                      className="w-full rounded-md border border-transparent bg-green-700 px-6 py-2 text-base font-medium text-white transition shadow-sm hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-800 focus:ring-offset-2"
                      onClick={onClickHandler}
                    >
                      データ更新
                    </button>
                  </div>
                  <div className="my-5 ms-5">
                    <button
                      type="button"
                      className="w-full transition rounded-md border border-transparent bg-gray-100 px-6 py-2 text-base font-medium shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                      onClick={onCancelHandler}
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div >
        : null
      }
    </div>
  )
}
