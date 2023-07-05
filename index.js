import './style';
import React from 'react';
import ReactDOM from 'react-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';
import BezierEasing from 'bezier-easing';

/* Slides data
-------------------------------------------------------------- */
const roadsterFloorImg =
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1780138/roadster-floor.png',
  roadsterImg =
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1780138/roadster-car.png',
  truckFloorImg =
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1780138/truck-floor.png',
  truckImg =
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1780138/truck-car.png';

const slides = [
  {
    id: 1,
    name: 'Model S',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et ',
    color: '#0047fd',
    imgFloorUrl: truckFloorImg,
    imgUrl: truckImg,
    topSpeed: 75,
    mph: 4.5,
    mileRange: 400,
    bckgHeight: 300,
    carShadowHeight: 300,
    shadowOpacity: 0.2,
  },
  {
    id: 2,
    name: 'Model X',
    desc: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    color: '#ee0101',
    imgFloorUrl: roadsterFloorImg,
    imgUrl: roadsterImg,
    topSpeed: 255,
    mph: 3,
    mileRange: 520,
    bckgHeight: 250,
    carShadowHeight: 0,
    shadowOpacity: 0.5,
  },
  {
    id: 3,
    name: 'Model 3',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et ',
    color: '#0047fd',
    imgFloorUrl: truckFloorImg,
    imgUrl: truckImg,
    topSpeed: 55,
    mph: 6,
    mileRange: 550,
    bckgHeight: 300,
    carShadowHeight: 250,
    shadowOpacity: 0.2,
  },
  {
    id: 4,
    name: 'Roadster',
    desc: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    color: '#ee0101',
    imgFloorUrl: roadsterFloorImg,
    imgUrl: roadsterImg,
    topSpeed: 250,
    mph: 1.9,
    mileRange: 620,
    bckgHeight: 340,
    carShadowHeight: 150,
    shadowOpacity: 0.5,
  },
  {
    id: 5,
    name: 'Semi truck',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
    color: '#0047fd',
    imgFloorUrl: truckFloorImg,
    imgUrl: truckImg,
    topSpeed: 65,
    mph: 5,
    mileRange: 500,
    bckgHeight: 390,
    carShadowHeight: 400,
    shadowOpacity: 0.2,
  },
];

/* Set CSS Variables
 */
class SetCSSVariables extends React.Component {
  static PropTypes = {
    cssVariables: PropTypes.object.isRequired,
    className: PropTypes.string,
  };

  componentWillReceiveProps(props) {
    Object.keys(props.cssVariables).forEach(function (key) {
      document.documentElement.style.setProperty(key, props.cssVariables[key]);
    });
  }

  render() {
    return this.props.children;
  }
}

/* Slide aside
    -------------------------------------------------------------- */

function SlideAside(props) {
  const activeCar = props.activeCar;
  return (
    <div className="tesla-slide-aside">
      <h1 className="tesla-slide-aside__wholename">
        <span>Tesla</span>
        <TransitionGroup component="span" className="tesla-slide-aside__name">
          <CSSTransition
            key={activeCar.name}
            timeout={{ enter: 800, exit: 1000 }}
            className="tesla-slide-aside__name-part"
            classNames="tesla-slide-aside__name-part-"
            mountOnEnter={true}
            unmountOnExit={true}
          >
            <span>{activeCar.name}</span>
          </CSSTransition>
        </TransitionGroup>
      </h1>
      <TransitionGroup className="tesla-slide-aside__desc">
        <CSSTransition
          key={activeCar.desc}
          timeout={{ enter: 900, exit: 1200 }}
          className="tesla-slide-aside__desc-text"
          classNames="tesla-slide-aside__desc-text-"
          mountOnEnter={true}
          unmountOnExit={true}
        >
          <p>{activeCar.desc}</p>
        </CSSTransition>
      </TransitionGroup>

      <div className="tesla-slide-aside__button">
        <button className="button">Reserve now</button>

        <TransitionGroup>
          <CSSTransition
            key={activeCar.color}
            timeout={{ enter: 800, exit: 1000 }}
            mountOnEnter={true}
            unmountOnExit={true}
            classNames="button__border-"
          >
            <SetCSSVariables cssVariables={{ '--btn-color': activeCar.color }}>
              <span className="button__border" />
            </SetCSSVariables>
          </CSSTransition>
        </TransitionGroup>
      </div>
    </div>
  );
}

SlideAside.PropTypes = {
  activeCar: PropTypes.object.isRequired,
};

/* Slide animate values
    -------------------------------------------------------------- */

function animate(render, duration, easing, next = () => null) {
  const start = Date.now();

  (function loop() {
    const current = Date.now(),
      delta = current - start,
      step = delta / duration;

    if (step > 1) {
      render(1);
      next();
    } else {
      requestAnimationFrame(loop);
      render(easing(step * 2));
    }
  })();
}

const myEasing = BezierEasing(0.4, -0.7, 0.1, 1.5);

