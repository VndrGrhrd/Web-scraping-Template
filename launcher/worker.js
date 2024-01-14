'use strict'
const getDocument = require('./commands/getDocument')
const IssueVoucher = require('./commands/issueVoucher')

class Worker {
    async execute(jobData) {
        const searchResult = await IssueVoucher.execute(jobData.params)
        const analysisResult = await getDocument.execute(searchResult)
        
        if (!analysisResult || typeof analysisResult == 'string') return this.unsuccessfully(analysisResult)
        return this.successfully(analysisResult)
    }

    successfully(result) {
        return {
            success: true,
            data: result,
            mesagem: "Web scraping completed successfully",
            operationDate: new Date().toLocaleString('pt-BR').replace(/[^\d]/gm, '')
        }
    }

    unsuccessfully(mensagem) {
        return {
            success: false,
            mesagem: mensagem || "Web scraping completed unsuccessfully",
            operationDate: new Date().toLocaleString('pt-BR').replace(/[^\d]/gm, '')
        }
    }
}
module.exports = Worker