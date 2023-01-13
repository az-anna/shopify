import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { useDebounce } from '../utils/hooks'
import InputField from '../components/InputField'
import Button from '../components/Button'
import { convertCompilerOptionsFromJson, forEachChild } from 'typescript'

export default function Home({ data }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredProducts, setFilteredProducts] = useState(data)
  function fitlerObjects(objects, terms, key) {
    let filtered = objects;
    for (let term in terms) {
      filtered.filter(item => item[key].includes(term))
    }
    return filtered
  }
  function filterProducts() {
    const queryTerms = searchTerm.replace('　', ' ').split(' ')
    let filtered = data
    queryTerms.forEach((query) => {
      filtered = filtered.filter(item => item.handle.includes(query))
    })
    setFilteredProducts(filtered)
  }
  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      filterProducts()
    }
  }
  function getModal(e){
    console.log(e.target.value)
  }
  console.log(data[0].images[0].src)
  return (
    <>
      <div className='m-3 grid grid-cols-12 items-start gap-x-4'>
        <section className='col-span-4'>
          <div className='font-bold'>
            リスニング　学校・実施年
          </div>
          <div className='flex items-center w-full gap-x-2'>
            <div className='w-5/6'>
              <InputField
                className='my-2 text-sm'
                placeholder='検索'
                value={searchTerm}
                onKeyDown={handleKeyDown}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className='w-1/6'>
              <Button
                className='text-sm'
                title='検索'
                onClick={filterProducts}
              />
            </div>
          </div>
          <div className='py-1'>
            <div
              className='flex py-2 hover:bg-gray-100 cursor-pointer'
              onClick={getModal}
              value={data[0].id}
            >
              <Image
                className='h-12 w-12 rounded'
                src={data[0].images[5].src}
                width={200}
                height={200}
                alt='sample'
              />
              <div className="ml-3">
                <p className="text-xs text-gray-800">{data[7].handle}</p>
              </div>
            </div>
          </div>

        </section>
      </div>
    </>

  )
}


export async function getServerSideProps() {
  const res = await fetch('http://localhost:8000/api/products')
  const data = await res.json()

  return { props: { data } }
}
