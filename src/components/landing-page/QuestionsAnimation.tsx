import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Autoplay } from 'swiper/modules';
import { QuestionMock } from './Question';
import { mockQuestions } from './mockQuestions';


export const QuestionsAnimation = () => {
    
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <div className="w-full h-full absolute z-10">
                <div className="absolute w-full h-full bg-gradient-to-r from-color1 to-color2 opacity-30 blur-3xl"></div>
                <div className="absolute w-full h-full bg-gradient-to-r from-color2 to-color1 opacity-30 blur-3xl"></div>
                <div className="absolute w-full h-full bg-gradient-to-r from-color3 to-color4 opacity-30 blur-3xl"></div>
            </div>

            <div className='relative z-30 w-full h-full max-h-full'>
                <Swiper
                    effect={'cards'}
                    grabCursor={true}
                    loop={true}
                    slidesPerView={3}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    modules={[Autoplay, EffectCards]}
                    className="mySwiper"
                >
                    {mockQuestions.map((question, i)=> <SwiperSlide className='rounded-xl h-auto bg-color1/30 border border-color2 backdrop-blur-lg aspect-square min-w-[90%]'>
                        <QuestionMock key={i} {...question} numbering={i + 1} />
                    </SwiperSlide>)}
                </Swiper>
            </div>
        </div>
    );
};