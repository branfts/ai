import GhostContentAPI from '@tryghost/content-api'
import { LRUCache } from 'lru-cache'

const cache = new LRUCache({
    max: 500
})

const { VITE_APP_CONTENT_API_URL, VITE_APP_CONTENT_API_KEY } = import.meta.env

class GhostPlugin {
    constructor() {
        this.meta = undefined
        this.api = new GhostContentAPI({
            url: VITE_APP_CONTENT_API_URL,
            key: VITE_APP_CONTENT_API_KEY,
            version: "v5.51.1"
        })
    }
    async getMeta(type = 'faq', site = 'nim', retry = 0) {
        const re = new RegExp(`${type}${site}-([a-zA-Z0-9_.&/]*)(?:-([a-zA-Z0-9_]*))?`)
        const cached = cache.get(re.toString())

        if (cached) return cached
        try {
            const tags = (await this.browseTags()).filter(tag => tag.name.match(re))
            if (process.env.NODE_ENV !== 'production') tags.map(tag => console.log('tag: ', tag.name, tag))
            this.meta = {
                categories: tags.reduce((categories, tag) => ({ ...categories, [tag.name.match(re)?.[1]]: tag.slug }), {}),
                subcategories: tags.reduce((subcategories, tag) => tag.name.match(re)?.[2] ? { ...subcategories, [tag.name.match(re)[2]]: tag.slug } : subcategories, {}),
            }
            cache.set(re.toString(), this.meta)
            if (process.env.NODE_ENV !== 'production') console.log(this.meta)

            return this.meta
        } catch (error) {
            if (retry < 11) {
                return await new Promise(resolve => {
                    setTimeout(() => {
                        retry += 1
                        if (process.env.NODE_ENV !== 'production') console.log(`getMeta retry #${retry}`)
                        resolve(this.getMeta(type, site, retry))
                    }, (retry + 1) * 500)
                })
            }
        }
    }
    async getFAQs(category, subcategory) {
        return this.getPosts('faq', category, subcategory)
    }
    async getHelpArticles(category, subcategory) {
        return this.getPosts('help', category, subcategory)
    }
    async getPosts(type, category, subcategory) {
        const categorySlug = this.meta.categories[category]
        const subcategorySlug = subcategory && this.meta.subcategories[subcategory]
        const filter = categorySlug && subcategorySlug
            ? `tag:${categorySlug}-${subcategorySlug}`
            : `tag:${categorySlug}`
        const cached = cache.get(filter)
        if (cached) return cached

        const posts = (await this.api.posts.browse({ filter })).map(post => (type === 'faq' ? {
            id: post.id,
            image: post.feature_image,
            q: post.title,
            a: post.html
        } : {
            id: post.id,
            image: post.feature_image,
            title: post.title,
            html: post.html
        }))
        cache.set(filter, posts)

        return posts
    }
    async get(slug) {
        const cached = cache.get('post')

        if (cached) return cached
        const post = await this.api.posts.read({ slug })
        cache.set('post', post)

        return post
    }
    async browseTags() {
        const cached = cache.get('tags')

        if (cached) return cached
        const tags = await this.api.tags.browse({ limit: 1000 })
        cache.set('tags', tags)
        return tags
    }
}

export default {
    async install(app) {
        app.config.globalProperties.$ghost = new GhostPlugin()
    }
}