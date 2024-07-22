// plugins/indexedDBPlugin.js

const DB_NAME = 'NamesDB'
const DB_VERSION = 1
const OBJECT_STORE_NAME = 'names'
const cache = {}

export default {
    install(app) {
        const dbPromise = openDB()

        app.config.globalProperties.$getNames = async function (firstLettersString) {
            if (!firstLettersString) return []

            const db = await dbPromise
            const results = new Set()

            // Function to search in IndexedDB
            const searchInDB = async (key) => {
                return new Promise((resolve) => {
                    const transaction = db.transaction(OBJECT_STORE_NAME, 'readonly')
                    const store = transaction.objectStore(OBJECT_STORE_NAME)
                    const request = store.get(key)

                    request.onsuccess = () => {
                        resolve(request.result)
                    }

                    request.onerror = () => {
                        resolve([])
                    }
                })
            }

            // Function to query the database and cache results
            const queryDatabase = async () => {
                const indexKey = getIndexForName(firstLettersString)
                const allResults = await searchInDB(indexKey)
                return allResults
            }

            // Perform query and cache results
            const dbResults = await queryDatabase()
            dbResults?.forEach(name => results.add(name))

            // Asynchronously update the IndexedDB with new names
            const indexKey = getIndexForName(firstLettersString)
            const newNames = await fetchNamesFromSource(firstLettersString)
            const transaction = db.transaction(OBJECT_STORE_NAME, 'readwrite')
            const store = transaction.objectStore(OBJECT_STORE_NAME)

            // Store the new names under the index key
            store.put(newNames, indexKey)
            return Array.from(results)
        }

        async function openDB() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(DB_NAME, DB_VERSION)

                request.onupgradeneeded = (event) => {
                    const db = event.target.result
                    if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
                        db.createObjectStore(OBJECT_STORE_NAME)
                    }
                }

                request.onsuccess = () => {
                    resolve(request.result)
                }

                request.onerror = () => {
                    reject(request.error)
                }
            })
        }
        function getIndexForName(name) {
            const lowerCase = name.toLowerCase()
            const firstLetter = lowerCase.slice(0, 1)
            const secondLetter = lowerCase.slice(1, 2)

            /**
            // List of endpoints
            const indexes = [
                'al', 'az', 'bl', 'bz', 'cl', 'cz', 'dl', 'dz',
                'el', 'ez', 'fl', 'fz', 'gl', 'gz', 'hl', 'hz',
                'il', 'iz', 'jl', 'jz', 'kl', 'kz', 'll', 'lz',
                'ml', 'mz', 'nl', 'nz', 'ol', 'oz', 'pl', 'pz',
                'ql', 'qz', 'rl', 'rz', 'sl', 'sz', 'tl', 'tz',
                'ul', 'uz', 'vl', 'vz', 'wl', 'wz', 'xl', 'xz',
                'yl', 'yz', 'zl', 'zz'
            ]
            */

            const index = !secondLetter ? `${firstLetter}l` : `${firstLetter}${secondLetter >= 'l' ? 'z' : 'l'}`
            return index
        }
        app.config.globalProperties.$getHostForName = (name) => {
            const index = getIndexForName(name)
            return `https://${index}.ai.june07.com`
        }

        async function fetchNamesFromSource(firstLettersString, url) {
            const rootUrl = `https://ai.june07.com/u`
            const baseUrl = `${app.config.globalProperties.$getHostForName(firstLettersString)}/u`

            // Fetch names from the GitHub Pages directory
            try {
                const response = await fetch(url || `${baseUrl}/index.json`)

                if (!response.ok) {
                    // Handle the case where the file does not exist or there's another error
                    if (response.status === 404) {
                        // Return an empty array if the file is not found
                        return []
                    } else {
                        throw new Error('Network response was not ok ' + response.statusText)
                    }
                }

                // Parse the JSON response
                const names = await response.json()

                return names
            } catch (error) {
                if (error) {
                    return fetchNamesFromSource(firstLettersString, rootUrl)
                }
                console.error('There was a problem with the fetch operation:', error)
                return []
            }
        }
    }
}
