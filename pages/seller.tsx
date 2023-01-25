import { useState, useEffect, useMemo } from 'react';
import { withRouter } from 'next/router';
import Link from 'next/link';
import Editor from '../components/TextEditor';

function Seller({ router: { query } }) {
  const [item, setItem] = useState()
  const [isShipped, setIsShipped] = useState("")
  const [price, setPrice] = useState<number>(0)
  const [exchangeRate, setExchangeRate] = useState<number>(1)
  const [profitRate, setProfitRate] = useState<number>(1)

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
      //pass
    } else {
      setPrice(Math.round(parseFloat(item.StartPrice.value) * exchangeRate * profitRate))
    }
  }, [item, exchangeRate, profitRate])
  console.log(item)

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
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-3 sm:mt-0">{item.StartPrice ? (item.StartPrice._currencyID + " " + item.StartPrice.value) : null}</dd>
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
              <div className="p-3 grid grid-cols-3 gap-x-6">
                <div className="col-span-1">
                  <p className="text-xs pb-3">価格設定</p>
                  <p>¥ {isNaN(price) ? null : price}</p>
                </div>
                <div className="col-span-1">
                  <p className="text-xs pb-1">為替レート</p>
                  <div className="flex rounded-md shadow-sm pr-2">
                    <input
                      type="number"
                      id="exchange-rate"
                      value={exchangeRate}
                      onChange={e => e.target.value.length > 0 ? setExchangeRate(parseFloat(e.target.value)) : setExchangeRate(NaN)}
                      className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm py-1 px-2"
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <p className="text-xs pb-1">倍率</p>
                  <div className="flex rounded-md shadow-sm pr-2">
                    <input
                      type="number"
                      id="profit-rate"
                      min="1"
                      step="0.1"
                      value={profitRate}
                      onChange={e => e.target.value.length >0 ? setProfitRate(parseFloat(e.target.value)) : setProfitRate(NaN)}
                      className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm py-1 px-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 md:col-span-3 md:mt-0">
            <form action="#" method="POST">
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
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 sm:col-span-3">
                      <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                        商品カテゴリー
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          name="product-type"
                          id="product-type"
                          className="block w-full flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-12">
                    <div className="col-span-1">
                      <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                        価格
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="number"
                          name="product-price"
                          id="product-price"
                          className="block w-full flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                          className="block w-full flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
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
                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withRouter(Seller);