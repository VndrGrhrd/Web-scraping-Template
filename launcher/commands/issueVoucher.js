'use strict'

const Utils = require("../../common/utils")


class IssueVoucher {

    async execute(params) {
        /*     Your code to interact with and search on the web page
        await Utils.clickField('#seletorCSS')
        await Utils.setFieldValue('#seletorCSS', params.federalDoc)
        await Utils.selectByValue('#seletorCSS', params.type)
        const pdfFile = Utils.waitDownloadDocument()
        await Utils.clickField('#seletorCSS')

        return {
            pdfFile: await pdfFile
        } */

        return {
            pdfFile: "./document.pdf"
        }

    }

}
module.exports = new IssueVoucher()