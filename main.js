const job = require('./jobs/data/job.json')
const InitWio = require('./Init.wdio')

const initWio = new InitWio()
initWio.start(job)