class AnimValue extends React.Component {
  static defaultProps = {
    delay: 0,
    duration: 800,
    transformFn: (value) => Math.floor(value),
  };

  node = null;
  timeout = null;

  animate(previousValue, newValue, applyFn) {
    window.clearTimeout(this.timeout);

    const diff = newValue - previousValue;
    const renderFunction = (step) => {
      this.timeout = setTimeout(() => {
        applyFn(
          this.props.transformFn(previousValue + diff * step, step),
          step
        );
      }, this.props.delay);
    };

    animate(renderFunction, this.props.duration, myEasing);
  }

  setValue = (value, step) => {
    if (!this.node) {
      return;
    }

    if (step === 1) {
      this.node.style.opacity = 1;
    } else {
      this.node.style.opacity = 0.7;
    }

    this.node.innerHTML = value;
  };

  componentDidMount() {
    this.animate(0, this.props.value, this.setValue);
  }

  componentWillReceiveProps(props) {
    let previousValue = this.props.value;

    if (previousValue !== props.value) {
      this.animate(previousValue, props.value, this.setValue);
    }
  }

  componentWillUnmount() {
    window.clearTimeout(this.timeout);
    this.timeout = null;
  }

  render() {
    return (
      <span
        className={this.props.className}
        children="0"
        ref={(node) => (this.node = node)}
      />
    );
  }
}

class AnimateValue extends React.Component {
  render() {
    return (
      <AnimValue
        className={this.props.className}
        delay={this.props.delay}
        value={this.props.value}
        transformFn={(value, step) =>
          step === 1
            ? value % 1 != 0
              ? value.toFixed(1)
              : value
            : Math.abs(Math.floor(value))
        }
      />
    );
  }
}

let DELAY_TOP_SPEED = 200,
  DELAY_MPH = 700,
  DELAY_MILE_RANG = 1200;

class SlideParams extends React.Component {
  static PropTypes = {
    activeCar: PropTypes.object.isRequired,
    animationForward: PropTypes.bool.isRequired,
  };

  componentWillReceiveProps(props) {
    if (!props.animationForward) {
      DELAY_TOP_SPEED = 1200;
      DELAY_MILE_RANG = 200;
    } else {
      DELAY_TOP_SPEED = 200;
      DELAY_MILE_RANG = 1200;
    }
  }

  render() {
    const { activeCar } = this.props;

    return (
      <div className="tesla-slide-params">
        <ul className="tesla-slide-params__list">
          <li className="tesla-slide-params__item">
            <div className="tesla-slide-params__wrapper">
              <span className="tesla-slide-params__prefix">+</span>
              <AnimateValue
                className="tesla-slide-params__value"
                value={activeCar.topSpeed}
                delay={DELAY_TOP_SPEED}
              />
              <span className="tesla-slide-params__sufix">mph</span>
            </div>

            <p className="tesla-slide-params__name">Top speed</p>
          </li>

          <li className="tesla-slide-params__item">
            <div className="tesla-slide-params__wrapper">
              <AnimateValue
                className="tesla-slide-params__value"
                value={activeCar.mph}
                delay={DELAY_MPH}
              />
              <span className="tesla-slide-params__sufix">s</span>
            </div>
            <p className="tesla-slide-params__name">0-60 mph</p>
          </li>

          <li className="tesla-slide-params__item">
            <div className="tesla-slide-params__wrapper">
              <AnimateValue
                className="tesla-slide-params__value"
                value={activeCar.mileRange}
                delay={DELAY_MILE_RANG}
              />
              <span className="tesla-slide-params__sufix">mi</span>
            </div>
            <p className="tesla-slide-params__name">Mile Range</p>
          </li>
        </ul>
      </div>
    );
  }
}

class Slide extends React.Component {
  static PropTypes = {
    activeSlide: PropTypes.object.isRequired,
    animationForward: PropTypes.bool.isRequired,
    setAnimationState: PropTypes.func.isRequired,
    ANIMATION_PHASES: PropTypes.object.isRequired,
  };

  handleEnter = (e) => {
    this.props.setAnimationState(this.props.ANIMATION_PHASES.STOP);
  };

