import { useState, useEffect, useMemo, FormEvent } from 'react';
import { withRouter, useRouter } from 'next/router';
import Table from '../components/Table';
import { Loader } from '../components/Loader';

function Stock() {
  const [isLoading, setLoading] = useState<boolean>(true)
  const [products, setProducts] = useState(null)

  async function getProducts(){
    const res = await fetch('http://localhost:8000/api/products/ebay/inventory')
    const data = await res.json()
    setProducts(data)
  }
  useEffect(() => {
    getProducts()
  }, [])
  useEffect(() => {
    if (products) {
      setLoading(false)
    }
  }, [products])

  return (
    <div className='p-5'>
      {isLoading ?
      <Loader />
      : <div>
          <Table
            title='出品終了分'
            data={products}
          />

        </div>

      }
      {/* <Loader /> */}
    </div>
  )
}

export default withRouter(Stock);