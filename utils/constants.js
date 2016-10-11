const navList = [
    { url: '/info-typein', zh_name: '信息录入' },
    { url: '/management', zh_name: '关键词管理' },
    { url: '/evolve', zh_name: '关键词演化' },
    { url: '/analysis', zh_name: '统计分析' },
    { url: '/sys-management', zh_name: '系统管理' },
];

const serverPath = '';
const urls = {
    'category': serverPath + '/management/category',
    'keywordList': serverPath + '/management/keywordList'
}

export { navList, urls };
