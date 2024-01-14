'use strict'

const { pdfToText } = require("../../common/utils")

class GetDocument {

    async execute(filesPath) {
        const texContent = await pdfToText(filesPath.pdfpath)
        return this.pdfMatch(texContent)

    }

    pdfMatch(text) {
        let status = ''
        let message = ""

        switch (true) {
            case this.regexTest('REGEX TO SEARCH IN PDF', text):
                status = 'NEGATIVE'
                message = "No Records Found"
                break;

            case this.regexTest('REGEX TO SEARCH IN PDF', text):
                status = "POSITIVE"
                message = "Found Records"
                break

            default:
                throw "Type not found, return to Developer"
        }

        return {
            notation: status,
            analisys: message
        }
    }

    regexTest(regex, text) { return new RegExp(regex, 'gmi').test(text.toUpperCase()) }


}
module.exports = new GetDocument()