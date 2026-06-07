import React, { useLayoutEffect, useRef } from 'react'
import useWindowStore from '#store/window';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

const WindowWrapper = (Component, windowKey) => {

    const Wrapped = (props) => {
        const { focusWindow, windows } = useWindowStore();
        const { isOpen, isMinimized, isMaximized, zIndex } = windows[windowKey];
        const isVisible = isOpen && !isMinimized;
        const ref = useRef(null);

        useGSAP(() => {
            const el = ref.current;
            if (!el || !isVisible) return;

            el.style.display = 'block';

            gsap.fromTo(el, { scale: 0.85, opacity: 0, y: 24 },
                { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' })

            return () => {
                el.style.display = 'none';
            }
        }, [isVisible]);

        useGSAP(() => {
            const el = ref.current;
            if (!el) return;

            // Drag only from the window header — keeps inputs/textareas functional
            const header = el.querySelector('#window-header');
            const [instance] = Draggable.create(el, {
                trigger: header ?? el,
                onPress: () => focusWindow(windowKey),
                enabled: !isMaximized,
            });

            const rightHandle = el.querySelector('.resize-handle-right');
            const leftHandle = el.querySelector('.resize-handle-left');
            const bottomHandle = el.querySelector('.resize-handle-bottom');

            const resizeRight = rightHandle ? Draggable.create(rightHandle, {
                type: 'x',
                onPress: e => e.stopPropagation(),
                onDrag: function () {
                    gsap.set(el, { width: el.offsetWidth + this.deltaX });
                }
            })[0] : null;

            const resizeLeft = leftHandle ? Draggable.create(leftHandle, {
                type: 'x',
                onPress: e => e.stopPropagation(),
                onDrag: function () {
                    gsap.set(el, {
                        width: el.offsetWidth - this.deltaX,
                        x: el._gsap.x + this.deltaX
                    });
                }
            })[0] : null;

            const resizeBottom = bottomHandle ? Draggable.create(bottomHandle, {
                type: 'y',
                onPress: e => e.stopPropagation(),
                onDrag: function () {
                    gsap.set(el, { height: el.offsetHeight + this.deltaY });
                }
            })[0] : null;

            return () => {
                instance.kill();
                if (resizeRight) resizeRight.kill();
                if (resizeLeft) resizeLeft.kill();
                if (resizeBottom) resizeBottom.kill();
            };

        }, [isMaximized]);

        useLayoutEffect(() => {
            const el = ref.current;
            if (!el) return;
            el.style.display = isVisible ? "block" : "none";
        }, [isVisible]);

        return <section
            id={windowKey}
            ref={ref}
            style={{
                zIndex,
                display: 'flex',
                flexDirection: 'column'
            }}
            className={isMaximized ? "absolute window-maximized" : "absolute"}
        >
            <Component {...props} />
            <div className="resize-handle resize-handle-right"></div>
            <div className="resize-handle resize-handle-bottom"></div>
            <div className="resize-handle resize-handle-left"></div>
        </section>
    };

    Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || 'Component'})`;

    return Wrapped;
}

export default WindowWrapper
