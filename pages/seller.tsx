import { useState, useEffect, FormEvent } from 'react';
import { withRouter, useRouter } from 'next/router';
import { Tags } from '../components/Tags';
import Link from 'next/link';
import Editor from '../components/TextEditor';
import { descAtom, tagAtom } from '../utils/atoms'
import { useAtom } from 'jotai'
import { ConfirmationModal } from '../components/Modal';
import { EbayProduct } from '../utils/types';
import { GlobeAltIcon } from '@heroicons/react/20/solid';
import { BACKEND_URL } from '../utils/urls';


function Seller({ router: { query } }) {
  const router = useRouter()
  const [item, setItem] = useState<EbayProduct>()
  const [isShipped, setIsShipped] = useState("")
  const [price, setPrice] = useState<number>(0)
  const [sellingPrice, setSellingPrice] = useState<number>(0)
  const [stocks, setStocks] = useState<number>(1)
  const [exchangeRate, setExchangeRate] = useState<number>(1)
  const [profitRate, setProfitRate] = useState<number>(1)
  const [title, setTitle] = useState<string>("")
  const [checked, setChecked] = useState<boolean>(false)
  const [tags, setTags] = useAtom(tagAtom)
  const [desc, setDesc] = useAtom(descAtom)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [status, setStatus] = useState<number>()
  const [productStatus, setProductStatus] = useState<string>("draft")
  const [loading, setLoading] = useState<boolean>(false)

  function handleCheckboxChange(e) {
    setChecked(e.target.checked)
  }

  async function submitHandler(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    if (item) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemUrl: item.ListingDetails.ViewItemURL,
          title: title,
          tags: tags.map(tag => tag.id).join(','),
          vendor: item.Seller.UserID,
          price: sellingPrice,
          stocks: stocks,
          description: desc,
          images: item.PictureDetails.PictureURL,
          itemId: item.ItemID,
          sku: item.Title,
          status: productStatus
        })
      };
      const res = await fetch(`${BACKEND_URL}api/products/create`, requestOptions)
      if (res.status) {
        setLoading(false)
        setStatus(res.status)
        setTags([{ id: '新着商品', text: '新着商品' }])
        setDesc('')
        setShowModal(true)
      }
    }
  }

  function clickHandler() {
    setSellingPrice(price)
  }
  function setStatusToDraft() {
    setProductStatus('draft')
  }
  function setStatusToActive() {
    setProductStatus('active')
  }
  async function fetchRate() {
    if (item) {
      const code = item.Currency
      const response = await fetch(`${BACKEND_URL}api/currency/rates?code=${code}`);
      const { data } = await response.json();
      const rate = parseFloat((1 / data[code]).toFixed(2))
      setExchangeRate(rate)
    }
  }

  useEffect(() => {
    if (query.eBayItem) {
      const data = JSON.parse(query.eBayItem)
      setItem(data)
    }
  }, [query])

  useEffect(() => {
    if (item) {
      const locations = item.ShipToLocations
      locations.includes("JP") ? setIsShipped("可") : setIsShipped("不可")
    }
  }, [item])

  useEffect(() => {
    if (isNaN(exchangeRate) || isNaN(profitRate) || !item) {
    } else {
      setPrice(Math.round(parseFloat(item.SellingStatus.CurrentPrice.value) * exchangeRate * profitRate))
    }
  }, [item, exchangeRate, profitRate])

  useEffect(() => {
    if (checked) {
      setPrice(Math.trunc(price / 1000) * 1000)
    } else {
      if (isNaN(exchangeRate) || isNaN(profitRate) || !item) {
      } else {
        setPrice(Math.round(parseFloat(item.SellingStatus.CurrentPrice.value) * exchangeRate * profitRate))
      }
    }
  }, [checked, price, exchangeRate, profitRate, item])


  return (
    <div className='p-5 bg-slate-100'>
      <div>
        <div className="md:grid md:grid-cols-5 md:gap-6">
          <div className="md:col-span-2">
            <div className="px-2">
              <h3 className="text-lg font-medium leading-6 text-gray-900">商品詳細</h3>
              {item ? (
                <div className="my-5 px-4 py-5 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-2 sm:grid sm:grid-cols-4 gap-x-2">
                      <dt className="text-sm font-medium text-gray-500">商品名</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-3 sm:mt-0">{item.Title ? item.Title : null}</dd>
                    </div>
                    <div className="py-2 sm:grid sm:grid-cols-4 gap-x-2">
                      <dt className="text-sm font-medium text-gray-500">商品ID</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-3 sm:mt-0">{item.ItemID ? item.ItemID : null}</dd>
                    </div>
                    <div className="py-2 sm:grid sm:grid-cols-4 gap-x-2">
                      <dt className="text-sm font-medium text-gray-500">販売者ID</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-3 sm:mt-0">{item.Seller ? item.Seller.UserID : null}</dd>
                    </div>
                    <div className="py-2 sm:grid sm:grid-cols-4 gap-x-2">
                      <dt className="text-sm font-medium text-gray-500">ストアURL</dt>
                      <Link
                        className="mt-1 text-sm text-blue-600 sm:col-span-3 sm:mt-0 underline"
                        href={item.Storefront ? item.Storefront.StoreURL : ""}
                        target="_blank"
                      >
                        {item.Storefront ? item.Storefront.StoreURL : null}
                      </Link>
                    </div>
                    <div className="py-2 sm:grid sm:grid-cols-4 gap-x-2">
                      <dt className="text-sm font-medium text-gray-500">商品URL</dt>
                      <Link
                        className="mt-1 text-sm text-blue-600 sm:col-span-3 sm:mt-0 underline"
                        href={item.ListingDetails ? item.ListingDetails.ViewItemURL : ""}
                        target="_blank"
                      >
                        {item.ListingDetails ? item.ListingDetails.ViewItemURL : null}
                      </Link>
                    </div>
                    <div className="py-2 sm:grid sm:grid-cols-4 gap-x-2">
                      <dt className="text-sm font-medium text-gray-500">価格</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-3 sm:mt-0">{item.SellingStatus ? (item.SellingStatus.CurrentPrice._currencyID + " " + item.SellingStatus.CurrentPrice.value) : null}</dd>
                    </div>
                    <div className="py-2 sm:grid sm:grid-cols-4 gap-x-2">
                      <dt className="text-sm font-medium text-gray-500">在庫数</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-3 sm:mt-0">{item.Quantity ? item.Quantity : null}</dd>
                    </div>
                    <div className="py-2 sm:grid sm:grid-cols-4 gap-x-2">
                      <dt className="text-sm font-medium text-gray-500">日本へ発送</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-3 sm:mt-0">{isShipped}</dd>
                    </div>
                  </dl>
                </div>
              ) : null}
            </div>
            <div className="rounded-lg bg-indigo-100 shadow">
              <div className="p-3 grid grid-cols-9">
                <div className="col-span-3 text-center">
                  <p className="text-sm pb-2">価格設定</p>
                  <p>¥ {isNaN(price) ? null : price.toLocaleString()}</p>
                </div>
                <div className="col-span-2 -mt-0.5 text-center">
                  <div className="inline-flex">
                    <p className="text-sm pb-1">為替レート</p>
                    <GlobeAltIcon
                      className="w-4 ml-2 -mt-1 cursor-pointer hover:w-5 text-indigo-700 transition-all"
                      onClick={fetchRate}
                    />
                  </div>
                  <div className="flex rounded-md shadow-sm">
                    <input
                      type="text"
                      id="exchange-rate"
                      value={isNaN(exchangeRate) ? "" : exchangeRate}
                      onChange={e => e.target.value.length > 0 ? setExchangeRate(parseFloat(e.target.value)) : setExchangeRate(NaN)}
                      className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm py-1 text-center"
                    />
                  </div>
                </div>
                <div className="col-span-2 text-center pl-4">
                  <p className="text-sm pb-1">倍率</p>
                  <div className="flex rounded-md shadow-sm">
                    <input
                      type="number"
                      id="profit-rate"
                      min="1"
                      step="0.1"
                      value={profitRate}
                      onChange={e => e.target.value.length > 0 ? setProfitRate(parseFloat(e.target.value)) : setProfitRate(NaN)}
                      className="block w-full rounded-md pl-6 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm py-1 px-2 text-center"
                    />
                  </div>
                </div>
                <div className="col-span-2 text-center pl-4">
                  <div className='flex items-center pb-1'>
                    <input
                      type="checkbox"
                      className="rounded-sm ml-3 mr-1 w-3.5 h-3.5 focus:outline-none focus:ring-1"
                      checked={checked}
                      onChange={handleCheckboxChange}
                    />
                    <p className=' text-sm'>
                      端数切捨
                    </p>
                  </div>


                  <button
                    className="inline-flex justify-center rounded-md border border-transparent bg-orange-500 py-1 px-3 text-sm font-medium text-white shadow-sm hover:bg-orange-600 "
                    onClick={clickHandler}
                  >
                    設定する
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 md:col-span-3 md:mt-0">
            <form onSubmit={submitHandler}>
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 sm:col-span-3">
                      <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                        商品名
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          name="product-website"
                          id="product-title"
                          className="block w-full flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          onChange={e => setTitle(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pb-3">
                    <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                      タグ
                    </label>
                    <div className="my-1 flex rounded-md shadow-sm ">
                      <Tags />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-12">
                    <div className="col-span-1">
                      <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                        価格
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="number"
                          name="product-price"
                          id="product-price"
                          value={sellingPrice}
                          className="block w-full flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          onChange={e => setSellingPrice(parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                    <div className="col-span-1">
                      <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                        在庫数
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="number"
                          name="product-quantity"
                          id="product-quantity"
                          value={stocks}
                          className="block w-full flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          onChange={e => setStocks(parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="company-website" className="block pb-2 text-sm font-medium text-gray-700">
                        登録時ステータス
                      </label>
                      <div className='h-7 w-36 rounded-md bg-gray-200'>
                        <div className='flex items-center text-sm font-medium transition-colors'>
                          <div
                            onClick={setStatusToDraft}
                            className={`mt-0.5 mx-0.5 h-6 w-1/2 inline-flex items-center justify-center cursor-pointer ${productStatus === 'active' ? "bg-gray-200 text-gray-500" : "text-indigo-600 bg-white rounded-md shadow-sm"}`}>
                            下書き
                          </div>
                          <div
                            onClick={setStatusToActive}
                            className={`mt-0.5 mx-0.5 h-6 w-1/2 inline-flex items-center justify-center cursor-pointer ${productStatus === 'draft' ? "bg-gray-200 text-gray-500" : "text-indigo-600 bg-white rounded-md shadow-sm"}`}>
                            公開
                          </div>
                        </div>
                      </div>

                    </div>


                  </div>
                  <div className=''>
                    <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                      詳細説明欄
                    </label>
                    <div className="mt-1">
                      <Editor />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 text-center">

                  {loading ? (
                    <button type="button" className="w-40 inline-flex pr-5 justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm" disabled>
                      <div className="flex m-auto justify-center items-center relative z-0">
                        <div className="animate-spin h-4 w-4 mr-3 border-2 border-white rounded-full border-t-transparent border-r-transparent"></div>
                        <div className="absolute inset-0 h-4 w-4 border-2 border-indigo-100 rounded-full opacity-40"></div>
                      </div>
                      Processing...
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="w-32 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Save
                    </button>
                  )
                  }
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {showModal ? (
        <>
          <ConfirmationModal
            status={status}
            confirmBtn="Go Back to Main"
            onConfirm={() => router.back()}
          />
        </>
      ) : null}
    </div>
  )
}

export default withRouter(Seller);