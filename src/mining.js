const runQuery = require('./query');
const runExportation = require('./csvExport');
const formatToCsv = require('./formatToCsv');

module.exports = async () => {
    let repos = [];
    try {
        const resJava = await runQuery('java')
        const resPython = await runQuery('python')
        const sortedJavaRepo = resJava.search.nodes.sort((a, b) => b.stargazerCount - a.stargazerCount)
        const sortedPythonRepo = resPython.search.nodes.sort((a, b) => b.stargazerCount - a.stargazerCount)
        for(let i = 0; i < 100; i++){
            repos.push({
                "Python Name Repo": sortedPythonRepo[i].nameWithOwner,
                "Python Stars Counting": sortedPythonRepo[i].stargazerCount,
                "Java Name Repo": sortedJavaRepo[i].nameWithOwner,
                "Java Stars Counting": sortedJavaRepo[i].stargazerCount
            })
        }
    }
    catch (error) {
        console.warn(error, 'ERROR: Something went wrong...')
    }
    await runExportation(repos)
}