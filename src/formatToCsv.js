module.exports = items => {
    return items.map(item => ({
        'Name with owner': item.nameWithOwner ? item.nameWithOwner : '',
        'Language': item.primaryLanguage ? item.primaryLanguage.name :  'NONE',
        'Created at': item.createdAt ? item.createdAt : '',
        'Last update': item.updatedAt ? item.updatedAt : '',
        'Releases': item.releases ? item.releases.totalCount : '',
        'Pull Requests': item.pullRequests ? item.pullRequests.totalCount : '',
        'Open Issues': item.openIssues ? item.openIssues.totalCount : '',
        'Closed Issues': item.closedIssues ? item.closedIssues.totalCount : '',
    }))
}