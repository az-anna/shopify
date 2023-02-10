import { SetStateAction, useState} from 'react'
import { ShopifySlider, EbaySlider } from '../components/Slider'
import InputField from '../components/InputField'
import Button from '../components/Button'
import ProductItem from '../components/ProductItem'
import Incrementer from '../components/Incrementer'
import Modal from '../components/Modal'
import { stockAtom} from '../utils/atoms'
import { useAtom } from 'jotai'
import { ShopifyProduct } from '../utils/types'
import Link from 'next/link'


interface ShopifyProductProps {
  products: ShopifyProduct[]
}

export default function Home({ products }: ShopifyProductProps ) {

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [queryTerm, setQueryTerm] = useState<string>('')
  const [filteredProducts, setFilteredProducts] = useState<ShopifyProduct[]>(products.slice(0, 100))
  const [selectedShopifyItem, setSelectedShopifyItem] = useState<ShopifyProduct>()
  const [ebayItems, setEbayItems] = useState()
  const [ebayItemDetails, setEbayItemDetails] = useState()
  const [selectedEbayItem, setSelectedEbayItem] = useState()
  const [showModal, setShowModal] = useState<boolean>(false)
  const [stock, setStock] = useAtom(stockAtom)

  async function filterProducts() {
    const searchTerms = searchTerm.replace('　', ' ').split(' ')
    const res =await fetch(`http://localhost:8000/api/products/shopify?handle=${searchTerms}`)
    const data = await res.json()
    setFilteredProducts(data)
  }

  async function fetchItems() {
    const res = await fetch(`http://localhost:8000/api/products/ebay?q=${queryTerm}`)
    const data = await res.json()
    setEbayItems(data['searchResult']['item'])
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      filterProducts()
    }
  }
  function handleKeyDownEbay(e) {
    if (e.key === 'Enter') {
      fetchItems()
    }
  }
  function handleShopifyClick(productId: SetStateAction<number | undefined>) {
    const selected = products.find(p => p.id === productId)
    setSelectedShopifyItem(selected)
    setStock(selected!.variants[0].inventory_quantity)
  }

  async function handleEbayClick(itemId: string) {
    if (ebayItems) {
      const selected = ebayItems.find(i => i.itemId === itemId)
      setSelectedEbayItem(selected)
      const res = await fetch(`http://localhost:8000/api/products/ebay/item?id=${itemId}`)
      const data = await res.json()
      setEbayItemDetails(data['Item'])
    }
  }
  function onConfirm(e) {
    e.preventDefault();
		setShowModal(false);
  }
  function onCancel(e){
    e.preventDefault();
		setShowModal(false);
  }
  function updateQuantity (){
    setShowModal(true)
  }
  console.log(products[0])
  return (
    <>
      <div className='mx-3 grid grid-cols-12 items-start gap-x-4'>
        <section className='col-span-4 px-2 h-screen'>
          <div className='flex mt-3  gap-x-3 items-baseline'>
            <div className='w-3/5 text-right font-semibold'>
              Shopify 商品一覧
            </div>
            <div className='text-left text-xs'>
              検索結果：{filteredProducts.length + "件"}
            </div>
          </div>
          <div className='flex items-center w-full gap-x-2'>
            <div className='w-2/3 lg:w-5/6'>
              <InputField
                className='my-2 text-sm'
                placeholder='検索ワードを入力'
                value={searchTerm}
                onKeyDown={handleKeyDown}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className='w-1/3 lg:w-1/6'>
              <Button
                className='text-sm'
                title='検索'
                onClick={filterProducts}
              />
            </div>
          </div>
          <div className='overflow-x-scroll h-5/6'>
            <ul role="list" className="divide-y divide-gray-100 transition">
              {filteredProducts.map((product) => (
                <li
                  key={product.id}
                  onClick={() => handleShopifyClick(product.id)}
                  className={product === selectedShopifyItem ? "bg-gray-200" : "bg-white"}
                >
                  <ProductItem
                    image={product.images[0]?.src}
                    title={product.title}
                    price={"¥" + product.variants[0].price}
                    created_at={product.created_at}
                    updated_at={product.updated_at}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className='col-span-4 h-screen bg-gray px-2 bg-slate-300'>
          <div className='flex mt-3  gap-x-3 items-baseline'>
            <div className='w-3/5 text-right font-semibold'>
              eBay 商品一覧
            </div>
            {ebayItems ? (
              <div className='text-left text-xs'>
                検索結果：{ebayItems?.length + "件"}
              </div>

            ) : null
            }
          </div>
          <div className='flex items-center w-full gap-x-2'>
            <div className='w-2/3 lg:w-5/6'>
              <InputField
                className='my-2 text-sm'
                placeholder='検索ワードを入力'
                value={queryTerm}
                onKeyDown={handleKeyDownEbay}
                onChange={(e) => setQueryTerm(e.target.value)}
              />
            </div>
            <div className='w-1/3 lg:w-1/6'>
              <Button
                className='text-sm'
                title='検索'
                onClick={fetchItems}
              />
            </div>
          </div>
          <div className='overflow-x-scroll h-5/6'>
            <ul role="list" className="divide-y divide-gray-100 transition">
              {ebayItems?.map((item) => (
                <li
                  key={item.itemId}
                  onClick={() => handleEbayClick(item.itemId)}
                  className={item === selectedEbayItem ? "bg-gray-200" : "bg-white"}
                >
                  <ProductItem
                    image={item.galleryURL}
                    title={item.title}
                    price={item.sellingStatus.currentPrice._currencyId + " " + item.sellingStatus.currentPrice.value}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className='col-span-4 h-screen'>
          <div className='grid justify-items-center w-full'>
            <div className='p-2 text-xs text-center font-bold'>
              Shopify 選択アイテム
            </div>
            <div className='grid justify-items-center'>
              {selectedShopifyItem ? (
                <>
                  <div className='h-56 w-72'>
                    <ShopifySlider
                      images={selectedShopifyItem?.images}
                    />
                  </div>
                  <div className='flex pt-1 gap-x-3'>
                    <p className='inline-flex items-center'>在庫: </p>
                    <Incrementer quantity={selectedShopifyItem?.variants[0].inventory_quantity}/>
                    <Button
                      className='text-xs inline-flex bg-green-800 hover:bg-green-700 transition-colors'
                      title='保存'
                      onClick={updateQuantity}
                    />
                  </div>
                </>
              ) : null}
            </div>
          </div>
          <div className='pt-2 border-b border-slate-300' />
          <div className='grid justify-items-center'>
            <div className='p-2 text-xs text-center font-bold'>
              eBay 選択アイテム
            </div>
            <div className='grid justify-items-center'>
              {ebayItemDetails ? (
                <>
                  <div className='h-56 w-72'>
                    <EbaySlider
                      images={ebayItemDetails['PictureDetails']['PictureURL']}
                    />
                  </div>
                  <div className='pt-1 text-blue-700 underline'>
                    <Link
                      href={{
                        pathname: '/seller',
                        query: { eBayItem : JSON.stringify(ebayItemDetails)}
                      }}
                      target="_blank"
                      className='text-sm'
                    >
                      出品準備
                    </Link>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </section>
      </div >
      {showModal ? (
				<>
					<Modal
						title="在庫状況の変更"
						msg={`在庫を ${selectedShopifyItem?.variants[0].inventory_quantity} → ${stock} に変更しますか？`}
						confirmBtn="はい"
						cancelBtn="キャンセル"
						onConfirm={onConfirm}
						onCancel={onCancel}
					/>
				</>
			) : null}
    </>

  )
}


export async function getServerSideProps() {
  const res = await fetch('http://localhost:8000/api/products')
  const data = await res.json()

  return {
    props: {
      products: data
    }
  }
}
