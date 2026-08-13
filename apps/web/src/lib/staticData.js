// 静态数据文件 — 从 PocketBase SQLite 导出
// 生成日期: 2026-08-13

const articles = __ARTICLES_DATA__;

function matchFilter(item, filterStr) {
  if (!filterStr) return true;
  const conditions = filterStr.split('&&').map(s => s.trim()).filter(Boolean);
  return conditions.every(cond => {
    const m = cond.match(/(\w+)\s*(=|!=)\s*(?:"([^"]*)"|'([^']*)')/);
    if (!m) return true;
    const [, field, op, v1, v2] = m;
    const val = v1 ?? v2 ?? '';
    const rowVal = String(item[field] ?? '');
    return op === '=' ? rowVal === val : rowVal !== val;
  });
}

function applySort(items, sortStr) {
  if (!sortStr) return items;
  const parts = sortStr.split(',').map(s => s.trim()).filter(Boolean);
  return [...items].sort((a, b) => {
    for (const part of parts) {
      const desc = part.startsWith('-');
      const field = desc ? part.slice(1) : part;
      const va = String(a[field] ?? '');
      const vb = String(b[field] ?? '');
      const cmp = va.localeCompare(vb);
      if (cmp !== 0) return desc ? -cmp : cmp;
    }
    return 0;
  });
}

class StaticCollection {
  constructor(name) {
    this.name = name;
  }

  async getFullList({ filter, sort, requestKey } = {}) {
    let items = articles.filter(a => matchFilter(a, filter));
    items = applySort(items, sort);
    return items;
  }

  async getList(page = 1, perPage = 500, { filter, sort } = {}) {
    let items = articles.filter(a => matchFilter(a, filter));
    items = applySort(items, sort);
    const start = (page - 1) * perPage;
    const paged = items.slice(start, start + perPage);
    return {
      page, perPage, totalItems: items.length, totalPages: Math.ceil(items.length / perPage),
      items: paged,
    };
  }

  async getFirstListItem(filter) {
    const items = articles.filter(a => matchFilter(a, filter));
    return items[0] || null;
  }

  async getOne(id) {
    return articles.find(a => a.id === id) || null;
  }

  async create(data) {
    throw new Error('静态模式下不支持创建操作');
  }

  async update(id, data) {
    throw new Error('静态模式下不支持更新操作');
  }

  async delete(id) {
    throw new Error('静态模式下不支持删除操作');
  }
}

class StaticPB {
  collection(name) {
    return new StaticCollection(name);
  }

  get files() {
    return {
      getURL(rec, filename) {
        if (!filename) return '';
        // 图片文件重定向到 Hostinger CDN
        return `https://images.hostinger.com/${filename}`;
      },
    };
  }

  get authStore() {
    return {
      token: '',
      model: null,
      isValid: false,
      isAdmin: false,
      clear() {},
      save() {},
      load() {},
    };
  }

  async getFileUrl(rec, filename) {
    return this.files.getURL(rec, filename);
  }
}

const staticPb = new StaticPB();
export default staticPb;
export { staticPb };
