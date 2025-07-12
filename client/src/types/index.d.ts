declare module 'react-typewriter-effect';
declare module 'react-scroll';
declare module 'react-slick' {
  import * as React from 'react';
  
  export interface Settings {
    accessibility?: boolean;
    adaptiveHeight?: boolean;
    afterChange?(currentSlide: number): void;
    appendDots?(dots: React.ReactNode): JSX.Element;
    arrows?: boolean;
    asNavFor?: any;
    autoplay?: boolean;
    autoplaySpeed?: number;
    beforeChange?(currentSlide: number, nextSlide: number): void;
    centerMode?: boolean;
    centerPadding?: string;
    className?: string;
    cssEase?: string;
    customPaging?(i: number): JSX.Element;
    dots?: boolean;
    dotsClass?: string;
    draggable?: boolean;
    easing?: string;
    edgeFriction?: number;
    fade?: boolean;
    focusOnSelect?: boolean;
    infinite?: boolean;
    initialSlide?: number;
    lazyLoad?: 'ondemand' | 'progressive';
    nextArrow?: JSX.Element;
    onEdge?(swipeDirection: string): void;
    onInit?(): void;
    onLazyLoad?(slidesToLoad: number[]): void;
    onReInit?(): void;
    onSwipe?(swipeDirection: string): void;
    pauseOnDotsHover?: boolean;
    pauseOnFocus?: boolean;
    pauseOnHover?: boolean;
    prevArrow?: JSX.Element;
    responsive?: ResponsiveObject[];
    rows?: number;
    rtl?: boolean;
    slide?: string;
    slidesPerRow?: number;
    slidesToScroll?: number;
    slidesToShow?: number;
    speed?: number;
    swipe?: boolean;
    swipeEvent?(event: React.TouchEvent): void;
    swipeToSlide?: boolean;
    touchMove?: boolean;
    touchThreshold?: number;
    useCSS?: boolean;
    useTransform?: boolean;
    variableWidth?: boolean;
    vertical?: boolean;
    verticalSwiping?: boolean;
    waitForAnimate?: boolean;
  }
  
  interface ResponsiveObject {
    breakpoint: number;
    settings: "unslick" | Settings;
  }
  
  export default class Slider extends React.Component<Settings> {
    slickGoTo(slideNumber: number, dontAnimate?: boolean): void;
    slickNext(): void;
    slickPause(): void;
    slickPlay(): void;
    slickPrev(): void;
    slickGoTo(index: number): void;
  }
}