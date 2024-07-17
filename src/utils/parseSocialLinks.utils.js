import { FacebookIcon, InstagramIcon, ThreadsIcon, TikTokIcon, OnlyFansIcon } from 'vue3-simple-icons'

export default function parseSocialLinks(links) {
    const networks = [{
        slug: 'onlyfans',
        re: /^(https?:\/\/)?(www\.)?onlyfans\.com\/.+$/,
        icon: OnlyFansIcon
    },{
        slug: 'instagram',
        re: /^(https?:\/\/)?(www\.)?instagram\.com\/.+$/,
        icon: InstagramIcon
    },{
        slug: 'facebook',
        re: /^(https?:\/\/)?(www\.)?facebook\.com\/.+$/,
        icon: FacebookIcon
    },{
        slug: 'threads',
        re: /^(https?:\/\/)?(www\.)?threads\.net\/.+$/,
        icon: ThreadsIcon
    },{
        slug: 'tiktok',
        re: /^(https?:\/\/)?(www\.)?tiktok\.com\/.+$/,
        icon: TikTokIcon
    },{
        slug: 'throne',
        re: /^(https?:\/\/)?(www\.)?throne\.com\/.+$/,
        svg: '/logos/throne.svg'
    },{
        slug: 'beacons',
        re: /^(https?:\/\/)?(www\.)?beacons\.ai\/.+$/,
        svg: '/logos/beacons.svg'
    }]
    const parsed = links.map(link => {
        const network = networks.find(network => network.re.test(link.href))
        
        return {
            ...link,
            ...network,
        }
    })
    
    return parsed
}