  render() {
    const { activeSlide, animationForward } = this.props;

    return (
      <div
        className={`tesla-slide ${
          animationForward ? 'animation-forward' : 'animation-back'
        }`}
      >
        <SlideAside activeCar={activeSlide} />

        <TransitionGroup>
          <CSSTransition
            key={activeSlide.name}
            timeout={{ enter: 800, exit: 1000 }}
            classNames="tesla-slide__bckg-"
            mountOnEnter={true}
            unmountOnExit={true}
          >
            <SetCSSVariables
              cssVariables={{
                '--car-color': activeSlide.color,
                '--bckg-height': activeSlide.bckgHeight + 'px',
                '--shadow-opacity': activeSlide.shadowOpacity,
                '--car-shadow-height': activeSlide.carShadowHeight + 'px',
              }}
            >
              <div className="tesla-slide__bckg">
                <div className="tesla-slide__bckg-fill" />
              </div>
            </SetCSSVariables>
          </CSSTransition>
        </TransitionGroup>

        <TransitionGroup>
          <CSSTransition
            key={activeSlide.name}
            timeout={{ enter: 700, exit: 1200 }}
            classNames="tesla-slide__img-"
            mountOnEnter={true}
            unmountOnExit={true}
            onEntered={this.handleEnter}
          >
            <div className="tesla-slide__img">
              <img
                className="tesla-slide__img-floor"
                src={activeSlide.imgFloorUrl}
                alt=""
              />
              <img
                className="tesla-slide__img-car"
                src={activeSlide.imgUrl}
                alt=""
              />
            </div>
          </CSSTransition>
        </TransitionGroup>

        <SlideParams
          activeCar={activeSlide}
          animationForward={animationForward}
        />
      </div>
    );
  }
}

class SliderNavigation extends React.Component {
  static PropTypes = {
    setActiveSlide: PropTypes.func.isRequired,
    carsNames: PropTypes.array.isRequired,
  };

  render() {
    return (
      <div className="tesla-slider-navigation">
        <ul className="tesla-slider-navigation__list">
          {this.props.carsNames.map((car) => (
            <li key={car.id} className="tesla-slider-navigation__item">
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  this.props.setActiveSlide(this.props.carsNames.indexOf(car));
                }}
                className={`tesla-slider-navigation__link ${
                  this.props.carsNames[this.props.activeSlide] === car
                    ? 'tesla-slider-navigation__link--active'
                    : ''
                }`}
                style={{
                  color:
                    this.props.carsNames[this.props.activeSlide] === car
                      ? car.color
                      : '',
                }}
              >
                {car.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

const logoTesla =
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1780138/logoTesla.svg',
  mouseImg = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1780138/mouse.svg',
  hamburger =
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1780138/hamburger.svg';

/* Slider
    -------------------------------------------------------------- */

const ANIMATION_PHASES = {
  PENDING: 'PENDING',
  STOP: 'STOP',
};

class Slider extends React.Component {
  state = {
    activeSlide: 0,
    animationForward: true,
    slidesCount: slides.length,
    animationState: null,
  };

  slider = {
    header: '',
    content: '',
  };

  componentDidMount() {
    this.setState({
      activeSlide: 3,
    });
    this.setAnimationState(ANIMATION_PHASES.PENDING);

    this.slider.header = document.querySelector('.tesla-header');
    this.slider.content = document.querySelector('.tesla-slider');

    document.body.addEventListener('wheel', this.handleScroll);
  }

  setAnimationState = (animationState) => this.setState({ animationState });

  setActiveSlide = (slideId) => {
    this.setState({
      activeSlide: slideId,
      animationForward: this.state.activeSlide < slideId ? true : false,
    });

    this.setAnimationState(ANIMATION_PHASES.PENDING);
  };

  timeout = null;

  handleScroll = (e) => {
    let sliderHeight = this.slider.content.clientHeight,
      headerHeight = this.slider.header.clientHeight;

    if (window.innerHeight < sliderHeight + headerHeight) {
      return; // do not handle scroll effect when window height is smaller than slider plus header height
    }

    e.preventDefault();

    window.clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      if (e.deltaY < 0 && this.state.activeSlide !== 0) {
        this.setActiveSlide(this.state.activeSlide - 1);
      }
      if (
        e.deltaY > 0 &&
        this.state.activeSlide !== this.state.slidesCount - 1
      ) {
        this.setActiveSlide(this.state.activeSlide + 1);
      }
    }, 50);
  };

  componentWillUnmount() {
    document.body.removeEventListener('wheel', this.handleScroll);
    window.clearTimeout(this.timeout);
    this.timeout = null;
  }

  render() {
    return (
      <div className="tesla-slider">
        <SliderNavigation
          activeSlide={this.state.activeSlide}
          setActiveSlide={this.setActiveSlide}
          carsNames={slides.map((slide) => ({
            id: slide.id,
            name: slide.name,
            color: slide.color,
          }))}
        />

        <Slide
          animationForward={this.state.animationForward}
          activeSlide={slides[this.state.activeSlide]}
          animationState={this.state.animationState}
          setAnimationState={this.setAnimationState}
          ANIMATION_PHASES={ANIMATION_PHASES}
        />

        <div className="tesla-slider__scroll">
          <img src={mouseImg} alt="" />
        </div>
      </div>
    );
  }
}

/* Header
    -------------------------------------------------------------- */
function Header() {
  return (
    <div className="tesla-header">
      <div className="tesla-header__logo">
        <img src={logoTesla} alt="" />
      </div>
      <div className="tesla-header__nav">
        <img src={hamburger} alt="" />
      </div>
    </div>
  );
}

/* App
    -------------------------------------------------------------- */
class App extends React.Component {
  render() {
    return (
      <div className="container">
        <Header />
        <Slider />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
