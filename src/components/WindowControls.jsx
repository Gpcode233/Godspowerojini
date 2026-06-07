import useWindowStore from '#store/window'
import React from 'react'

const WindowControls = ({ target }) => {
    const { closeWindow, minimizeWindow, toggleMaximizeWindow } = useWindowStore();

    return (
        <div id="window-controls" role="group" aria-label="Window controls">
            <button type="button" className='close' aria-label="Close window" onClick={() => closeWindow(target)} />
            <button type="button" className='minimize' aria-label="Minimize window" onClick={() => minimizeWindow(target)} />
            <button type="button" className='maximize' aria-label="Maximize window" onClick={() => toggleMaximizeWindow(target)} />
        </div>
    )
}

export default WindowControls
