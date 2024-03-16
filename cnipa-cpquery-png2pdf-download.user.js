// ==UserScript==
// @name         cpquery 图片下载并生成PDF
// @namespace    http://tampermonkey.net/
// @version      1.1 （2024-03-09）
// @description  下载cpquery.cponline.cnipa.gov.cn上的多PNG格式的文档并合并为PDF下载
// @author       Lancer1911
// @match        *://cpquery.cponline.cnipa.gov.cn/*
// @grant        none
// @icon         https://cpquery.cponline.cnipa.gov.cn/favicon.ico
// ==/UserScript==

/*
#   .____                                     ____ ________  ____ ____ 
#   |    |   _____    ____   ____  __________/_   /   __   \/_   /_   |
#   |    |   \__  \  /    \_/ ___\/ __ \_  __ \   \____    / |   ||   |
#   |    |___ / __ \|   |  \  \__\  ___/|  | \/   |  /    /  |   ||   |
#   |_______ (____  /___|  /\___  >___  >__|  |___| /____/   |___||___|
#           \/    \/     \/     \/    \/                               
*/

(async function() {
    'use strict';

    // 动态加载 jsPDF
    async function loadJsPDF() {
        if (typeof window.jspdf === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.3.1/jspdf.umd.min.js';
            document.body.appendChild(script);
            await new Promise(resolve => script.onload = resolve);
        }
        return window.jspdf.jsPDF;
    }

    // 为指定的父级元素添加下载按钮
    async function addDownloadButtonToParent(parent) {
        if (parent.querySelector('.downloadAndGeneratePDFButton')) return;

        const button = document.createElement('button');
        button.innerText = '下载图片并生成PDF';
        button.className = 'downloadAndGeneratePDFButton';
        button.style = `position: absolute; right: 10px; top: 10px;
                        padding: 5px; font-size: 16px; color: #fff;
                        background-color: rgba(52, 152, 219, 0.7);
                        border: none; border-radius: 5px; cursor: pointer; z-index: 1000;`;

        if (getComputedStyle(parent).position === 'static') {
            parent.style.position = 'relative';
        }

        parent.appendChild(button);

        button.addEventListener("click", async function() {
            const jsPDF = await loadJsPDF();
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imageDivs = document.querySelectorAll(".el-image");
            const imageUrls = Array.from(imageDivs).map(div => div.querySelector("img").src);

            let promises = imageUrls.map(url => fetch(url).then(response => response.blob()));

            Promise.all(promises).then(blobs => {
                let loadImagesPromises = blobs.map(blob => {
                    return new Promise((resolve) => {
                        let reader = new FileReader();
                        reader.onload = function(e) {
                            resolve(e.target.result);
                        };
                        reader.readAsDataURL(blob);
                    });
                });

                Promise.all(loadImagesPromises).then(images => {
                    images.forEach((imgData, index) => {
                        if (index > 0) doc.addPage();
                        const imgProps = doc.getImageProperties(imgData);
                        const imgWidth = imgProps.width;
                        const imgHeight = imgProps.height;
                        const pageWidth = doc.internal.pageSize.getWidth();
                        const pageHeight = doc.internal.pageSize.getHeight();
                        const ratio = imgWidth / imgHeight;
                        let newWidth, newHeight;
                        if (ratio > 1) {
                            newWidth = pageWidth;
                            newHeight = newWidth / ratio;
                        } else {
                            newHeight = pageHeight;
                            newWidth = newHeight * ratio;
                        }
                        doc.addImage(imgData, 'PNG', 0, 0, newWidth, newHeight);
                    });
                    doc.save('downloaded-images.pdf');
                });
            });
        });
    }

    setInterval(() => {
        const elImageDivs = document.querySelectorAll('.el-image');
        elImageDivs.forEach(div => {
            const parentDiv = div.parentNode;
            if (parentDiv) addDownloadButtonToParent(parentDiv);
        });
    }, 1000);
})();
