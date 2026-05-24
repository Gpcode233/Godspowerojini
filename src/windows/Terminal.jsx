import { techStack } from '#constants';
import WindowWrapper from '#hoc/WindowWrapper';
import WindowControls from '#components/WindowControls';
import useWindowStore from '#store/window';
import { Check, Flag } from 'lucide-react';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Line wrapper: each line gets a white mask + block cursor overlaid
const Line = ({ as: Tag = 'div', children, className = '' }) => (
    <Tag className={`t-line ${className}`} style={{ position: 'relative' }}>
        {children}
        <div className="t-mask" />
        <div className="t-cursor" />
    </Tag>
);

const Terminal = () => {
    const { windows } = useWindowStore();
    const isOpen = windows.terminal?.isOpen;
    const contentRef = useRef(null);
    const tlRef = useRef(null);

    useGSAP(() => {
        const el = contentRef.current;
        if (!el) return;

        // Kill any running animation + deferred call
        if (tlRef.current) {
            tlRef.current.kill();
            tlRef.current = null;
        }

        const lines = el.querySelectorAll('.t-line');

        if (!isOpen) {
            // Reset all lines: mask covers content, cursor hidden
            lines.forEach(line => {
                const mask = line.querySelector('.t-mask');
                const cursor = line.querySelector('.t-cursor');
                if (mask) gsap.set(mask, { x: 0 });
                if (cursor) gsap.set(cursor, { x: 0, opacity: 0 });
            });
            return;
        }

        // Terminal is w-xl = 576px. Hardcode 660 so mask ALWAYS travels past
        // the right edge — no dynamic offsetWidth measurement needed.
        const TRAVEL = 660;

        const tl = gsap.timeline({ delay: 0.45 });
        tlRef.current = tl;

        lines.forEach(line => {
            const mask   = line.querySelector('.t-mask');
            const cursor = line.querySelector('.t-cursor');
            if (!mask || !cursor) return;

            const charCount = Math.max(8, Math.min(
                line.textContent.trim().replace(/\s+/g, ' ').length,
                80
            ));

            const duration = charCount * 0.02; // 20ms per char

            tl.set(mask,   { x: 0 });
            tl.set(cursor, { x: 0, opacity: 1 });

            tl.to([mask, cursor], {
                x: TRAVEL,
                duration,
                ease: `steps(${charCount})`,
            });

            tl.set(cursor, { opacity: 0 });
        });

    }, { dependencies: [isOpen] });

    return (
        <>
            <div id='window-header'>
                <WindowControls target="terminal" />
                <h2>Terminal - Tech Stack</h2>
            </div>

            <div className='techstack' ref={contentRef}>

                <Line as="p">
                    <span className="font-bold">@Godspower % </span>
                    npm show tech-stack
                </Line>

                <Line as="div" className="label">
                    <p className='w-32'>Category</p>
                    <p>Technologies</p>
                </Line>

                <ul className='content'>
                    {techStack.map(({ category, items }) => (
                        <Line as="li" key={category} className="flex items-center">
                            <Check className='check' size={20} />
                            <h3>{category}</h3>
                            <ul>
                                {items.map((item, i) => (
                                    <li key={i}>
                                        {item}{i < items.length - 1 ? ', ' : ''}
                                    </li>
                                ))}
                            </ul>
                        </Line>
                    ))}
                </ul>

                <div className='footnote'>
                    <Line as="p">
                        <Check size={20} /> 5 of 5 stacks loaded successfully (100%)
                    </Line>
                    <Line as="p" className="text-black">
                        <Flag size={15} fill='black' />
                        Render time: 6ms
                    </Line>
                </div>

            </div>
        </>
    );
};

const TerminalWindow = WindowWrapper(Terminal, 'terminal');
export default TerminalWindow;
