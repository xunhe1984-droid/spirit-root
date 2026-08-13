// 静态 PocketBase 客户端
// 所有数据来自本地 JSON 导出，无需后端服务
// 适用于静态部署（Netlify、GitHub Pages 等）

import staticPb from './staticClient.js';

const pocketbaseClient = staticPb;

export default pocketbaseClient;
export { pocketbaseClient };
