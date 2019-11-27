import React, {useState} from 'react';
import {Div, PanelSpinner, FixedLayout, Gallery, Button, Panel, Checkbox, Link} from '@vkontakte/vkui';

import slides from './slides';

import {withAppContext} from '../../Contexts/AppContext';

import './Welcome.scss';
import {AGREEMENT, PRIVACY_POLICY} from '../../Constants/links';

const Welcome = ({id, startApp, appContext}) => {

  const {isAppDataFetching} = appContext.state;

  const [slideIndex, setSlideIndex] = useState(0);
  const [agreement, setAgreement] = useState(false);
  const [privacy, setPrivacy] = useState(false);

  const next = () => slideIndex !== slides.length - 1 ? setSlideIndex(slideIndex + 1) : startApp();

  return (
    <Panel id={id} theme='white'>
      {
        isAppDataFetching ? <>
          <div className='welcome'>
            <Gallery
              slideWidth='100%'
              slideIndex={slideIndex}
              onChange={slideIndex => setSlideIndex(slideIndex)}
              style={{height: '100%'}}
              bullets='dark'
            >
              {
                slides.map((slide, index) =>
                  <div
                    key={index}
                    className='welcome__slide'
                  >
                    <img className='welcome__image' src={slide} alt=''/>
                  </div>
                )
              }
            </Gallery>
          </div>
          <FixedLayout vertical='bottom'>
            <Div style={{marginBottom: -15}}>
              {
                slideIndex === slides.length - 1 &&
                <div className='welcome-checkbox__wrapper'>
                  <Checkbox
                    onChange={() => setAgreement(!agreement)}
                  >
                    <div className='welcome-checkbox__text'>
                      Я согласен на <br/> <Link href={AGREEMENT} target='_blank'>обработку персональных данных</Link>
                    </div>
                  </Checkbox>
                  <Checkbox
                    onChange={() => setPrivacy(!privacy)}
                  >
                    <div className='welcome-checkbox__text'>
                      Я ознакомлен с <br/> <Link href={PRIVACY_POLICY} target='_blank'>пользовательским соглашением</Link>
                    </div>
                  </Checkbox>
                </div>
              }
              <div className='welcome__button'>
                <Button
                  size='xl'
                  onClick={next}
                  style={
                    (slideIndex === slides.length - 1 && (!agreement || !privacy)) ? {
                      opacity: 0.5,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    } : {}
                  }
                >
                  {slideIndex === slides.length - 1 ? 'Начать' : 'Далее'}
                </Button>
              </div>
            </Div>
          </FixedLayout>
        </> : <PanelSpinner/>
      }
    </Panel>
  )
};

export default withAppContext(Welcome);
