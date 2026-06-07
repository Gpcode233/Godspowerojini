import React, { useRef } from 'react'
import { dockApps } from '#constants'
import { Tooltip } from 'react-tooltip';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import useWindowStore from '#store/window';

function Dock() {

    const { openWindow, minimizeWindow, restoreWindow, windows } = useWindowStore();
    const dockRef = useRef(null);

    useGSAP(() => {
        const dock = dockRef.current;
        if (!dock) return;

        const icons = dock.querySelectorAll('.dock-icon');

        const animateIcons = (mouseX) => {
            const { left } = dock.getBoundingClientRect();

            icons.forEach((icon) => {
                const { left: iconLeft, width } = icon.getBoundingClientRect();
                const center = iconLeft - left + width / 2;
                const distance = Math.abs(mouseX - center);

                const intensity = Math.exp(-(distance ** 2.5) / 10000);

                gsap.to(icon, {
                    scale: 1 + 0.25 * intensity,
                    y: -15 * intensity,
                    ease: "power1.out",
                    duration: 0.2,
                });
            });
        };

        const handleMouseMove = (e) => {
            const { left } = dock.getBoundingClientRect();

            animateIcons(e.clientX - left);
        };

        const resetIcons = () => icons.forEach((icon) => gsap.to(icon, {
            scale: 1,
            y: 0,
            ease: "power1.out",
            duration: 0.22,
        }));

        dock.addEventListener("mousemove", handleMouseMove);
        dock.addEventListener("mouseleave", resetIcons);

        return () => {
            dock.removeEventListener("mousemove", handleMouseMove);
            dock.removeEventListener("mouseleave", resetIcons);
        };
    }, []);

    const toggleApp = (app) => {
        if (!app.canOpen) return;

        const window = windows[app.id];

        if (!window) {
            console.error(`Window not found for app: ${app.id}`);
            return;
        }

        if (window.isMinimized) {
            restoreWindow(app.id);
        } else if (window.isOpen) {
            minimizeWindow(app.id);
        } else {
            openWindow(app.id);
        }
    };

    return (
        <section id='dock'>
            <div ref={dockRef} className='dock-container'>
                {dockApps.map(({ id, name, icon, iconClass, canOpen }) => (
                    <div key={id ?? name} className='relative flex flex-col items-center'>
                        <button
                            type='button'
                            className='dock-icon'
                            aria-label={name}
                            data-tooltip-id="dock-tooltip"
                            data-tooltip-content={name}
                            data-tooltip-delay-show="100"
                            disabled={!canOpen}
                            onClick={() => toggleApp({ id, canOpen })}
                        >
                            <img
                                src={`/images/${icon}`}
                                alt={name}
                                loading='lazy'
                                className={`w-full h-full object-contain object-center ${iconClass ?? ''} ${canOpen ? '' : 'opacity-60'}`}
                            />
                        </button>
                        {canOpen && windows[id]?.isOpen && (
                            <span className={`dock-dot ${windows[id]?.isMinimized ? 'is-minimized' : ''}`} />
                        )}
                    </div>
                ))}

                <Tooltip id="dock-tooltip" place="top" className='tooltip' />
            </div>
        </section>
    );
}

export default Dock;
