import { useState, useEffect, useMemo, FormEvent } from 'react';
import { withRouter, useRouter } from 'next/router';
import Table from '../components/Table';
import { Loader } from '../components/Loader';

function Stock() {
  const [products, setProducts] = useState(null)

  async function getProducts() {
    const res = await fetch('http://127.0.0.1:8000/api/products/ebay/inventory')
    const data = await res.json()
    setProducts(data)
  }
  useEffect(() => {
    getProducts()
  }, [])

  return (
    <div className='p-5'>
      {products ?
        <div>
          <Table
            title='出品終了分'
            data={products}
          />
        </div>
        : <Loader />
      }
    </div>
  )
}

export default withRouter(Stock);