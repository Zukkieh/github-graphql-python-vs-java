const runQuery = require('./query');
const runExportation = require('./csvExport');

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
                "Pyton Created At": sortedPythonRepo[i].createdAt,
                "Pyton Watchers": sortedPythonRepo[i].watchers.totalCount,
                "Pyton Forks": sortedPythonRepo[i].forks.totalCount,
                "Pyton Releases": sortedPythonRepo[i].releases.totalCount,
                "Java Name Repo": sortedJavaRepo[i].nameWithOwner,
                "Java Stars Counting": sortedJavaRepo[i].stargazerCount,
                "Java Created At": sortedJavaRepo[i].createdAt,
                "Java Watchers": sortedJavaRepo[i].watchers.totalCount,
                "Java Forks": sortedJavaRepo[i].forks.totalCount,
                "Java Releases": sortedJavaRepo[i].releases.totalCount,
            })
        }
    }
    catch (error) {
        console.warn(error, 'ERROR: Something went wrong...')
    }
    await runExportation(repos)
}