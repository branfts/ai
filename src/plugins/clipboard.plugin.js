class Clipboard {
    constructor() {
        this.debounce = undefined
    }
    async copy(data) {
        let self = this
        if (self.debounce) return
        self.debounce = setTimeout(() => self.debounce = undefined, 500)
        try {
            if (data instanceof Blob) {
                await navigator.clipboard.write([new ClipboardItem({ [data.type]: data })])
            } else {
                await navigator.clipboard.writeText(data)
            }
            console.log('copied to clipboard')
            return true
        } catch (error) {
            console.error(error)
        }
    }
}

export default new Clipboard()