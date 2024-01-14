'use sctrict'

const TIME_TO_WAIT = 600000
const os = require('node:os')
const fs = require('node:fs')
const path = require('node:path');
const Wreck = require('@hapi/wreck');
const pdfUtil = require('pdf-to-text');
const TIMEOUT_WIO = { timeout: TIME_TO_WAIT }
const TEMP_DIR = path.join(os.tmpdir(), 'webScraping')

class Utils {

    pause(time) { return new Promise(resolve => setTimeout(resolve, time)) }

    async nativate(url) {
        let notComplete = true
        await browser.url(url)

        while (notComplete) {
            await new Promise(resolve => setTimeout(resolve, 1000))
            const state = await browser.execute('return document.readyState')
            if (state.includes('complete')) notComplete = false
        }
    }

    async clickField(field) {
        const element = await browser.$(field)
        await element.isClickable()
        await element.scrollIntoView({ block: 'center' })
        await element.click()
    }

    async clickByScript(field) {
        await this.checkVisibity(field)
        await browser.execute(`document.querySelector('${field}').click()`)
    }

    async setFieldValue(field, value) {
        await this.checkVisibity(field)
        await browser.$(field).setValue(value)
    }

    async setFieldValueTyping(field, value) {
        await this.clickField(field)
        await browser.keys(value)
    }

    async selectByValue(field, value) {
        await this.checkVisibity(field)
        await browser.$(field).selectByAttribute('value', value)
    }

    async selectByText(field, text) {
        await this.checkVisibity(field)
        await browser.$(field).selectByVisibleText(text)
    }

    async getAttribute(field, attribute) {
        await this.checkVisibity(field)
        return await browser.$(field).getAttribute(attribute)
    }

    async getTexts(field) {
        const arrTexts = []
        await this.checkVisibity(field)
        const arrElements = await browser.$$(field)
        for (const element of arrElements) {
            const text = await element.getText()
            text && arrTexts.push(text)
        }
        return arrTexts.filter(Boolean)
    }

    async getHTMLs(field) {
        const arrHTML = []
        await this.checkVisibity(field)
        const arrElements = await browser.$$(field)
        for (const element of arrElements) {
            const html = await element.getHTML()
            html && arrHTML.push(html)
        }
        return arrHTML.filter(Boolean)
    }

    async checkExisting(field) {
        await this.pause(1000)
        return await browser.$(field).isExisting()
    }

    async waitForExisting(field) {
        const command = async () => {
            return await browser.$(field).isExisting()
        }
        await browser.$(field).waitUntil(command, TIMEOUT_WIO)
    }

    async checkVisibity(field) {
        await this.pause(1000)
        if (!(await this.checkExisting(field))) return false

        await browser.$(field).isDisplayed()
        await browser.$(field).scrollIntoView({ block: 'center' })
    }

    async waitForVisible(field) {
        await browser.$(field).waitForDisplayed(TIMEOUT_WIO)
        await browser.$(field).scrollIntoView({ block: 'center' })
    }

    async pageIsComplete() {
        await this.pause(1000)
        const isComplete = await browser.execute('return document.readyState')
        console.log(`page is: `, isComplete)
        if (!isComplete.includes('complete')) return await this.pageIsComplete()
    }

    async isLoagind(field) {
        const isLoading = await this.checkVisibity(field)
        console.log('Page is: ', isLoading)
        if (isLoading) return await this.isLoagind(field)
    }

    async solverReCaptcha() {
        if (!(await this.checkExisting(this.iframeReCaptcha))) return

        const scrFrame = await this.getAttribute(this.iframeReCaptcha, 'src')
        const siteUrl = await browser.getUrl()
        const siteKey = new URL(scrFrame).searchParams.get('k')

        const taskResponse = await captchaSolvers.recaptchaV2(siteUrl, siteKey)
        await browser.execute(`document.querySelector('${this.inpReCaptchaResponse}').value = "${taskResponse}"`)
        await browser.execute('onSubmit()')
    }

    async savePDF() {
        const filePath = path.join(TEMP_DIR, 'print.pdf')
        const pdfBuffer = await browser.savePDF(filePath)
        return { pdfpath: filePath }
    }

    waitDownloadDocument() {
        return new Promise((resolve, reject) => {
            const timeoutID = setTimeout(() => reject('TIMEOUT EXEED'), 60000 * 5)
            try {
                let resolved = false
                const downloadPath = path.join(os.homedir(), 'Downloads')
                const watcher = fs.watch(downloadPath, (event, filename) => {
                    if (resolved) return

                    if (event == 'change' && !filename.includes('.part')) {
                        resolved = true
                        clearTimeout(timeoutID)
                        watcher.close()
                        resolve({ pdfpath: path.join(downloadPath, filename) })
                    }
                })

            } catch (error) {
                clearTimeout(timeoutID)
                reject(error)
            }

        })
    }

    async pdfToText(filePath) {
        return new Promise((resolve, reject) => {
            try {
                pdfUtil.pdfToText(filePath, function (err, data) {
                    if (err) reject(err);
                    const pdfText = data.replace(/\s+/g, ' ').trim()
                    return resolve(pdfText)
                });
            } catch (error) {
                reject(error)
            }
        })
    }

    addDaysToDate(date, daysToAdd) {
        const millisecondsPerDay = 24 * 60 * 60 * 1000
        const timestamp = new Date(date).getTime()
        const newTimestamp = timestamp + (Number(daysToAdd) * millisecondsPerDay)
        return new Date(newTimestamp)
    }

    async getPDF() {
        const filePath = path.join(TEMP_DIR, 'print.pdf')
        const urlPDF = `https://exemple.com/issue?document=exemple.pdf`

        const { payload } = await Wreck.get(urlPDF);
        fs.writeFileSync(filePath, payload)

        return { pdfpath: filePath, }
    }

}
module.exports = new Utils()