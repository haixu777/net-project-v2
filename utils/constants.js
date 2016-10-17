const navList = [
    { url: '/info-typein', zh_name: '信息录入' },
    { url: '/management', zh_name: '关键词管理' },
    { url: '/evolve', zh_name: '关键词演化' },
    { url: '/analysis', zh_name: '统计分析' },
    { url: '/sys-management', zh_name: '系统管理' },
];

const serverPath = '';
const urls = {
    'category': serverPath + '/subject',
    'topic': serverPath + '/subject',
    'keywordList': serverPath + '/management/keywordList',
    'audit': serverPath + '/management/audit',
    'delete': serverPath + '/management/delete',
    'update': serverPath + '/management/update',
    'upload': serverPath + '/upload',
    'typein': serverPath + '/typein',
};
const auditStates = [
    {zh_name: '全部', id: -1},
    {zh_name: '未审核', id: 0},
    {zh_name: '已通过', id: 1},
    {zh_name: '已拒绝', id: 2}
];

const statusDict = {
    '-1':'全部',
    '0': '未审核',
    '1': '已通过',
    '2': '已拒绝'
};

export { navList, urls , statusDict,auditStates};
