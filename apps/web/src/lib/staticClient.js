// 静态 PocketBase 客户端
// 从本地 JSON 数据读取，无需后端服务
import articlesData from './articlesData.js';

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

const collections = {
  articles: [...articlesData],
  comments: [],
  media: [],
};

class StaticCollection {
  constructor(name) {
    this.name = name;
    this._items = collections[name] || [];
  }

  async getFullList({ filter, sort, requestKey } = {}) {
    let items = this._items.filter(a => matchFilter(a, filter));
    items = applySort(items, sort);
    return items;
  }

  async getList(page = 1, perPage = 500, { filter, sort } = {}) {
    let items = this._items.filter(a => matchFilter(a, filter));
    items = applySort(items, sort);
    const start = (page - 1) * perPage;
    const paged = items.slice(start, start + perPage);
    return {
      page, perPage,
      totalItems: items.length,
      totalPages: Math.ceil(items.length / perPage) || 1,
      items: paged,
    };
  }

  async getFirstListItem(filter) {
    const items = this._items.filter(a => matchFilter(a, filter));
    return items[0] || null;
  }

  async getOne(id) {
    return this._items.find(a => a.id === id) || null;
  }

  async create(data) {
    console.warn('[StaticPB] 创建操作已禁用（静态模式）');
    throw new Error('Static mode: create disabled');
  }

  async update(id, data) {
    console.warn('[StaticPB] 更新操作已禁用（静态模式）');
    throw new Error('Static mode: update disabled');
  }

  async delete(id) {
    console.warn('[StaticPB] 删除操作已禁用（静态模式）');
    throw new Error('Static mode: delete disabled');
  }

  async authWithPassword(email, password) {
    throw new Error('Static mode: authentication disabled');
  }
}

// Auth store listeners
const authListeners = new Set();

const staticPb = {
  collection(name) {
    // support both 'articles' and 'users'
    return new StaticCollection(name);
  },
  files: {
    getURL(rec, filename) {
      if (!filename) return '';
      return `https://images.hostinger.com/${filename}`;
    },
  },
  getFileUrl(rec, filename) {
    return this.files.getURL(rec, filename);
  },
  authStore: {
    token: '',
    model: null,
    get record() { return this.model; },
    set record(v) { this.model = v; },
    isValid: false,
    isAdmin: false,
    clear() {
      this.token = '';
      this.model = null;
      this.isValid = false;
      authListeners.forEach(fn => fn('', null));
    },
    save() {},
    load() {},
    onChange(callback) {
      authListeners.add(callback);
      return () => authListeners.delete(callback);
    },
  },
};

export default staticPb;
export { staticPb };
