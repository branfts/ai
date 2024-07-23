import { FacebookIcon, InstagramIcon, ThreadsIcon, TikTokIcon, OnlyFansIcon, XIcon, LinktreeIcon, TargetIcon, AmazonIcon, CashAppIcon  } from 'vue3-simple-icons'

export default function parseSocialLinks(links) {
    const networks = [{
        slug: 'target',
        re: /^(https?:\/\/)?(www|goto\.)?target\.com\/.+$/,
        icon: TargetIcon
    },{
        slug: 'amazon',
        re: /^(https?:\/\/)?(www\.)?amazon\.com\/.+$/,
        icon: AmazonIcon
    },{
        slug: 'cashapp',
        re: /^(https?:\/\/)?(www\.)?cash\.app\/.+$/,
        icon: CashAppIcon
    },{
        slug: 'onlyfans',
        re: /^(https?:\/\/)?(www\.)?onlyfans\.com\/.+$/,
        icon: OnlyFansIcon
    },{
        slug: 'linktree',
        re: /^(https?:\/\/)?(www\.)?linktr\.ee\/.+$/,
        icon: LinktreeIcon
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
        slug: 'twitter',
        re: /^(https?:\/\/)?(www\.)?x\.com\/.+$/,
        icon: XIcon
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
        const network = networks.find(network => network.re.test(link.url))
        
        return {
            ...link,
            ...network,
        }
    })
    
    return parsed
}