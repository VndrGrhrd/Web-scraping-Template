'use strict'

const os = require('node:os')
const path = require('node:path');
const { remote } = require('webdriverio')
const { exec } = require('node:child_process')
const { nativate } = require('./common/utils.js')
const TEMP_DIR = path.join(os.tmpdir(), 'webScraping')
const Worker = require('./launcher/worker.js')
const { writeFileSync } = require('node:fs')

class InitWio {

    get firefoxCapabilities() {
        return {
            browserName: 'firefox',
            'moz:firefoxOptions': {
                args: ['-start-maximized'],
                prefs: {
                    'browser.download.folderList': 2,
                    'browser.download.dir': TEMP_DIR,
                    'browser.helperApps.neverAsk.saveToDisk': 'application/pdf',
                    'pdfjs.disabled': true
                }
            }
        }
    }

    get chromeCapabilities() {
        return {
            browserName: 'chrome',
            'goog:chromeOptions': {
                args: ['-start-maximized'],
                prefs: {
                    'download.default_directory': TEMP_DIR,
                    'download.prompt_for_download': false, // Desative a solicitação de download
                    'download.directory_upgrade': true, // Use o diretório de download definido sem solicitar confirmação
                    'plugins.always_open_pdf_externally': true, // Faça o download de PDFs automaticamente em vez de abri-los
                }
            }
        }
    }

    async initBrowser() {
        exec(`mkdir ${TEMP_DIR}`)

        global.browser = await remote({ capabilities: this.firefoxCapabilities })
        await browser.maximizeWindow()

    }

    async closeBrowser() {
        exec(`rm -rf ${TEMP_DIR}/*`)

        await browser.deleteSession()
        browser = null
    }

    async start(jobData) {
        try {
            await this.initBrowser()
            await nativate(jobData.uri)

            const worker = new Worker()
            const result = await worker.execute(jobData)
            writeFileSync('./jobs/result.json', JSON.stringify(result, null, 2))

            await this.closeBrowser()
        } catch (error) {
            await this.closeBrowser()
            throw error
        }
    }
}
module.exports = InitWio