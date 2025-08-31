"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import style from "./ImageSlider.module.css";

const ImageSlider = ({ images, alt }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [enableTransition, setEnableTransition] = useState(false);
    const mountedRef = useRef(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [translateX, setTranslateX] = useState(0);
    const sliderRef = useRef(null);

    useEffect(() => {
        setEnableTransition(false);
        setCurrentIndex(0);
        setTranslateX(0);
        const id = requestAnimationFrame(() => {
            setEnableTransition(true);
            mountedRef.current = true;
        });
        return () => cancelAnimationFrame(id);
    }, [images]);

    const handleMove = useCallback(
        (clientX) => {
            if (!isDragging) return;

            const diff = clientX - startX;
            const dragPercent = (diff / (sliderRef.current?.offsetWidth || 1)) * 100;

            // 境界での制限を追加
            let boundedTranslate = dragPercent;

            // 左端の場合（currentIndex === 0）、右方向（正の値）のドラッグを制限
            if (currentIndex === 0 && dragPercent > 0) {
                boundedTranslate = Math.min(dragPercent * 0.3, 30); // 抵抗感を与える
            }

            // 右端の場合（currentIndex === images.length - 1）、左方向（負の値）のドラッグを制限
            if (currentIndex === images.length - 1 && dragPercent < 0) {
                boundedTranslate = Math.max(dragPercent * 0.3, -30); // 抵抗感を与える
            }

            // 通常の範囲制限
            const maxTranslate = 100;
            const minTranslate = -100;
            boundedTranslate = Math.max(minTranslate, Math.min(maxTranslate, boundedTranslate));

            setTranslateX(boundedTranslate);
        },
        [isDragging, startX, currentIndex, images.length]
    );

    const handleEnd = useCallback(() => {
        if (!isDragging) return;

        setIsDragging(false);
        setEnableTransition(true);

        const threshold = 20; // スライド切り替えの閾値

        // 左端での制限：currentIndex が 0 の場合、右方向（正の値）への移動は無効
        if (currentIndex === 0 && translateX > 0) {
            setTranslateX(0);
            return;
        }

        // 右端での制限：currentIndex が最後の場合、左方向（負の値）への移動は無効
        if (currentIndex === images.length - 1 && translateX < 0) {
            setTranslateX(0);
            return;
        }

        // 通常の閾値判定
        if (translateX > threshold && currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        } else if (translateX < -threshold && currentIndex < images.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }

        setTranslateX(0);
    }, [isDragging, translateX, currentIndex, images.length]);

    // グローバルイベントリスナー
    useEffect(() => {
        if (isDragging) {
            const handleGlobalMouseMove = (e) => {
                e.preventDefault();
                handleMove(e.clientX);
            };

            const handleGlobalMouseUp = (e) => {
                e.preventDefault();
                handleEnd();
            };

            document.addEventListener("mousemove", handleGlobalMouseMove);
            document.addEventListener("mouseup", handleGlobalMouseUp);

            return () => {
                document.removeEventListener("mousemove", handleGlobalMouseMove);
                document.removeEventListener("mouseup", handleGlobalMouseUp);
            };
        }
    }, [isDragging, handleMove, handleEnd]);

    if (!images || images.length === 0) {
        return null;
    }

    if (images.length === 1) {
        return (
            <div className={style.slider_container}>
                <img src={images[0]} alt={alt} className={style.single_image} />
            </div>
        );
    }

    const goToPrevious = () => {
        setEnableTransition(true);
        setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
    };

    const goToNext = () => {
        setEnableTransition(true);
        setCurrentIndex((prevIndex) => Math.min(images.length - 1, prevIndex + 1));
    };

    const handleStart = (clientX) => {
        setIsDragging(true);
        setStartX(clientX);
        setEnableTransition(false);
    };

    // マウスイベント
    const handleMouseDown = (e) => {
        e.preventDefault();
        handleStart(e.clientX);
    };

    // タッチイベント
    const handleTouchStart = (e) => {
        handleStart(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
        handleMove(e.touches[0].clientX);
    };

    const handleTouchEnd = (e) => {
        handleEnd();
    };

    const currentTransform = isDragging ? `translateX(-${currentIndex * 100 - translateX}%)` : `translateX(-${currentIndex * 100}%)`;

    return (
        <div className={style.slider_container}>
            <div className={style.slider_button_prev} onClick={goToPrevious} style={{ opacity: currentIndex > 0 ? 1 : 0, pointerEvents: currentIndex > 0 ? "auto" : "none" }}>
                <IoIosArrowBack />
            </div>

            <div className={style.slider_wrapper} ref={sliderRef} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                <div className={`${style.slider_track} ${!enableTransition ? style.noTransition : ""}`} style={{ transform: currentTransform }}>
                    {images.map((image, index) => (
                        <div key={index} className={style.slide}>
                            <img src={image} alt={`${alt} ${index + 1}`} draggable={false} />
                        </div>
                    ))}
                </div>
                <div className={style.slider_indicators}>
                    {images.map((_, index) => (
                        <div
                            key={index}
                            className={`${style.indicator} ${index === currentIndex ? style.active : ""}`}
                            onClick={() => {
                                setEnableTransition(true);
                                setCurrentIndex(index);
                            }}
                        />
                    ))}
                </div>
            </div>

            <div
                className={style.slider_button_next}
                onClick={goToNext}
                style={{ opacity: currentIndex < images.length - 1 ? 1 : 0, pointerEvents: currentIndex < images.length - 1 ? "auto" : "none" }}
            >
                <IoIosArrowForward />
            </div>
        </div>
    );
};

export default ImageSlider;
