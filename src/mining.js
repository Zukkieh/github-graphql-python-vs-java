const runQuery = require('./query');
const runExportation = require('./csvExport');

const promisify = require('util').promisify
const exec = promisify(require('child_process').exec);

module.exports = async () => {
    let repos = [];
    const reposUrl = [];
    try {
        const resJava = await runQuery('java')
        const resPython = await runQuery('python')
        const sortedJavaRepo = resJava.search.nodes.sort((a, b) => b.stargazerCount - a.stargazerCount)
        const sortedPythonRepo = resPython.search.nodes.sort((a, b) => b.stargazerCount - a.stargazerCount)
        for(let i = 0; i < 100; i++){
            reposUrl.push({
                name: sortedPythonRepo[i].name,
                url: sortedPythonRepo[i].url
            })
            reposUrl.push({
                name: sortedJavaRepo[i].name,
                url: sortedJavaRepo[i].url
            })
            repos.push({
                "Python Name Repo": sortedPythonRepo[i].nameWithOwner,
                "Python Stars Counting": sortedPythonRepo[i].stargazerCount,
                "Python Created At": sortedPythonRepo[i].createdAt,
                "Python Watchers": sortedPythonRepo[i].watchers.totalCount,
                "Python Forks": sortedPythonRepo[i].forks.totalCount,
                "Python Releases": sortedPythonRepo[i].releases.totalCount,
                "Python LOC": '',
                "Python Comments": '',
                "Java Name Repo": sortedJavaRepo[i].nameWithOwner,
                "Java Stars Counting": sortedJavaRepo[i].stargazerCount,
                "Java Created At": sortedJavaRepo[i].createdAt,
                "Java Watchers": sortedJavaRepo[i].watchers.totalCount,
                "Java Forks": sortedJavaRepo[i].forks.totalCount,
                "Java Releases": sortedJavaRepo[i].releases.totalCount,
                "Java LOC": '',
                "Java Comments": '',
            })
        }
    }
    catch (error) {
        console.warn(error, 'ERROR: Something went wrong...')
    }

    if(reposUrl.length === 200){
        for(let i = 0; i < 200; i++){
            try {
                console.log(i, ' - clonando...')
                await exec(`cd repos && git clone ${reposUrl[i].url}`);
                const {stdout} = await exec(`yarn sloc repos/${reposUrl[i].name}`)
                const numbers = stdout.split(' ')
                .filter(item => item.includes('\n'))
                .map(item => item.match(/\d+/))
                .filter((item, index) => index !== 0 && index !== 1 && index !== 10 && index !== 11)
                .map(item => Number(item[0]) || 0)
                const loc = {
                    name: reposUrl[i].name,
                    code: numbers[0] + numbers[1] + numbers[5] + numbers[7],
                    comments: numbers[2] + numbers[3] + numbers[4] + numbers[6]
                }
                if(i % 2 === 0){
                    repos[Math.floor(i/2)]["Python LOC"] = loc.code;
                    repos[Math.floor(i/2)]["Python Comments"] = loc.comments;
                }else{
                    repos[Math.floor(i/2)]["Java LOC"] = loc.code;
                    repos[Math.floor(i/2)]["Java Comments"] = loc.comments;
                }
                await exec(`cd repos && rmdir /Q /S ${reposUrl[i].name}`)
            } catch (e) {
                repos[Math.floor(i/2)][`${i % 2 === 0 ? 'Python' : 'Java'} LOC`] = 'ERROR TO CLONE';
                repos[Math.floor(i/2)][`${i % 2 === 0 ? 'Python' : 'Java'} Comments`] = 'ERROR TO CLONE';
                await exec(`cd repos && rmdir /Q /S ${reposUrl[i].name}`)
                console.error(e);
              }
        }
    }
    await runExportation(repos)
}