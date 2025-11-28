import { WindowControls } from '#components'
import WindowWrapper from '#hoc/WindowWrapper'
import { Download } from 'lucide-react'
import React from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//     'pdfjs-dist/build/pdf.worker.min.mjs',
//     import.meta.url,
// ).toString();

pdfjs.GlobalWorkerOptions.workerSrc =  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Resume = () => {
    return (
        <>
            <div id='window-header'>
                <WindowControls target="resume" />
                <h2>Resume.pdf</h2>

                <a
                    href="files/Godspower-resume.pdf"
                    download className='cursor-pointer'
                    title='Download Resume'
                >
                    <Download className='icon' />
                </a>
            </div>

            <div className="flex flex-col flex-grow overflow-auto bg-white">
                <Document file="files/Godspower-resume.pdf">
                    <Page pageNumber={1} renderTextLayer renderAnnotationLayer />
                </Document>
            </div>
        </>
    )
}

const ResumeWindow = WindowWrapper(Resume, "resume")

export default ResumeWindow;