import { Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import Image from 'next/image';
import { ShopifyImage } from '../utils/types';
import { Pagination, Navigation } from 'swiper';
import 'swiper/css/pagination';


export const ShopifySlider = ({images} : {images: ShopifyImage[]}) => {
  return (
    <>
    <Swiper
      spaceBetween={0}
      slidesPerView={1}
      modules={[Pagination, Navigation]}
      speed={500}
      loop
      touchRatio={1.5}
      effect={"flip"}
      // navigation
      pagination={{ clickable: true }}
      className='w-full h-full cursor-grab'
    >

      {images?.map((image) => (
        <SwiperSlide key={image.src}>
          <Image
            src={image.src}
            fill
            alt="Project"
            className='object-contain'
            sizes="25vw"
          />
        </SwiperSlide>
      ))}
    </Swiper>
    </>
  )
}

export const EbaySlider = ({images} : {images: string[]}) => {
    Array.isArray(images) ? images = images : images = [images]
    return (
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        modules={[Pagination]}
        speed={500}
        loop={true}
        touchRatio={1.5}
        effect={"flip"}
        pagination={{ clickable: true }}
        className='w-full h-full cursor-grab'
      >
        <i className='icon-arrow-long-right review-swiper-button-next'></i>
        {images.map((image) => (
          <SwiperSlide key={image}>
            <Image
              src={image}
              fill
              alt="Project"
              className='object-contain'
              sizes="25vw"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    )
  }

