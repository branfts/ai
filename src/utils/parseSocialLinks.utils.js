import { FacebookIcon, InstagramIcon, ThreadsIcon, TikTokIcon, OnlyFansIcon, XIcon, LinktreeIcon, TargetIcon, AmazonIcon, CashAppIcon, YouTubeIcon, GitHubIcon, NpmIcon, RedditIcon, GoogleMapsIcon, PinterestIcon, SpotifyIcon, LinkedInIcon  } from 'vue3-simple-icons'

export default function parseSocialLinks(links) {
    const networks = [{
        slug: 'target',
        re: /^(https?:\/\/)?(www|goto\.)?target\.com\/.+$/,
        icon: TargetIcon,
        color: '#CC0000'
    },{
        slug: 'amazon',
        re: /^(https?:\/\/)?(www\.)?amazon\.com\/.+$/,
        icon: AmazonIcon,
        color: '#FF9900'
    },{
        slug: 'cashapp',
        re: /^(https?:\/\/)?(www\.)?cash\.app\/.+$/,
        icon: CashAppIcon,
        color: '#00C244'
    },{
        slug: 'onlyfans',
        re: /^(https?:\/\/)?(www\.)?onlyfans\.com\/.+$/,
        icon: OnlyFansIcon,
        color: '#00AFF0'
    },{
        slug: 'linktree',
        re: /^(https?:\/\/)?(www\.)?linktr\.ee\/.+$/,
        icon: LinktreeIcon,
        color: '#43E55E'
    },{
        slug: 'instagram',
        re: /^(https?:\/\/)?(www\.)?instagram\.com\/.+$/,
        icon: InstagramIcon,
        color: '#E4405F'
    },{
        slug: 'facebook',
        re: /^(https?:\/\/)?(www\.)?facebook\.com\/.+$/,
        icon: FacebookIcon,
        color: '#0866FF'
    },{
        slug: 'threads',
        re: /^(https?:\/\/)?(www\.)?threads\.net\/.+$/,
        icon: ThreadsIcon,
    },{
        slug: 'tiktok',
        re: /^(https?:\/\/)?(www\.)?tiktok\.com\/.+$/,
        icon: TikTokIcon,
        colors: ['#ff0050', '#00f2ea'],
        color: () => ['#ff0050', '#00f2ea'][Math.floor(Math.random() * 2)]
    },{
        slug: 'twitter',
        re: /^(https?:\/\/)?(www\.)?x|twitter\.com\/.+$/,
        icon: XIcon,
    },{
        slug: 'youtube',
        re: /^(https?:\/\/)?(www\.)?youtube\.com\/.+$/,
        icon: YouTubeIcon,
        color: '#FF0000'
    },{
        slug: 'github',
        re: /^(https?:\/\/)?(www\.)?github\.com\/.+$/,
        icon: GitHubIcon,
        color: '#181717'
    },{
        slug: 'npm',
        re: /^(https?:\/\/)?(www\.)?npmjs\.com\/.+$/,
        icon: NpmIcon,
        color: '#CB3837'
    },{
        slug: 'reddit',
        re: /^(https?:\/\/)?(www\.)?reddit\.com\/.+$/,
        icon: RedditIcon,
        color: '#FF4500'
    },{
        slug: 'googlemaps',
        re: /^(https?:\/\/)?(www\.)?google\.com\/maps\/.+$/,
        icon: GoogleMapsIcon,
        color: '#4285F4'
    },{
        slug: 'linkedin',
        re: /^(https?:\/\/)?(www\.)?linkedin\.com\/.+$/,
        icon: LinkedInIcon,
        color: '#0A66C2'
    },{
        slug: 'pinterest',
        re: /^(https?:\/\/)?(www\.)?pinterest\.com\/.+$/,
        icon: PinterestIcon,
        color: '#BD081C'
    },{
        slug: 'spotify',
        re: /^(https?:\/\/)?(www|open\.)?spotify\.com\/.+$/,
        icon: SpotifyIcon,
        color: '#1DB954'
    },{
        slug: 'throne',
        re: /^(https?:\/\/)?(www\.)?throne\.com\/.+$/,
        svg: '/logos/throne.svg'
    },{
        slug: 'beacons',
        re: /^(https?:\/\/)?(www\.)?beacons\.ai\/.+$/,
        svg: '/logos/beacons.svg'
    },{
        slug: 'introco',
        re: /^(https?:\/\/)?(www\.)?intro\.co\/.+$/,
        favicon: 'https://intro.co/intro-icon-32.png'
    },{
        slug: 'stanstore',
        re: /^(https?:\/\/)?(www\.)?stan\.store\/.+$/,
        favicon: 'https://stan.store/favicon.ico',
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