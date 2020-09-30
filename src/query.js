const github = require('./config');
module.exports = async (language) => {
    const res = await github.query(`
        query {
            search(type: REPOSITORY, first: 100, query: """
                stars:>100
                language:${language}
            """) {
                repositoryCount
                pageInfo {
                endCursor
                }
                nodes {
                ... on Repository {
                    nameWithOwner
                    stargazerCount
                    primaryLanguage {
                        name
                    }
                    watchers {
                        totalCount
                    }
                    createdAt
                    forks {
                        totalCount
                    }
                    releases {
                        totalCount
                    }
                }
                }
            }
        }
    `)
    return res;
};